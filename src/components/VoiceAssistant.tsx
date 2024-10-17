// src/components/VoiceAssistant.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import useAzureSpeech from "@/hooks/useAzureSpeech";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { startListening, stopListening, synthesizeSpeech } = useAzureSpeech();

  useEffect(() => {
    if (isListening) {
      startListening((text) => {
        setTranscript(text);
        handleNLU(text);
      });
    } else {
      stopListening();
    }
  }, [isListening]);

  const handleNLU = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/nlu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResponse(data.result[0].label);
      synthesizeResponse(data.result[0].label);
    } catch (error) {
      console.error("Error in NLU:", error);
      setResponse("Sorry, I couldn't understand that.");
    } finally {
      setIsLoading(false);
    }
  };

  const synthesizeResponse = async (text: string) => {
    try {
      const audioBlob = await synthesizeSpeech(text);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(audioBlob);
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error in speech synthesis:", error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Voice Assistant</h2>
        <div className='mb-4'>
          <p className='font-semibold'>You said:</p>
          <p className='italic'>{transcript}</p>
        </div>
        <div className='mb-4'>
          <p className='font-semibold'>Assistant response:</p>
          <p>{isLoading ? "Thinking..." : response}</p>
        </div>
        <div className='flex justify-center'>
          <Button
            onClick={() => setIsListening(!isListening)}
            className={`flex items-center ${
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isListening ? (
              <>
                <StopCircle className='mr-2' />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className='mr-2' />
                Start Listening
              </>
            )}
          </Button>
        </div>
        <audio ref={audioRef} className='hidden' />
      </div>
    </div>
  );
}
