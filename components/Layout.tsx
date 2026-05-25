
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">NC</div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">NEUROCARE-AI</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => onNavigate('dashboard')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Dashboard</button>
              <button onClick={() => onNavigate('test')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">New Assessment</button>
              <button onClick={() => onNavigate('profile')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Profile</button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <button 
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 NEUROCARE-AI. Preliminary AI screening assistant.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
