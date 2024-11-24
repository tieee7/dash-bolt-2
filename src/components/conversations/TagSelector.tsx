import React, { useState, useRef } from 'react';
import { Tag as TagIcon, Plus, X } from 'lucide-react';
import { useConversationStore } from '../../lib/store/conversationStore';
import { useClickOutside } from '../../hooks/useClickOutside';

interface TagSelectorProps {
  conversationId: string;
}

export default function TagSelector({ conversationId }: TagSelectorProps) {
  const { tags, currentConversation, addTag, removeTag } = useConversationStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setShowDropdown(false));

  const currentTags = currentConversation?.tags || [];
  const availableTags = tags.filter(
    tag => !currentTags.some(ct => ct.id === tag.id)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
      >
        <TagIcon className="h-4 w-4" />
        <span>Manage Tags</span>
        {currentTags.length > 0 && (
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
            {currentTags.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {/* Current Tags Section */}
          {currentTags.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-2">CURRENT TAGS</div>
              <div className="flex flex-wrap gap-1">
                {currentTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                    <button
                      onClick={() => removeTag(conversationId, tag.id)}
                      className="hover:bg-black/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Tags Section */}
          <div className="p-3">
            {currentTags.length === 0 && (
              <div className="text-xs font-medium text-gray-500 mb-2">ADD TAGS</div>
            )}
            {availableTags.length > 0 ? (
              <div className="space-y-1">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      addTag(conversationId, tag.id);
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-gray-50 rounded-md text-sm"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                    <Plus className="h-3 w-3 ml-auto text-gray-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-2">
                {currentTags.length > 0 ? 'No more tags available' : 'No tags available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}