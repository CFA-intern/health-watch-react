
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import PatientCard from '../components/PatientCard';
import AlertHistory from '../components/AlertHistory';
import { Search, Users, AlertTriangle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DoctorDashboard = () => {
  const { patients, alerts, addRemark } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRemark = (patientId: string, remark: string) => {
    addRemark(patientId, remark);
    toast({
      title: "Remark Added",
      description: "Patient remark has been successfully saved",
    });
  };

  const totalPatients = patients.length;
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical').length;
  const patientsWithRemarks = patients.filter(p => p.remarks).length;

  const caretakerNames = {
    '3': 'Alice Johnson',
    '4': 'Bob Wilson'
  };

  const patientNames = patients.reduce((acc, patient) => {
    acc[patient.id] = patient.name;
    return acc;
  }, {} as { [key: string]: string });

  return (
    <Layout title="Doctor Dashboard">
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
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Patients with Remarks</p>
                <p className="text-2xl font-bold text-green-600">{patientsWithRemarks}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">{alerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patients List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">All Patients ({filteredPatients.length})</h2>
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  showRemarks={true}
                  onAddRemark={handleAddRemark}
                  caretakerNames={caretakerNames}
                />
              ))}
            </div>
          </div>

          {/* Alert History */}
          <div className="lg:col-span-1">
            <AlertHistory alerts={alerts} patientNames={patientNames} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
