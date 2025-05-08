
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-green-50 dark:from-gray-900 dark:to-forest-900">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        <div className="md:w-72 flex-shrink-0 mb-8 md:mb-0 md:mr-8">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-forest-500 to-green-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-2xl font-bold ml-2 text-gray-800 dark:text-white">Everyday Task</h1>
          </div>
          <Navigation />
        </div>
        <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden px-2 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
