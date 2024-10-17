import React from "react";
import SpeechToTextTool from "@/components/SpeechToTextTool";
import TextToSpeechTool from "@/components/TextToSpeechTool";

export default function SpeechPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Speech Tools</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <SpeechToTextTool />
        <TextToSpeechTool />
      </div>
    </div>
  );
}
