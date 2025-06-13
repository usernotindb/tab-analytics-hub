import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from "@/hooks/use-database";
import { executeQuery } from "@/utils/database/dbOperations";
import { updatePortalStatus, deletePortal, Portal } from "@/utils/database/portalOperations";
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
  Monitor, 
  User, 
  CheckCircle, 
  XCircle,
  UserCheck,
  Clock,
  Calendar,
  Database
} from "lucide-react";

// Sample fallback data
const samplePortal: Portal = {
  id: 1,
  customerId: 1,
  userId: "14545807",
  company: "Azteca Tax Systems",
  portalName: "Xlink",
  portalUrl: "https://xlink.example.com",
  software: "Xlink",
  type: "Desktop",
  userType: "Master User",
  installed: true,
  license: "1040 License",
  installedBy: "John Doe",
  status: 'ready',
  lastChecked: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Status Update Form Component
const StatusUpdateForm = ({ portal, onComplete }: { portal: Portal; onComplete: (status: Portal['status'], errorMessage?: string) => void }) => {
  const [status, setStatus] = useState<Portal['status']>(portal.status);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(status, status === 'error' ? errorMessage : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">Portal Status</label>
        <select 
          id="status" 
          value={status} 
          onChange={(e) => setStatus(e.target.value as Portal['status'])}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="ready">Ready</option>
          <option value="not_ready">Not Ready</option>
          <option value="pending">Pending</option>
          <option value="error">Error</option>
        </select>
      </div>

      {status === 'error' && (
        <div className="space-y-2">
          <label htmlFor="errorMessage" className="text-sm font-medium">Error Message</label>
          <Input 
            id="errorMessage" 
            value={errorMessage} 
            onChange={(e) => setErrorMessage(e.target.value)} 
            placeholder="Describe the error..."
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit">Update Status</Button>
      </div>
    </form>
  );
};

const PortalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConfigured } = useDatabase();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadPortal = async () => {
    if (!id) return;

    if (!isConfigured) {
      console.log("Database not configured, using sample data");
      setPortal(samplePortal);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await executeQuery<any[]>(
        `SELECT p.*, c.userId, c.company, c.firstName, c.lastName
         FROM portals p
         JOIN customers c ON p.customerId = c.id
         WHERE p.id = ?`,
        [Number(id)]
      );
      
      if (result.success && result.data && result.data.length > 0) {
        const row = result.data[0];
        const portalData: Portal = {
          id: row.id,
          customerId: row.customerId,
          userId: row.userId || '',
          company: row.company || '',
          portalName: row.portalName,
          portalUrl: row.portalUrl || '',
          software: row.portalName,
          type: 'Desktop',
          userType: 'Standard User',
          installed: row.status === 'ready',
          license: '',
          installedBy: `${row.firstName} ${row.lastName}`,
          status: row.status,
          lastChecked: row.lastChecked,
          errorMessage: row.errorMessage,
          accessCredentials: row.accessCredentials,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
        setPortal(portalData);
      } else {
        console.error("Portal not found");
        setPortal(samplePortal); // Fallback to sample data
      }
    } catch (error) {
      console.error("Error loading portal:", error);
      setPortal(samplePortal); // Fallback to sample data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortal();
  }, [id, isConfigured]);

  const handleDelete = async () => {
    if (!portal) return;

    if (!isConfigured) {
      toast({
        title: "Portal deleted",
        description: "Portal has been successfully removed (demo mode).",
      });
      navigate("/portals");
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deletePortal(portal.id);
      
      if (result.success) {
        navigate("/portals");
      }
    } catch (error) {
      console.error("Error deleting portal:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (status: Portal['status'], errorMessage?: string) => {
    if (!portal) return;

    if (!isConfigured) {
      setPortal(prev => prev ? { ...prev, status, errorMessage } : null);
      setIsStatusUpdateOpen(false);
      toast({
        title: "Portal status updated",
        description: `Portal status changed to ${status} (demo mode).`,
      });
      return;
    }

    try {
      setIsUpdating(true);
      const result = await updatePortalStatus(portal.id, status, errorMessage);
      
      if (result.success) {
        await loadPortal(); // Refresh portal data
        setIsStatusUpdateOpen(false);
      }
    } catch (error) {
      console.error("Error updating portal status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium mt-4">Loading portal data...</div>
          <div className="text-sm text-muted-foreground mt-2">
            {isConfigured ? "Fetching from database" : "Loading demo data"}
          </div>
        </div>
      </div>
    );
  }

  if (!portal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/portals")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Portal Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">The requested portal was not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/portals")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {portal.company} - {portal.software}
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
          <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="space-x-2">
                <Edit className="h-4 w-4" />
                <span>Update Status</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Update Portal Status</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <StatusUpdateForm portal={portal} onComplete={handleStatusUpdate} />
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
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Installation Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User ID</p>
                    <p>{portal.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installation Type</p>
                    <p>{portal.type}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p>{portal.company}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Software</p>
                    <p>{portal.software}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">License</p>
                    <p>{portal.license}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User Type</p>
                    <p>{portal.userType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installed By</p>
                    <p>{portal.installedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Installation Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {portal.installed ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Installed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">Not Installed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Installation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="min-w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Installation Created</p>
                      <p className="text-sm text-muted-foreground">Jan 15, 2023 at 10:30 AM</p>
                      <p className="text-sm mt-1">Initial setup of the installation was completed.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="min-w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">User Access Configured</p>
                      <p className="text-sm text-muted-foreground">Jan 16, 2023 at 2:15 PM</p>
                      <p className="text-sm mt-1">User permissions and access controls were set up.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="min-w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">Feb 3, 2023 at 9:45 AM</p>
                      <p className="text-sm mt-1">Software was updated to the latest version.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">User information will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Portal history will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalDetails;
