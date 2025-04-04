
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle, Calculator, Users, FileCheck, Building2 } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstSetup, setIsFirstSetup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }

    // Check if this is the first setup
    const checkSetupStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/setup/status");
        const data = await response.json();
        setIsFirstSetup(!data.configured);
      } catch (error) {
        // If the endpoint isn't available or returns an error, assume setup needed
        setIsFirstSetup(true);
      }
    };

    checkSetupStatus();
  }, []);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isFirstSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Calculator className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl">Welcome to TAB Analytics</CardTitle>
            <p className="text-muted-foreground mt-2">
              Your comprehensive tax portal management system
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center mb-4">
              <p>It looks like this is your first time running the application.</p>
              <p className="font-medium">Let's get you set up!</p>
            </div>

            <Button 
              size="lg" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={() => navigate("/setup")}
            >
              Start Setup Wizard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Calculator className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">TAB Analytics</CardTitle>
          <p className="text-muted-foreground mt-2">
            Tax portal management system
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard 
              icon={Users}
              title="Customer Management"
              description="Track and manage all your tax clients in one place"
            />
            <FeatureCard 
              icon={Building2}
              title="Portal Tracking"
              description="Monitor portals and installations across all software"
            />
            <FeatureCard 
              icon={FileCheck}
              title="Application Status"
              description="Track submitted and unsubmitted bank applications"
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Software Payments"
              description="Monitor licensing and payment status for all software"
            />
          </div>
          
          <div className="flex flex-col space-y-3 pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/setup")}
            >
              Run Setup Wizard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
      <div className="rounded-full bg-primary/10 p-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Index;
