import React from 'react';
import { Mail, Settings, UserCircle, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { name: 'Onboarding Emails', desc: 'Welcome emails for new customers.' },
  { name: 'Subscription Activation', desc: 'Notify customers when subscriptions become active.' },
  { name: 'Trial Management', desc: 'Trial start, extension, and expiration notifications.' },
  { name: 'Subscription Changes', desc: 'Plan upgrades, downgrades, and modifications.' },
  { name: 'Renewal Reminders', desc: 'Subscription renewal notifications.' },
  { name: 'Payment Success', desc: 'Successful payment confirmations.' },
  { name: 'Payment Failure', desc: 'Failed payment alerts and retry notifications.' },
  { name: 'Invoice Generated', desc: 'Invoice creation notifications.' },
  { name: 'Credit Notes', desc: 'Credit note issuance notifications.' },
  { name: 'Finance Notifications', desc: 'Finance-related alerts and statements.' },
  { name: 'Payment Statements', desc: 'Monthly and custom payment statement emails.' }
];

export default function EmailNotificationsDashboard({ onSelectCategory }) {
  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      
      {/* Main Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Email Notifications</h1>
        <p className="text-stone-600 max-w-3xl">
          Manage and customize all automated email notifications sent to customers regarding subscriptions, invoices, payments, onboarding, and account activities.
        </p>
      </div>

      {/* Top Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <Mail size={20} />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Email Templates</h2>
          </div>
          <p className="text-sm text-stone-600 mb-6 min-h-[40px]">
            Manage default email templates used across the platform.
          </p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Customize Templates
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <Settings size={20} />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">SMTP Settings</h2>
          </div>
          <p className="text-sm text-stone-600 mb-6 min-h-[40px]">
            Configure custom SMTP server or use the default system email service.
          </p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Configure SMTP
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <UserCircle size={20} />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Sender Details</h2>
          </div>
          <div className="mb-4 text-sm text-stone-600 min-h-[40px]">
            <p><span className="font-medium text-stone-800">ManageMyOPZ Team</span></p>
            <p>hello@managemyopz.com</p>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Manage Sender Address
          </button>
        </div>
      </div>

      {/* Notification Categories */}
      <h2 className="text-xl font-bold text-stone-900 mb-6">Notification Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className="bg-white p-5 rounded-lg shadow-sm border border-stone-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-stone-900 mb-2 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
              <p className="text-sm text-stone-500 leading-snug">{cat.desc}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <ChevronRight size={18} className="text-stone-400 group-hover:text-blue-600" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
