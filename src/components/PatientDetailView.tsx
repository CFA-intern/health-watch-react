
import { Patient, useData } from '../contexts/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, User, Phone, Stethoscope, Clock, Activity } from 'lucide-react';
import VitalCard from './VitalCard';

interface PatientDetailViewProps {
  patient: Patient;
  onClose: () => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onClose }) => {
  const { doctors, caretakers } = useData();
  
  const assignedDoctor = doctors.find(d => d.id === patient.doctorId);
  const assignedCaretakers = caretakers.filter(c => patient.assignedCaretakers.includes(c.id));

  const getVitalStatus = (vital: string, value: number) => {
    const thresholds = {
      heartRate: { min: 60, max: 100 },
      bloodPressureSystolic: { min: 90, max: 140 },
      bloodPressureDiastolic: { min: 60, max: 90 },
      spO2: { min: 95, max: 100 },
      temperature: { min: 36.1, max: 37.2 }
    };

    const threshold = thresholds[vital as keyof typeof thresholds];
    if (!threshold) return 'normal';

    if (value < threshold.min * 0.8 || value > threshold.max * 1.2) return 'critical';
    if (value < threshold.min || value > threshold.max) return 'warning';
    return 'normal';
  };

  const chartData = patient.vitalHistory.map((vital, index) => ({
    time: vital.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: vital.heartRate,
    bloodPressure: vital.bloodPressureSystolic,
    spO2: vital.spO2,
    temperature: vital.temperature
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold">Patient Details - {patient.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Patient Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {patient.name}</p>
                <p><span className="font-medium">Age:</span> {patient.age} years</p>
                <p><span className="font-medium">Condition:</span> {patient.condition}</p>
                <p><span className="font-medium">Emergency Contact:</span> {patient.emergencyContact}</p>
                {patient.remarks && (
                  <p><span className="font-medium">Remarks:</span> {patient.remarks}</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-green-600" />
                Medical Team
              </h3>
              
              {assignedDoctor && (
                <div className="mb-3">
                  <p className="font-medium text-sm">Assigned Doctor:</p>
                  <p className="text-sm">{assignedDoctor.name}</p>
                  <p className="text-sm text-gray-600">{assignedDoctor.specialization}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    <span>{assignedDoctor.phone}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="font-medium text-sm mb-1">Assigned Caretakers:</p>
                {assignedCaretakers.map(caretaker => (
                  <div key={caretaker.id} className="text-sm mb-1">
                    <p>{caretaker.name}</p>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{caretaker.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Vitals */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              Current Vitals
              <span className="flex items-center gap-1 text-sm text-gray-500 font-normal">
                <Clock className="h-4 w-4" />
                {patient.vitals.timestamp.toLocaleTimeString()}
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                label="Blood Pressure"
                value={patient.vitals.bloodPressureSystolic}
                unit={`/${patient.vitals.bloodPressureDiastolic.toFixed(0)}`}
                status={getVitalStatus('bloodPressureSystolic', patient.vitals.bloodPressureSystolic)}
                icon="activity"
                min={90}
                max={140}
              />
              
              <VitalCard
                label="SpO₂"
                value={patient.vitals.spO2}
                unit="%"
                status={getVitalStatus('spO2', patient.vitals.spO2)}
                icon="droplets"
                min={95}
                max={100}
              />
              
              <VitalCard
                label="Temperature"
                value={patient.vitals.temperature}
                unit="°C"
                status={getVitalStatus('temperature', patient.vitals.temperature)}
                icon="temperature"
                min={36.1}
                max={37.2}
              />
            </div>
          </div>

          {/* Health Charts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">24-Hour Health Trends</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-3">Heart Rate (bpm)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[50, 120]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-3">Blood Pressure (mmHg)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[80, 160]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="bloodPressure" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-3">SpO₂ (%)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="spO2" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-3">Temperature (°C)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[35, 39]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
