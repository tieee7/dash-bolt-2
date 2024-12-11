import React from 'react';

interface TypingIndicatorProps {
  isBot?: boolean;
  className?: string;
}

export default function TypingIndicator({ isBot = false, className = '' }: TypingIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg max-w-[200px] ${
      isBot ? 'bg-white shadow-sm' : 'bg-orange-100'
    } ${className}`}>
      <span className="text-sm">
        {isBot ? 'Bot is typing' : 'Someone is typing'}
      </span>
      <div className="flex space-x-1">
        <div 
          className={`w-2 h-2 rounded-full animate-bounce ${
            isBot ? 'bg-gray-400' : 'bg-orange-400'
          }`} 
          style={{ animationDelay: '0ms' }}
        />
        <div 
          className={`w-2 h-2 rounded-full animate-bounce ${
            isBot ? 'bg-gray-400' : 'bg-orange-400'
          }`} 
          style={{ animationDelay: '150ms' }}
        />
        <div 
          className={`w-2 h-2 rounded-full animate-bounce ${
            isBot ? 'bg-gray-400' : 'bg-orange-400'
          }`} 
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}