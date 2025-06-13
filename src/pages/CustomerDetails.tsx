
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from "@/hooks/use-database";
import { getCustomerById, updateCustomer, deleteCustomer, CustomerData } from "@/utils/database/customerOperations";
import { Customer } from "@/types/customer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  FileCheck, 
  CheckCircle, 
  XCircle,
  Database
} from "lucide-react";

// Sample fallback data
const sampleCustomer: Customer = {
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
};

// Edit Customer Form Component
const EditCustomerForm = ({ customer, onComplete }: { customer: Customer; onComplete: (data: Partial<CustomerData>) => void }) => {
  const [formData, setFormData] = useState({
    userId: customer.userId,
    efin: customer.efin,
    company: customer.company,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    businessPhone: customer.businessPhone,
    cellPhone: customer.cellPhone
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="userId" className="text-sm font-medium">User ID</label>
          <Input 
            id="userId" 
            name="userId" 
            value={formData.userId} 
            onChange={handleChange} 
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="efin" className="text-sm font-medium">EFIN</label>
          <Input 
            id="efin" 
            name="efin" 
            value={formData.efin} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="company" className="text-sm font-medium">Company</label>
        <Input 
          id="company" 
          name="company" 
          value={formData.company} 
          onChange={handleChange} 
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
          <Input 
            id="firstName" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
          <Input 
            id="lastName" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input 
          id="email" 
          name="email" 
          type="email"
          value={formData.email} 
          onChange={handleChange} 
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="businessPhone" className="text-sm font-medium">Business Phone</label>
          <Input 
            id="businessPhone" 
            name="businessPhone" 
            value={formData.businessPhone} 
            onChange={handleChange} 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="cellPhone" className="text-sm font-medium">Cell Phone</label>
          <Input 
            id="cellPhone" 
            name="cellPhone" 
            value={formData.cellPhone} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Update Customer</Button>
      </div>
    </form>
  );
};

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConfigured } = useDatabase();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadCustomer = async () => {
    if (!id) return;

    if (!isConfigured) {
      console.log("Database not configured, using sample data");
      setCustomer(sampleCustomer);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await getCustomerById(Number(id));
      
      if (result.success && result.data) {
        setCustomer(result.data);
      } else {
        console.error("Failed to fetch customer:", result.message);
        setCustomer(sampleCustomer); // Fallback to sample data
      }
    } catch (error) {
      console.error("Error loading customer:", error);
      setCustomer(sampleCustomer); // Fallback to sample data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [id, isConfigured]);

  const handleDelete = async () => {
    if (!customer) return;

    if (!isConfigured) {
      toast({
        title: "Customer deleted",
        description: "Customer has been successfully removed (demo mode).",
      });
      navigate("/customers");
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteCustomer(customer.id);
      
      if (result.success) {
        navigate("/customers");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async (data: Partial<CustomerData>) => {
    if (!customer) return;

    if (!isConfigured) {
      setCustomer(prev => prev ? { ...prev, ...data } : null);
      setIsEditOpen(false);
      toast({
        title: "Customer updated",
        description: "Customer information has been updated (demo mode).",
      });
      return;
    }

    try {
      setIsUpdating(true);
      const result = await updateCustomer(customer.id, data);
      
      if (result.success) {
        await loadCustomer(); // Refresh customer data
        setIsEditOpen(false);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium mt-4">Loading customer data...</div>
          <div className="text-sm text-muted-foreground mt-2">
            {isConfigured ? "Fetching from database" : "Loading demo data"}
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Customer Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">The requested customer was not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isConfigured ? "Connected to database" : "Using demo data"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Customer</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <EditCustomerForm customer={customer} onComplete={handleEdit} />
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant="destructive" 
            className="space-x-2" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full animate-slide-in">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portals">Portals</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User ID</p>
                    <p>{customer.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">EFIN</p>
                    <p>{customer.efin}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p>{customer.firstName} {customer.lastName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> {customer.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {customer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Phone</p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {customer.businessPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cell Phone</p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {customer.cellPhone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Portal</p>
                      <p className="text-sm text-muted-foreground">Installation Status</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${customer.portalReady ? 'bg-green-100' : 'bg-red-100'}`}>
                      {customer.portalReady ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Bank Application</p>
                      <p className="text-sm text-muted-foreground">Submission Status</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${customer.bankAppSubmitted ? 'bg-green-100' : 'bg-red-100'}`}>
                      {customer.bankAppSubmitted ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Software</p>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${customer.softwarePaid ? 'bg-green-100' : 'bg-red-100'}`}>
                      {customer.softwarePaid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="portals">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Portal information will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="banking">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Banking information will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Customer history will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
