
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import PatientCard from '../components/PatientCard';
import AlertHistory from '../components/AlertHistory';
import { Search, Users, AlertTriangle, Clock } from 'lucide-react';

const CaretakerDashboard = () => {
  const { user } = useAuth();
  const { patients, alerts, getPatientsByCaretaker } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const assignedPatients = getPatientsByCaretaker(user?.id || '');
  const filteredPatients = assignedPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientIds = assignedPatients.map(p => p.id);
  const relevantAlerts = alerts.filter(alert => patientIds.includes(alert.patientId));
  const criticalAlerts = relevantAlerts.filter(alert => alert.type === 'critical').length;

  const caretakerNames = {
    '3': 'Alice Johnson',
    '4': 'Bob Wilson'
  };

  const patientNames = patients.reduce((acc, patient) => {
    acc[patient.id] = patient.name;
    return acc;
  }, {} as { [key: string]: string });

  const recentAlerts = relevantAlerts.slice(0, 5);

  return (
    <Layout title="Caretaker Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned Patients</p>
                <p className="text-2xl font-bold text-gray-900">{assignedPatients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">{relevantAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Duty</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your assigned patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patients List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Assigned Patients ({filteredPatients.length})</h2>
            {filteredPatients.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients assigned</h3>
                <p className="text-gray-600">You don't have any patients assigned to you at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    caretakerNames={caretakerNames}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Alert History */}
          <div className="lg:col-span-1">
            <AlertHistory alerts={relevantAlerts} patientNames={patientNames} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaretakerDashboard;
