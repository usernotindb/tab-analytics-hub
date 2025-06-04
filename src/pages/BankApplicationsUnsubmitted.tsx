
import { useState, useEffect } from "react";
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
import { useBankApplications } from "@/hooks/use-bank-applications";

const NewApplicationForm = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    customerId: 1,
    bankName: "",
    product: "",
    amount: "",
    purpose: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      applicationStatus: 'unsubmitted'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="customerId" className="text-sm font-medium">Customer ID</label>
        <Input 
          id="customerId" 
          name="customerId" 
          type="number"
          value={formData.customerId} 
          onChange={handleChange} 
          placeholder="Enter Customer ID" 
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="bankName" className="text-sm font-medium">Bank</label>
        <Input 
          id="bankName" 
          name="bankName" 
          value={formData.bankName} 
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

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">Amount</label>
        <Input 
          id="amount" 
          name="amount" 
          type="number"
          value={formData.amount} 
          onChange={handleChange} 
          placeholder="Enter Amount" 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="purpose" className="text-sm font-medium">Purpose</label>
        <Input 
          id="purpose" 
          name="purpose" 
          value={formData.purpose} 
          onChange={handleChange} 
          placeholder="Enter Purpose" 
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Create Draft</Button>
      </div>
    </form>
  );
};

const BankApplicationsUnsubmitted = () => {
  const { toast } = useToast();
  const { applications, isLoading, loadApplicationsByStatus, addApplication, removeApplication, updateApplication, isDatabaseMode } = useBankApplications();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadApplicationsByStatus('unsubmitted');
  }, []);

  const filteredApplications = applications.filter((app) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      app.applicationId?.toLowerCase().includes(searchTermLower) ||
      app.userId?.toLowerCase().includes(searchTermLower) ||
      app.customerName?.toLowerCase().includes(searchTermLower) ||
      app.bankName.toLowerCase().includes(searchTermLower) ||
      app.product.toLowerCase().includes(searchTermLower) ||
      app.applicationStatus.toLowerCase().includes(searchTermLower)
    );
  });

  const handleDelete = async (id: number) => {
    const result = await removeApplication(id);
    if (result.success) {
      if (!isDatabaseMode) {
        toast({
          title: "Draft deleted",
          description: "The application draft has been deleted.",
        });
      }
      // Refresh the list
      loadApplicationsByStatus('unsubmitted');
    } else {
      toast({
        title: "Error deleting draft",
        description: result.message || "Failed to delete draft",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (id: number) => {
    const result = await updateApplication(id, { 
      applicationStatus: 'submitted',
      submissionDate: new Date().toISOString().split('T')[0]
    });
    
    if (result.success) {
      toast({
        title: "Application submitted",
        description: "The application has been successfully submitted to the bank.",
      });
      // Refresh the list
      loadApplicationsByStatus('unsubmitted');
    } else {
      toast({
        title: "Error submitting application",
        description: result.message || "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  const handleAddApplication = async (data: any) => {
    const result = await addApplication(data);
    
    if (result.success) {
      setIsFormOpen(false);
      if (!isDatabaseMode) {
        toast({
          title: "Draft created",
          description: "New application draft has been created.",
        });
      }
      // Refresh the list
      loadApplicationsByStatus('unsubmitted');
    } else {
      toast({
        title: "Error creating draft",
        description: result.message || "Failed to create draft",
        variant: "destructive"
      });
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Unsubmitted Bank Applications</h1>
          <p className="text-muted-foreground mt-1">
            Draft applications that haven't been submitted to financial institutions
            {!isDatabaseMode && " (Demo mode)"}
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
                  <TableHead className="hidden lg:table-cell">Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
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
                      <TableCell className="font-medium">{app.applicationId}</TableCell>
                      <TableCell>{app.userId}</TableCell>
                      <TableCell>{app.customerName}</TableCell>
                      <TableCell className="hidden md:table-cell">{app.bankName}</TableCell>
                      <TableCell className="hidden md:table-cell">{app.product}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {app.amount ? `$${app.amount.toLocaleString()}` : 'N/A'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{app.updatedAt?.split('T')[0]}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleSubmit(app.id)}>
                              <Send className="mr-2 h-4 w-4" />
                              Submit application
                            </DropdownMenuItem>
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
