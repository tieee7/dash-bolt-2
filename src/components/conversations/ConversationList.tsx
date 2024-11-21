import React from 'react';
import { User } from 'lucide-react';

interface Conversation {
  id: string;
  email: string;
  message: string;
  date?: string;
  time?: string;
}

const conversations: Conversation[] = [
  {
    id: '1',
    email: 'test.123@gmail.com',
    message: 'This chatroom is empty',
  },
  {
    id: '2',
    email: 'jimmmy.11@gmail.com',
    message: 'aaaaaaaaaaaaaaaaaaaaa...',
    date: '9 Aug'
  },
  {
    id: '3',
    email: 'jooepo44@gmail.com',
    message: "That's great to hear...",
    date: '8 Aug'
  },
  {
    id: '4',
    email: 'steven@gmail.com',
    message: "That's great to hear...",
    date: '9 Aug'
  },
  {
    id: '5',
    email: 'test44@gmail.com',
    message: 'Fantastic! In order ...',
    time: '12:5AM'
  }
];

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedId?: string;
}

export default function ConversationList({ onSelectConversation, selectedId }: ConversationListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation)}
          className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors ${
            selectedId === conversation.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="rounded-full bg-gray-100 p-2">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900">{conversation.email}</span>
              {(conversation.date || conversation.time) && (
                <span className="text-sm text-gray-500">
                  {conversation.date || conversation.time}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">{conversation.message}</p>
          </div>
        </button>
      ))}
    </div>
  );
}