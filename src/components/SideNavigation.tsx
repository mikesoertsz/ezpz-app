import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutTemplate, 
  Database, 
  Bot, 
  Settings,
  User,
  LogOut,
  ChevronDown,
  PhoneOutgoing,
  Folders
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SideNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
}

export default function SideNavigation({ isOpen, onToggle, currentPath }: SideNavigationProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: currentPath === '/' },
    { icon: Folders, label: 'Projects', path: '/projects', active: currentPath === '/projects' },
    { icon: LayoutTemplate, label: 'Flow Builder', path: '/flow-builder', active: currentPath === '/flow-builder' },
    { icon: Database, label: 'Knowledge Bases', path: '/knowledge-bases', active: currentPath === '/knowledge-bases' },
    { icon: Bot, label: 'Agent Builder', path: '/agent-builder', active: currentPath === '/agent-builder' },
    { icon: PhoneOutgoing, label: 'Send Call', path: '/send-call', active: currentPath === '/send-call' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 text-gray-800 transition-all duration-300 flex flex-col ${
        isOpen ? 'w-40' : 'w-12'
      }`}
    >
      <div className="flex items-center justify-between p-2 border-b border-gray-200">
        <div className="flex items-center">
          {isOpen ? (
            <>
              <div className="h-6 w-6 bg-blue-500 rounded-md flex items-center justify-center mr-2">
                <LayoutTemplate className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm">EZPZ</span>
            </>
          ) : (
            <div className="h-6 w-6 bg-blue-500 rounded-md flex items-center justify-center mx-auto">
              <LayoutTemplate className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav>
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path}
                  className={`flex items-center py-1.5 px-2 text-xs ${
                    item.active 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${!isOpen ? 'justify-center' : ''}`}
                >
                  <item.icon className={`h-4 w-4 ${isOpen ? 'mr-2' : ''}`} />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-2 border-t border-gray-200 relative">
        <button 
          className={`flex items-center ${isOpen ? 'w-full' : 'justify-center'}`}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          {user ? (
            <div className="h-7 w-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center overflow-hidden border border-blue-200">
              <span className="text-xs font-medium">{getInitials(user.email || '')}</span>
            </div>
          ) : (
            <div className="h-7 w-7 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          )}
          
          {isOpen && user && (
            <>
              <div className="ml-2 flex-1 min-w-0 text-left">
                <p className="text-xs font-medium truncate">{user.email}</p>
                <p className="text-xs text-gray-500 truncate">Settings</p>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </>
          )}
        </button>
        
        {showUserMenu && (
          <div className={`absolute bottom-full left-0 mb-1 bg-white border rounded-md shadow-md w-full p-2 ${isOpen ? 'w-full' : 'left-12 w-48'}`}>
            <div className="space-y-1">
              <button className="flex items-center w-full text-xs p-2 text-left hover:bg-gray-100 rounded">
                <User className="h-3 w-3 mr-2 text-gray-500" />
                Profile
              </button>
              <button className="flex items-center w-full text-xs p-2 text-left hover:bg-gray-100 rounded">
                <Settings className="h-3 w-3 mr-2 text-gray-500" />
                Settings
              </button>
              <div className="border-t my-1"></div>
              <button 
                className="flex items-center w-full text-xs p-2 text-left hover:bg-gray-100 rounded text-red-500"
                onClick={handleSignOut}
              >
                <LogOut className="h-3 w-3 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}