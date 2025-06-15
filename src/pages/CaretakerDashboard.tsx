
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import PatientCard from '../components/PatientCard';
import AlertHistoryView from '../components/AlertHistoryView';
import ContactsView from '../components/ContactsView';
import RecentAlerts from '../components/RecentAlerts';
import { Search, Users, AlertTriangle, Clock } from 'lucide-react';

interface CaretakerDashboardProps {
  currentView?: 'dashboard' | 'alerts' | 'contacts';
}

const CaretakerDashboard: React.FC<CaretakerDashboardProps> = ({ currentView = 'dashboard' }) => {
  const { user } = useAuth();
  const { patients, getPatientsByCaretaker, getUnresolvedAlerts, getResolvedAlerts } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const assignedPatients = getPatientsByCaretaker(user?.id || '');
  const filteredPatients = assignedPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientIds = assignedPatients.map(p => p.id);
  const unresolvedAlerts = getUnresolvedAlerts().filter(alert => patientIds.includes(alert.patientId));
  const resolvedAlerts = getResolvedAlerts().filter(alert => patientIds.includes(alert.patientId));
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.type === 'critical').length;

  const caretakerNames = {
    '3': 'Alice Johnson',
    '4': 'Bob Wilson'
  };

  const renderContent = () => {
    switch (currentView) {
      case 'alerts':
        return <AlertHistoryView patientIds={patientIds} />;
      case 'contacts':
        return <ContactsView showAll={false} />;
      default:
        return (
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
                    <p className="text-sm text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-yellow-600">{unresolvedAlerts.length}</p>
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

            {/* Recent Alerts */}
            <RecentAlerts patientIds={patientIds} />

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

            {/* Patients List */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Assigned Patients ({filteredPatients.length})</h2>
              {filteredPatients.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                  <p className="text-gray-600">
                    {assignedPatients.length === 0 
                      ? "You don't have any patients assigned to you at the moment."
                      : "No patients match your search criteria."
                    }
                  </p>
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
          </div>
        );
    }
  };

  return (
    <Layout title="Caretaker Dashboard">
      {renderContent()}
    </Layout>
  );
};

export default CaretakerDashboard;
