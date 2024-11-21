import React from 'react';

interface Transaction {
  provider: string;
  amount: number;
  date: string;
}

const transactions: Transaction[] = [
  { provider: 'Stripe', amount: 35, date: '2023-03-15' },
  { provider: 'PayPal', amount: 120, date: '2023-03-14' },
  { provider: 'Stripe', amount: 45, date: '2023-03-13' }
];

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          See more
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div>
              <p className="font-medium">{transaction.provider}</p>
              <p className="text-sm text-gray-600">{transaction.date}</p>
            </div>
            <span className="font-semibold">${transaction.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}