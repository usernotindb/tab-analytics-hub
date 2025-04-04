
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseSetup } from "@/components/setup/DatabaseSetup";
import { AdminSetup } from "@/components/setup/AdminSetup";
import { SetupComplete } from "@/components/setup/SetupComplete";
import { Progress } from "@/components/ui/progress";

enum SetupStep {
  Database = "database",
  Admin = "admin",
  Complete = "complete",
}

const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.Database);
  const [progress, setProgress] = useState(0);
  const [dbConfig, setDbConfig] = useState({
    host: "",
    port: 3306,
    user: "",
    password: "",
    database: "",
  });
  const [adminConfig, setAdminConfig] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const navigate = useNavigate();

  const handleDatabaseConfigSave = (config: typeof dbConfig) => {
    setDbConfig(config);
    setCurrentStep(SetupStep.Admin);
    setProgress(50);
  };

  const handleAdminConfigSave = async (config: typeof adminConfig) => {
    setAdminConfig(config);
    
    try {
      // Submit both configurations to backend
      const response = await fetch("http://localhost:3001/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          database: dbConfig,
          admin: config,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Setup failed");
      }
      
      setCurrentStep(SetupStep.Complete);
      setProgress(100);
      setIsSetupComplete(true);
    } catch (error) {
      console.error("Setup error:", error);
      // Handle error - we would show an error message here
    }
  };

  const handleComplete = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">TAB Analytics Setup Wizard</CardTitle>
          <CardDescription>
            Configure your application settings to get started
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger 
                value={SetupStep.Database} 
                disabled={currentStep !== SetupStep.Database}
              >
                Database Configuration
              </TabsTrigger>
              <TabsTrigger 
                value={SetupStep.Admin} 
                disabled={currentStep !== SetupStep.Admin && currentStep !== SetupStep.Complete}
              >
                Admin Setup
              </TabsTrigger>
              <TabsTrigger 
                value={SetupStep.Complete} 
                disabled={currentStep !== SetupStep.Complete}
              >
                Complete
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={SetupStep.Database}>
              <DatabaseSetup 
                initialConfig={dbConfig} 
                onNext={handleDatabaseConfigSave} 
              />
            </TabsContent>
            
            <TabsContent value={SetupStep.Admin}>
              <AdminSetup 
                initialConfig={adminConfig} 
                onNext={handleAdminConfigSave} 
              />
            </TabsContent>
            
            <TabsContent value={SetupStep.Complete}>
              <SetupComplete onComplete={handleComplete} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="text-sm text-gray-500">
            TAB Analytics Setup - Step {progress === 0 ? '1' : progress === 50 ? '2' : '3'} of 3
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupWizard;
