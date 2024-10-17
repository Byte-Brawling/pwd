"use client";
import React, { useState } from "react";
import { analyzeImage } from "../models/vision";

export default function ImageAnalysisTool() {
  const [imageUrl, setImageUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!imageUrl) return;

    setIsLoading(true);
    try {
      const result = await analyzeImage(imageUrl);
      setAnalysis(result);
    } catch (error) {
      console.error("Image analysis error:", error);
      setAnalysis("Error during image analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Image Analysis</h2>
      <input
        type='text'
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className='w-full p-2 border rounded mb-4'
        placeholder='Enter image URL'
      />
      <button
        onClick={handleAnalyze}
        disabled={isLoading || !imageUrl}
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-4'
      >
        {isLoading ? "Analyzing..." : "Analyze Image"}
      </button>
      {imageUrl && (
        <img
          src={imageUrl}
          alt='Analyzed image'
          className='max-w-full h-auto mb-4'
        />
      )}
      {analysis && (
        <div className='mt-4'>
          <h3 className='font-bold'>Analysis:</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}
