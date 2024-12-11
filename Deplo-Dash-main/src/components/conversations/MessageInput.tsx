import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useConversationStore } from '../../lib/store/conversationStore';
import { toast } from 'react-hot-toast';

interface MessageInputProps {
  conversationId: string;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { sendMessage, isLoading } = useConversationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      await sendMessage(message.trim(), conversationId);
      setMessage('');
    } catch (error: any) {
      toast.error('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
          Send
        </button>
      </div>
    </form>
  );
}