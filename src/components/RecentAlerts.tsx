
import { useData } from '../contexts/DataContext';
import { AlertTriangle, Clock, User, Activity, Heart, Thermometer, Droplets } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RecentAlerts = ({ patientIds = [] }) => {
  const { getUnresolvedAlerts, getPatientById, resolveAlert } = useData();
  const { user } = useAuth();
  const [resolvingAlert, setResolvingAlert] = useState<string | null>(null);
  const [actionTaken, setActionTaken] = useState('');
  
  // Filter alerts based on patient IDs if provided (for caretakers)
  const unresolvedAlerts = patientIds.length > 0 
    ? getUnresolvedAlerts().filter(alert => patientIds.includes(alert.patientId)).slice(0, 5)
    : getUnresolvedAlerts().slice(0, 5);

  const getVitalIcon = (vital: string) => {
    switch (vital) {
      case 'heartRate': return <Heart className="h-4 w-4" />;
      case 'bloodPressureSystolic': 
      case 'bloodPressureDiastolic': return <Activity className="h-4 w-4" />;
      case 'spO2': return <Droplets className="h-4 w-4" />;
      case 'temperature': return <Thermometer className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleResolveAlert = (alertId: string) => {
    if (actionTaken.trim()) {
      resolveAlert(alertId, actionTaken, user?.name || 'Unknown User');
      setResolvingAlert(null);
      setActionTaken('');
    }
  };

  if (unresolvedAlerts.length === 0) {
    return (
      <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-green-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-green-800">All Clear</h3>
            <p className="text-sm text-green-700">No active alerts at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  // Display the user interface logic - only show resolve button for caretakers
  const showResolveButton = user?.role === 'caretaker';

  return (
    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-3">Active Alerts ({unresolvedAlerts.length})</h3>
          <div className="space-y-3">
            {unresolvedAlerts.map(alert => {
              const patient = getPatientById(alert.patientId);
              return (
                <div key={alert.id} className="bg-white rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{patient?.name || 'Unknown Patient'}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.type === 'critical' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.type.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {getVitalIcon(alert.vital)}
                        <span className="text-sm text-gray-700">{alert.message}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp.toLocaleString()}
                        </div>
                        {patient && (
                          <div>Age: {patient.age} • {patient.condition}</div>
                        )}
                      </div>
                      
                      {showResolveButton && (
                        <>
                          {resolvingAlert === alert.id ? (
                            <div className="mt-3 space-y-2">
                              <textarea
                                value={actionTaken}
                                onChange={(e) => setActionTaken(e.target.value)}
                                placeholder="Describe the action taken to resolve this alert..."
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleResolveAlert(alert.id)}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                                >
                                  Resolve
                                </button>
                                <button
                                  onClick={() => {
                                    setResolvingAlert(null);
                                    setActionTaken('');
                                  }}
                                  className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setResolvingAlert(alert.id)}
                              className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                            >
                              Resolve Alert
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentAlerts;
