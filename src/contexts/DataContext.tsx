import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Vitals {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  spO2: number;
  temperature: number;
  timestamp: Date;
}

export interface Alert {
  id: string;
  patientId: string;
  type: 'critical' | 'warning';
  message: string;
  timestamp: Date;
  vital: string;
  value: number;
  resolved: boolean;
  actionTaken?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  assignedCaretakers: string[];
  vitals: Vitals;
  remarks: string;
  doctorId: string;
  emergencyContact: string;
  vitalHistory: Vitals[];
}

export interface Doctor {
  id: string;
  name: string;
  phone: string;
  specialization: string;
}

export interface Caretaker {
  id: string;
  name: string;
  phone: string;
}

interface DataContextType {
  patients: Patient[];
  alerts: Alert[];
  doctors: Doctor[];
  caretakers: Caretaker[];
  addRemark: (patientId: string, remark: string) => void;
  getPatientsByCaretaker: (caretakerId: string) => Patient[];
  resolveAlert: (alertId: string, actionTaken: string, resolvedBy: string) => void;
  getUnresolvedAlerts: () => Alert[];
  getResolvedAlerts: () => Alert[];
  getPatientById: (patientId: string) => Patient | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Wilson', phone: '+1-555-0101', specialization: 'Cardiology' },
  { id: '2', name: 'Dr. Michael Chen', phone: '+1-555-0102', specialization: 'Internal Medicine' },
  { id: '3', name: 'Dr. Emily Rodriguez', phone: '+1-555-0103', specialization: 'Pulmonology' },
];

const initialCaretakers: Caretaker[] = [
  { id: '3', name: 'Alice Johnson', phone: '+1-555-0201' },
  { id: '4', name: 'Bob Wilson', phone: '+1-555-0202' },
];

const generateVitalHistory = (): Vitals[] => {
  const history: Vitals[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Every hour for last 24 hours
    history.push({
      heartRate: 70 + Math.random() * 30,
      bloodPressureSystolic: 110 + Math.random() * 30,
      bloodPressureDiastolic: 70 + Math.random() * 20,
      spO2: 95 + Math.random() * 5,
      temperature: 36.2 + Math.random() * 1.5,
      timestamp
    });
  }
  
  return history;
};

const initialPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 65,
    condition: 'Hypertension',
    assignedCaretakers: ['3'],
    doctorId: '1',
    emergencyContact: '+1-555-0301',
    vitals: {
      heartRate: 75,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      spO2: 98,
      temperature: 36.5,
      timestamp: new Date()
    },
    remarks: '',
    vitalHistory: generateVitalHistory()
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 72,
    condition: 'Diabetes',
    assignedCaretakers: ['3', '4'],
    doctorId: '2',
    emergencyContact: '+1-555-0302',
    vitals: {
      heartRate: 68,
      bloodPressureSystolic: 110,
      bloodPressureDiastolic: 70,
      spO2: 97,
      temperature: 37.1,
      timestamp: new Date()
    },
    remarks: '',
    vitalHistory: generateVitalHistory()
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 58,
    condition: 'Heart Disease',
    assignedCaretakers: ['4'],
    doctorId: '1',
    emergencyContact: '+1-555-0303',
    vitals: {
      heartRate: 85,
      bloodPressureSystolic: 140,
      bloodPressureDiastolic: 90,
      spO2: 95,
      temperature: 36.8,
      timestamp: new Date()
    },
    remarks: '',
    vitalHistory: generateVitalHistory()
  },
  {
    id: '4',
    name: 'Mary Williams',
    age: 69,
    condition: 'COPD',
    assignedCaretakers: ['3'],
    doctorId: '3',
    emergencyContact: '+1-555-0304',
    vitals: {
      heartRate: 78,
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 85,
      spO2: 92,
      temperature: 36.9,
      timestamp: new Date()
    },
    remarks: '',
    vitalHistory: generateVitalHistory()
  }
];

