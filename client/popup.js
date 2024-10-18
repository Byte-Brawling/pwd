/* File: client/popup.js */
let mediaRecorder;
let audioChunks = [];

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startRecord");
  const stopButton = document.getElementById("stopRecord");
  const status = document.getElementById("status");
  const transcriptionDiv = document.getElementById("transcription");
  const transcriptionText = document.getElementById("transcriptionText");
  const responseDiv = document.getElementById("response");
  const responseText = document.getElementById("responseText");
  const voiceSelect = document.getElementById("voiceSelect");

  // Populate voice list
  function populateVoiceList() {
    chrome.tts.getVoices((voices) => {
      voiceSelect.innerHTML = "";
      voices.forEach((voice) => {
        const option = document.createElement("option");
        option.textContent = `${voice.voiceName} (${voice.lang})`;
        option.value = voice.voiceName;
        voiceSelect.appendChild(option);
      });
      console.log("Available voices:", voices);
    });
  }

  populateVoiceList();

  startButton.addEventListener("click", startRecording);
  stopButton.addEventListener("click", stopRecording);

  // ... [Your existing startRecording and stopRecording functions] ...
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.start();
      startButton.disabled = true;
      stopButton.disabled = false;
      status.textContent = "Recording...";
      status.classList.remove("text-red-500");
      status.classList.add("text-green-500");
      transcriptionDiv.classList.add("hidden");
      responseDiv.classList.add("hidden");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      status.textContent = "Error: " + err.message;
      status.classList.add("text-red-500");
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      startButton.disabled = false;
      stopButton.disabled = true;
      status.textContent = "Processing...";
      status.classList.remove("text-green-500");
      status.classList.add("text-yellow-500");

      mediaRecorder.addEventListener("stop", sendAudioToServer);
    }
  }
  function playAudio(text) {
    console.log("Attempting to play audio with text:", text);
    const selectedVoice = voiceSelect.value;
    console.log("Selected voice:", selectedVoice);

    chrome.tts.speak(text, {
      voiceName: selectedVoice,
      onEvent: function (event) {
        console.log("TTS Event:", event.type);
        if (event.type === "error") {
          console.error("TTS Error:", event);
        }
      },
    });
  }

  async function sendAudioToServer() {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    audioChunks = [];

    const formData = new FormData();
    formData.append("audio", audioBlob, "speech.wav");
    formData.append("params", JSON.stringify({ voice: voiceSelect.value }));

    try {
      const response = await fetch("http://localhost:8000/conversation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);

      // Display transcription
      transcriptionText.textContent = result.transcribed_text;
      transcriptionDiv.classList.remove("hidden");

      // Display AI response
      responseText.textContent = result.response_text;
      responseDiv.classList.remove("hidden");

      // Play audio
      playAudio(result.response_text);

      status.textContent = "Response received and playing.";
      status.classList.remove("text-yellow-500");
      status.classList.add("text-green-500");
    } catch (error) {
      console.error("Error:", error);
      status.textContent = "Error: " + error.message;
      status.classList.remove("text-yellow-500");
      status.classList.add("text-red-500");
    }
  }

  // Add a test button
  const testButton = document.createElement("button");
  testButton.textContent = "Test TTS";
  testButton.addEventListener("click", () => {
    playAudio("This is a test of the Chrome TTS API.");
  });
  document.body.appendChild(testButton);
});
