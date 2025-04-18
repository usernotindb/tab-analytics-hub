
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerTable } from "@/components/customer/CustomerTable";
import { CustomerSearch } from "@/components/customer/CustomerSearch";
import { AddCustomerDialog } from "@/components/customer/AddCustomerDialog";
import { Customer } from "@/types/customer";
import { sampleCustomers } from "@/data/sampleCustomers";
import { CustomerFilters } from "@/components/customer/FilterDialog";

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
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

  const handleDelete = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
    toast({
      title: "Customer deleted",
      description: "The customer has been successfully removed.",
    });
  };

  const addNewCustomer = (data: any) => {
    const newCustomer: Customer = {
      id: customers.length + 1,
      userId: `1454${Math.floor(Math.random() * 10000)}`,
      efin: data.efin || "",
      company: data.company || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      businessPhone: data.businessPhone || "",
      cellPhone: data.cellPhone || "",
      portalReady: false,
      bankAppSubmitted: false,
      softwarePaid: false,
    };
    
    setCustomers([...customers, newCustomer]);
    setIsWizardOpen(false);
    toast({
      title: "Customer added",
      description: "The new customer has been successfully added.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tax Customers</h1>
        
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
