
import { useState } from 'react';
import { Patient } from '../contexts/DataContext';
import VitalCard from './VitalCard';
import { User, Clock, MessageSquare } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  showRemarks?: boolean;
  onAddRemark?: (patientId: string, remark: string) => void;
  caretakerNames?: { [key: string]: string };
}

const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  showRemarks = false, 
  onAddRemark,
  caretakerNames = {}
}) => {
  const [remarkText, setRemarkText] = useState('');
  const [showRemarkForm, setShowRemarkForm] = useState(false);

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

  const handleAddRemark = () => {
    if (remarkText.trim() && onAddRemark) {
      onAddRemark(patient.id, remarkText);
      setRemarkText('');
      setShowRemarkForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-600">Age: {patient.age} • {patient.condition}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
            <Clock className="h-4 w-4" />
            {patient.vitals.timestamp.toLocaleTimeString()}
          </div>
          <p className="text-sm text-gray-600">
            Caretakers: {patient.assignedCaretakers.map(id => caretakerNames[id] || `CT-${id}`).join(', ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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

      {patient.remarks && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Doctor's Remarks:</p>
              <p className="text-sm text-blue-700">{patient.remarks}</p>
            </div>
          </div>
        </div>
      )}

      {showRemarks && onAddRemark && (
        <div className="border-t pt-4">
          {!showRemarkForm ? (
            <button
              onClick={() => setShowRemarkForm(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Remark
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter your medical remarks for this patient..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddRemark}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Save Remark
                </button>
                <button
                  onClick={() => {
                    setShowRemarkForm(false);
                    setRemarkText('');
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientCard;
