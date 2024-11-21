import React from 'react';
import { MapPin, Clock } from 'lucide-react';

interface Task {
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description: string;
  date: string;
}

const upcomingTasks: Task[] = [
  {
    title: 'Design Conference',
    startTime: '07:19 AM',
    endTime: '11:30 AM',
    location: '56 Dayton Mission Suite 157',
    description: 'Quarterly design team meetup to discuss new trends and upcoming projects',
    date: 'Today'
  },
  {
    title: 'Weekend Festival',
    startTime: '05:00 PM',
    endTime: '10:00 PM',
    location: '853 Moore Flats Suite 158',
    description: 'Annual music and arts festival featuring local artists',
    date: '16 October 2019'
  },
  {
    title: 'Glastonbury Festival',
    startTime: '08:00 PM',
    endTime: '11:00 PM',
    location: '646 Waltor Road Apt. 571',
    description: 'Major music festival with multiple stages and performances',
    date: '20-22 October 2019'
  },
  {
    title: 'Ultra Europe 2019',
    startTime: '10:00 PM',
    endTime: '04:00 AM',
    location: '506 Satterfield Tunnel Apt. 963',
    description: 'Electronic music festival featuring world-renowned DJs',
    date: '25 October 2019'
  }
];

export default function UpcomingTasks() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Tasks</h2>
      <div className="space-y-6">
        {upcomingTasks.map((task, index) => (
          <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
              <span className="text-sm text-gray-500">{task.date}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {task.startTime} - {task.endTime}
              </span>
            </div>
            
            {task.location && (
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{task.location}</span>
              </div>
            )}
            
            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}