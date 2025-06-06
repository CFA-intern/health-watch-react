
import { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import VitalCard from '../components/VitalCard';
import { Stethoscope, FileText, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DoctorDashboard = () => {
  const { patients, addRemark } = useData();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [remarkContent, setRemarkContent] = useState('');
  const [remarkType, setRemarkType] = useState('observation');

  const handleAddRemark = () => {
    if (!selectedPatient || !remarkContent.trim()) return;

    const newRemark = {
      id: Date.now().toString(),
      doctorId: user.id,
      doctorName: user.name,
      content: remarkContent,
      timestamp: new Date(),
      type: remarkType
    };

    addRemark(selectedPatient.id, newRemark);
    setRemarkContent('');
    
    toast({
      title: "Remark Added",
      description: `Added ${remarkType} for ${selectedPatient.name}`,
    });
  };

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
    <Layout title="Doctor Dashboard">
      <div className="space-y-6">
        {/* Patient List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Patient Monitoring
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Age: {patient.age}</p>
                    <p className="text-sm text-gray-600">{patient.condition}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {patient.lastUpdated.toLocaleString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded ${
                    getVitalStatus('heartRate', patient.vitals.heartRate) === 'critical' ? 'bg-red-100' :
                    getVitalStatus('heartRate', patient.vitals.heartRate) === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    HR: {patient.vitals.heartRate} bpm
                  </div>
                  <div className={`p-2 rounded ${
                    getVitalStatus('bloodPressureSystolic', patient.vitals.bloodPressureSystolic) === 'critical' ? 'bg-red-100' :
                    getVitalStatus('bloodPressureSystolic', patient.vitals.bloodPressureSystolic) === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    BP: {patient.vitals.bloodPressureSystolic}/{patient.vitals.bloodPressureDiastolic}
                  </div>
                  <div className={`p-2 rounded ${
                    getVitalStatus('temperature', patient.vitals.temperature) === 'critical' ? 'bg-red-100' :
                    getVitalStatus('temperature', patient.vitals.temperature) === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    Temp: {patient.vitals.temperature.toFixed(1)}°C
                  </div>
                  <div className={`p-2 rounded ${
                    getVitalStatus('spO2', patient.vitals.spO2) === 'critical' ? 'bg-red-100' :
                    getVitalStatus('spO2', patient.vitals.spO2) === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    SpO2: {patient.vitals.spO2}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Patient Details */}
        {selectedPatient && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vital Signs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Vital Signs - {selectedPatient.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <VitalCard
                  label="Heart Rate"
                  value={selectedPatient.vitals.heartRate}
                  unit="bpm"
                  status={getVitalStatus('heartRate', selectedPatient.vitals.heartRate)}
                  icon="heart"
                  min={60}
                  max={100}
                />
                <VitalCard
                  label="Blood Pressure"
                  value={selectedPatient.vitals.bloodPressureSystolic}
                  unit="mmHg"
                  status={getVitalStatus('bloodPressureSystolic', selectedPatient.vitals.bloodPressureSystolic)}
                  icon="activity"
                />
                <VitalCard
                  label="Temperature"
                  value={selectedPatient.vitals.temperature}
                  unit="°C"
                  status={getVitalStatus('temperature', selectedPatient.vitals.temperature)}
                  icon="temperature"
                  min={36.0}
                  max={37.5}
                />
                <VitalCard
                  label="SpO2"
                  value={selectedPatient.vitals.spO2}
                  unit="%"
                  status={getVitalStatus('spO2', selectedPatient.vitals.spO2)}
                  icon="droplets"
                  min={95}
                  max={100}
                />
              </div>
            </div>

            {/* Add Remark */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Add Medical Remark
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remark Type
                  </label>
                  <select
                    value={remarkType}
                    onChange={(e) => setRemarkType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="observation">Observation</option>
                    <option value="treatment">Treatment</option>
                    <option value="urgent">Urgent Note</option>
                    <option value="follow-up">Follow-up Required</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remark Content
                  </label>
                  <textarea
                    value={remarkContent}
                    onChange={(e) => setRemarkContent(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your medical remark..."
                  />
                </div>
                
                <button
                  onClick={handleAddRemark}
                  disabled={!remarkContent.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Add Remark
                </button>
              </div>

              {/* Previous Remarks */}
              {selectedPatient.remarks.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Previous Remarks</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedPatient.remarks.map((remark) => (
                      <div key={remark.id} className="border-l-4 border-blue-500 pl-3 py-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">{remark.doctorName}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            remark.type === 'urgent' ? 'bg-red-100 text-red-800' :
                            remark.type === 'treatment' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {remark.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{remark.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {remark.timestamp.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
