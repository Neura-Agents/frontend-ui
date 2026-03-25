import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider, useAlert } from './context/AlertContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import { TooltipProvider } from '@/components/ui/tooltip';
import LandingPage from './pages/LandingPage';
import Profile from './pages/ProfilePage';
import UIComponents from './pages/UIComponentsPage';
import './App.css';
import CreateEditAgentPage from './pages/CreateEditAgentPage';
import ApiKeysPage from './pages/ApiKeysPage';
import UsagePage from './pages/UsagePage';
import ThemeSettingsPage from './pages/ThemeSettingsPage';
import UsersPage from './pages/UsersPage';
import PricingPage from './pages/PricingPage';
import BillingPage from './pages/BillingPage';
import MCPPage from './pages/MCPPage';
import ToolsPage from './pages/ToolsPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import AgentsPage from './pages/AgentsPage';
import AgentChatPage from './pages/AgentChatPage';


const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { user, loading, hasRole } = useAuth();
  const { showAlert } = useAlert();
  const alertShown = React.useRef(false);

  useEffect(() => {
    if (!loading && user && role && !hasRole(role) && !alertShown.current) {
      alertShown.current = true;
      showAlert({
        title: "Access Denied",
        description: "You do not have permission to access this resource",
        variant: "destructive"
      });
    }
  }, [loading, user, role, hasRole, showAlert]);

  if (loading) return null;

  if (!user) return <Navigate to="/" state={{ from: window.location.pathname + window.location.search }} replace />;

  if (role && !hasRole(role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="neura-theme">
        <AlertProvider>
          <TooltipProvider delayDuration={400}>
            <AuthProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route
                    path="/design-system"
                    element={
                      <ProtectedRoute role="platform-admin">
                        <UIComponents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/agent-create"
                    element={
                      <ProtectedRoute role="platform-users">
                        <CreateEditAgentPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/agent-edit/:id"
                    element={
                      <ProtectedRoute role="platform-users">
                        <CreateEditAgentPage isEdit={true} />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/api-keys-management"
                    element={
                      <ProtectedRoute role="platform-users">
                        <ApiKeysPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/usage"
                    element={
                      <ProtectedRoute role="platform-users">
                        <UsagePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/theme-settings"
                    element={
                      <ProtectedRoute role="platform-admin">
                        <ThemeSettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute role="platform-admin">
                        <UsersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pricing"
                    element={
                      <ProtectedRoute role="platform-users">
                        <PricingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/billing"
                    element={
                      <ProtectedRoute role="platform-users">
                        <BillingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mcp"
                    element={
                      <ProtectedRoute role="platform-users">
                        <MCPPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tools"
                    element={
                      <ProtectedRoute role="platform-users">
                        <ToolsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/knowledge-base"
                    element={
                      <ProtectedRoute role="platform-users">
                        <KnowledgeBasePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/agents"
                    element={
                      <ProtectedRoute role="platform-users">
                        <AgentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/agent-chat/:slug"
                    element={
                      <ProtectedRoute role="platform-users">
                        <AgentChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/knowledge-graph"
                    element={
                      <ProtectedRoute role="platform-users">
                        <KnowledgeGraphPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </AuthProvider>
          </TooltipProvider>
        </AlertProvider>
      </ThemeProvider>
    </Router>

  );
}

export default App;
