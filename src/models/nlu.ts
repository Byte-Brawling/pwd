import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY as string,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
    defaultQuery: { "api-version": "2023-05-15" },
    defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY as string },
});

export async function analyzeText(text: string): Promise<string> {
    const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo", // Adjust based on your deployment
        messages: [
            { role: "system", content: "Analyze the following text and provide insights." },
            { role: "user", content: text }
        ],
    });

    return response.choices[0].message.content || '';
}