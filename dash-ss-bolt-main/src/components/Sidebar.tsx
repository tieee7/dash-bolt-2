import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Puzzle,
  Settings,
  Calendar,
  Mail,
  Globe,
  Users,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react';

interface MenuItem {
  icon: any;
  label: string;
  id: string;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const iconComponents = {
  dashboard: LayoutDashboard,
  conversations: MessageSquare,
  integrations: Puzzle,
  settings: Settings,
  calendar: Calendar,
  email: Mail,
  leads: Users,
  domain: Globe,
};

const defaultMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: MessageSquare, label: 'Conversations', id: 'conversations' },
  { icon: Puzzle, label: 'Integrations', id: 'integrations' },
  { icon: Settings, label: 'Settings', id: 'settings' },
  { icon: Calendar, label: 'Calendar', id: 'calendar' },
  { icon: Mail, label: 'Email Marketing', id: 'email' },
  { icon: Users, label: 'Leads', id: 'leads' },
  { icon: Globe, label: 'Domain', id: 'domain' },
];

export default function Sidebar({ isOpen, toggleSidebar, currentPage, onPageChange }: SidebarProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    // Initialize from localStorage or use default
    const savedOrder = localStorage.getItem('sidebarOrder');
    if (savedOrder) {
      try {
        const savedIds = JSON.parse(savedOrder) as string[];
        const orderedItems = savedIds.map(id => ({
          ...defaultMenuItems.find(item => item.id === id)!,
          icon: iconComponents[id as keyof typeof iconComponents]
        }));
        if (orderedItems.length === defaultMenuItems.length) {
          return orderedItems;
        }
      } catch (error) {
        console.error('Error loading saved order:', error);
      }
    }
    return defaultMenuItems;
  });

  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || !isDragging) return;
    
    setMenuItems(prevItems => {
      const items = [...prevItems];
      const draggedItemContent = items[draggedItem];
      items.splice(draggedItem, 1);
      items.splice(index, 0, draggedItemContent);
      return items;
    });
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    if (isDragging) {
      const orderToSave = menuItems.map(item => item.id);
      localStorage.setItem('sidebarOrder', JSON.stringify(orderToSave));
      setIsDragging(false);
      setDraggedItem(null);
    }
  };

  const resetOrder = () => {
    localStorage.removeItem('sidebarOrder');
    setMenuItems(defaultMenuItems);
  };

  return (
    <div 
      className={`bg-white h-screen shadow-lg transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } flex flex-col fixed left-0 top-0`}
    >
      <div className="flex items-center p-4 border-b">
        {isOpen && (
          <button 
            onClick={() => onPageChange('dashboard')}
            className="text-xl font-bold text-orange-500 hover:text-orange-600"
          >
            corinna.ai
          </button>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg hover:bg-gray-100 ml-auto`}
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 pt-4">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-move
              ${!isOpen && 'justify-center'}
              ${currentPage === item.id ? 'bg-orange-50 text-orange-600' : ''}`}
          >
            {isOpen && (
              <GripVertical className="h-4 w-4 mr-2 text-gray-400" />
            )}
            <button
              onClick={() => onPageChange(item.id)}
              className="flex items-center flex-1"
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </button>
          </div>
        ))}
      </nav>

      {isOpen && (
        <button
          onClick={resetOrder}
          className="m-4 p-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          Reset Menu Order
        </button>
      )}
    </div>
  );
}