"use client";
import React, { useState } from "react";
import { MessageCircle, Users, Phone, Settings, Bot } from "lucide-react";
import Image from "next/image";
import ChatSidebar from "../chat/chatSidebar";
import AIChatSidebar from "../chat/aiChatSidebar";

const Sidebar = ({ userAvatar, onChatSelect, onAIChatSelect }) => {
  const [activeMenu, setActiveMenu] = useState("ai");

  const toggleMenu = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className='flex h-screen'>
      <div className='w-16 bg-gray-900 flex flex-col items-center py-4'>
        <nav className='flex-1 space-y-8'>
          <button
            onClick={() => toggleMenu("ai")}
            className='flex justify-center w-full'
          >
            <Bot
              size={24}
              className={`${
                activeMenu === "ai" ? "text-white" : "text-gray-400"
              } hover:text-white transition-colors`}
            />
          </button>
          <button
            onClick={() => toggleMenu("chats")}
            className='flex justify-center w-full'
          >
            <div className='relative'>
              <MessageCircle
                size={24}
                className={`${
                  activeMenu === "chats" ? "text-white" : "text-gray-400"
                } hover:text-white transition-colors`}
              />
              <span className='absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 text-xs flex items-center justify-center text-white'>
                19
              </span>
            </div>
          </button>
          <button
            onClick={() => toggleMenu("users")}
            className='flex justify-center w-full'
          >
            <Users
              size={24}
              className={`${
                activeMenu === "users" ? "text-white" : "text-gray-400"
              } hover:text-white transition-colors`}
            />
          </button>
          <button
            onClick={() => toggleMenu("calls")}
            className='flex justify-center w-full'
          >
            <Phone
              size={24}
              className={`${
                activeMenu === "calls" ? "text-white" : "text-gray-400"
              } hover:text-white transition-colors`}
            />
          </button>
        </nav>
        <div className='mb-8'>
          <div className='relative'>
            <button onClick={() => toggleMenu("account")}>
              <Image
                src={userAvatar}
                alt='User Avatar'
                width={40}
                height={40}
                className='rounded-full'
              />
            </button>
            <span className='absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-gray-900 bg-green-400'></span>
          </div>
        </div>
        <div className='mt-auto'>
          <button
            onClick={() => toggleMenu("settings")}
            className='flex justify-center w-full'
          >
            <Settings
              size={24}
              className={`${
                activeMenu === "settings" ? "text-white" : "text-gray-400"
              } hover:text-white transition-colors`}
            />
          </button>
        </div>
      </div>
      <div className='w-[450px]'>
        {activeMenu === "chats" && <ChatSidebar onChatSelect={onChatSelect} />}
        {activeMenu === "users" && (
          <div className='bg-gray-800 text-white h-full p-4'>Users Content</div>
        )}
        {activeMenu === "calls" && (
          <div className='bg-gray-800 text-white h-full p-4'>Calls Content</div>
        )}
        {activeMenu === "ai" && (
          <AIChatSidebar onConversationSelect={onAIChatSelect} />
        )}
        {activeMenu === "account" && (
          <div className='bg-gray-800 text-white h-full p-4'>
            Account Content
          </div>
        )}
        {activeMenu === "settings" && (
          <div className='bg-gray-800 text-white h-full p-4'>
            Settings Content
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
