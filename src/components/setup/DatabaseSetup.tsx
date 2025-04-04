
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const databaseSchema = z.object({
  host: z.string().min(1, { message: "Database host is required" }),
  port: z.coerce.number().int().positive(),
  user: z.string().min(1, { message: "Database user is required" }),
  password: z.string().min(1, { message: "Database password is required" }),
  database: z.string().min(1, { message: "Database name is required" }),
});

type DatabaseSetupProps = {
  initialConfig: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  onNext: (config: any) => void;
};

export function DatabaseSetup({ initialConfig, onNext }: DatabaseSetupProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof databaseSchema>>({
    resolver: zodResolver(databaseSchema),
    defaultValues: initialConfig,
  });

  const testConnection = async (values: z.infer<typeof databaseSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/setup/test-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Database connection successful!");
        return true;
      } else {
        toast.error(data.message || "Connection failed");
        return false;
      }
    } catch (error) {
      toast.error("Could not connect to the database server");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof databaseSchema>) => {
    const isValid = await testConnection(values);
    if (isValid) {
      onNext(values);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Database Configuration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your MySQL database details to connect to your database.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input placeholder="localhost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="root" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="database"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Database Name</FormLabel>
                <FormControl>
                  <Input placeholder="atsat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => testConnection(form.getValues())}>
              Test Connection
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Testing..." : "Next"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
