import React, { useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import MainNavbar from "./components/MainNavbar";
import SideNavigation from "./components/SideNavigation";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import AgentBuilderPage from "./pages/AgentBuilderPage";
import AuthPage from "./pages/AuthPage";
import FlowBuilderPage from "./pages/FlowBuilderPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import SendCallPage from "./pages/SendCallPage";

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};


const ProtectedLayout: React.FC = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/flow-builder":
        return "Developer Recruitment Flow";
      case "/knowledge-bases":
        return "Knowledge Bases";
      case "/agent-builder":
        return "Agent Builder";
      case "/send-call":
        return "Send Call";
      default:
        return "EZPZ Platform";
    }
  };

  return (
    <div className="flex w-screen h-screen">
      <SideNavigation
        isOpen={isSideNavOpen}
        onToggle={() => setIsSideNavOpen(!isSideNavOpen)}
        currentPath={location.pathname}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSideNavOpen ? "ml-40" : "ml-12"
        }`}
      >
        <MainNavbar
          isSideNavOpen={isSideNavOpen}
          toggleSideNav={() => setIsSideNavOpen(!isSideNavOpen)}
          pageTitle={getPageTitle()}
        />

        <div className="relative flex-1 bg-gray-50">
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
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
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
