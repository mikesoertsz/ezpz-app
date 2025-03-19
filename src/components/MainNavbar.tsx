import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle,
  Share2
} from 'lucide-react';
import { Button } from './ui/button';

interface MainNavbarProps {
  isSideNavOpen: boolean;
  toggleSideNav: () => void;
  pageTitle: string;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ isSideNavOpen, toggleSideNav, pageTitle }) => {
  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-3 z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 h-9 w-9 text-gray-500"
          onClick={toggleSideNav}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center">
          <h1 className="text-lg font-semibold mr-2">{pageTitle}</h1>
          <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-7">
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="relative mr-3">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1.5 text-sm border rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-gray-500 mr-1">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MainNavbar;