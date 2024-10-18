"use client";
import React, { useState } from "react";
import ChatInterface from "../chat/chat";
import Sidebar from "../navigation/sidebar";
import { useUser } from "@clerk/nextjs";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useUser();
  const userAvatar = user?.imageUrl;

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
