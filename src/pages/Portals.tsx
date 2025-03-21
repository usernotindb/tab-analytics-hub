
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data - in a real app, this would come from your API
const portalData = [
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

const Portals = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Portals & Installations</h1>
        
        <Button className="space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Installation</span>
        </Button>
      </div>

      <Card className="animate-slide-in">
        <CardContent className="p-6">
          <div className="flex items-center mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search portals and installations..." 
                className="pl-10" 
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
                {portalData.map((portal) => (
                  <TableRow key={portal.id}>
                    <TableCell className="font-medium">{portal.userId}</TableCell>
                    <TableCell>{portal.company}</TableCell>
                    <TableCell>{portal.software}</TableCell>
                    <TableCell className="hidden md:table-cell">{portal.type}</TableCell>
                    <TableCell className="hidden md:table-cell">{portal.userType}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className={`w-3 h-3 rounded-full ${portal.installed ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit installation</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portals;
