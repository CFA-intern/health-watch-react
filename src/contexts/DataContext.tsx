
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
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  assignedCaretakers: string[];
  vitals: Vitals;
  remarks: string;
}

interface DataContextType {
  patients: Patient[];
  alerts: Alert[];
  addRemark: (patientId: string, remark: string) => void;
  getPatientsByCaretaker: (caretakerId: string) => Patient[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 65,
    condition: 'Hypertension',
    assignedCaretakers: ['3'],
    vitals: {
      heartRate: 75,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      spO2: 98,
      temperature: 36.5,
      timestamp: new Date()
    },
    remarks: ''
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 72,
    condition: 'Diabetes',
    assignedCaretakers: ['3', '4'],
    vitals: {
      heartRate: 68,
      bloodPressureSystolic: 110,
      bloodPressureDiastolic: 70,
      spO2: 97,
      temperature: 37.1,
      timestamp: new Date()
    },
    remarks: ''
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 58,
    condition: 'Heart Disease',
    assignedCaretakers: ['4'],
    vitals: {
      heartRate: 85,
      bloodPressureSystolic: 140,
      bloodPressureDiastolic: 90,
      spO2: 95,
      temperature: 36.8,
      timestamp: new Date()
    },
    remarks: ''
  },
  {
    id: '4',
    name: 'Mary Williams',
    age: 69,
    condition: 'COPD',
    assignedCaretakers: ['3'],
    vitals: {
      heartRate: 78,
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 85,
      spO2: 92,
      temperature: 36.9,
      timestamp: new Date()
    },
    remarks: ''
  }
];

const thresholds = {
  heartRate: { min: 60, max: 100 },
  bloodPressureSystolic: { min: 90, max: 140 },
  bloodPressureDiastolic: { min: 60, max: 90 },
  spO2: { min: 95, max: 100 },
  temperature: { min: 36.1, max: 37.2 }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const generateRandomVitals = (baseVitals: Vitals): Vitals => {
    const variance = 0.1; // 10% variance
    
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
          value
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 100)); // Keep only last 100 alerts
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
            vitals: newVitals
          };
        })
      );
    }, 5000); // Update every 5 seconds

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

  return (
    <DataContext.Provider value={{ 
      patients, 
      alerts, 
      addRemark, 
      getPatientsByCaretaker 
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
