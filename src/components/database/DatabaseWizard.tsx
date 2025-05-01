
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Loader } from "lucide-react";
import { DatabaseConfig, testDbConnection, saveDbConfig } from "@/utils/database/dbConnector";

interface DatabaseWizardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DatabaseWizard = ({ 
  isOpen, 
  onOpenChange,
  onSuccess
}: DatabaseWizardProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Database configuration
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: "",
    port: "3306", // Default MySQL port
    user: "",
    password: "",
    database: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDbConfig({ ...dbConfig, [name]: value });
    // Clear previous test results when configuration changes
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await testDbConnection(dbConfig);
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Connection successful",
          description: "Successfully connected to the database.",
        });
      } else {
        toast({
          title: "Connection failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast({
        title: "Connection error",
        description: "An unexpected error occurred while testing the connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = () => {
    saveDbConfig(dbConfig);
    toast({
      title: "Configuration saved",
      description: "Database configuration has been saved successfully."
    });
    if (onSuccess) onSuccess();
    onOpenChange(false);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Database Connection Setup</DialogTitle>
          <DialogDescription>
            Configure your MySQL database connection.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="host">Database Host</Label>
              <Input 
                id="host"
                name="host"
                placeholder="localhost or IP address"
                value={dbConfig.host}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Database Port</Label>
              <Input 
                id="port"
                name="port"
                placeholder="3306"
                value={dbConfig.port}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user">Database User</Label>
              <Input 
                id="user"
                name="user"
                placeholder="root"
                value={dbConfig.user}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Database Password</Label>
              <Input 
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={dbConfig.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="database">Database Name</Label>
              <Input 
                id="database"
                name="database"
                placeholder="Enter database name"
                value={dbConfig.database}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="pt-4 flex flex-col items-center">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleTestConnection}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              
              {testResult && (
                <div className={`mt-4 p-3 rounded-md w-full flex items-center ${
                  testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {testResult.success ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <X className="h-5 w-5 mr-2" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
          ) : (
            <div></div> // Empty div for spacing
          )}
          
          {step < 2 ? (
            <Button onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSaveConfig}
              disabled={!testResult?.success}
            >
              Save Configuration
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
