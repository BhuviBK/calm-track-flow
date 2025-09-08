
import React from 'react';
import Navigation from './Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-green-50 dark:from-gray-900 dark:to-forest-900 transition-all duration-700">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Desktop Navigation */}
        <div className="hidden md:block md:w-72 flex-shrink-0 mb-8 md:mb-0 md:mr-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6 transition-all duration-500 hover:translate-x-2">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-forest-500 to-green-400 flex items-center justify-center animate-pulse-gentle">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h1 className="text-2xl font-bold ml-2 text-gray-800 dark:text-white transition-colors duration-300">Everyday Task</h1>
            </div>
          </div>
          
          {/* User info */}
          <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          
          <Navigation />
        </div>
        
        {/* Mobile Header with Navigation Menu */}
        {isMobile && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3">
              <Sheet>
                <SheetTrigger className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Menu className="h-6 w-6 text-forest-600 dark:text-forest-400" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] p-0">
                  <div className="flex items-center justify-start p-4 border-b">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-forest-500 to-green-400 flex items-center justify-center animate-pulse-gentle">
                      <span className="text-white font-bold text-sm">E</span>
                    </div>
                    <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">Everyday Task</h1>
                  </div>
                  <div className="p-4">
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Navigation />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-forest-500 to-green-400 flex items-center justify-center animate-pulse-gentle">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <h1 className="text-lg font-bold ml-2 text-gray-800 dark:text-white">Everyday Task</h1>
              </div>
            </div>
          </div>
        )}
        
        <main className={cn("flex-1 pb-20 md:pb-0 overflow-x-hidden overflow-y-auto px-2 md:px-6", isMobile ? "pt-16" : "")}>
          <div className={cn("max-w-full animate-fade-in", isMobile ? "pb-24" : "md:pr-4")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
