"use client";
import React, { useState } from "react";
import { synthesizeSpeech } from "../models/tts";

export default function TextToSpeechTool() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSynthesize = async () => {
    if (!text) return;

    setIsLoading(true);
    try {
      const audioData = await synthesizeSpeech(text);
      const audioBlob = new Blob([audioData], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Speech synthesis error:", error);
      alert("Error during speech synthesis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Text to Speech</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className='w-full p-2 border rounded mb-4'
        rows={4}
        placeholder='Enter text to synthesize'
      />
      <button
        onClick={handleSynthesize}
        disabled={isLoading || !text}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
      >
        {isLoading ? "Synthesizing..." : "Synthesize Speech"}
      </button>
    </div>
  );
}
