
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, Activity, Check, Dumbbell, DollarSign, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppContext } from '@/contexts/AppContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { currentUser } = useAppContext();
  
  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    // Task Management Group
    { path: '/todo', icon: <Check className="w-5 h-5" />, label: 'Todo List', group: 'tasks' },
    { path: '/calendar', icon: <Calendar className="w-5 h-5" />, label: 'Calendar', group: 'tasks' },
    { path: '/expense', icon: <DollarSign className="w-5 h-5" />, label: 'Expenses', group: 'tasks' },
    // Wellbeing Group
    { path: '/meditate', icon: <Clock className="w-5 h-5" />, label: 'Meditate', group: 'wellbeing' },
    { path: '/exercise', icon: <Dumbbell className="w-5 h-5" />, label: 'Exercise', group: 'wellbeing' },
    { path: '/track', icon: <Activity className="w-5 h-5" />, label: 'Mood', group: 'wellbeing' },
  ];
  
  const accountItems = currentUser 
    ? [{ path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile', group: 'account' }]
    : [
        { path: '/login', icon: <LogIn className="w-5 h-5" />, label: 'Login', group: 'account' },
        { path: '/signup', icon: <User className="w-5 h-5" />, label: 'Signup', group: 'account' }
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
        "flex items-center rounded-lg transition-colors",
        isMobile ? "px-3 py-2 w-full mb-1" : "px-3 py-2 w-full",
        location.pathname === item.path
          ? "bg-forest-500 text-white dark:bg-forest-700 dark:text-white"
          : "text-gray-600 hover:text-forest-700 dark:text-gray-300 dark:hover:text-forest-300"
      )}
    >
      <div className="flex items-center">
        {item.icon}
        <span className="ml-2">{item.label}</span>
      </div>
    </Link>
  );
  
  // Common navigation groups that work both for mobile sidebar and desktop
  const renderNavGroup = (title: string, items: typeof navItems) => (
    <div className="w-full mb-4">
      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </div>
      <div className="flex flex-col gap-1 w-full mt-1">
        {items.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <nav className={cn("z-10", isMobile ? "" : "md:relative md:shadow-none md:py-0 md:mt-8")}>
      {/* Navigation Items */}
      <div className="flex flex-col">
        {/* Home Items */}
        {otherItems.length > 0 && renderNavGroup("Home", otherItems)}
        
        {/* Task Management Group */}
        {taskItems.length > 0 && renderNavGroup("Tasks", taskItems)}
        
        {/* Wellbeing Group */}
        {wellbeingItems.length > 0 && renderNavGroup("Wellbeing", wellbeingItems)}
        
        {/* Account Group */}
        {renderNavGroup("Account", accountItems)}
      </div>
    </nav>
  );
};

export default Navigation;