// Create some sample resolved alerts for demonstration
const createSampleResolvedAlerts = (): Alert[] => {
  const now = new Date();
  return [
    {
      id: 'resolved-1',
      patientId: '1',
      type: 'critical',
      message: 'Blood pressure critically high: 180/110',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      vital: 'bloodPressureSystolic',
      value: 180,
      resolved: true,
      actionTaken: 'Administered antihypertensive medication. Patient monitored closely for 30 minutes. Blood pressure stabilized to 140/85.',
      resolvedBy: 'Dr. Sarah Wilson',
      resolvedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000)
    },
    {
      id: 'resolved-2',
      patientId: '2',
      type: 'warning',
      message: 'Heart rate elevated: 105 bpm',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      vital: 'heartRate',
      value: 105,
      resolved: true,
      actionTaken: 'Patient was encouraged to rest and provided with relaxation techniques. Heart rate returned to normal range after 20 minutes.',
      resolvedBy: 'Alice Johnson',
      resolvedAt: new Date(now.getTime() - 3.5 * 60 * 60 * 1000)
    },
    {
      id: 'resolved-3',
      patientId: '4',
      type: 'critical',
      message: 'Oxygen saturation too low: 88%',
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      vital: 'spO2',
      value: 88,
      resolved: true,
      actionTaken: 'Oxygen therapy initiated immediately. Nebulizer treatment administered. Patient responded well, SpO2 improved to 95%.',
      resolvedBy: 'Dr. Emily Rodriguez',
      resolvedAt: new Date(now.getTime() - 5.5 * 60 * 60 * 1000)
    }
  ];
};

const thresholds = {
  heartRate: { min: 60, max: 100 },
  bloodPressureSystolic: { min: 90, max: 140 },
  bloodPressureDiastolic: { min: 60, max: 90 },
  spO2: { min: 95, max: 100 },
  temperature: { min: 36.1, max: 37.2 }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [alerts, setAlerts] = useState<Alert[]>(createSampleResolvedAlerts());

  const generateRandomVitals = (baseVitals: Vitals): Vitals => {
    const variance = 0.1;
    
    return {
      heartRate: Math.max(50, Math.min(150, baseVitals.heartRate + (Math.random() - 0.5) * baseVitals.heartRate * variance)),
      bloodPressureSystolic: Math.max(80, Math.min(200, baseVitals.bloodPressureSystolic + (Math.random() - 0.5) * baseVitals.bloodPressureSystolic * variance)),
      bloodPressureDiastolic: Math.max(50, Math.min(120, baseVitals.bloodPressureDiastolic + (Math.random() - 0.5) * baseVitals.bloodPressureDiastolic * variance)),
      spO2: Math.max(85, Math.min(100, baseVitals.spO2 + (Math.random() - 0.5) * baseVitals.spO2 * variance)),
      temperature: Math.max(35, Math.min(40, baseVitals.temperature + (Math.random() - 0.5) * baseVitals.temperature * variance)),
      timestamp: new Date()
    };
  };

  const checkForAlerts = (patient: Patient, newVitals: Vitals) => {
    const newAlerts: Alert[] = [];

    Object.entries(thresholds).forEach(([vital, threshold]) => {
      const value = newVitals[vital as keyof Vitals] as number;
      
      if (value < threshold.min || value > threshold.max) {
        const alertType = value < threshold.min * 0.8 || value > threshold.max * 1.2 ? 'critical' : 'warning';
        const message = value < threshold.min 
          ? `${vital} too low: ${value.toFixed(1)}`
          : `${vital} too high: ${value.toFixed(1)}`;

        newAlerts.push({
          id: `${patient.id}-${vital}-${Date.now()}`,
          patientId: patient.id,
          type: alertType,
          message,
          timestamp: new Date(),
          vital,
          value,
          resolved: false
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 200));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => {
          const newVitals = generateRandomVitals(patient.vitals);
          checkForAlerts(patient, newVitals);
          
          return {
            ...patient,
            vitals: newVitals,
            vitalHistory: [...patient.vitalHistory.slice(-23), newVitals]
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addRemark = (patientId: string, remark: string) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, remarks: remark }
          : patient
      )
    );
  };

  const getPatientsByCaretaker = (caretakerId: string): Patient[] => {
    return patients.filter(patient => 
      patient.assignedCaretakers.includes(caretakerId)
    );
  };

  const resolveAlert = (alertId: string, actionTaken: string, resolvedBy: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              resolved: true, 
              actionTaken, 
              resolvedBy, 
              resolvedAt: new Date() 
            }
          : alert
      )
    );
  };

  const getUnresolvedAlerts = (): Alert[] => {
    return alerts.filter(alert => !alert.resolved);
  };

  const getResolvedAlerts = (): Alert[] => {
    return alerts.filter(alert => alert.resolved);
  };

  const getPatientById = (patientId: string): Patient | undefined => {
    return patients.find(patient => patient.id === patientId);
  };

  return (
    <DataContext.Provider value={{ 
      patients, 
      alerts, 
      doctors: initialDoctors,
      caretakers: initialCaretakers,
      addRemark, 
      getPatientsByCaretaker,
      resolveAlert,
      getUnresolvedAlerts,
      getResolvedAlerts,
      getPatientById
    }}>
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
