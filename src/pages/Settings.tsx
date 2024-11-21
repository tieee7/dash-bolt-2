import React, { useState, useRef } from 'react';
import { Camera, CreditCard, Calendar, Download, LogOut, Save } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  current: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    features: ['500 Email Credits', '100 Domains', '500 Contacts'],
    current: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 99,
    features: ['2000 Email Credits', 'Unlimited Domains', '2000 Contacts', 'Priority Support'],
    current: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    features: ['Unlimited Email Credits', 'Unlimited Domains', 'Unlimited Contacts', '24/7 Support', 'Custom Integration'],
    current: false
  }
];

const transactions = [
  { id: 1, date: '2024-03-15', amount: 99, description: 'Professional Plan - Monthly', status: 'Completed' },
  { id: 2, date: '2024-02-15', amount: 99, description: 'Professional Plan - Monthly', status: 'Completed' },
  { id: 3, date: '2024-01-15', amount: 99, description: 'Professional Plan - Monthly', status: 'Completed' }
];

export default function Settings() {
  const [name, setName] = useState('Mike Woz');
  const [email, setEmail] = useState('mike@example.com');
  const [company, setCompany] = useState('Acme Inc');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success('Profile photo updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handlePlanChange = (planId: string) => {
    toast.success(`Plan will be changed to ${planId} at the start of next billing cycle`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Removed duplicate notifications section */}
      {/* <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            marginBottom: '2rem', // Add some bottom margin to prevent overlap with screen edge
            zIndex: 9999 // Ensure notifications are above other content
          }
        }} 
      /> */}
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-gray-600 text-sm mt-1">
            Update your personal information and profile photo
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-2">
              <div 
                className="relative group cursor-pointer"
                onClick={handleAvatarClick}
              >
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-white group-hover:ring-gray-100 transition-all duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <p className="text-sm text-gray-500">Click to upload new photo</p>
            </div>

            {/* Profile Form */}
            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment & Billing Section */}
      <section className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Payment & Billing</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your subscription and billing preferences
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Subscription Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-6 ${
                  plan.current ? 'border-orange-500 bg-orange-50' : 'hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{plan.name}</h4>
                    <p className="text-2xl font-bold mt-2">${plan.price}<span className="text-sm font-normal text-gray-600">/mo</span></p>
                  </div>
                  {plan.current && (
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanChange(plan.id)}
                  className={`w-full py-2 rounded-lg ${
                    plan.current
                      ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Billing History</h3>
            <button className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-sm">{transaction.description}</td>
                    <td className="py-4 text-sm">${transaction.amount}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-orange-500 hover:text-orange-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}