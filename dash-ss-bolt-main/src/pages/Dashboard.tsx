import React from 'react';
import { Users, DollarSign, Calendar } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PlanUsage from '../components/dashboard/PlanUsage';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          A detailed overview of your metrics, usage, customers and more
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Potential Clients" 
          value="5" 
          Icon={Users}
        />
        <StatsCard 
          title="Pipeline Value" 
          value="$125" 
          Icon={DollarSign}
        />
        <StatsCard 
          title="Appointments" 
          value="0" 
          Icon={Calendar}
        />
        <StatsCard 
          title="Total Sales" 
          value="$0" 
          Icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlanUsage />
        <RecentTransactions />
      </div>
    </div>
  );
}