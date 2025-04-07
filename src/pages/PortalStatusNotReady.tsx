
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
import { Search, MoreHorizontal, Eye, Edit, Trash, XCircle, AlertTriangle } from "lucide-react";

interface Portal {
  id: number;
  userId: string;
  company: string;
  software: string;
  creationDate: string;
  status: string;
  reason: string;
}

// Sample data of not ready portals
const notReadyPortals: Portal[] = [
  {
    id: 3,
    userId: "14545809",
    company: "Premier Tax Services",
    software: "TaxPro",
    creationDate: "2023-01-25",
    status: "Pending Installation",
    reason: "Awaiting customer confirmation",
  },
  {
    id: 5,
    userId: "14545813",
    company: "Fast Tax Returns",
    software: "TaxSuite",
    creationDate: "2023-02-28",
    status: "Installation Failed",
    reason: "Compatibility issues with existing software",
  },
  {
    id: 6,
    userId: "14545814",
    company: "Pro Tax Advisors",
    software: "TaxWeb",
    creationDate: "2023-03-15",
    status: "Setup Required",
    reason: "Missing user credentials",
  },
];

const PortalStatusNotReady = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPortals = notReadyPortals.filter((portal) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      portal.userId.toLowerCase().includes(searchTermLower) ||
      portal.company.toLowerCase().includes(searchTermLower) ||
      portal.software.toLowerCase().includes(searchTermLower) ||
      portal.status.toLowerCase().includes(searchTermLower) ||
      portal.reason.toLowerCase().includes(searchTermLower)
    );
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Installation":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "Installation Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Setup Required":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Not Ready Portals</h1>
          <p className="text-muted-foreground mt-1">
            Showing all portals that require attention or are not fully installed
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-500 font-medium">{notReadyPortals.length} Not Ready</span>
        </div>
      </div>

      <Card className="animate-slide-in">
        <CardContent className="p-6">
          <div className="flex items-center mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search not ready portals..." 
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
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Creation Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPortals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No portals found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPortals.map((portal) => (
                    <TableRow key={portal.id}>
                      <TableCell className="font-medium">{portal.userId}</TableCell>
                      <TableCell>{portal.company}</TableCell>
                      <TableCell>{portal.software}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(portal.status)}
                          <span>{portal.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{portal.creationDate}</TableCell>
                      <TableCell className="hidden lg:table-cell">{portal.reason}</TableCell>
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

export default PortalStatusNotReady;
