import React from 'react';
import { Globe } from 'lucide-react';

interface DomainHeaderProps {
  isEditing: boolean;
  domainName: string;
  setDomainName: (name: string) => void;
  handleDomainSave: () => void;
  setIsEditing: (editing: boolean) => void;
  currentDomain?: { name: string } | null;
}

export default function DomainHeader({
  isEditing,
  domainName,
  setDomainName,
  handleDomainSave,
  setIsEditing,
  currentDomain
}: DomainHeaderProps) {
  return (
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold mb-4">Domain Name</h3>
      <div className="flex items-center gap-3">
        <Globe className="h-5 w-5 text-gray-500 flex-shrink-0" />
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter domain name"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDomainSave}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDomainName(currentDomain?.name || '');
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between">
            <span className="font-medium text-gray-700">{domainName}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}