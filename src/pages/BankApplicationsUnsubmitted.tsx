
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash, Check, CheckCircle2 } from "lucide-react";
import { BankApplication } from "@/lib/schema";
import { getBankApplicationsByStatus, createBankApplication, deleteBankApplication } from "@/lib/api";

const ApplicationForm = ({ onComplete }: { onComplete: (data: Partial<BankApplication>) => void }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    applicationType: "Personal Loan",
    amount: 0,
    bankName: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="customerName" className="text-sm font-medium">Customer Name</label>
        <Input 
          id="customerName" 
          name="customerName" 
          value={formData.customerName} 
          onChange={handleChange} 
          placeholder="Enter Customer Name" 
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="applicationType" className="text-sm font-medium">Application Type</label>
        <select 
          id="applicationType" 
          name="applicationType" 
          value={formData.applicationType} 
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="Personal Loan">Personal Loan</option>
          <option value="Business Loan">Business Loan</option>
          <option value="Mortgage">Mortgage</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Line of Credit">Line of Credit</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">Amount ($)</label>
        <Input 
          id="amount" 
          name="amount" 
          type="number" 
          step="0.01" 
          min="0"
          value={formData.amount} 
          onChange={handleChange} 
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bankName" className="text-sm font-medium">Bank Name</label>
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
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <textarea 
          id="notes" 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange} 
          placeholder="Add any additional notes"
          className="w-full p-2 border rounded-md h-24 resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Create Application</Button>
      </div>
    </form>
  );
};

const BankApplicationsUnsubmitted = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<BankApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBankApplicationsByStatus('unsubmitted');
        setApplications(data);
      } catch (error) {
        console.error("Error fetching unsubmitted applications:", error);
        toast({
          title: "Error",
          description: "Failed to load unsubmitted applications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredApplications = applications.filter((app) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      app.customerName.toLowerCase().includes(searchTermLower) ||
      app.applicationType.toLowerCase().includes(searchTermLower) ||
      app.bankName.toLowerCase().includes(searchTermLower)
    );
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteBankApplication(id);
      setApplications(applications.filter(app => app.id !== id));
      toast({
        title: "Application deleted",
        description: "The application has been removed.",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const handleAddApplication = async (data: Partial<BankApplication>) => {
    try {
      const newApplication = await createBankApplication({
        customerId: 0, // This would be set properly in a real implementation
        customerName: data.customerName || "",
        applicationType: data.applicationType || "Personal Loan",
        status: 'unsubmitted',
        amount: data.amount || 0,
        bankName: data.bankName || "",
        notes: data.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      setApplications([...applications, newApplication]);
      setIsFormOpen(false);
      toast({
        title: "Application created",
        description: "The new application has been added.",
      });
    } catch (error) {
      console.error("Error creating application:", error);
      toast({
        title: "Error",
        description: "Failed to create application",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Unsubmitted Bank Applications</h1>
        
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
              <ApplicationForm onComplete={handleAddApplication} />
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
                placeholder="Search applications..." 
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Application Type</TableHead>
                  <TableHead className="hidden md:table-cell">Bank</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No unsubmitted applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.customerName}</TableCell>
                      <TableCell>{app.applicationType}</TableCell>
                      <TableCell className="hidden md:table-cell">{app.bankName}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatCurrency(app.amount)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="capitalize py-1 px-2 bg-yellow-50 text-yellow-600 rounded-full text-xs">
                            Unsubmitted
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{new Date(app.created_at).toLocaleDateString()}</TableCell>
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
                              Edit application
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark as submitted
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(app.id)}
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

export default BankApplicationsUnsubmitted;
