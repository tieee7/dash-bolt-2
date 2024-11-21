import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

interface FilterChip {
  id: string;
  section: string;
  label: string;
}

interface FilterBarProps {
  selectedFilters: Record<string, string[]>;
  filterSections: Record<string, { title: string; options: { id: string; label: string }[] }>;
  onRemoveFilter: (section: string, id: string) => void;
}

export default function FilterBar({ selectedFilters, filterSections, onRemoveFilter }: FilterBarProps) {
  const [showOverflow, setShowOverflow] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setShowOverflow(false));

  // Convert selected filters to chips
  const filterChips: FilterChip[] = Object.entries(selectedFilters).flatMap(([section, filters]) =>
    filters.map(filter => ({
      id: filter,
      section,
      label: filterSections[section].options.find(opt => opt.id === filter)?.label || filter
    }))
  );

  // Check for overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && overflowRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = overflowRef.current.scrollWidth;
        setHasOverflow(contentWidth > containerWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [filterChips]);

  if (filterChips.length === 0) return null;

  return (
    <div className="relative flex items-center gap-2 py-2">
      <div ref={containerRef} className="flex-1 overflow-hidden">
        <div ref={overflowRef} className="flex flex-wrap gap-2">
          {filterChips.map((chip, index) => (
            <div
              key={`${chip.section}-${chip.id}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
            >
              <span className="text-gray-600">{chip.label}</span>
              <button
                onClick={() => onRemoveFilter(chip.section, chip.id)}
                className="p-0.5 hover:bg-gray-200 rounded-full"
              >
                <X className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {hasOverflow && (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowOverflow(!showOverflow)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            More
            <ChevronDown className="h-4 w-4" />
          </button>

          {showOverflow && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              {filterChips.map((chip) => (
                <div
                  key={`${chip.section}-${chip.id}`}
                  className="px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{chip.label}</span>
                  <button
                    onClick={() => onRemoveFilter(chip.section, chip.id)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}