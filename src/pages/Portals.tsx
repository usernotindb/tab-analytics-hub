
import { useState } from "react";
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
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortals } from "@/hooks/use-portals";

// Component for the installation form
const InstallationForm = ({ onComplete }: { onComplete: (data: Partial<any>) => void }) => {
  const [formData, setFormData] = useState({
    customerId: 1, // This should be selected from available customers
    portalName: "",
    portalUrl: "",
    status: "pending" as const
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
        <label htmlFor="portalName" className="text-sm font-medium">Portal Name</label>
        <Input 
          id="portalName" 
          name="portalName" 
          value={formData.portalName} 
          onChange={handleChange} 
          placeholder="Enter Portal Name" 
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="portalUrl" className="text-sm font-medium">Portal URL</label>
        <Input 
          id="portalUrl" 
          name="portalUrl" 
          type="url"
          value={formData.portalUrl} 
          onChange={handleChange} 
          placeholder="Enter Portal URL" 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">Status</label>
        <select 
          id="status" 
          name="status" 
          value={formData.status} 
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="pending">Pending</option>
          <option value="ready">Ready</option>
          <option value="not_ready">Not Ready</option>
          <option value="error">Error</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Add Installation</Button>
      </div>
    </form>
  );
};

const Portals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { portals, isLoading, addPortal, removePortal, isDatabaseMode } = usePortals();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredPortals = portals.filter((portal) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      portal.userId?.toLowerCase().includes(searchTermLower) ||
      portal.company?.toLowerCase().includes(searchTermLower) ||
      portal.portalName.toLowerCase().includes(searchTermLower) ||
      portal.software?.toLowerCase().includes(searchTermLower) ||
      portal.type?.toLowerCase().includes(searchTermLower) ||
      portal.userType?.toLowerCase().includes(searchTermLower) ||
      portal.license?.toLowerCase().includes(searchTermLower)
    );
  });

  const handleDelete = async (id: number) => {
    const result = await removePortal(id);
    if (!result.success) {
      toast({
        title: "Error deleting portal",
        description: result.message || "Failed to delete portal",
        variant: "destructive"
      });
    }
  };

  const handleAddInstallation = async (data: any) => {
    const result = await addPortal({
      customerId: Number(data.customerId),
      portalName: data.portalName,
      portalUrl: data.portalUrl,
      status: data.status
    });
    
    if (result.success) {
      setIsFormOpen(false);
      if (!isDatabaseMode) {
        toast({
          title: "Installation added",
          description: "The new installation has been successfully added.",
        });
      }
    } else {
      toast({
        title: "Error adding installation",
        description: result.message || "Failed to add installation",
        variant: "destructive"
      });
    }
  };

  const viewDetails = (id: number) => {
    navigate(`/portals/${id}`);
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
          <h1 className="text-3xl font-bold tracking-tight">Portals & Installations</h1>
          {!isDatabaseMode && (
            <p className="text-sm text-muted-foreground mt-1">
              Demo mode - Configure database in Settings to save data permanently
            </p>
          )}
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Installation</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Installation</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <InstallationForm onComplete={handleAddInstallation} />
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
                placeholder="Search portals and installations..." 
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
                  <TableHead>Software</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">User Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Installed</TableHead>
                  <TableHead className="hidden lg:table-cell">License</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPortals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No installations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPortals.map((portal) => (
                    <TableRow key={portal.id}>
                      <TableCell className="font-medium">{portal.userId}</TableCell>
                      <TableCell>{portal.company}</TableCell>
                      <TableCell>{portal.software}</TableCell>
                      <TableCell className="hidden md:table-cell">{portal.type}</TableCell>
                      <TableCell className="hidden md:table-cell">{portal.userType}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          portal.installed ? "bg-green-500" : "bg-red-500"
                        )}></div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{portal.license}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewDetails(portal.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit installation
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(portal.id)}
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

export default Portals;
