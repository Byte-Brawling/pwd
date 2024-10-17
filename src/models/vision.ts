import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY as string,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
    defaultQuery: { "api-version": "2023-05-15" },
    defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY as string },
});

export async function analyzeImage(imageUrl: string): Promise<string> {
    const response = await client.chat.completions.create({
        model: "gpt-4-vision-preview", // Ensure this model is available in your deployment
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "What's in this image?" },
                    { type: "image_url", image_url: imageUrl },
                ],
            },
        ],
    });

    return response.choices[0].message.content || '';
}