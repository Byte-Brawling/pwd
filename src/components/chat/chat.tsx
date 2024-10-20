"use client";
import React, { useState, useRef } from "react";
import { Mic, StopCircle, Volume2, MoreVertical, Send, Smile } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface Chat {
  avatar: string;
  name: string;
  status: string;
}

interface Message {
  type: "human" | "ai";
  text: string;
  audioUrl: string;
}

interface ChatInterfaceProps {
  selectedChat: Chat | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [textInput, setTextInput] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const conversationId = "6712789988a714d95945581e";
  const userId = "67126ec511248e1d11c42a8b";

  const startRecording = (): void => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error: Error) =>
        console.error("Error accessing microphone:", error)
      );
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.onstop = () => {
        sendAudioToBackend();
      };
    }
  };

  const sendAudioToBackend = async (): Promise<void> => {
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("from_user", userId);
    formData.append("conversation_id", conversationId);

    try {
      // Step 1: Send for transcription
      const transcriptionResponse = await fetch(
        "http://localhost:8000/transcribe",
        {
          method: "POST",
          body: formData,
        }
      );

      const transcriptionData = await transcriptionResponse.json();

      // Immediately update UI with transcription
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "human",
          text: transcriptionData.transcribed_text,
          audioUrl: transcriptionData.audio_url,
        },
      ]);

      // Step 2: Request AI response
      const aiResponse = await fetch("http://localhost:8000/ai-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcribed_text: transcriptionData.transcribed_text,
          from_user: userId,
          conversation_id: conversationId,
        }),
      });

      const aiData = await aiResponse.json();

      // Update UI with AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "ai",
          text: aiData.ai_text_response,
          audioUrl: aiData.ai_audio_url,
        },
      ]);

      // Play AI response
      if (audioRef.current) {
        audioRef.current.src = aiData.ai_audio_url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error in communication:", error);
    }
  };

  const sendTextMessage = async () => {
    if (textInput.trim()) {
      // Add user message to state
      setMessages((prev) => [
        ...prev,
        { type: "human", text: textInput, audioUrl: "" },
      ]);

      // Send to AI response route
      try {
        const aiResponse = await fetch("http://localhost:8000/ai-response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcribed_text: textInput,
            from_user: userId,
            conversation_id: conversationId,
          }),
        });

        const aiData = await aiResponse.json();

        // Add AI response to state
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: aiData.ai_text_response,
            audioUrl: aiData.ai_audio_url,
          },
        ]);
        // Play AI response
        if (audioRef.current) {
          audioRef.current.src = aiData.ai_audio_url;
          audioRef.current.play();
        }
      } catch (error) {
        console.error("Error sending text message:", error);
      }

      setTextInput("");
    }
  };

  const toggleRecording = (): void => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudio = (audioUrl: string): void => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
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
    <div className='flex flex-col h-screen text-white bg-gray-900'>
      {/* Chat Header */}
      <div className='flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900 bg-opacity-80'>
        <div>
          <span className='text-3xl'>AI Chat Message {selectedChat.name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='w-8 h-8 hover:bg-gray-800 hover:text-white'
            >
              <span className='sr-only'>Open menu</span>
              <MoreVertical size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56 bg-gray-900'>
            <DropdownMenuItem onSelect={() => setInputMode("voice")}>
              Voice
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setInputMode("text")}>
              Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chat Messages */}
      <div className='flex-grow overflow-y-auto p-8'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.type === "human" ? "text-right" : "text-left"
            } group`}
          >
            <div
              className={`inline-flex items-end ${
                message.type === "human" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`relative max-w-xl ${
                  message.type === "human" ? "mr-2" : "ml-2"
                }`}
              >
                <div className='flex items-center'>
                  <p
                    className={`p-2 rounded-lg ${
                      message.type === "human" ? "bg-[#005c4b]" : "bg-[#202c33]"
                    }`}
                  >
                    {message.text}
                  </p>
                  {message.audioUrl && (
                    <button
                      onClick={() => playAudio(message.audioUrl)}
                      className='opacity-0 flex space-x-1 group-hover:opacity-100 transition-opacity duration-200 ml-2'
                    >
                      <div className='rounded-full w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600'>
                        <Volume2 size={16} />
                      </div>
                      <div className='rounded-full w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600'>
                        <Smile size={16} />
                      </div>
                    </button>
                  )}
                </div>
                <div className='text-xs text-gray-500 mt-1 text-right'>
                  4:20 PM
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className='p-4 border-t border-gray-700 bg-gray-900 bg-opacity-80'>
        {inputMode === "voice" ? (
          <div className='flex justify-center'>
            <button
              onClick={toggleRecording}
              className={`p-4 rounded-full ${
                isRecording ? "bg-red-600" : "bg-green-600"
              } hover:opacity-80 transition-opacity`}
            >
              {isRecording ? <StopCircle size={40} /> : <Mic size={40} />}
            </button>
          </div>
        ) : (
          <div className='flex w-full max-w-md mx-auto'>
            <input
              type='text'
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className='flex-grow p-2 bg-gray-800 text-white rounded-l-md'
              placeholder='Type a message'
            />
            <button
              onClick={sendTextMessage}
              className='bg-green-600 p-2 rounded-r-md hover:bg-green-700'
            >
              <Send size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Hidden audio element for AI response playback */}
      <audio ref={audioRef} className='hidden' />
    </div>
  );
};

export default ChatInterface;
