// File: app/api/text-to-speech/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {
    SpeechConfig,
    SpeechSynthesizer,
    AudioConfig,
    ResultReason
} from 'microsoft-cognitiveservices-speech-sdk';

const SPEECH_KEY = process.env.AZURE_SPEECH_KEY as string;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION as string;

interface TTSRequest {
    text: string;
    voice?: string;
}

interface TTSResponse {
    audioContent: string;  // Base64 encoded audio data
}

interface ErrorResponse {
    error: string;
}

/**
 * Handles POST requests for text-to-speech conversion
 * @param request - The incoming request containing text to be converted
 * @returns A Promise resolving to a NextResponse with the audio data or error
 */
export async function POST(request: NextRequest): Promise<NextResponse<TTSResponse | ErrorResponse>> {
    if (!SPEECH_KEY || !SPEECH_REGION) {
        return NextResponse.json({ error: 'Speech service configuration is missing' }, { status: 500 });
    }

    try {
        const { text, voice = 'en-US-JennyNeural' }: TTSRequest = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const speechConfig = SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
        speechConfig.speechSynthesisVoiceName = voice;

        const synthesizer = new SpeechSynthesizer(speechConfig, AudioConfig.fromDefaultSpeakerOutput());

        return new Promise<NextResponse<TTSResponse | ErrorResponse>>((resolve) => {
            synthesizer.speakTextAsync(
                text,
                (result) => {
                    synthesizer.close();
                    if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                        // Convert ArrayBuffer to Base64 string
                        const audioData = new Uint8Array(result.audioData);
                        const base64Audio = Buffer.from(audioData).toString('base64');
                        resolve(NextResponse.json({ audioContent: base64Audio }));
                    } else {
                        resolve(NextResponse.json({ error: 'Speech synthesis failed' }, { status: 400 }));
                    }
                },
                (error) => {
                    synthesizer.close();
                    resolve(NextResponse.json({ error: `Error synthesizing speech: ${error}` }, { status: 500 }));
                }
            );
        });
    } catch (error) {
        console.error('Error in text-to-speech route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}