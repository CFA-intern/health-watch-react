
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import VitalCard from '../components/VitalCard';
import { Users, UserCheck, AlertTriangle, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { patients, caretakers, getUnresolvedAlerts } = useData();
  const unresolvedAlerts = getUnresolvedAlerts();
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.type === 'critical');

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Caretakers</p>
                <p className="text-3xl font-bold text-green-600">{caretakers.length}</p>
              </div>
              <UserCheck className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-yellow-600">{unresolvedAlerts.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-600">{criticalAlerts.length}</p>
              </div>
              <Activity className="h-12 w-12 text-red-600" />
            </div>
          </div>
        </div>

        {/* Patient Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Patient Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caretaker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient) => {
                  const hasActiveAlert = unresolvedAlerts.some(alert => alert.patientId === patient.id);
                  const caretaker = caretakers.find(c => c.id === patient.caretakerId);
                  
                  return (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{patient.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.condition}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{caretaker?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          hasActiveAlert 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {hasActiveAlert ? 'Alert' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {patient.lastUpdated.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Caretaker Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Caretaker Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caretakers.map((caretaker) => (
              <div key={caretaker.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{caretaker.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Email: {caretaker.email}</p>
                  <p>Phone: {caretaker.phone}</p>
                  <p>Shift: {caretaker.shift}</p>
                  <p>Patients: {caretaker.patients.length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
