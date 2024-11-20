import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatbotPreviewProps {
  chatbotName: string;
  greetingMessage: string;
  color: string;
  domainName: string;
}

export default function ChatbotPreview({ 
  chatbotName, 
  greetingMessage, 
  color,
  domainName 
}: ChatbotPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [message, setMessage] = useState('');

  const buttonStyle = {
    backgroundColor: color,
  };

  const indicatorStyle = {
    backgroundColor: color,
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end">
      {isExpanded && (
        <div className="mb-4 w-[380px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={indicatorStyle}></div>
            </div>
            <div>
              <h3 className="font-medium">{chatbotName}</h3>
              <p className="text-sm text-gray-500">from {domainName}</p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="h-[400px] overflow-y-auto p-4 bg-gray-50">
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                🤖
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                <p className="text-sm">{greetingMessage}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 pr-10"
                  style={{ focusRing: color }}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                  <Paperclip className="h-5 w-5" />
                </button>
              </div>
              <button 
                className="p-2 rounded-full text-white flex items-center justify-center"
                style={buttonStyle}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-400">Powered by Corinna.ai</span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg"
        style={buttonStyle}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '×' : '💬'}
      </button>
    </div>
  );
}