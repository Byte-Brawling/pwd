// File: app/api/vision/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const VISION_KEY = process.env.AZURE_VISION_KEY as string;
const VISION_ENDPOINT = process.env.AZURE_VISION_ENDPOINT as string;

interface VisionRequest {
    imageUrl: string;
}

interface VisionResponse {
    description: string;
    tags: string[];
    objects: string[];
}

interface ErrorResponse {
    error: string;
}

/**
 * Handles POST requests for image analysis
 * @param request - The incoming request containing the image URL to be analyzed
 * @returns A Promise resolving to a NextResponse with the analysis results or error
 */
export async function POST(request: NextRequest): Promise<NextResponse<VisionResponse | ErrorResponse>> {
    if (!VISION_KEY || !VISION_ENDPOINT) {
        return NextResponse.json({ error: 'Vision service configuration is missing' }, { status: 500 });
    }

    try {
        const { imageUrl }: VisionRequest = await request.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
        }

        const client = new ComputerVisionClient(
            new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': VISION_KEY } }),
            VISION_ENDPOINT
        );

        const [describeResult, tagsResult, objectsResult] = await Promise.all([
            client.describeImage(imageUrl),
            client.tagImage(imageUrl),
            client.detectObjects(imageUrl)
        ]);

        const response: VisionResponse = {
            description: describeResult.captions[0]?.text || 'No description available',
            tags: tagsResult.tags.map(tag => tag.name),
            objects: objectsResult.objects.map(obj => obj.object)
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in vision route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}