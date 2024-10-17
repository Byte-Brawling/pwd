import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY as string,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
    defaultQuery: { "api-version": "2023-05-15" },
    defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY as string },
});

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
    const result = await client.audio.transcriptions.create({
        file: new Blob([audioBuffer]),
        model: "whisper-1",
    });

    return result.text;
}