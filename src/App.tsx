import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import { AlertProvider, useAlert } from './context/AlertContext';
import { ThemeProvider } from './context/ThemeContext';
import UmamiAnalytics from './components/UmamiAnalytics';
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
import PlatformFeaturesPage from './pages/PlatformFeaturesPage';
import PlatformRolesPage from './pages/PlatformRolesPage';
import AboutUsPage from './pages/AboutUsPage';
import SystemPromptsPage from './pages/SystemPromptsPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import AgentInfoPage from './pages/AgentInfoPage';
import CapabilitiesPage from './pages/CapabilitiesPage';
import ContactPage from './pages/ContactPage';
import { TermsPage, PrivacyPage } from './pages/LegalPages';

const isDashboardHost = window.location.hostname.includes('dashboard') || window.location.port === '8005';
const APP_MODE = (import.meta.env.VITE_APP_MODE as 'public' | 'dashboard') || (isDashboardHost ? 'dashboard' : 'public');

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { user, loading, hasRole, login } = useAuth();
  const location = useLocation();
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

  useEffect(() => {
    if (!loading && !user) {
      login("", location.pathname + location.search);
    }
  }, [loading, user, login, location]);

  if (loading || !user) return null;

  if (role && !hasRole(role)) return <Navigate to="/" state={{ from: location.pathname + location.search }} replace />;

  return <>{children}</>;
};

function AppRoutes() {

  // Mode-based routing logic
  if (APP_MODE === 'public') {
    return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/a2a-agents" element={<AgentInfoPage type="a2a" />} />
          <Route path="/orchestrator-agents" element={<AgentInfoPage type="orchestrator" />} />
          <Route path="/capabilities" element={<CapabilitiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    );
  }

  // Dashboard / App Mode (Port 8000)
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* If unauthenticated on dashboard home, we land on landing page or redirect to login.
            The user said "everything remains the same", but on 8000 we don't have LandingPage really.
            Actually, if they land on 8000 and NOT logged in, we should probably redirect to 7999
            OR just let the ProtectedRoute trigger a login. */}
        <Route path="/" element={
          <ProtectedRoute role="platform-users">
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute role="platform-users">
            <Profile />
          </ProtectedRoute>
        } />
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
          path="/platform-features"
          element={
            <ProtectedRoute role="platform-admin">
              <PlatformFeaturesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-roles"
          element={
            <ProtectedRoute role="platform-admin">
              <PlatformRolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-prompts"
          element={
            <ProtectedRoute role="platform-admin">
              <SystemPromptsPage />
            </ProtectedRoute>
          }
        />
        {/* Pricing/About are still conceptually available but maybe shouldn't be the focus here.
            But for completeness, let's keep them if they are on 8000 too. */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/a2a-agents" element={<AgentInfoPage type="a2a" />} />
        <Route path="/orchestrator-agents" element={<AgentInfoPage type="orchestrator" />} />
        <Route path="/capabilities" element={<CapabilitiesPage />} />
        <Route path="/contact" element={<ContactPage />} />

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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="neura-theme">
        <AlertProvider>
          <TooltipProvider delayDuration={400}>
            <AuthProvider>
              <NavigationProvider>
                <UmamiAnalytics>
                  <AppRoutes />
                </UmamiAnalytics>
              </NavigationProvider>
            </AuthProvider>
          </TooltipProvider>
        </AlertProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
