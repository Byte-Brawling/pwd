// File: app/api/speech-to-text/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Ensure these environment variables are set in your .env.local file
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY as string;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT as string;
const AZURE_OPENAI_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME as string;

interface TranscriptionResponse {
    transcription: string;
}

interface ErrorResponse {
    error: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<TranscriptionResponse | ErrorResponse>> {
    if (!AZURE_OPENAI_KEY || !AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_DEPLOYMENT_NAME) {
        return NextResponse.json({ error: 'Azure OpenAI configuration is missing' }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File | null;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const client = new OpenAI({
            apiKey: AZURE_OPENAI_KEY,
            baseURL: `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT_NAME}`,
            defaultQuery: { "api-version": "2023-05-15" },
            defaultHeaders: { "api-key": AZURE_OPENAI_KEY },
        });

        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

        const result = await client.audio.transcriptions.create({
            file: new Blob([audioBuffer]),
            model: "whisper-1",
        });

        if (result.text) {
            return NextResponse.json({ transcription: result.text });
        } else {
            return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error in speech-to-text route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}