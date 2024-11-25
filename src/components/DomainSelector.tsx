import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDomain } from '../context/DomainContext';

export default function DomainSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentDomain, setCurrentDomain, domains, isLoading } = useDomain();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-9 w-40 bg-gray-100 animate-pulse rounded-lg"></div>
    );
  }

  if (!currentDomain || domains.length === 0) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50 rounded-lg">
        No domains available
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <span className="font-medium">{currentDomain.name}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </button>

      {isOpen && domains.length > 0 && (
        <div className="absolute z-50 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => {
                  setCurrentDomain(domain);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${
                  currentDomain.id === domain.id ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                }`}
              >
                {domain.icon && <span>{domain.icon}</span>}
                {domain.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}