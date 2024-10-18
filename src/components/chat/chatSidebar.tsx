"use client";
import React, { useState } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import Image from "next/image";

const ChatSidebar = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Unread", "Favorites", "Groups"];

  const chats = [
    {
      id: 1,
      name: "~onkoba~",
      message: "Umejua sasa?",
      time: "1:50 PM",
      unread: 1,
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 2,
      name: "Comrades at arms",
      message: "bbb: Tuingie game n mtu",
      time: "1:28 PM",
      unread: 43,
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 3,
      name: "Offside -# reject timetable #reject school",
      message: "~ Hugiru pinned a message",
      time: "12:31 PM",
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 1,
      name: "~onkoba~",
      message: "Umejua sasa?",
      time: "1:50 PM",
      unread: 1,
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 2,
      name: "Comrades at arms",
      message: "bbb: Tuingie game n mtu",
      time: "1:28 PM",
      unread: 43,
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 3,
      name: "Offside -# reject timetable #reject school",
      message: "~ Hugiru pinned a message",
      time: "12:31 PM",
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 1,
      name: "~onkoba~",
      message: "Umejua sasa?",
      time: "1:50 PM",
      unread: 1,
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 2,
      name: "Comrades at arms",
      message: "bbb: Tuingie game n mtu",
      time: "1:28 PM",
      unread: 43,
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 3,
      name: "Offside -# reject timetable #reject school",
      message: "~ Hugiru pinned a message",
      time: "12:31 PM",
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 1,
      name: "~onkoba~",
      message: "Umejua sasa?",
      time: "1:50 PM",
      unread: 1,
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 2,
      name: "Comrades at arms",
      message: "bbb: Tuingie game n mtu",
      time: "1:28 PM",
      unread: 43,
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    {
      id: 3,
      name: "Offside -# reject timetable #reject school",
      message: "~ Hugiru pinned a message",
      time: "12:31 PM",
      avatar: "https://avatars.githubusercontent.com/u/1476234?v=4",
    },
    // Add more chat items here...
  ];

  return (
    <div className='bg-gray-800 text-gray-300 h-screen overflow-y-auto'>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Chats</h2>
          <div className='flex items-center space-x-2'>
            <button>
              <Plus size={20} />
            </button>
            <button>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
        <div className='relative mb-4'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
            size={18}
          />
          <input
            type='text'
            placeholder='Search'
            className='w-full bg-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='flex space-x-2 mb-4'>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 text-sm rounded-full ${
                activeTab === tab ? "bg-green-500 text-white" : "bg-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className='flex items-center p-3 hover:bg-gray-700 cursor-pointer'
          >
            <Image
              src={chat.avatar}
              alt={chat.name}
              width={40}
              height={40}
              className='rounded-full mr-3'
            />
            <div className='flex-1 min-w-0'>
              <div className='flex justify-between items-baseline'>
                <h3 className='text-sm font-medium truncate'>{chat.name}</h3>
                <span className='text-xs text-gray-500'>{chat.time}</span>
              </div>
              <p className='text-sm text-gray-400 truncate'>{chat.message}</p>
            </div>
            {chat.unread && (
              <span className='bg-green-500 text-white text-xs rounded-full px-2 py-1 ml-2'>
                {chat.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
