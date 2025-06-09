import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col bg-white px-4 sm:px-6 lg:px-8 py-8">
        {/* Logo - Top Left */}
        <div className="flex items-center space-x-2 mb-8">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-semibold text-gray-900">Revolutie</span>
        </div>
        
        {/* Centered Form Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-8">
            {children}
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="flex-1 relative overflow-hidden bg-gray-100 min-h-[300px] lg:min-h-screen">
        <img 
          src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Modern abstract design" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-blue-600/20"></div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-white max-w-md">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 drop-shadow-lg">Welcome to Revolutie</h3>
            <p className="text-base lg:text-lg opacity-90 drop-shadow-md">Experience the future of digital innovation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;