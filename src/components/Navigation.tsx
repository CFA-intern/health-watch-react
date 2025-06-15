
import { AlertTriangle, Phone, Activity } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'alerts' | 'contacts';
  onViewChange: (view: 'dashboard' | 'alerts' | 'contacts') => void;
  alertCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, alertCount = 0 }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="px-6 py-3">
        <div className="flex space-x-8">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Activity className="h-4 w-4" />
            Dashboard
          </button>

          <button
            onClick={() => onViewChange('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative ${
              currentView === 'alerts'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Alert History
            {alertCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('contacts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'contacts'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Phone className="h-4 w-4" />
            Contacts
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
