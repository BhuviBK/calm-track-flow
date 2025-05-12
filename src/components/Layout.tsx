
import React from 'react';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-green-50 dark:from-gray-900 dark:to-forest-900">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Desktop Navigation */}
        <div className="hidden md:block md:w-72 flex-shrink-0 mb-8 md:mb-0 md:mr-8">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-forest-500 to-green-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-2xl font-bold ml-2 text-gray-800 dark:text-white">Everyday Task</h1>
          </div>
          <Navigation />
        </div>
        
        {/* Mobile Navigation - Hamburger Menu */}
        {isMobile && (
          <div className="md:hidden fixed top-4 left-4 z-30">
            <Sheet>
              <SheetTrigger className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
                <Menu className="h-6 w-6 text-forest-600 dark:text-forest-400" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <div className="flex items-center justify-start p-4 border-b">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-forest-500 to-green-400 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">Everyday Task</h1>
                </div>
                <div className="p-4">
                  <Navigation />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
        
        <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden overflow-y-auto px-2 md:px-6">
          <div className={cn("max-w-full", isMobile ? "pb-24" : "md:pr-4")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
