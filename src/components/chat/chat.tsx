"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, StopCircle } from "lucide-react";
import Image from "next/image";

const ChatInterface = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const conversationId = "6712789988a714d95945581e";
  const userId = "67126ec511248e1d11c42a8b";

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.onstop = () => {
        sendAudioToBackend();
      };
    }
  };

  const sendAudioToBackend = async () => {
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("from_user", userId);
    formData.append("conversation_id", conversationId);

    try {
      const response = await fetch("http://localhost:8000/messages-ai", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "human",
          text: data.human_transcribed_text,
          audioUrl: data.human_audio_url,
        },
        {
          type: "ai",
          text: data.ai_text_response,
          audioUrl: data.ai_audio_url,
        },
      ]);

      // Play AI response
      if (audioRef.current) {
        audioRef.current.src = data.ai_audio_url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!selectedChat) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900 text-white'>
        <h1 className='text-3xl font-bold'>Welcome, sir</h1>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen bg-gray-900 text-white'>
      {/* Chat Header */}
      <div className='flex items-center p-4 border-b border-gray-700'>
        <Image
          src={selectedChat.avatar}
          alt={selectedChat.name}
          width={40}
          height={40}
          className='rounded-full mr-3'
        />
        <div>
          <h2 className='font-semibold'>{selectedChat.name}</h2>
          <p className='text-sm text-gray-400'>{selectedChat.status}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className='flex-grow overflow-y-auto p-8'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.type === "human" ? "text-right" : ""}`}
          >
            <p
              className={`p-2 rounded-lg inline-block max-w-xl ${
                message.type === "human" ? "bg-green-700" : "bg-gray-800"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>

      {/* Voice Input */}
      <div className='p-4 border-t border-gray-700 flex justify-center'>
        <button
          onClick={toggleRecording}
          className={`p-4 rounded-full ${
            isRecording ? "bg-red-600" : "bg-green-600"
          } hover:opacity-80 transition-opacity`}
        >
          {isRecording ? <StopCircle size={40} /> : <Mic size={40} />}
        </button>
      </div>

      {/* Hidden audio element for AI response playback */}
      <audio ref={audioRef} className='hidden' />
    </div>
  );
};

export default ChatInterface;
