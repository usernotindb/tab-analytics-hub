
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  XCircle 
} from "lucide-react";

// This would come from your API in a real application
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

// Sample data - in a real app, this would come from your API
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

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundCustomer = sampleCustomers.find(
      (c) => c.id === Number(id)
    );
    
    if (foundCustomer) {
      setCustomer(foundCustomer);
    }
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    // In a real app, this would be an API call
    toast({
      title: "Customer deleted",
      description: "The customer has been successfully removed.",
    });
    navigate("/customers");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">
            {customer.firstName} {customer.lastName}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button variant="destructive" className="space-x-2" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
            <span>Delete</span>
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
