// extension/src/popup/index.ts
document.addEventListener('DOMContentLoaded', () => {
  const analyzeButton = document.getElementById('analyzeButton');
  const resultDiv = document.getElementById('result');

  analyzeButton?.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { type: 'GET_PAGE_CONTENT' }, (response) => {
          if (response && response.content) {
            analyzeContent(response.content);
          }
        });
      }
    });
  });

  function analyzeContent(content) {
    chrome.runtime.sendMessage({ type: 'ANALYZE_PAGE', payload: { content } }, (response) => {
      if (resultDiv) {
        resultDiv.textContent = response || 'No analysis available.';
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYSIS_RESULT') {
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
      resultDiv.textContent = message.payload;
    }
  }
});