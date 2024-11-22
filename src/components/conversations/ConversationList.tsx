import React, { useEffect } from 'react';
import { User } from 'lucide-react';
import { useConversationStore } from '../../lib/store/conversationStore';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedId?: string;
}

export default function ConversationList({ onSelectConversation, selectedId }: ConversationListProps) {
  const { conversations, fetchConversations, isLoading } = useConversationStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors ${
            selectedId === conversation.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="rounded-full bg-gray-100 p-2">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900">
                {conversation.title || 'New Conversation'}
              </span>
              {conversation.last_message_at && (
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                </span>
              )}
            </div>
            {!conversation.is_read && (
              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mb-1"></span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}