import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useConversationStore } from '../../lib/store/conversationStore';

export default function TagManager() {
  const { tags, selectedTags, setSelectedTags, createTag, deleteTag, fetchTags, fetchConversations } = useConversationStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6366F1');

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    await createTag(newTagName.trim(), newTagColor);
    setNewTagName('');
    setIsCreating(false);
  };

  const handleDeleteTag = async (tagId: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      await deleteTag(tagId);
      // Remove the deleted tag from selected tags if it was selected
      if (selectedTags.includes(tagId)) {
        const newSelectedTags = selectedTags.filter(id => id !== tagId);
        setSelectedTags(newSelectedTags);
        await fetchConversations();
      }
    }
  };

  const handleTagToggle = async (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    await fetchConversations();
  };

  return (
    <div className="relative">
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-medium text-gray-700">Filter by Tags</h3>
          <button
            onClick={() => setIsCreating(true)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Tag
          </button>
        </div>
        
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">No tags available</p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className={`group flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-blue-100 cursor-pointer ${
                  selectedTags.includes(tag.id) ? 'bg-blue-200' : 'bg-gray-100'
                }`}
              >
                <div
                  onClick={() => handleTagToggle(tag.id)}
                  className="flex items-center gap-1.5 flex-1"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm text-gray-700">{tag.name}</span>
                  {selectedTags.includes(tag.id) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTag(tag.id);
                  }}
                  className="p-0.5 text-gray-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Tag Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Create New Tag</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTag} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tag name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Create Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}