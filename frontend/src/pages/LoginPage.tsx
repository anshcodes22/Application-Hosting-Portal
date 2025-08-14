import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

// Mock role data - replace with actual API integration later
const MOCK_USERS = {
  'developer@bhel.com': { role: 'developer', name: 'John Developer' },
  'reviewer@bhel.com': { role: 'reviewer', name: 'Jane Reviewer' },
  'hod@bhel.com': { role: 'hod', name: 'Robert HOD' },
  'dtg@bhel.com': { role: 'dtg', name: 'Sarah DTG' },
  'cdt@bhel.com': { role: 'cdt', name: 'Mike CDT' },
  'hosting@bhel.com': { role: 'hosting', name: 'Alex Hosting' },
  'admin@bhel.com': { role: 'admin', name: 'Admin User' },
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = MOCK_USERS[formData.email as keyof typeof MOCK_USERS];
      
      if (user && formData.password === 'password123') {
        // Role-based redirect logic
        console.log(`Redirecting ${user.role} to their dashboard...`);
        
        // Role-based routing
        switch (user.role) {
          case 'developer': 
            navigate('/developer'); 
            break;
          case 'reviewer': 
            navigate('/reviewer');
            break;
          case 'hod': 
            navigate('/hod'); 
            break;
          case 'dtg': 
            navigate('/dtg'); 
            break;
          case 'cdt': 
            navigate('/cdt'); 
            break;
          case 'hosting': 
            navigate('/hosting'); 
            break;
          case 'admin': 
            navigate('/admin'); 
            break;
          default:
            alert(`Welcome ${user.name}! Dashboard for ${user.role} coming soon...`);
        }
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BHEL</h1>
              <p className="text-sm text-gray-600">Application Hosting Workflow Portal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                required
                icon={Mail}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
                icon={Lock}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            {/* <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Demo Credentials (password: password123)</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-600">
                  <div>developer@bhel.com</div>
                  <div>reviewer@bhel.com</div>
                  <div>hod@bhel.com</div>
                  <div>admin@bhel.com</div>
                </div>
                <div className="text-gray-600">
                  <div>dtg@bhel.com</div>
                  <div>cdt@bhel.com</div>
                  <div>hosting@bhel.com</div>
                </div>
              </div>
            </div> */}
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 BHEL - Internal Use Only
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};