let isListening = false;
let mediaRecorder;
let audioChunks = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateListeningState") {
        isListening = request.isListening;
        if (isListening) {
            startListening();
        } else {
            stopListening();
        }
    } else if (request.action === "playAudio") {
        playAudioResponse(request.audio);
    }
});

function startListening() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                chrome.runtime.sendMessage({ action: "processAudio", audio: audioBlob });
                audioChunks = [];
            };
            mediaRecorder.start();
        });
}

function stopListening() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
}

function playAudioResponse(audioContent) {
    const audio = new Audio("data:audio/wav;base64," + audioContent);
    audio.play();
}