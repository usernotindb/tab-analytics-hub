
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
import { Check, X, Loader, Database } from "lucide-react";
import { DatabaseConfig, testDbConnection, saveDbConfig } from "@/utils/database/dbConnector";
import { initializeDatabase } from "@/utils/database/dbOperations";

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
  const [initializeSchema, setInitializeSchema] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  
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

  const handleInitializeSchema = async () => {
    setIsInitializing(true);
    
    try {
      const result = await initializeDatabase();
      
      if (result.success) {
        toast({
          title: "Schema initialized",
          description: "Database tables have been created successfully.",
        });
        setStep(4); // Move to final step
      } else {
        toast({
          title: "Schema initialization failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error initializing schema:", error);
      toast({
        title: "Initialization error",
        description: "An unexpected error occurred while initializing the database schema.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSaveConfig = async () => {
    saveDbConfig(dbConfig);
    
    if (initializeSchema && testResult?.success) {
      setStep(3); // Go to schema initialization step
    } else {
      // Skip schema initialization
      toast({
        title: "Configuration saved",
        description: "Database configuration has been saved successfully."
      });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Database setup complete",
      description: "Your database is ready to use!"
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

  const resetWizard = () => {
    setStep(1);
    setTestResult(null);
    setInitializeSchema(true);
    setDbConfig({
      host: "",
      port: "3306",
      user: "",
      password: "",
      database: ""
    });
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetWizard();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Database Connection Setup"}
            {step === 2 && "Test Connection & Schema"}
            {step === 3 && "Initialize Database Schema"}
            {step === 4 && "Setup Complete"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Configure your MySQL database connection."}
            {step === 2 && "Test the connection and configure schema options."}
            {step === 3 && "Initialize the database with required tables."}
            {step === 4 && "Your database is now ready to use!"}
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

            {testResult?.success && (
              <div className="mt-4 p-4 border rounded-md bg-blue-50">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="initializeSchema"
                    checked={initializeSchema}
                    onChange={(e) => setInitializeSchema(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="initializeSchema" className="text-sm font-medium">
                    Initialize database schema
                  </Label>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Create the necessary tables for customers, portals, and application data.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-2 text-center">
            <div className="flex justify-center">
              <Database className="h-16 w-16 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Initialize Database Schema</h3>
              <p className="text-sm text-gray-600 mt-2">
                This will create the necessary tables for your application including:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• customers table</li>
                <li>• portals table</li>
                <li>• bank_applications table</li>
                <li>• audit_logs table</li>
              </ul>
            </div>
            
            <Button 
              className="w-full"
              onClick={handleInitializeSchema}
              disabled={isInitializing}
            >
              {isInitializing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating Tables...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Initialize Database
                </>
              )}
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 py-2 text-center">
            <div className="flex justify-center">
              <Check className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-700">Setup Complete!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Your database connection has been configured and the schema has been initialized. 
                You can now start using all database features of the application.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          {step > 1 && step < 4 ? (
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step === 1 && (
            <Button onClick={handleNextStep}>
              Next
            </Button>
          )}
          
          {step === 2 && (
            <Button 
              onClick={handleSaveConfig}
              disabled={!testResult?.success}
            >
              {initializeSchema ? "Save & Initialize" : "Save Configuration"}
            </Button>
          )}
          
          {step === 3 && (
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Configuration saved",
                  description: "Database configuration saved without schema initialization."
                });
                if (onSuccess) onSuccess();
                onOpenChange(false);
              }}
            >
              Skip Initialization
            </Button>
          )}
          
          {step === 4 && (
            <Button onClick={handleComplete}>
              Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
