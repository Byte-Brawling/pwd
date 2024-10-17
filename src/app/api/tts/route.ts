// src/app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { speechClient } from '@/lib/azure/speechClient';

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const result = await speechClient.speakTextAsync(text);

        if (result.audioData) {
            return new NextResponse(result.audioData, {
                headers: {
                    'Content-Type': 'audio/wav',
                    'Content-Disposition': 'attachment; filename=tts_output.wav',
                },
            });
        } else {
            return NextResponse.json({ error: 'Failed to generate speech' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error in TTS:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}