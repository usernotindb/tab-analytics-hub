
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import CustomerWizard from "@/components/customer/CustomerWizard";

interface AddCustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: any) => void;
}

export const AddCustomerDialog = ({ 
  isOpen, 
  onOpenChange, 
  onComplete 
}: AddCustomerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Customer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CustomerWizard onComplete={onComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
