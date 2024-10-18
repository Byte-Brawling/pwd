import React, { useMemo } from "react";
import { Search, Plus } from "lucide-react";

const AIChatSidebar = ({ onConversationSelect }) => {
  // Mock data for AI conversations
  const aiConversations = [
    {
      id: 1,
      title: "Python Debugging",
      lastMessage: "Here's how you can debug your Python code...",
      timestamp: new Date(2024, 9, 18, 14, 30), // Example: October 18, 2024, 2:30 PM
    },
    {
      id: 2,
      title: "React Hooks Explained",
      lastMessage:
        "useEffect is a React Hook that lets you synchronize a component with an external system...",
      timestamp: new Date(2024, 9, 17), // Example: October 17, 2024
    },
    {
      id: 3,
      title: "Machine Learning Basics",
      lastMessage: "Machine learning is a subset of artificial intelligence...",
      timestamp: new Date(2024, 9, 16), // Example: October 16, 2024
    },
    {
      id: 4,
      title: "JavaScript Promises",
      lastMessage:
        "Promises in JavaScript represent the eventual completion or failure of an asynchronous operation...",
      timestamp: new Date(2024, 9, 11), // Example: October 11, 2024
    },
    {
      id: 5,
      title: "CSS Grid Layout",
      lastMessage:
        "CSS Grid is a powerful tool for creating complex layouts...",
      timestamp: new Date(2024, 8, 25), // Example: September 25, 2024
    },
  ];

  const categorizeConversations = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(thisMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    return aiConversations.reduce((acc, conversation) => {
      const timestamp = new Date(conversation.timestamp);
      let category;

      if (timestamp >= today) {
        category = "Today";
      } else if (timestamp >= yesterday) {
        category = "Yesterday";
      } else if (timestamp >= thisWeekStart) {
        category = "This Week";
      } else if (timestamp >= lastWeekStart) {
        category = "Last Week";
      } else if (timestamp >= thisMonthStart) {
        category = "This Month";
      } else if (timestamp >= lastMonthStart) {
        category = "Last Month";
      } else {
        category = "Oldest";
      }

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(conversation);
      return acc;
    }, {});
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className='bg-gray-800 text-gray-300 h-screen overflow-y-auto'>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>AI Chats</h2>
          <button className='p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors'>
            <Plus size={20} />
          </button>
        </div>
        <div className='relative mb-4'>
          <Search
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
            size={18}
          />
          <input
            type='text'
            placeholder='Search AI conversations'
            className='w-full bg-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500'
          />
        </div>
      </div>
      <div className='space-y-4'>
        {" "}
        {/* Add space between categories */}
        {Object.entries(categorizeConversations).map(
          ([category, conversations]) => (
            <div key={category} className='mb-2'>
              {" "}
              {/* Add bottom margin to each category */}
              <h3 className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-750'>
                {category}
              </h3>
              <div className='space-y-1'>
                {" "}
                {/* Add a small space between conversations */}
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className='flex flex-col p-3 hover:bg-gray-700 cursor-pointer'
                    onClick={() => onConversationSelect(conversation)}
                  >
                    <div className='flex justify-between items-baseline'>
                      <h3 className='text-sm font-medium truncate'>
                        {conversation.title}
                      </h3>
                      <span className='text-xs text-gray-500'>
                        {formatTimestamp(conversation.timestamp)}
                      </span>
                    </div>
                    <p className='text-sm text-gray-400 truncate mt-1'>
                      {conversation.lastMessage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AIChatSidebar;
