
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import VitalCard from '../components/VitalCard';
import { Users, Clock, AlertTriangle } from 'lucide-react';

const CaretakerDashboard = () => {
  const { getPatientsByCaretaker, getUnresolvedAlerts } = useData();
  const { user } = useAuth();
  
  // For demo purposes, assume caretaker1 for non-admin users
  const caretakerId = user?.role === 'caretaker' ? 'caretaker1' : 'caretaker1';
  const assignedPatients = getPatientsByCaretaker(caretakerId);
  const allAlerts = getUnresolvedAlerts();
  const relevantAlerts = allAlerts.filter(alert => 
    assignedPatients.some(patient => patient.id === alert.patientId)
  );

  const getVitalStatus = (vital, value) => {
    switch (vital) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        if (value < 50 || value > 110) return 'critical';
        return 'normal';
      case 'bloodPressureSystolic':
        if (value > 140) return 'warning';
        if (value > 160) return 'critical';
        return 'normal';
      case 'bloodPressureDiastolic':
        if (value > 90) return 'warning';
        if (value > 100) return 'critical';
        return 'normal';
      case 'temperature':
        if (value > 37.5 || value < 36.0) return 'warning';
        if (value > 38.5 || value < 35.0) return 'critical';
        return 'normal';
      case 'spO2':
        if (value < 95) return 'warning';
        if (value < 90) return 'critical';
        return 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <Layout title="Caretaker Dashboard">
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned Patients</p>
                <p className="text-3xl font-bold text-blue-600">{assignedPatients.length}</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-red-600">{relevantAlerts.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-sm font-medium text-gray-700">
                  {assignedPatients.length > 0 
                    ? Math.max(...assignedPatients.map(p => p.lastUpdated.getTime())) === Math.max(...assignedPatients.map(p => p.lastUpdated.getTime()))
                      ? new Date(Math.max(...assignedPatients.map(p => p.lastUpdated.getTime()))).toLocaleTimeString()
                      : 'Never'
                    : 'No patients'
                  }
                </p>
              </div>
              <Clock className="h-12 w-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        {relevantAlerts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Active Alerts ({relevantAlerts.length})
            </h2>
            <div className="space-y-3">
              {relevantAlerts.map((alert) => {
                const patient = assignedPatients.find(p => p.id === alert.patientId);
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.type === 'critical' 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient?.name}</h3>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.type === 'critical' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Patient Vitals */}
        <div className="space-y-6">
          {assignedPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{patient.name}</h2>
                  <p className="text-gray-600">Age: {patient.age} | Condition: {patient.condition}</p>
                  <p className="text-sm text-gray-500">
                    Last updated: {patient.lastUpdated.toLocaleString()}
                  </p>
                </div>
                
                {/* Recent Remarks */}
                {patient.remarks.length > 0 && (
                  <div className="max-w-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Latest Remark:</h4>
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                      <p className="text-sm text-gray-700">{patient.remarks[patient.remarks.length - 1].content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {patient.remarks[patient.remarks.length - 1].doctorName} - {patient.remarks[patient.remarks.length - 1].timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <VitalCard
                  label="Heart Rate"
                  value={patient.vitals.heartRate}
                  unit="bpm"
                  status={getVitalStatus('heartRate', patient.vitals.heartRate)}
                  icon="heart"
                  min={60}
                  max={100}
                />
                <VitalCard
                  label="Blood Pressure (Sys)"
                  value={patient.vitals.bloodPressureSystolic}
                  unit="mmHg"
                  status={getVitalStatus('bloodPressureSystolic', patient.vitals.bloodPressureSystolic)}
                  icon="activity"
                />
                <VitalCard
                  label="Temperature"
                  value={patient.vitals.temperature}
                  unit="°C"
                  status={getVitalStatus('temperature', patient.vitals.temperature)}
                  icon="temperature"
                  min={36.0}
                  max={37.5}
                />
                <VitalCard
                  label="SpO2"
                  value={patient.vitals.spO2}
                  unit="%"
                  status={getVitalStatus('spO2', patient.vitals.spO2)}
                  icon="droplets"
                  min={95}
                  max={100}
                />
              </div>
            </div>
          ))}
        </div>

        {assignedPatients.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Patients</h3>
            <p className="text-gray-600">You don't have any patients assigned to you at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CaretakerDashboard;
