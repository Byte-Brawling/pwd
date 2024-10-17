export const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY as string;
export const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT as string;
export const AZURE_OPENAI_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME as string;
export const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY as string;
export const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION as string;

export function validateAzureConfig() {
    const requiredVars = [
        AZURE_OPENAI_KEY,
        AZURE_OPENAI_ENDPOINT,
        AZURE_OPENAI_DEPLOYMENT_NAME,
        AZURE_SPEECH_KEY,
        AZURE_SPEECH_REGION,
    ];

    if (requiredVars.some(v => !v)) {
        throw new Error('Missing required Azure configuration. Please check your environment variables.');
    }
}