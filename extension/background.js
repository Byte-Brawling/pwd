let isListening = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleListening") {
        isListening = !isListening;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateListeningState", isListening });
        });
        sendResponse({ isListening });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "processAudio") {
        // Here we'll call our API to process the audio
        fetch('http://localhost:3000/api/speech-to-text', {
            method: 'POST',
            body: request.audio
        })
            .then(response => response.json())
            .then(data => {
                // Process the transcription
                return fetch('http://localhost:3000/api/natural-language-understanding', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: data.transcription })
                });
            })
            .then(response => response.json())
            .then(data => {
                // Generate response based on NLU analysis
                return fetch('http://localhost:3000/api/text-to-speech', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: "Here's your response: " + data.analysis })
                });
            })
            .then(response => response.json())
            .then(data => {
                // Send the audio response back to the content script
                chrome.tabs.sendMessage(sender.tab.id, { action: "playAudio", audio: data.audioContent });
            })
            .catch(error => console.error('Error:', error));
    }
});