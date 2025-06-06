
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Shield, Stethoscope, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Activity className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Patient Health Monitoring System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Advanced real-time health monitoring and alerting system for healthcare professionals
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            Access Dashboard
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Admin Dashboard</h3>
            <p className="text-gray-600">
              Complete oversight of all patients, caretakers, and system alerts
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Doctor Dashboard</h3>
            <p className="text-gray-600">
              Patient monitoring with the ability to add medical remarks
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Caretaker Dashboard</h3>
            <p className="text-gray-600">
              Monitor assigned patients with real-time vital signs
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Demo Credentials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Admin Access</h4>
              <p className="text-sm text-gray-600">Username: admin</p>
              <p className="text-sm text-gray-600">Password: admin</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Doctor Access</h4>
              <p className="text-sm text-gray-600">Username: doctor</p>
              <p className="text-sm text-gray-600">Password: doctor</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Caretaker Access</h4>
              <p className="text-sm text-gray-600">Username: caretaker1</p>
              <p className="text-sm text-gray-600">Password: caretaker1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
