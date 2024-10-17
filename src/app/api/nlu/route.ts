// src/app/api/nlu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const result = await hf.textClassification({
            model: 'distilbert-base-uncased-finetuned-sst-2-english',
            inputs: text,
        });

        return NextResponse.json({ result });
    } catch (error) {
        console.error('Error in NLU:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}