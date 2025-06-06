
import { useData } from '../contexts/DataContext';
import { AlertTriangle, Clock, User, CheckCircle, FileText, XCircle } from 'lucide-react';

const AlertHistoryView = ({ patientIds }) => {
  const { alerts, getPatientById } = useData();
  
  // Filter alerts if patientIds are provided, otherwise show all
  const filteredAlerts = patientIds 
    ? alerts.filter(alert => patientIds.includes(alert.patientId))
    : alerts;

  // Sort alerts by timestamp (newest first)
  const sortedAlerts = [...filteredAlerts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const resolvedAlerts = sortedAlerts.filter(alert => alert.resolved);
  const unresolvedAlerts = sortedAlerts.filter(alert => !alert.resolved);

  if (sortedAlerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts</h3>
        <p className="text-gray-600">No alerts have been recorded yet.</p>
      </div>
    );
  }

  const renderAlert = (alert) => {
    const patient = getPatientById(alert.patientId);
    const isResolved = alert.resolved;
    
    return (
      <div
        key={alert.id}
        className={`p-4 rounded-lg border ${
          isResolved 
            ? 'border-green-200 bg-green-50' 
            : alert.type === 'critical'
            ? 'border-red-200 bg-red-50'
            : 'border-yellow-200 bg-yellow-50'
        }`}
      >
        <div className="flex items-start gap-3">
          {isResolved ? (
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
          )}
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
              <span className={`text-xs font-medium ${
                isResolved ? 'text-green-600' : 'text-red-600'
              }`}>
                {isResolved ? 'RESOLVED' : 'ACTIVE'}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
            
            <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs font-medium text-blue-800">Vital Details:</p>
              <p className="text-sm text-blue-700">
                {alert.vital}: {alert.value?.toFixed(1)} 
                {alert.vital === 'temperature' && '°C'}
                {alert.vital === 'spO2' && '%'}
                {alert.vital === 'heartRate' && ' bpm'}
                {(alert.vital === 'bloodPressureSystolic' || alert.vital === 'bloodPressureDiastolic') && ' mmHg'}
              </p>
            </div>
            
            {isResolved && alert.actionTaken && (
              <div className="mb-3 p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-green-800">Action Taken:</p>
                    <p className="text-sm text-green-700">{alert.actionTaken}</p>
                    <p className="text-xs text-green-600 mt-1">
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
  };

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      {unresolvedAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-red-600">
            Active Alerts ({unresolvedAlerts.length})
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {unresolvedAlerts.map(renderAlert)}
          </div>
        </div>
      )}

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-green-600">
            Resolved Alert History ({resolvedAlerts.length})
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {resolvedAlerts.map(renderAlert)}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Alert Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{unresolvedAlerts.length}</p>
            <p className="text-sm text-red-700">Active Alerts</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</p>
            <p className="text-sm text-green-700">Resolved Alerts</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{sortedAlerts.length}</p>
            <p className="text-sm text-blue-700">Total Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertHistoryView;
