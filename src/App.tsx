
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DatabaseProvider } from "./hooks/use-database";
import { AuthProvider } from "./hooks/use-auth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
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
import NavigationAudit from "./pages/NavigationAudit";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Wrapper to provide auth outside of routes
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Customers />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers/:id" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <CustomerDetails />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/portals" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Portals />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/portals/:id" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PortalDetails />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/paid-software" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PaidSoftware />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/portal-status/ready" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PortalStatusReady />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/portal-status/not-ready" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <PortalStatusNotReady />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bank-applications/submitted" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <BankApplicationsSubmitted />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bank-applications/unsubmitted" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <BankApplicationsUnsubmitted />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/navigation-audit" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <NavigationAudit />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DatabaseProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </DatabaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
