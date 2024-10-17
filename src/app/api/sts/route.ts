// src/app/api/speech-to-speech/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;
        const targetLang = formData.get('targetLang') as string;

        if (!audioFile || !targetLang) {
            return NextResponse.json({ error: 'Missing audio file or target language' }, { status: 400 });
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const audioData = new Uint8Array(arrayBuffer);

        // Step 1: Speech-to-Text
        const transcriptionResult = await hf.automaticSpeechRecognition({
            model: 'openai/whisper-large-v2',
            data: audioData,
        });

        // Step 2: Translation (if needed)
        let translatedText = transcriptionResult.text;
        if (targetLang !== 'en') {
            const translationResult = await hf.translation({
                model: 'Helsinki-NLP/opus-mt-en-ROMANCE',
                inputs: translatedText,
            });
            translatedText = translationResult.text;
        }

        // Step 3: Text-to-Speech
        const ttsResult = await hf.textToSpeech({
            model: 'espnet/kan-bayashi_ljspeech_vits',
            inputs: translatedText,
        });

        return new NextResponse(ttsResult, {
            headers: {
                'Content-Type': 'audio/wav',
                'Content-Disposition': 'attachment; filename=speech_to_speech_output.wav',
            },
        });
    } catch (error) {
        console.error('Error in Speech-to-Speech:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}