import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
}

export default function StatsCard({ title, value, Icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-6 w-6 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}