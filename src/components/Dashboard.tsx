import React, { useState, useEffect } from 'react';
import { User, LogOut, Shield, Clock, Mail } from 'lucide-react';

interface DashboardProps {
  onSignOut?: () => void;
}

interface UserData {
  id?: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
  avatar?: string;
}

// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard: React.FC<DashboardProps> = ({ onSignOut }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('No authentication token found. Please sign in again.');
          setIsLoading(false);
          return;
        }

        // Try to get cached user data first (for immediate display)
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            console.log('Loaded cached user data:', parsedUserData);
          } catch (parseError) {
            console.warn('Failed to parse stored user data:', parseError);
            localStorage.removeItem('userData'); // Clean up corrupted data
          }
        }

        // Verify token with backend and get fresh user data
        console.log('Verifying token with backend...');
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Token verification response status:', response.status);

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUserData(null);
            throw new Error('Your session has expired. Please sign in again.');
          }
          throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Token verification successful:', data);
        
        if (data.user) {
          setUserData(data.user);
          // Update localStorage with fresh user data
          localStorage.setItem('userData', JSON.stringify(data.user));
          console.log('Updated user data in localStorage');
        } else if (data.valid && userData) {
          // Token is valid but no user data returned, keep existing cached data
          console.log('Token valid, using cached user data');
        } else {
          throw new Error('Invalid response format from server');
        }
        
      } catch (error) {
        console.error('Auth verification failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        setError(errorMessage);
        
        // Only clear tokens if it's an auth error, not a network error
        if (error instanceof Error && 
            (error.message.includes('session') || 
             error.message.includes('token') || 
             error.message.includes('401') || 
             error.message.includes('403'))) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setUserData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []); // Empty dependency array - only run on mount

  const handleSignOut = () => {
    console.log('Signing out user...');
    
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Reset component state
    setUserData(null);
    setError('');
    
    // Call parent callback if provided
    if (onSignOut) {
      onSignOut();
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Error state (unauthorized) - only show if there's an error AND no user data
  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={() => {
              // Clear any remaining auth data
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              
              // Call sign out callback to redirect to login
              if (onSignOut) {
                onSignOut();
              } else {
                // Fallback: reload the page which should show login
                window.location.reload();
              }
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard content - show if we have user data (even if there was an error refreshing)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {userData?.fullName || userData?.firstName || 'User'}!
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error banner if there was an issue refreshing data */}
      {error && userData && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <p className="text-sm text-yellow-800">
            Warning: {error} (showing cached data)
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {userData?.fullName || userData?.firstName || 'User'}!
              </h2>
              <p className="text-gray-600 mt-1">
                You have successfully accessed your protected dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Email Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData?.email || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Role Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData?.role || 'User'}
                </p>
              </div>
            </div>
          </div>

          {/* Join Date Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(userData?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">User ID</label>
              <p className="mt-1 text-sm text-gray-900">{userData?.id || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">
                {userData?.fullName || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-sm text-gray-900">{userData?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Last Login</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(userData?.lastLogin)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-900">Update Profile</h4>
              <p className="text-sm text-gray-600 mt-1">Manage your account settings</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-900">Security Settings</h4>
              <p className="text-sm text-gray-600 mt-1">Change password and security options</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <h4 className="font-medium text-gray-900">Help & Support</h4>
              <p className="text-sm text-gray-600 mt-1">Get help with your account</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;