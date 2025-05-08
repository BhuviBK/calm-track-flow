
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, Activity, Check, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    // Task Management Group
    { path: '/todo', icon: <Check className="w-5 h-5" />, label: 'Todo List', group: 'tasks' },
    { path: '/calendar', icon: <Calendar className="w-5 h-5" />, label: 'Calendar', group: 'tasks' },
    // Wellbeing Group
    { path: '/meditate', icon: <Clock className="w-5 h-5" />, label: 'Meditate', group: 'wellbeing' },
    { path: '/exercise', icon: <Dumbbell className="w-5 h-5" />, label: 'Exercise', group: 'wellbeing' },
    { path: '/track', icon: <Activity className="w-5 h-5" />, label: 'Mood', group: 'wellbeing' },
  ];
  
  // Group the items by their category
  const taskItems = navItems.filter(item => item.group === 'tasks');
  const wellbeingItems = navItems.filter(item => item.group === 'wellbeing');
  const otherItems = navItems.filter(item => !item.group);

  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <Link
      key={item.path}
      to={item.path}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full",
        location.pathname === item.path
          ? "bg-forest-500 text-white dark:bg-forest-700 dark:text-white"
          : "text-gray-600 hover:text-forest-700 dark:text-gray-300 dark:hover:text-forest-300"
      )}
    >
      {item.icon}
      <span className="hidden md:inline">{item.label}</span>
    </Link>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg py-2 md:relative md:shadow-none md:py-0 md:mt-8 z-10">
      <div className="flex justify-around md:flex-col md:gap-6 md:items-start">
        {/* Other Items */}
        {otherItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
        
        {/* Task Management Group */}
        {taskItems.length > 0 && (
          <div className="hidden md:block w-full">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tasks
            </div>
            <div className="flex flex-col gap-1 w-full">
              {taskItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        )}
        
        {/* On mobile, show task items directly */}
        <div className="md:hidden flex gap-1">
          {taskItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
        
        {/* Wellbeing Group */}
        {wellbeingItems.length > 0 && (
          <div className="hidden md:block w-full">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Wellbeing
            </div>
            <div className="flex flex-col gap-1 w-full">
              {wellbeingItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        )}
        
        {/* On mobile, show wellbeing items directly */}
        <div className="md:hidden flex gap-1">
          {wellbeingItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
