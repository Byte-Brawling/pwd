// src/lib/openai.ts
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateResponse(messages: { role: string; content: string }[]) {
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });

        return completion.data.choices[0].message?.content;
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}

export async function analyzeImage(imageUrl: string) {
    try {
        const response = await openai.createImageAnalysis({
            image: imageUrl,
            model: 'gpt-4-vision-preview',
        });

        return response.data.analysis;
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
}