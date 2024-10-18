"use client";
import React, { useState } from "react";
import ChatInterface from "../chat/chat";
import Sidebar from "../navigation/sidebar";

const Layout = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const userAvatar = "https://avatars.githubusercontent.com/u/1476234?v=4"; // Replace with actual path or URL

  return (
    <div className='flex h-screen'>
      <Sidebar userAvatar={userAvatar} onChatSelect={setSelectedChat} />
      <div className='flex-grow'>
        <ChatInterface selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default Layout;
