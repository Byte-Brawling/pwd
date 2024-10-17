// src/hooks/useAzureVision.ts
"use client";
import { analyzeImage, detectText } from '@/lib/azure/visionClient';
// import { analyzeImage } from '@/lib/openai';
import { useState, useCallback } from 'react';

interface AnalysisResult {
    description: string;
    tags: string[];
    objects: string[];
    colors: {
        dominant: string[];
        accent: string | undefined;
    };
    categories: string[];
}

const useAzureVision = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeImageUrl = useCallback(async (imageUrl: string): Promise<AnalysisResult> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await analyzeImage(imageUrl);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const detectTextInImage = useCallback(async (imageUrl: string): Promise<string> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await detectText(imageUrl);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { analyzeImageUrl, detectTextInImage, isLoading, error };
};

export default useAzureVision;