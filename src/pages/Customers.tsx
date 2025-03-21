import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, MoreHorizontal, Search, UserPlus, Edit, Trash, Eye } from "lucide-react";
import CustomerWizard from "@/components/customer/CustomerWizard";

interface Customer {
  id: number;
  userId: string;
  efin: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  businessPhone: string;
  cellPhone: string;
  portalReady: boolean;
  bankAppSubmitted: boolean;
  softwarePaid: boolean;
}

const sampleCustomers: Customer[] = [
  {
    id: 1,
    userId: "14545807",
    efin: "123456",
    company: "Azteca Tax Systems",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    businessPhone: "(555) 123-4567",
    cellPhone: "(555) 987-6543",
    portalReady: true,
    bankAppSubmitted: true,
    softwarePaid: true,
  },
  {
    id: 2,
    userId: "14545808",
    efin: "234567",
    company: "Global Tax Solutions",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    businessPhone: "(555) 222-3333",
    cellPhone: "(555) 444-5555",
    portalReady: false,
    bankAppSubmitted: true,
    softwarePaid: true,
  },
  {
    id: 3,
    userId: "14545809",
    efin: "345678",
    company: "Premier Tax Services",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.j@example.com",
    businessPhone: "(555) 666-7777",
    cellPhone: "(555) 888-9999",
    portalReady: true,
    bankAppSubmitted: false,
    softwarePaid: false,
  },
  {
    id: 4,
    userId: "14545810",
    efin: "456789",
    company: "Advanced Tax Pros",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.g@example.com",
    businessPhone: "(555) 111-2222",
    cellPhone: "(555) 333-4444",
    portalReady: false,
    bankAppSubmitted: false,
    softwarePaid: true,
  },
];

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      customer.userId.toLowerCase().includes(searchTermLower) ||
      customer.company.toLowerCase().includes(searchTermLower) ||
      customer.firstName.toLowerCase().includes(searchTermLower) ||
      customer.lastName.toLowerCase().includes(searchTermLower) ||
      customer.email.toLowerCase().includes(searchTermLower)
    );
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
        
        <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
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
              <CustomerWizard 
                onComplete={addNewCustomer}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="animate-slide-in">
        <CardContent className="p-6">
          <div className="flex items-center mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="hidden md:table-cell">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Portal</TableHead>
                  <TableHead className="hidden lg:table-cell">Bank App</TableHead>
                  <TableHead className="hidden lg:table-cell">Software</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.userId}</TableCell>
                      <TableCell>{customer.company}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {customer.firstName} {customer.lastName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className={`w-3 h-3 rounded-full ${customer.portalReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className={`w-3 h-3 rounded-full ${customer.bankAppSubmitted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className={`w-3 h-3 rounded-full ${customer.softwarePaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(customer.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
