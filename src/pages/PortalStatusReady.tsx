
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Search, MoreHorizontal, Eye, Edit, Trash, CheckCircle } from "lucide-react";

interface Portal {
  id: number;
  userId: string;
  company: string;
  software: string;
  installationDate: string;
  installedBy: string;
  lastUpdated: string;
}

// Sample data of ready portals
const readyPortals: Portal[] = [
  {
    id: 1,
    userId: "14545807",
    company: "Azteca Tax Systems",
    software: "Xlink",
    installationDate: "2023-01-15",
    installedBy: "John Doe",
    lastUpdated: "2023-02-10",
  },
  {
    id: 2,
    userId: "14545808",
    company: "Global Tax Solutions",
    software: "TaxWeb",
    installationDate: "2023-03-05",
    installedBy: "Jane Smith",
    lastUpdated: "2023-03-20",
  },
  {
    id: 4,
    userId: "14545812",
    company: "Elite Tax Advisors",
    software: "TaxPro Premium",
    installationDate: "2023-02-18",
    installedBy: "Michael Johnson",
    lastUpdated: "2023-04-01",
  },
];

const PortalStatusReady = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPortals = readyPortals.filter((portal) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      portal.userId.toLowerCase().includes(searchTermLower) ||
      portal.company.toLowerCase().includes(searchTermLower) ||
      portal.software.toLowerCase().includes(searchTermLower) ||
      portal.installedBy.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Ready Portals</h1>
          <p className="text-muted-foreground mt-1">
            Showing all portals that are ready and fully installed
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-500 font-medium">{readyPortals.length} Ready</span>
        </div>
      </div>

      <Card className="animate-slide-in">
        <CardContent className="p-6">
          <div className="flex items-center mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search ready portals..." 
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
                  <TableHead className="hidden md:table-cell">Installation Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Installed By</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPortals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No ready portals found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPortals.map((portal) => (
                    <TableRow key={portal.id}>
                      <TableCell className="font-medium">{portal.userId}</TableCell>
                      <TableCell>{portal.company}</TableCell>
                      <TableCell>{portal.software}</TableCell>
                      <TableCell className="hidden md:table-cell">{portal.installationDate}</TableCell>
                      <TableCell className="hidden lg:table-cell">{portal.installedBy}</TableCell>
                      <TableCell className="hidden lg:table-cell">{portal.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/portals/${portal.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit portal
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
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

export default PortalStatusReady;
