"use client";
import React, { useState } from "react";
import { transcribeAudio } from "../models/stt";

export default function SpeechToTextTool() {
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const text = await transcribeAudio(Buffer.from(buffer));
      setTranscription(text);
    } catch (error) {
      console.error("Transcription error:", error);
      setTranscription("Error during transcription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Speech to Text</h2>
      <input
        type='file'
        accept='audio/*'
        onChange={handleFileUpload}
        className='mb-4'
      />
      {isLoading ? (
        <p>Transcribing...</p>
      ) : (
        <div className='mt-4'>
          <h3 className='font-bold'>Transcription:</h3>
          <p>{transcription || "No transcription yet"}</p>
        </div>
      )}
    </div>
  );
}
