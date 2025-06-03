
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { LogOut, Bell, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { alerts } = useData();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const recentAlerts = alerts.slice(0, 5);
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical').length;

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
      </header>

      <main className="p-6">
        {recentAlerts.length > 0 && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <Bell className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Recent Alerts</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {recentAlerts.slice(0, 2).map(alert => (
                    <div key={alert.id} className="mb-1">
                      <span className="font-medium">{alert.message}</span> - {alert.timestamp.toLocaleTimeString()}
                    </div>
                  ))}
                  {recentAlerts.length > 2 && (
                    <p className="text-xs">...and {recentAlerts.length - 2} more alerts</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
};

export default Layout;
