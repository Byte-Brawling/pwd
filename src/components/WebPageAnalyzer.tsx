// src/components/WebPageAnalyzer.tsx
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import useAzureVision from '@/hooks/useAzureVision';

export default function WebPageAnalyzer() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { analyzeImageUrl, detectTextInImage, isLoading, error } = useAzureVision();

  const analyzeWebPage = async () => {
    if (!url) return;

    try {
      const imageAnalysis = await analyzeImageUrl(url);
      const textInImage = await detectTextInImage(url);
      
      setAnalysis(
        `Image Description: ${imageAnalysis.description}\n\n` +
        `Tags: ${imageAnalysis.tags.join(', ')}\n\n` +
        `Objects: ${imageAnalysis.objects.join(', ')}\n\n` +
        `Dominant Colors: ${imageAnalysis.colors.dominant.join(', ')}\n\n` +
        `Text in Image: ${textInImage}`
      );
    } catch (error) {
      console.error('Error analyzing web page:', error);
      setAnalysis('Failed to analyze the web page. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Web Page Analyzer</h2>
        <div className="mb-4">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex justify-center mb-4">
          <Button
            onClick={analyzeWebPage}
            disabled={isLoading}
            className="flex items-center bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              'Analyzing...'
            ) : (
              <>
                <Search className="mr-2" />
                Analyze Image
              </>
            )}
          </Button>
        </div>
        {error && (
          <div className="mt-4 text-red-500">
            Error: {error}
          </div>
        )}
        {analysis && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Analysis Result:</h3>
            <pre className="text-sm whitespace-pre-wrap">{analysis}</pre>
          </div>
        )}
      </div>
    </div>
  );
}