import React from 'react';

interface UsageItemProps {
  label: string;
  current: number;
  max: number;
}

function UsageItem({ label, current, max }: UsageItemProps) {
  const percentage = (current / max) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">{current} / {max}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-2 bg-orange-500 rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function PlanUsage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Plan Usage</h2>
      <p className="text-sm text-gray-600 mb-6">
        A detailed overview of your metrics, usage, customers and more
      </p>
      
      <UsageItem label="Email Credits" current={93} max={500} />
      <UsageItem label="Domains" current={2} max={100} />
      <UsageItem label="Contacts" current={5} max={500} />
    </div>
  );
}