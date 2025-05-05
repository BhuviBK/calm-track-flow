
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { path: '/meditate', icon: <Clock className="w-5 h-5" />, label: 'Meditate' },
    { path: '/track', icon: <Activity className="w-5 h-5" />, label: 'Mood' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg py-2 md:relative md:shadow-none md:py-0 md:mt-8 z-10">
      <div className="flex justify-around md:flex-col md:gap-4 md:items-start">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              location.pathname === item.path
                ? "bg-calm-100 text-calm-700 dark:bg-calm-900 dark:text-calm-300"
                : "text-gray-600 hover:text-calm-600 dark:text-gray-300 dark:hover:text-calm-400"
            )}
          >
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
