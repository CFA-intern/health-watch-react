
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import PatientCard from '../components/PatientCard';
import AlertHistoryView from '../components/AlertHistoryView';
import ContactsView from '../components/ContactsView';
import RecentAlerts from '../components/RecentAlerts';
import { Search, Users, AlertTriangle, Activity } from 'lucide-react';

interface AdminDashboardProps {
  currentView?: 'dashboard' | 'alerts' | 'contacts';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentView = 'dashboard' }) => {
  const { patients, getUnresolvedAlerts, getResolvedAlerts } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPatients = patients.length;
  const unresolvedAlerts = getUnresolvedAlerts();
  const resolvedAlerts = getResolvedAlerts();
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.type === 'critical').length;
  const totalCaretakers = [...new Set(patients.flatMap(p => p.assignedCaretakers))].length;

  const caretakerNames = {
    '3': 'Alice Johnson',
    '4': 'Bob Wilson'
  };

  const renderContent = () => {
    switch (currentView) {
      case 'alerts':
        return <AlertHistoryView />;
      case 'contacts':
        return <ContactsView />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Caretakers</p>
                    <p className="text-2xl font-bold text-gray-900">{totalCaretakers}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
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
                    <p className="text-2xl font-bold text-yellow-600">{unresolvedAlerts.length + resolvedAlerts.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <RecentAlerts />

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients by name or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Patients List */}
            <div>
              <h2 className="text-xl font-semibold mb-4">All Patients ({filteredPatients.length})</h2>
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    caretakerNames={caretakerNames}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout title="Admin Dashboard">
      {renderContent()}
    </Layout>
  );
};

export default AdminDashboard;
