document.getElementById('toggleButton').addEventListener('click', function() {
  chrome.runtime.sendMessage({action: "toggleListening"}, function(response) {
    if (response.isListening) {
      this.textContent = "Stop Listening";
    } else {
      this.textContent = "Start Listening";
    }
  });
});