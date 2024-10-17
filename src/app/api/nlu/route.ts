// File: app/api/natural-language-understanding/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { TextAnalyticsClient, AzureKeyCredential } from '@azure/ai-text-analytics';

const NLU_KEY = process.env.AZURE_NLU_KEY as string;
const NLU_ENDPOINT = process.env.AZURE_NLU_ENDPOINT as string;

interface NLURequest {
    text: string;
}

interface NLUResponse {
    sentiment: string;
    keyPhrases: string[];
    entities: Array<{ name: string; type: string }>;
}

interface ErrorResponse {
    error: string;
}

/**
 * Handles POST requests for natural language understanding
 * @param request - The incoming request containing text to be analyzed
 * @returns A Promise resolving to a NextResponse with the analysis results or error
 */
export async function POST(request: NextRequest): Promise<NextResponse<NLUResponse | ErrorResponse>> {
    if (!NLU_KEY || !NLU_ENDPOINT) {
        return NextResponse.json({ error: 'NLU service configuration is missing' }, { status: 500 });
    }

    try {
        const { text }: NLURequest = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const client = new TextAnalyticsClient(NLU_ENDPOINT, new AzureKeyCredential(NLU_KEY));

        const [sentimentResult, keyPhrasesResult, entitiesResult] = await Promise.all([
            client.analyzeSentiment([text]),
            client.extractKeyPhrases([text]),
            client.recognizeEntities([text])
        ]);

        // Check for errors and extract data safely
        if (sentimentResult[0].error || keyPhrasesResult[0].error || entitiesResult[0].error) {
            const errorMessage = sentimentResult[0].error?.message ||
                keyPhrasesResult[0].error?.message ||
                entitiesResult[0].error?.message ||
                'An error occurred during text analysis';
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

        const response: NLUResponse = {
            sentiment: sentimentResult[0].sentiment || 'Unknown',
            keyPhrases: keyPhrasesResult[0].keyPhrases || [],
            entities: entitiesResult[0].entities.map(entity => ({
                name: entity.text,
                type: entity.category
            })) || []
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in natural language understanding route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}