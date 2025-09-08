
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, Activity, Check, Dumbbell, DollarSign, Timer, UtensilsCrossed, CalendarCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    // Task Management Group
    { path: '/todo', icon: <Check className="w-5 h-5" />, label: 'Todo List', group: 'tasks' },
    { path: '/calendar-todo', icon: <CalendarCheck className="w-5 h-5" />, label: 'Todo Calendar', group: 'tasks' },
    { path: '/expense', icon: <DollarSign className="w-5 h-5" />, label: 'Expenses', group: 'tasks' },
    { path: '/pomodoro', icon: <Timer className="w-5 h-5" />, label: 'Pomodoro', group: 'tasks' },
    { path: '/exercise-timer', icon: <Activity className="w-5 h-5" />, label: 'Exercise Timer', group: 'tasks' },
    // Wellbeing Group
    { path: '/meditate', icon: <Clock className="w-5 h-5" />, label: 'Meditate', group: 'wellbeing' },
    { path: '/exercise', icon: <Dumbbell className="w-5 h-5" />, label: 'Exercise', group: 'wellbeing' },
    { path: '/track', icon: <Activity className="w-5 h-5" />, label: 'Mood', group: 'wellbeing' },
    { path: '/food', icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Calories', group: 'wellbeing' },
    // Profile Group
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile', group: 'profile' },
  ];

  // Group the items by their category
  const taskItems = navItems.filter(item => item.group === 'tasks');
  const wellbeingItems = navItems.filter(item => item.group === 'wellbeing');
  const profileItems = navItems.filter(item => item.group === 'profile');
  const otherItems = navItems.filter(item => !item.group);

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <div
      key={item.path}
      className={cn(
        "flex items-center rounded-lg transition-all duration-300 transform cursor-pointer hover:scale-105",
        isMobile ? "px-3 py-2 w-full mb-1" : "px-3 py-2 w-full",
        location.pathname === item.path
          ? "bg-forest-500 text-white dark:bg-forest-700 dark:text-white translate-x-2"
          : "text-gray-600 hover:text-forest-700 dark:text-gray-300 dark:hover:text-forest-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleNavigation(item.path);
      }}
    >
      <div className="flex items-center">
        <span className={`transition-transform duration-300 ${location.pathname === item.path ? 'rotate-0 scale-110' : 'rotate-0'}`}>
          {item.icon}
        </span>
        <span className="ml-2 transition-all duration-300">{item.label}</span>
      </div>
    </div>
  );
  
  // Common navigation groups that work both for mobile sidebar and desktop
  const renderNavGroup = (title: string, items: typeof navItems) => (
    <div className="w-full mb-4 transform transition-all duration-500 animate-fade-in">
      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </div>
      <div className="flex flex-col gap-1 w-full mt-1">
        {items.map((item, index) => (
          <div key={item.path} className="transition-all duration-300" style={{ 
            animationDelay: `${index * 100}ms`,
            animation: 'fade-in 0.5s ease-out forwards'
          }}>
            <NavItem item={item} />
          </div>
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
        
        {/* Profile Group */}
        {profileItems.length > 0 && renderNavGroup("Account", profileItems)}
      </div>
    </nav>
  );
};

export default Navigation;
