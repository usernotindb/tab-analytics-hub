
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSoftware } from "@/hooks/use-software";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash, DollarSign, Database } from "lucide-react";
import { Software } from "@/utils/database/softwareOperations";

// Payment form component
const PaymentForm = ({ onComplete }: { onComplete: (data: Partial<Software>) => void }) => {
  const [formData, setFormData] = useState({
    customerId: 1,
    userId: "",
    customer: "",
    softwareName: "",
    version: "",
    licenseKey: "",
    licenses: 1,
    price: 0,
    status: 'paid' as const,
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'licenses' || name === 'price' || name === 'customerId' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    
    const softwareData = {
      ...formData,
      purchaseDate: today.toISOString().split('T')[0],
      expirationDate: nextYear.toISOString().split('T')[0],
      nextBillingDate: nextYear.toISOString().split('T')[0],
      cost: formData.price
    };
    
    onComplete(softwareData);
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
            placeholder="Enter User ID" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="customer" className="text-sm font-medium">Customer</label>
          <Input 
            id="customer" 
            name="customer" 
            value={formData.customer} 
            onChange={handleChange} 
            placeholder="Enter Customer Name" 
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="softwareName" className="text-sm font-medium">Software Name</label>
          <Input 
            id="softwareName" 
            name="softwareName" 
            value={formData.softwareName} 
            onChange={handleChange} 
            placeholder="Enter Software Name" 
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="version" className="text-sm font-medium">Version</label>
          <Input 
            id="version" 
            name="version" 
            value={formData.version} 
            onChange={handleChange} 
            placeholder="e.g., 2024.1" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="licenseKey" className="text-sm font-medium">License Key</label>
        <Input 
          id="licenseKey" 
          name="licenseKey" 
          value={formData.licenseKey} 
          onChange={handleChange} 
          placeholder="Enter License Key" 
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="licenses" className="text-sm font-medium">Number of Licenses</label>
          <Input 
            id="licenses" 
            name="licenses" 
            type="number" 
            min="1"
            value={formData.licenses} 
            onChange={handleChange} 
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            step="0.01" 
            min="0"
            value={formData.price} 
            onChange={handleChange} 
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">Status</label>
          <select 
            id="status" 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <textarea 
          id="notes" 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange} 
          placeholder="Additional notes about the software..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Add Software</Button>
      </div>
    </form>
  );
};

const PaidSoftware = () => {
  const { toast } = useToast();
  const {
    software,
    stats,
    isLoading,
    statsLoading,
    isAddingLoading,
    isDeletingLoading,
    addSoftwareRecord,
    deleteSoftwareRecord,
    updateSoftwareStatusRecord,
    searchTerm,
    setSearchTerm,
    isConfigured
  } = useSoftware();
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = async (id: number) => {
    try {
      await deleteSoftwareRecord(id);
    } catch (error) {
      console.error("Error deleting software:", error);
    }
  };

  const handleAddPayment = async (data: Partial<Software>) => {
    try {
      await addSoftwareRecord(data as Omit<Software, 'id' | 'created_at' | 'updated_at'>);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding software:", error);
    }
  };

  const handleStatusChange = async (id: number, status: Software['status']) => {
    try {
      await updateSoftwareStatusRecord(id, status);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'overdue':
      case 'expired':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading || statsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading software data...</div>
          <div className="text-sm text-muted-foreground mt-2">
            {isConfigured ? "Fetching from database" : "Loading demo data"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paid Software</h1>
          <div className="flex items-center gap-2 mt-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isConfigured ? "Connected to database" : "Using demo data"}
            </span>
          </div>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="space-x-2" disabled={isAddingLoading}>
              <Plus className="h-4 w-4" />
              <span>{isAddingLoading ? "Adding..." : "Add Software"}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Software License</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <PaymentForm onComplete={handleAddPayment} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalPaid.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.paidCount || 0} software packages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalPending.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingCount || 0} software packages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalOverdue.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.overdueCount || 0} software packages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalLicenses || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active licenses
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-slide-in">
        <CardContent className="p-6">
          <div className="flex items-center mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search software licenses..." 
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Software</TableHead>
                  <TableHead className="hidden md:table-cell">Version</TableHead>
                  <TableHead className="hidden md:table-cell">Licenses</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Next Billing</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {software.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No software licenses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  software.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.userId}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.softwareName}</div>
                          {item.licenseKey && (
                            <div className="text-xs text-muted-foreground">{item.licenseKey}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{item.version || "N/A"}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.licenses}</TableCell>
                      <TableCell className="hidden md:table-cell">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                          <span className="capitalize">{item.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{item.nextBillingDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isDeletingLoading}>
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
                              <Edit className="mr-2 h-4 w-4" />
                              Edit license
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'active')}>
                              Mark as Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'expired')}>
                              Mark as Expired
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(item.id)}
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

export default PaidSoftware;
