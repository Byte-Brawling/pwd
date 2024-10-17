// extension/src/background/index.ts
import { generateResponse } from '../../src/lib/openai';

chrome.runtime.onInstalled.addListener(() => {
    console.log('Voice Assistant Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ANALYZE_PAGE') {
        handlePageAnalysis(message.payload);
    }
});

async function handlePageAnalysis(analysis: any) {
    try {
        const response = await generateResponse([
            { role: 'system', content: 'You are a helpful assistant analyzing web pages.' },
            { role: 'user', content: `Analyze this web page: ${JSON.stringify(analysis)}` }
        ]);

        chrome.tabs.create({ url: chrome.runtime.getURL('popup/analysis.html') }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tabId, { type: 'ANALYSIS_RESULT', payload: response });
                }
            });
        });
    } catch (error) {
        console.error('Error handling page analysis:', error);
    }
} 