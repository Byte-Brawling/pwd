// extension/src/content-scripts/index.ts
import { analyzeWebPage } from '../utils/webPageAnalysis';

function injectAssistantButton() {
    const button = document.createElement('button');
    button.textContent = 'Analyze Page';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';

    button.addEventListener('click', async () => {
        const analysis = await analyzeWebPage(document);
        chrome.runtime.sendMessage({ type: 'ANALYZE_PAGE', payload: analysis });
    });

    document.body.appendChild(button);
}

injectAssistantButton();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PAGE_CONTENT') {
        const pageContent = document.body.innerText;
        sendResponse({ content: pageContent });
    }
});