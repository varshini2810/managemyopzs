import React from 'react';
import { Search, Bell, Moon, Menu, ChevronDown, Monitor } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  
  const initial = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors">
          <Menu size={20} />
        </button>
        
        <div className="relative w-80 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="w-full pl-9 pr-12 py-1.5 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-gray-700"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-400 font-mono text-[10px] px-1.5 py-0.5">
            ⌘K
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <Moon size={18} />
        </button>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        <button className="flex items-center gap-2.5 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
            {initial}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-gray-700 leading-tight">{user?.name || 'Admin User'}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wide leading-tight">{user?.role || 'System Console'}</div>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
