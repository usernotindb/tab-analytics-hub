
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Search, MoreHorizontal, Eye, Edit, Trash, XCircle, AlertTriangle } from "lucide-react";
import { getPortalsByStatus } from "@/lib/api-service";
import { Portal } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";

const PortalStatusNotReady = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: notReadyPortals = [], isLoading, error } = useQuery({
    queryKey: ['portals', 'installed', false],
    queryFn: () => getPortalsByStatus(false),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load not ready portals. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredPortals = notReadyPortals.filter((portal) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      portal.userId.toLowerCase().includes(searchTermLower) ||
      portal.company.toLowerCase().includes(searchTermLower) ||
      portal.software.toLowerCase().includes(searchTermLower) ||
      portal.type.toLowerCase().includes(searchTermLower)
    );
  });

  const getStatusIcon = (portal: Portal) => {
    if (!portal.installed) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = (portal: Portal) => {
    if (!portal.installed) {
      return "Not Installed";
    }
    return "Installation Pending";
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
          <span className="text-red-500 font-medium">
            {isLoading ? "Loading..." : `${notReadyPortals.length} Not Ready`}
          </span>
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
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPortals.length === 0 ? (
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
                          {getStatusIcon(portal)}
                          <span>{getStatusText(portal)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(portal.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{portal.type}</TableCell>
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
