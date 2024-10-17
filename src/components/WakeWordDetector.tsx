// src/components/WakeWordDetector.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function zWakeWordDetector({
  onWakeWordDetected,
}: {
  onWakeWordDetected: () => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript
              .trim()
              .toLowerCase();
            if (transcript.includes("hey assistant")) {
              onWakeWordDetected();
            }
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onWakeWordDetected]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-4 text-center'>
          Wake Word Detector
        </h2>
        <p className='mb-4 text-center'>
          Say &quot;Hey Assistant&quot; to activate
        </p>
        <div className='flex justify-center'>
          <Button
            onClick={toggleListening}
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
      </div>
    </div>
  );
}
