
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const customerSchema = z.object({
  efin: z.string().min(1, "EFIN is required"),
  company: z.string().min(1, "Company is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  businessPhone: z.string().optional(),
  cellPhone: z.string().min(1, "Cell phone is required"),
  secondContactName: z.string().optional(),
  secondCellPhone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
  notes: z.string().optional(),
});

type CustomerData = z.infer<typeof customerSchema>;

interface CustomerWizardProps {
  onComplete: (data: CustomerData) => void;
}

const CustomerWizard = ({ onComplete }: CustomerWizardProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      efin: "",
      company: "",
      firstName: "",
      lastName: "",
      email: "",
      businessPhone: "",
      cellPhone: "",
      secondContactName: "",
      secondCellPhone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ["efin", "company", "firstName", "lastName"],
      2: ["email", "cellPhone", "businessPhone"],
      3: ["address", "city", "state", "zip"],
    }[step] as Array<keyof CustomerData>;
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(Math.min(step + 1, totalSteps + 1));
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
  };

  const handleSubmit = (data: CustomerData) => {
    onComplete(data);
  };

  // Content based on current step
  const stepContent = {
    1: (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <FormField
          control={form.control}
          name="efin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EFIN</FormLabel>
              <FormControl>
                <Input placeholder="Enter EFIN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    ),
    2: (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter business phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cellPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cell Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter cell phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondContactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>2nd Contact Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter 2nd contact name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondCellPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>2nd Cell Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter 2nd cell phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    ),
    3: (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-semibold">Address & Notes</h2>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ZIP code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional notes" 
                  className="resize-none h-20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    ),
    4: (
      <div className="space-y-4 text-center py-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-4">All Set!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Review the information below and click "Complete" to add the new customer.
        </p>
        
        <div className="mt-6 space-y-4 text-left border rounded-lg p-4 bg-muted/30">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Company:</p>
              <p className="font-medium">{form.getValues().company}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">EFIN:</p>
              <p className="font-medium">{form.getValues().efin}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Contact:</p>
            <p className="font-medium">
              {form.getValues().firstName} {form.getValues().lastName}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Address:</p>
            <p className="font-medium">
              {form.getValues().address}, {form.getValues().city}, {form.getValues().state} {form.getValues().zip}
            </p>
          </div>
        </div>
      </div>
    ),
  }[step];

  // Progress bar
  const progressPercentage = step === totalSteps + 1 ? 100 : (step / totalSteps) * 100;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="relative h-1 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground mb-6">
          <span>Step {Math.min(step, totalSteps)} of {totalSteps}</span>
          {step <= totalSteps && <span>{['Basic Info', 'Contact', 'Address'][step - 1]}</span>}
        </div>

        {stepContent}

        <div className="flex justify-between pt-4">
          {step > 1 && step <= totalSteps + 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          {step < totalSteps + 1 ? (
            <Button 
              type="button" 
              onClick={nextStep} 
              className={`${step === 1 ? 'ml-auto' : ''}`}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Complete
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CustomerWizard;
