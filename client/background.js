browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "playAudio") {
        playAudio(request.audioData);
    }
});

function playAudio(audioData) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = base64ToArrayBuffer(audioData);
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
    }, (err) => {
        console.error('Error decoding audio data', err);
    });
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}