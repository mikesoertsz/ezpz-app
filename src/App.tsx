import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import SideNavigation from './components/SideNavigation';
import MainNavbar from './components/MainNavbar';
import HomePage from './pages/HomePage';
import FlowBuilderPage from './pages/FlowBuilderPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import AgentBuilderPage from './pages/AgentBuilderPage';
import SendCallPage from './pages/SendCallPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Protected Layout wrapper
const ProtectedLayout: React.FC = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/flow-builder':
        return 'Developer Recruitment Flow';
      case '/knowledge-bases':
        return 'Knowledge Bases';
      case '/agent-builder':
        return 'Agent Builder';
      case '/send-call':
        return 'Send Call';
      default:
        return 'EZPZ Platform';
    }
  };

  return (
    <div className="w-screen h-screen flex">
      <SideNavigation 
        isOpen={isSideNavOpen} 
        onToggle={() => setIsSideNavOpen(!isSideNavOpen)} 
        currentPath={location.pathname}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSideNavOpen ? 'ml-40' : 'ml-12'}`}>
        <MainNavbar 
          isSideNavOpen={isSideNavOpen} 
          toggleSideNav={() => setIsSideNavOpen(!isSideNavOpen)} 
          pageTitle={getPageTitle()}
        />
        
        <div className="flex-1 relative bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/flow-builder" replace />} />
        <Route path="/flow-builder" element={<FlowBuilderPage />} />
        <Route path="/knowledge-bases" element={<KnowledgeBasePage />} />
        <Route path="/agent-builder" element={<AgentBuilderPage />} />
        <Route path="/send-call" element={<SendCallPage />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

export default App;