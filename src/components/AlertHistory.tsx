
import { Alert } from '../contexts/DataContext';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface AlertHistoryProps {
  alerts: Alert[];
  patientNames?: { [key: string]: string };
}

const AlertHistory: React.FC<AlertHistoryProps> = ({ alerts, patientNames = {} }) => {
  const getAlertIcon = (type: string) => {
    return type === 'critical' ? (
      <AlertTriangle className="h-4 w-4 text-red-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-yellow-500" />
    );
  };

  const getAlertColor = (type: string) => {
    return type === 'critical' 
      ? 'bg-red-50 border-red-200' 
      : 'bg-yellow-50 border-yellow-200';
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Alert History</h2>
        <p className="text-gray-500 text-center py-8">No alerts recorded</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Alert History</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">
                    {patientNames[alert.patientId] || `Patient ${alert.patientId}`}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.type === 'critical' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.type.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {alert.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertHistory;
