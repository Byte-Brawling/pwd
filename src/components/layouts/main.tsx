"use client";
import React, { useRef, useState } from "react";
import ChatInterface from "../chat/chat";
import Sidebar from "../navigation/sidebar";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useUser();
  const userAvatar = user?.imageUrl;
  const audioRef = useRef(null);
  const getAudio = async () => {
    const response = await axios.get(
      "http://localhost:8000/audio/6712856c262c672f4066f45f"
    ).then((response) => {
      audioRef.current.src = URL.createObjectURL(response.data);
    })
    audioRef.current.play()
  }
  return (
    <div className='flex h-screen'>
      <Sidebar
        userAvatar={userAvatar}
        onChatSelect={setSelectedChat}
        onAIChatSelect={setSelectedChat}
      />
      <div className='flex-grow'>
        <ChatInterface selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default Layout;
