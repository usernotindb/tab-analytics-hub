
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatabaseWizard } from "./DatabaseWizard";
import { isDatabaseConfigured, clearDbConfig, getDbConfig } from "@/utils/database/dbConnector";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const DatabaseStatusCard = () => {
  const [isConfigured, setIsConfigured] = useState(isDatabaseConfigured);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const dbConfig = getDbConfig();

  const handleWizardSuccess = () => {
    setIsConfigured(true);
  };

  const handleClearConfig = () => {
    clearDbConfig();
    setIsConfigured(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>MySQL Database Connection</CardTitle>
            <CardDescription>
              Connect to your MySQL database server
            </CardDescription>
          </div>
          {isConfigured && (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              Connected
            </Badge>
          )}
          {!isConfigured && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isConfigured && dbConfig ? (
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Host:</span>
              <span>{dbConfig.host}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Port:</span>
              <span>{dbConfig.port}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Database:</span>
              <span>{dbConfig.database}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">User:</span>
              <span>{dbConfig.user}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              No database connection configured. Set up a connection to start using database features.
            </p>
            <Button onClick={() => setIsWizardOpen(true)}>
              Configure Database
            </Button>
          </div>
        )}
      </CardContent>
      {isConfigured && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsWizardOpen(true)}
          >
            Reconfigure
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 hover:text-red-600">
                Clear Configuration
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove your database configuration. You'll need to reconfigure it to connect to the database again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearConfig}>
                  Clear Configuration
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}

      <DatabaseWizard 
        isOpen={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        onSuccess={handleWizardSuccess}
      />
    </Card>
  );
};
