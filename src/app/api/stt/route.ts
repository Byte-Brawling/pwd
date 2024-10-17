// src/app/api/stt/route.ts
import { speechClient } from '@/lib/azure/speechClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const audioData = new Uint8Array(arrayBuffer);

        const result = await speechClient.recognizeOnceAsync(audioData);

        if (result.reason === ResultReason.RecognizedSpeech) {
            return NextResponse.json({ text: result.text });
        } else {
            return NextResponse.json({ error: 'Speech not recognized' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error in STT:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}