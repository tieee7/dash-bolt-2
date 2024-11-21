import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const events = [
  {
    name: 'Design Conference',
    date: 3,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    name: 'Weekend Festival',
    date: 16,
    color: 'bg-pink-100 text-pink-800',
  },
  {
    name: 'Glastonbury Festival',
    date: 23,
    color: 'bg-orange-100 text-orange-800',
  },
];

export default function Calendar() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Calendar</h2>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Event
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button className="text-sm font-medium">Today</button>
        <div className="flex items-center gap-4">
          <ChevronLeft className="h-5 w-5 text-gray-500 cursor-pointer" />
          <h3 className="text-lg font-medium">October 2019</h3>
          <ChevronRight className="h-5 w-5 text-gray-500 cursor-pointer" />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm rounded">Day</button>
          <button className="px-3 py-1 text-sm rounded">Week</button>
          <button className="px-3 py-1 text-sm rounded bg-blue-500 text-white">
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => (
          <div key={day} className="bg-white p-4 text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const day = i - 4; // Adjust to start from the correct day
          const event = events.find((e) => e.date === day);
          
          return (
            <div
              key={i}
              className={`bg-white p-4 min-h-[100px] ${
                day < 1 || day > 31 ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              <span className="text-sm">{day > 0 && day <= 31 ? day : ''}</span>
              {event && (
                <div className={`mt-2 p-2 rounded-md text-sm ${event.color}`}>
                  {event.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}