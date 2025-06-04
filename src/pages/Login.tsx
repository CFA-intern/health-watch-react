
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(username, password);
      
      // Check if login was successful by checking if user exists after login
      setTimeout(() => {
        if (user) {
          toast({
            title: "Login Successful",
            description: "Welcome to the Patient Monitoring System",
          });
          
          // Navigate based on role
          if (user.role === 'admin') navigate('/admin');
          else if (user.role === 'doctor') navigate('/doctor');
          else if (user.role === 'caretaker') navigate('/caretaker');
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid username or password",
            variant: "destructive"
          });
        }
        
        setIsLoading(false);
      }, 100);
    }, 1000);
  };

  const quickLogin = (user: string) => {
    setUsername(user);
    setPassword(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Health Monitor Login
            </h1>
            <p className="text-gray-600 mt-2">
              Access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-sm text-gray-600 text-center mb-4">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('doctor')}
                className="px-3 py-2 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
              >
                Doctor
              </button>
              <button
                onClick={() => quickLogin('caretaker1')}
                className="px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
              >
                Caretaker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
