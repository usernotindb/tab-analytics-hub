
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SetupWizard from "./pages/SetupWizard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Portals from "./pages/Portals";
import PortalDetails from "./pages/PortalDetails";
import PaidSoftware from "./pages/PaidSoftware";
import PortalStatusReady from "./pages/PortalStatusReady";
import PortalStatusNotReady from "./pages/PortalStatusNotReady";
import BankApplicationsSubmitted from "./pages/BankApplicationsSubmitted";
import BankApplicationsUnsubmitted from "./pages/BankApplicationsUnsubmitted";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import UserManagement from "./pages/UserManagement";
import SystemHealth from "./pages/SystemHealth";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

// Simple authentication check
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<SetupWizard />} />
      
      {/* Redirect from portal-status to the appropriate page */}
      <Route path="/portal-status" element={<Navigate to="/portal-status/ready" replace />} />
      
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/customers" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Customers />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/customers/:id" 
        element={
          <PrivateRoute>
            <MainLayout>
              <CustomerDetails />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/portals" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Portals />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/portals/:id" 
        element={
          <PrivateRoute>
            <MainLayout>
              <PortalDetails />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/paid-software" 
        element={
          <PrivateRoute>
            <MainLayout>
              <PaidSoftware />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/portal-status/ready" 
        element={
          <PrivateRoute>
            <MainLayout>
              <PortalStatusReady />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/portal-status/not-ready" 
        element={
          <PrivateRoute>
            <MainLayout>
              <PortalStatusNotReady />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/bank-applications/submitted" 
        element={
          <PrivateRoute>
            <MainLayout>
              <BankApplicationsSubmitted />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/bank-applications/unsubmitted" 
        element={
          <PrivateRoute>
            <MainLayout>
              <BankApplicationsUnsubmitted />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      {/* New pages */}
      <Route 
        path="/users" 
        element={
          <PrivateRoute>
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/system-health" 
        element={
          <PrivateRoute>
            <MainLayout>
              <SystemHealth />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Reports />
            </MainLayout>
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AuthProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
