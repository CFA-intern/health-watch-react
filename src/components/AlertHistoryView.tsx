
import { useData } from '../contexts/DataContext';
import { AlertTriangle, Clock, User, CheckCircle, FileText } from 'lucide-react';

interface AlertHistoryViewProps {
  patientIds?: string[]; // Optional array of patient IDs to filter alerts
}

const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({ patientIds }) => {
  const { getResolvedAlerts, getPatientById } = useData();
  
  // Filter alerts if patientIds are provided
  const resolvedAlerts = patientIds 
    ? getResolvedAlerts().filter(alert => patientIds.includes(alert.patientId))
    : getResolvedAlerts();

  if (resolvedAlerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Resolved Alerts</h3>
        <p className="text-gray-600">No alerts have been resolved yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Alert History ({resolvedAlerts.length} resolved)</h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {resolvedAlerts.map((alert) => {
          const patient = getPatientById(alert.patientId);
          return (
            <div
              key={alert.id}
              className="p-4 rounded-lg border border-green-200 bg-green-50"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {patient?.name || `Patient ${alert.patientId}`}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.type === 'critical' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.type.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">RESOLVED</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
                  
                  {alert.actionTaken && (
                    <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-blue-800">Action Taken:</p>
                          <p className="text-sm text-blue-700">{alert.actionTaken}</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Resolved by: {alert.resolvedBy} on {alert.resolvedAt?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Alert occurred: {alert.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertHistoryView;
