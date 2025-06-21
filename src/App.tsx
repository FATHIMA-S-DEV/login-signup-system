import React, { useState, useEffect } from 'react';
import AuthLayout from './components/AuthLayout';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

// Lazy load Dashboard to avoid conflicts
const Dashboard = React.lazy(() => import('./components/Dashboard'));

function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkExistingAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        // User has existing valid session
        setShowDashboard(true);
      }
      
      setIsCheckingAuth(false);
    };

    checkExistingAuth();
  }, []);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignInSuccess = () => {
    setShowDashboard(true);
    
    // Optional: Update URL without page refresh
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '/dashboard');
    }
  };

  const handleSignOut = () => {
    setShowDashboard(false);
    
    // Optional: Update URL back to login
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', '/');
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showDashboard) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Dashboard...</p>
          </div>
        </div>
      }>
        <Dashboard onSignOut={handleSignOut} />
      </React.Suspense>
    );
  }

  return (
    <AuthLayout>
      {isSignUp ? (
        <SignUp onToggleMode={toggleMode} />
      ) : (
        <SignIn 
          onToggleMode={toggleMode} 
          onSignInSuccess={handleSignInSuccess}
        />
      )}
    </AuthLayout>
  );
}

export default App;