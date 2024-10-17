// src/app/page.tsx
"use client";

import React, { useState } from "react";
import VoiceAssistant from "@/components/VoiceAssistant";
import WakeWordDetector from "@/components/WakeWordDetector";
import WebPageAnalyzer from "@/components/WebPageAnalyzer";

export default function Home() {
  const [activeComponent, setActiveComponent] = useState<
    "wake" | "voice" | "web"
  >("wake");

  const handleWakeWordDetected = () => {
    setActiveComponent("voice");
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      {activeComponent === "wake" && (
        <WakeWordDetector onWakeWordDetected={handleWakeWordDetected} />
      )}
      {activeComponent === "voice" && <VoiceAssistant />}
      {activeComponent === "web" && <WebPageAnalyzer />}
      <div className='mt-8'>
        <button
          onClick={() => setActiveComponent("web")}
          className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
        >
          Switch to Web Page Analyzer
        </button>
      </div>
    </div>
  );
}
