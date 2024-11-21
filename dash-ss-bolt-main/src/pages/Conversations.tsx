import React, { useState, useRef } from 'react';
import { Mail, Clock, ChevronDown, X, Star, Trash2, Eye, EyeOff } from 'lucide-react';
import ConversationList from '../components/conversations/ConversationList';
import FilterBar from '../components/conversations/FilterBar';
import { useClickOutside } from '../hooks/useClickOutside';
import { toast, Toaster } from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const initialFilters = [
  { icon: Mail, label: 'Unread', id: 'unread' },
  { icon: Mail, label: 'All', id: 'all' },
  { icon: Clock, label: 'Expired', id: 'expired' },
];

const filterSections = {
  tags: {
    title: 'Tags',
    options: [
      { id: 'urgent', label: 'Urgent', color: 'red' },
      { id: 'follow-up', label: 'Follow Up', color: 'blue' },
      { id: 'resolved', label: 'Resolved', color: 'green' },
      { id: 'pending', label: 'Pending', color: 'yellow' },
    ]
  },
  status: {
    title: 'Status',
    options: [
      { id: 'new', label: 'New' },
      { id: 'in-progress', label: 'In Progress' },
      { id: 'completed', label: 'Completed' },
    ]
  },
  priority: {
    title: 'Priority',
    options: [
      { id: 'high', label: 'High' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low' },
    ]
  }
};

const sampleMessages: Message[] = [
  {
    id: '1',
    text: "Hi there! How can I help you today?",
    sender: 'bot',
    timestamp: '10:00 AM'
  },
  {
    id: '2',
    text: "I'm having trouble with my account settings. Can't seem to find where to change my notification preferences.",
    sender: 'user',
    timestamp: '10:01 AM'
  },
  {
    id: '3',
    text: "I can help you with that! To change your notification preferences, go to Settings > Notifications. There you'll find all available options for customizing your notifications.",
    sender: 'bot',
    timestamp: '10:01 AM'
  },
  {
    id: '4',
    text: "Thanks! Found it. One more question - is there a way to mute notifications for specific times?",
    sender: 'user',
    timestamp: '10:02 AM'
  },
  {
    id: '5',
    text: "Yes, absolutely! In the same Notifications section, you'll find a 'Quiet Hours' option. You can set specific time ranges when you don't want to receive notifications.",
    sender: 'bot',
    timestamp: '10:03 AM'
  }
];

export default function Conversations() {
  const [openFilter, setOpenFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState('unread');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    tags: [],
    status: [],
    priority: [],
  });
  const [isStarred, setIsStarred] = useState(false);
  const [isRead, setIsRead] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [messages, setMessages] = useState(sampleMessages);

  // Refs for dropdown menus
  const filtersRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Use click outside hook for each dropdown
  useClickOutside(filtersRef, () => setOpenFilter(''), openFilter === 'filters');
  useClickOutside(tagsRef, () => setOpenFilter(''), openFilter === 'tags');
  useClickOutside(priorityRef, () => setOpenFilter(''), openFilter === 'priority');
  useClickOutside(statusRef, () => setOpenFilter(''), openFilter === 'status');

  const handleFilterToggle = (filter: string) => {
    setOpenFilter(prev => prev === filter ? '' : filter);
  };

  const toggleFilter = (section: string, id: string) => {
    setSelectedFilters(prev => {
      const current = prev[section] || [];
      const updated = current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [section]: updated };
    });
  };

  const handleRemoveFilter = (section: string, id: string) => {
    toggleFilter(section, id);
  };

  const handleDeleteConversation = () => {
    setMessages([]);
    toast.success('Conversation deleted successfully');
  };

  const handleReadToggle = () => {
    setIsRead(!isRead);
    toast.success(`Conversation marked as ${isRead ? 'unread' : 'read'}`);
  };

  const getDropdownRef = (filter: string) => {
    switch (filter) {
      case 'filters':
        return filtersRef;
      case 'tags':
        return tagsRef;
      case 'priority':
        return priorityRef;
      case 'status':
        return statusRef;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Toaster position="top-right" />
      
      {/* Left Panel */}
      <div className="w-96 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4 mb-4">
            {initialFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  activeFilter === filter.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </button>
            ))}
          </div>
          
          {/* Filter Button and Dropdown */}
          <div className="relative" ref={filtersRef}>
            <button
              onClick={() => handleFilterToggle('filters')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <span>Filters</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Filter Bar */}
            <FilterBar
              selectedFilters={selectedFilters}
              filterSections={filterSections}
              onRemoveFilter={handleRemoveFilter}
            />

            {/* Dropdown Menu */}
            {openFilter === 'filters' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {Object.entries(filterSections).map(([sectionKey, section]) => (
                  <div key={sectionKey} className="p-4 border-b border-gray-100 last:border-0">
                    <h3 className="font-medium mb-2">{section.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {section.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => toggleFilter(sectionKey, option.id)}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            selectedFilters[sectionKey]?.includes(option.id)
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <ConversationList />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Support Conversation</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReadToggle}
                className={`p-2 rounded-lg hover:bg-gray-100 ${
                  isRead ? 'text-gray-400' : 'text-blue-500'
                }`}
                title={isRead ? 'Mark as unread' : 'Mark as read'}
              >
                {isRead ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsStarred(!isStarred)}
                className={`p-2 rounded-lg hover:bg-gray-100 ${
                  isStarred ? 'text-yellow-500' : 'text-gray-400'
                }`}
                title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`h-5 w-5 ${isStarred ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleDeleteConversation}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                title="Delete conversation"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Selected Tags Display */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                />
              </span>
            ))}
          </div>

          {/* Filter Buttons Row */}
          <div className="flex gap-2">
            {['tags', 'priority', 'status'].map((filterType) => (
              <div key={filterType} className="relative" ref={getDropdownRef(filterType)}>
                <button
                  onClick={() => handleFilterToggle(filterType)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <span>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {openFilter === filterType && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                    <div className="p-2">
                      {filterSections[filterType as keyof typeof filterSections].options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSelectedTags(prev => 
                              prev.includes(option.id) 
                                ? prev.filter(t => t !== option.id)
                                : [...prev, option.id]
                            );
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            selectedTags.includes(option.id)
                              ? 'bg-gray-900 text-white'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs mt-2 block opacity-70">{message.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}