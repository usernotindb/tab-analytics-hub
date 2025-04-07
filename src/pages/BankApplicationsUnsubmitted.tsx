import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash, Send, AlertTriangle, CheckCircle } from "lucide-react";

interface BankApplication {
  id: number;
  draftId: string;
  userId: string;
  customer: string;
  bank: string;
  creationDate: string;
  lastUpdated: string;
  product: string;
  status: 'incomplete' | 'ready' | 'review';
}

const unsubmittedApplications: BankApplication[] = [
  {
    id: 5,
    draftId: "DRAFT-2023-001",
    userId: "14545811",
    customer: "Rapid Tax Service",
    bank: "First National Bank",
    creationDate: "2023-04-01",
    lastUpdated: "2023-04-05",
    product: "Business Loan",
    status: 'incomplete',
  },
  {
    id: 6,
    draftId: "DRAFT-2023-002",
    userId: "14545812",
    customer: "Elite Tax Advisors",
    bank: "Citizens Bank",
    creationDate: "2023-04-02",
    lastUpdated: "2023-04-07",
    product: "Line of Credit",
    status: 'ready',
  },
  {
    id: 7,
    draftId: "DRAFT-2023-003",
    userId: "14545813",
    customer: "Fast Tax Returns",
    bank: "Capital One",
    creationDate: "2023-04-03",
    lastUpdated: "2023-04-06",
    product: "Business Credit Card",
    status: 'review',
  },
];

const NewApplicationForm = ({ onComplete }: { onComplete: (data: Partial<BankApplication>) => void }) => {
  const [formData, setFormData] = useState({
    userId: "",
    customer: "",
    bank: "",
    product: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="userId" className="text-sm font-medium">User ID</label>
        <Input 
          id="userId" 
          name="userId" 
          value={formData.userId} 
          onChange={handleChange} 
          placeholder="Enter User ID" 
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="customer" className="text-sm font-medium">Customer</label>
        <Input 
          id="customer" 
          name="customer" 
          value={formData.customer} 
          onChange={handleChange} 
          placeholder="Enter Customer Name" 
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bank" className="text-sm font-medium">Bank</label>
        <Input 
          id="bank" 
          name="bank" 
          value={formData.bank} 
          onChange={handleChange} 
          placeholder="Enter Bank Name" 
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="product" className="text-sm font-medium">Product</label>
        <select 
          id="product" 
          name="product" 
          value={formData.product} 
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Select a product</option>
          <option value="Business Loan">Business Loan</option>
          <option value="Line of Credit">Line of Credit</option>
          <option value="Business Credit Card">Business Credit Card</option>
          <option value="Advance Loan">Advance Loan</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Create Draft</Button>
      </div>
    </form>
  );
};

const BankApplicationsUnsubmitted = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<BankApplication[]>(unsubmittedApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredApplications = applications.filter((app) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      app.draftId.toLowerCase().includes(searchTermLower) ||
      app.userId.toLowerCase().includes(searchTermLower) ||
      app.customer.toLowerCase().includes(searchTermLower) ||
      app.bank.toLowerCase().includes(searchTermLower) ||
      app.product.toLowerCase().includes(searchTermLower) ||
      app.status.toLowerCase().includes(searchTermLower)
    );
  });

  const handleDelete = (id: number) => {
    setApplications(applications.filter(app => app.id !== id));
    toast({
      title: "Draft deleted",
      description: "The application draft has been deleted.",
    });
  };

  const handleSubmit = (id: number) => {
    setApplications(applications.filter(app => app.id !== id));
    toast({
      title: "Application submitted",
      description: "The application has been successfully submitted to the bank.",
    });
  };

  const handleAddApplication = (data: Partial<BankApplication>) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const newApplication: BankApplication = {
      id: applications.length + 1 + 7, // Start from higher ID to avoid conflicts
      draftId: `DRAFT-2023-${String(applications.length + 1 + 4).padStart(3, '0')}`,
      userId: data.userId || "",
      customer: data.customer || "",
      bank: data.bank || "",
      creationDate: formattedDate,
      lastUpdated: formattedDate,
      product: data.product || "",
      status: 'incomplete',
    };
    
    setApplications([...applications, newApplication]);
    setIsFormOpen(false);
    toast({
      title: "Draft created",
      description: "New application draft has been created.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'incomplete':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'review':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Unsubmitted Bank Applications</h1>
          <p className="text-muted-foreground mt-1">
            Draft applications that haven't been submitted to financial institutions
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Application</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Bank Application</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <NewApplicationForm onComplete={handleAddApplication} />
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
                placeholder="Search unsubmitted applications..." 
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
                  <TableHead>Draft ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Bank</TableHead>
                  <TableHead className="hidden md:table-cell">Product</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No unsubmitted applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.draftId}</TableCell>
                      <TableCell>{app.userId}</TableCell>
                      <TableCell>{app.customer}</TableCell>
                      <TableCell className="hidden md:table-cell">{app.bank}</TableCell>
                      <TableCell className="hidden md:table-cell">{app.product}</TableCell>
                      <TableCell className="hidden lg:table-cell">{app.lastUpdated}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </div>
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
                              Edit draft
                            </DropdownMenuItem>
                            {app.status === 'ready' && (
                              <DropdownMenuItem onClick={() => handleSubmit(app.id)}>
                                <Send className="mr-2 h-4 w-4" />
                                Submit application
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(app.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete draft
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

export default BankApplicationsUnsubmitted;
