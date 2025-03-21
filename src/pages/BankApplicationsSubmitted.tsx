
import { useState } from "react";
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
import { Search, MoreHorizontal, Eye, Download, Printer, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BankApplication {
  id: number;
  appId: string;
  userId: string;
  customer: string;
  bank: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  product: string;
}

// Sample data of submitted bank applications
const submittedApplications: BankApplication[] = [
  {
    id: 1,
    appId: "BA-2023-001",
    userId: "14545807",
    customer: "Azteca Tax Systems",
    bank: "First National Bank",
    submissionDate: "2023-01-20",
    status: 'approved',
    product: "Business Loan",
  },
  {
    id: 2,
    appId: "BA-2023-002",
    userId: "14545808",
    customer: "Global Tax Solutions",
    bank: "Citizens Bank",
    submissionDate: "2023-02-15",
    status: 'pending',
    product: "Line of Credit",
  },
  {
    id: 3,
    appId: "BA-2023-003",
    userId: "14545809",
    customer: "Premier Tax Services",
    bank: "Tax Refund Bank",
    submissionDate: "2023-03-10",
    status: 'approved',
    product: "Advance Loan",
  },
  {
    id: 4,
    appId: "BA-2023-004",
    userId: "14545810",
    customer: "Advanced Tax Pros",
    bank: "Capital One",
    submissionDate: "2023-03-25",
    status: 'rejected',
    product: "Business Credit Card",
  },
];

const BankApplicationsSubmitted = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = submittedApplications.filter((app) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      app.appId.toLowerCase().includes(searchTermLower) ||
      app.userId.toLowerCase().includes(searchTermLower) ||
      app.customer.toLowerCase().includes(searchTermLower) ||
      app.bank.toLowerCase().includes(searchTermLower) ||
      app.product.toLowerCase().includes(searchTermLower) ||
      app.status.toLowerCase().includes(searchTermLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Submitted Bank Applications</h1>
          <p className="text-muted-foreground mt-1">
            Showing all bank applications that have been submitted to financial institutions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-500 font-medium">{submittedApplications.length} Submitted</span>
        </div>
      </div>

      <Card className="animate-slide-in">
        <CardContent className="p-6">
          <div className="flex items-center mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search submitted applications..." 
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
                  <TableHead>App ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Bank</TableHead>
                  <TableHead className="hidden md:table-cell">Product</TableHead>
                  <TableHead className="hidden lg:table-cell">Submission Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No submitted applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.appId}</TableCell>
                      <TableCell>{app.userId}</TableCell>
                      <TableCell>{app.customer}</TableCell>
                      <TableCell className="hidden md:table-cell">{app.bank}</TableCell>
                      <TableCell className="hidden md:table-cell">{app.product}</TableCell>
                      <TableCell className="hidden lg:table-cell">{app.submissionDate}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getStatusBadge(app.status)}
                      </TableCell>
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
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Print application
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

export default BankApplicationsSubmitted;
