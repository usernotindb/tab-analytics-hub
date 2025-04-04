
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

type SetupCompleteProps = {
  onComplete: () => void;
};

export function SetupComplete({ onComplete }: SetupCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6">
      <div className="rounded-full bg-green-100 p-3">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-medium">Setup Complete!</h3>
        <p className="text-muted-foreground mt-2">
          Your application has been successfully configured and is ready to use.
        </p>
      </div>
      
      <div className="bg-muted p-4 rounded-md w-full max-w-md">
        <h4 className="font-medium mb-2">Next Steps:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Log in with your admin credentials</li>
          <li>Set up your customer profiles</li>
          <li>Configure portals and software licenses</li>
          <li>Add bank applications and track their progress</li>
        </ul>
      </div>
      
      <Button onClick={onComplete} size="lg">
        Go to Login
      </Button>
    </div>
  );
}
