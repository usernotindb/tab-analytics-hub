
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

// Define the Portal interface
interface Portal {
  id: number;
  userId: string;
  company: string;
  software: string;
  type: string;
  userType: string;
  installed: boolean;
  license: string;
  installed_by: string;
}

// Sample data - in a real app, this would come from your API
const portalData: Portal[] = [
  {
    id: 1,
    userId: "14545807",
    company: "Azteca Tax Systems",
    software: "Xlink",
    type: "Desktop",
    userType: "Master User",
    installed: true,
    license: "1040 License",
    installed_by: "John Doe",
  },
  {
    id: 2,
    userId: "14545808",
    company: "Global Tax Solutions",
    software: "TaxWeb",
    type: "Online",
    userType: "Admin",
    installed: true,
    license: "Full Service",
    installed_by: "Jane Smith",
  },
  {
    id: 3,
    userId: "14545809",
    company: "Premier Tax Services",
    software: "TaxPro",
    type: "Desktop",
    userType: "Standard User",
    installed: false,
    license: "1040 License",
    installed_by: "N/A",
  },
];

// Component for the installation form
const InstallationForm = ({ onComplete }: { onComplete: (data: Partial<Portal>) => void }) => {
  const [formData, setFormData] = useState({
    userId: "",
    company: "",
    software: "",
    type: "Desktop",
    userType: "Standard User",
    license: ""
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
        <label htmlFor="company" className="text-sm font-medium">Company</label>
        <Input 
          id="company" 
          name="company" 
          value={formData.company} 
          onChange={handleChange} 
          placeholder="Enter Company Name" 
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="software" className="text-sm font-medium">Software</label>
        <Input 
          id="software" 
          name="software" 
          value={formData.software} 
          onChange={handleChange} 
          placeholder="Enter Software Name" 
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">Type</label>
        <select 
          id="type" 
          name="type" 
          value={formData.type} 
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="Desktop">Desktop</option>
          <option value="Online">Online</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="userType" className="text-sm font-medium">User Type</label>
        <select 
          id="userType" 
          name="userType" 
          value={formData.userType} 
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="Master User">Master User</option>
          <option value="Admin">Admin</option>
          <option value="Standard User">Standard User</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="license" className="text-sm font-medium">License</label>
        <Input 
          id="license" 
          name="license" 
          value={formData.license} 
          onChange={handleChange} 
          placeholder="Enter License Information" 
          required
        />
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
  const [portals, setPortals] = useState<Portal[]>(portalData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredPortals = portals.filter((portal) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      portal.userId.toLowerCase().includes(searchTermLower) ||
      portal.company.toLowerCase().includes(searchTermLower) ||
      portal.software.toLowerCase().includes(searchTermLower) ||
      portal.type.toLowerCase().includes(searchTermLower) ||
      portal.userType.toLowerCase().includes(searchTermLower) ||
      portal.license.toLowerCase().includes(searchTermLower)
    );
  });

  const handleDelete = (id: number) => {
    setPortals(portals.filter(portal => portal.id !== id));
    toast({
      title: "Installation deleted",
      description: "The installation has been successfully removed.",
    });
  };

  const handleAddInstallation = (data: Partial<Portal>) => {
    const newPortal: Portal = {
      id: portals.length + 1,
      userId: data.userId || "",
      company: data.company || "",
      software: data.software || "",
      type: data.type || "Desktop",
      userType: data.userType || "Standard User",
      installed: true,
      license: data.license || "",
      installed_by: "Current User", // In a real app, this would be the logged-in user
    };
    
    setPortals([...portals, newPortal]);
    setIsFormOpen(false);
    toast({
      title: "Installation added",
      description: "The new installation has been successfully added.",
    });
  };

  const viewDetails = (id: number) => {
    navigate(`/portals/${id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Portals & Installations</h1>
        
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
