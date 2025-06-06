
import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(undefined);

// Mock data
const generateMockPatients = () => [
  {
    id: '1',
    name: 'John Smith',
    age: 65,
    condition: 'Hypertension',
    caretakerId: 'caretaker1',
    vitals: {
      heartRate: 85,
      bloodPressureSystolic: 140,
      bloodPressureDiastolic: 90,
      temperature: 36.8,
      spO2: 97
    },
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    remarks: [
      {
        id: '1',
        doctorId: '2',
        doctorName: 'Dr. Sarah Wilson',
        content: 'Blood pressure slightly elevated. Continue monitoring.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'observation'
      }
    ]
  },
  {
    id: '2',
    name: 'Mary Johnson',
    age: 72,
    condition: 'Diabetes',
    caretakerId: 'caretaker1',
    vitals: {
      heartRate: 92,
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 82,
      temperature: 37.2,
      spO2: 95
    },
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    remarks: []
  },
  {
    id: '3',
    name: 'Robert Davis',
    age: 58,
    condition: 'Heart Disease',
    caretakerId: 'caretaker2',
    vitals: {
      heartRate: 105,
      bloodPressureSystolic: 160,
      bloodPressureDiastolic: 95,
      temperature: 36.5,
      spO2: 93
    },
    lastUpdated: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    remarks: [
      {
        id: '2',
        doctorId: '2',
        doctorName: 'Dr. Sarah Wilson',
        content: 'Critical: Heart rate and BP elevated. Immediate attention required.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'urgent'
      }
    ]
  }
];

const generateMockCaretakers = () => [
  {
    id: 'caretaker1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    shift: 'Day',
    patients: ['1', '2']
  },
  {
    id: 'caretaker2',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+1 (555) 987-6543',
    shift: 'Night',
    patients: ['3']
  }
];

const generateMockAlerts = () => [
  {
    id: '1',
    patientId: '3',
    type: 'critical',
    message: 'Heart rate dangerously high: 105 bpm',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    vital: 'heartRate',
    value: 105,
    resolved: false
  },
  {
    id: '2',
    patientId: '1',
    type: 'warning',
    message: 'Blood pressure elevated: 140/90 mmHg',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    vital: 'bloodPressureSystolic',
    value: 140,
    resolved: true,
    resolvedBy: 'Dr. Sarah Wilson',
    resolvedAt: new Date(Date.now() - 90 * 60 * 1000),
    actionTaken: 'Administered medication and scheduled follow-up monitoring'
  },
  {
    id: '3',
    patientId: '2',
    type: 'warning',
    message: 'Temperature slightly elevated: 37.2°C',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    vital: 'temperature',
    value: 37.2,
    resolved: false
  }
];

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState(generateMockPatients());
  const [caretakers, setCaretakers] = useState(generateMockCaretakers());
  const [alerts, setAlerts] = useState(generateMockAlerts());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => ({
          ...patient,
          vitals: {
            ...patient.vitals,
            heartRate: Math.max(60, Math.min(120, patient.vitals.heartRate + (Math.random() - 0.5) * 10)),
            bloodPressureSystolic: Math.max(90, Math.min(180, patient.vitals.bloodPressureSystolic + (Math.random() - 0.5) * 15)),
            bloodPressureDiastolic: Math.max(60, Math.min(110, patient.vitals.bloodPressureDiastolic + (Math.random() - 0.5) * 10)),
            temperature: Math.max(35.5, Math.min(39.0, patient.vitals.temperature + (Math.random() - 0.5) * 0.5)),
            spO2: Math.max(85, Math.min(100, patient.vitals.spO2 + (Math.random() - 0.5) * 3))
          },
          lastUpdated: new Date()
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getPatientById = (id) => patients.find(patient => patient.id === id);
  const getCaretakerById = (id) => caretakers.find(caretaker => caretaker.id === id);
  const getPatientsByCaretaker = (caretakerId) => patients.filter(patient => patient.caretakerId === caretakerId);
  const getUnresolvedAlerts = () => alerts.filter(alert => !alert.resolved);

  const addRemark = (patientId, remark) => {
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === patientId
          ? { ...patient, remarks: [...patient.remarks, remark] }
          : patient
      )
    );
  };

  const resolveAlert = (alertId, resolvedBy, actionTaken) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              resolved: true,
              resolvedBy,
              resolvedAt: new Date(),
              actionTaken
            }
          : alert
      )
    );
  };

  const value = {
    patients,
    caretakers,
    alerts,
    getPatientById,
    getCaretakerById,
    getPatientsByCaretaker,
    getUnresolvedAlerts,
    addRemark,
    resolveAlert
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
