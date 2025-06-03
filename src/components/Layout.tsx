import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { LogOut, Bell, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { getUnresolvedAlerts } = useData();
  const [currentView, setCurrentView] = useState<'dashboard' | 'alerts' | 'contacts'>('dashboard');

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const unresolvedAlerts = getUnresolvedAlerts();
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.type === 'critical').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {criticalAlerts > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {criticalAlerts}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
          alertCount={unresolvedAlerts.length}
        />
      </header>

      <main className="p-6">
        {React.cloneElement(children as React.ReactElement, { currentView })}
      </main>
    </div>
  );
};

export default Layout;
