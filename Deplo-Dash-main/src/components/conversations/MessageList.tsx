import React, { useEffect, useRef } from 'react';
import { useConversationStore } from '../../lib/store/conversationStore';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { Archive } from 'lucide-react';

interface MessageListProps {
  conversationId: string;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const { messages, fetchMessages, isLoading, currentConversation } = useConversationStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages(conversationId);

    // Set up real-time subscription
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages(conversationId);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_type === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                message.sender_type === 'user'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gray-900 text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs mt-2 block opacity-70">
                {format(new Date(message.created_at), 'h:mm a')}
              </span>
            </div>
          </div>
        ))}
        {currentConversation && currentConversation.status === 'archived' && (
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-2 text-gray-600">
              <Archive className="h-4 w-4" />
              <span className="text-sm">This conversation has been archived</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}