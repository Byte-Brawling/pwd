// src/app/api/vision/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const imageData = new Uint8Array(arrayBuffer);

        const result = await hf.imageClassification({
            model: 'google/vit-base-patch16-224',
            data: imageData,
        });

        return NextResponse.json({ result });
    } catch (error) {
        console.error('Error in Vision:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}