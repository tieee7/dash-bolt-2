import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  icon?: string;
}

const domains: Domain[] = [
  { id: '1', name: 'example.com', icon: '🌐' },
  { id: '2', name: 'test.com', icon: '🌐' },
  { id: '3', name: 'demo.com', icon: '🌐' },
  { id: '4', name: 'yourcompany.com', icon: '🌐' },
];

export default function DomainSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain>(() => {
    const saved = localStorage.getItem('selectedDomain');
    return saved ? JSON.parse(saved) : domains[0];
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('selectedDomain', JSON.stringify(selectedDomain));
  }, [selectedDomain]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <span className="font-medium">{selectedDomain.name}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomain(domain);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${
                  selectedDomain.id === domain.id ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
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