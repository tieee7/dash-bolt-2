import React, { useState, useRef } from 'react';
import { Info } from 'lucide-react';
import { format } from 'date-fns';
import { useClickOutside } from '../../hooks/useClickOutside';

interface ConversationDetailsProps {
  createdAt: string;
  updatedAt: string;
  messages: Array<{ sender_type: 'user' | 'bot' }>;
}

export default function ConversationDetails({ createdAt, updatedAt, messages }: ConversationDetailsProps) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(popoverRef, () => setShowPopover(false));

  const userMessages = messages.filter(m => m.sender_type === 'user').length;
  const botMessages = messages.filter(m => m.sender_type === 'bot').length;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setShowPopover(!showPopover)}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        title="Conversation Details"
      >
        <Info className="h-5 w-5" />
      </button>

      {showPopover && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h4 className="font-medium text-gray-900 mb-3">Conversation Details</h4>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-sm font-medium">
                {format(new Date(createdAt), 'PPP p')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-sm font-medium">
                {format(new Date(updatedAt), 'PPP p')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-sm font-medium">{messages.length}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">User Messages</p>
                <p className="text-sm font-medium">{userMessages}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bot Messages</p>
                <p className="text-sm font-medium">{botMessages}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}