
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DatabaseProvider } from "./hooks/use-database";
import Dashboard from "./pages/Dashboard";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DatabaseProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <MainLayout>
                  <Customers />
                </MainLayout>
              } 
            />
            <Route 
              path="/customers/:id" 
              element={
                <MainLayout>
                  <CustomerDetails />
                </MainLayout>
              } 
            />
            <Route 
              path="/portals" 
              element={
                <MainLayout>
                  <Portals />
                </MainLayout>
              } 
            />
            <Route 
              path="/portals/:id" 
              element={
                <MainLayout>
                  <PortalDetails />
                </MainLayout>
              } 
            />
            <Route 
              path="/paid-software" 
              element={
                <MainLayout>
                  <PaidSoftware />
                </MainLayout>
              } 
            />
            <Route 
              path="/portal-status/ready" 
              element={
                <MainLayout>
                  <PortalStatusReady />
                </MainLayout>
              } 
            />
            <Route 
              path="/portal-status/not-ready" 
              element={
                <MainLayout>
                  <PortalStatusNotReady />
                </MainLayout>
              } 
            />
            <Route 
              path="/bank-applications/submitted" 
              element={
                <MainLayout>
                  <BankApplicationsSubmitted />
                </MainLayout>
              } 
            />
            <Route 
              path="/bank-applications/unsubmitted" 
              element={
                <MainLayout>
                  <BankApplicationsUnsubmitted />
                </MainLayout>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <MainLayout>
                  <Settings />
                </MainLayout>
              } 
            />
            <Route 
              path="/navigation-audit" 
              element={
                <MainLayout>
                  <NavigationAudit />
                </MainLayout>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DatabaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
