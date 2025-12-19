
import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  "Harvesting your ingredients...",
  "Tending to the garden...",
  "Thinking of something yummy...",
  "Consulting the farm chef...",
  "Gathering fresh herbs..."
];

const FarmLoader: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-green-100 border-t-green-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
          🥬
        </div>
      </div>
      <p className="text-xl font-medium text-green-700 font-comfortaa animate-pulse">
        {LOADING_MESSAGES[msgIndex]}
      </p>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default FarmLoader;
