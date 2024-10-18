"use client";
import React from "react";
import { Smile, Paperclip, Mic } from "lucide-react";
import Image from "next/image";

interface ChatInterfaceProps{
    selectedChat: {
}


const ChatInterface = ({ selectedChat }) => {
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
      <div className='flex-grow overflow-y-auto p-4'>
        {/* You would map through messages here */}
        <div className='mb-4'>
          <p className='bg-gray-800 p-2 rounded-lg inline-block max-w-xs'>
            Eeeh...kuna nini?
          </p>
        </div>
        <div className='mb-4 text-right'>
          <p className='bg-green-700 p-2 rounded-lg inline-block max-w-xs'>
            so like nikiweka hoz details kwa service fulani, itakata straight
            from mpesa ama inawork aje
          </p>
        </div>
        {/* Add more messages as needed */}
      </div>

      {/* Chat Input */}
      <div className='p-4 border-t border-gray-700'>
        <div className='flex items-center bg-gray-800 rounded-full'>
          <button className='p-2 text-gray-400 hover:text-white'>
            <Smile size={24} />
          </button>
          <input
            type='text'
            placeholder='Type a message'
            className='flex-grow bg-transparent border-none focus:outline-none px-4 py-2 text-white'
          />
          <button className='p-2 text-gray-400 hover:text-white'>
            <Paperclip size={24} />
          </button>
          <button className='p-2 text-gray-400 hover:text-white'>
            <Mic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
