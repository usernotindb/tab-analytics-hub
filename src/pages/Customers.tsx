
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerTable } from "@/components/customer/CustomerTable";
import { CustomerSearch } from "@/components/customer/CustomerSearch";
import { AddCustomerDialog } from "@/components/customer/AddCustomerDialog";
import { useCustomers } from "@/hooks/use-customers";
import { CustomerFilters } from "@/components/customer/FilterDialog";

const Customers = () => {
  const { toast } = useToast();
  const { customers, isLoading, addCustomer, removeCustomer, isDatabaseMode } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>({
    portalReady: null,
    bankAppSubmitted: null,
    softwarePaid: null
  });

  const filteredCustomers = customers.filter((customer) => {
    // Text search
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      customer.userId.toLowerCase().includes(searchTermLower) ||
      customer.company.toLowerCase().includes(searchTermLower) ||
      customer.firstName.toLowerCase().includes(searchTermLower) ||
      customer.lastName.toLowerCase().includes(searchTermLower) ||
      customer.email.toLowerCase().includes(searchTermLower);
    
    // Apply filters
    const matchesPortalFilter = filters.portalReady === null || customer.portalReady === filters.portalReady;
    const matchesBankFilter = filters.bankAppSubmitted === null || customer.bankAppSubmitted === filters.bankAppSubmitted;
    const matchesSoftwareFilter = filters.softwarePaid === null || customer.softwarePaid === filters.softwarePaid;
    
    return matchesSearch && matchesPortalFilter && matchesBankFilter && matchesSoftwareFilter;
  });

  const handleDelete = async (id: number) => {
    const result = await removeCustomer(id);
    if (!result.success) {
      toast({
        title: "Error deleting customer",
        description: result.message || "Failed to delete customer",
        variant: "destructive"
      });
    }
  };

  const addNewCustomer = async (data: any) => {
    const result = await addCustomer(data);
    if (result.success) {
      setIsWizardOpen(false);
      if (!isDatabaseMode) {
        toast({
          title: "Customer added",
          description: "The new customer has been successfully added.",
        });
      }
    } else {
      toast({
        title: "Error adding customer",
        description: result.message || "Failed to add customer",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Customers</h1>
          {!isDatabaseMode && (
            <p className="text-sm text-muted-foreground mt-1">
              Demo mode - Configure database in Settings to save data permanently
            </p>
          )}
        </div>
        
        <AddCustomerDialog 
          isOpen={isWizardOpen}
          onOpenChange={setIsWizardOpen}
          onComplete={addNewCustomer}
        />
      </div>

      <Card className="animate-slide-in">
        <CardContent className="p-6">
          <div className="mb-6">
            <CustomerSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          <CustomerTable 
            customers={filteredCustomers}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
