// src/lib/azure/visionClient.ts
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";

const key = process.env.AZURE_VISION_KEY;
const endpoint = process.env.AZURE_VISION_ENDPOINT;

if (!key || !endpoint) {
    throw new Error("Azure Vision API key or endpoint is not set in environment variables");
}

const credentials = new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } });
export const visionClient = new ComputerVisionClient(credentials, endpoint);

export async function analyzeImage(imageUrl: string) {
    try {
        const features = ["Categories", "Description", "Color", "Objects", "Tags"];
        const result = await visionClient.analyzeImage(imageUrl, { visualFeatures: features });

        return {
            description: result.description?.captions?.[0]?.text || "No description available",
            tags: result.tags?.map(tag => tag.name) || [],
            objects: result.objects?.map(obj => obj.object) || [],
            colors: {
                dominant: result.color?.dominantColors || [],
                accent: result.color?.accentColor,
            },
            categories: result.categories?.map(category => category.name) || [],
        };
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
}

export async function detectText(imageUrl: string) {
    try {
        const result = await visionClient.recognizePrintedText(true, imageUrl);

        let extractedText = "";
        if (result.regions) {
            for (const region of result.regions) {
                for (const line of region.lines || []) {
                    for (const word of line.words || []) {
                        extractedText += word.text + " ";
                    }
                    extractedText += "\n";
                }
            }
        }

        return extractedText.trim();
    } catch (error) {
        console.error("Error detecting text:", error);
        throw error;
    }
}