import React, { useState } from 'react';
import AuthLayout from './components/AuthLayout';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function App() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <AuthLayout>
      {isSignUp ? (
        <SignUp onToggleMode={toggleMode} />
      ) : (
        <SignIn onToggleMode={toggleMode} />
      )}
    </AuthLayout>
  );
}

export default App;