
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash, DollarSign } from "lucide-react";

interface Software {
  id: number;
  userId: string;
  customer: string;
  software: string;
  licenses: number;
  price: number;
  status: 'paid' | 'pending' | 'overdue';
  purchaseDate: string;
  nextBillingDate: string;
}

const sampleSoftware: Software[] = [
  {
    id: 1,
    userId: "14545807",
    customer: "Azteca Tax Systems",
    software: "TaxPro Premium",
    licenses: 3,
    price: 599.99,
    status: 'paid',
    purchaseDate: "2023-01-15",
    nextBillingDate: "2024-01-15",
  },
  {
    id: 2,
    userId: "14545808",
    customer: "Global Tax Solutions",
    software: "TaxWeb Enterprise",
    licenses: 5,
    price: 1299.99,
    status: 'pending',
    purchaseDate: "2023-03-10",
    nextBillingDate: "2024-03-10",
  },
  {
    id: 3,
    userId: "14545809",
    customer: "Premier Tax Services",
    software: "TaxPro Basic",
    licenses: 2,
    price: 299.99,
    status: 'overdue',
    purchaseDate: "2023-02-20",
    nextBillingDate: "2024-02-20",
  },
];

// Payment form component
const PaymentForm = ({ onComplete }: { onComplete: (data: Partial<Software>) => void }) => {
  const [formData, setFormData] = useState({
    userId: "",
    customer: "",
    software: "",
    licenses: 1,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'licenses' || name === 'price' ? Number(value) : value 
    }));
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

      <div className="flex justify-end">
        <Button type="submit">Add Payment</Button>
      </div>
    </form>
  );
};

const PaidSoftware = () => {
  const { toast } = useToast();
  const [software, setSoftware] = useState<Software[]>(sampleSoftware);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredSoftware = software.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      item.userId.toLowerCase().includes(searchTermLower) ||
      item.customer.toLowerCase().includes(searchTermLower) ||
      item.software.toLowerCase().includes(searchTermLower)
    );
  });

  const handleDelete = (id: number) => {
    setSoftware(software.filter(item => item.id !== id));
    toast({
      title: "Software payment deleted",
      description: "The payment record has been successfully removed.",
    });
  };

  const handleAddPayment = (data: Partial<Software>) => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    
    const newSoftware: Software = {
      id: software.length + 1,
      userId: data.userId || "",
      customer: data.customer || "",
      software: data.software || "",
      licenses: data.licenses || 1,
      price: data.price || 0,
      status: 'paid',
      purchaseDate: today.toISOString().split('T')[0],
      nextBillingDate: nextYear.toISOString().split('T')[0],
    };
    
    setSoftware([...software, newSoftware]);
    setIsFormOpen(false);
    toast({
      title: "Payment added",
      description: "The new software payment has been successfully recorded.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Paid Software</h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Payment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Software Payment</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <PaymentForm onComplete={handleAddPayment} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${software.filter(s => s.status === 'paid').reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {software.filter(s => s.status === 'paid').length} software packages
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
              ${software.filter(s => s.status === 'pending').reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {software.filter(s => s.status === 'pending').length} software packages
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
              ${software.filter(s => s.status === 'overdue').reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {software.filter(s => s.status === 'overdue').length} software packages
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
                placeholder="Search software payments..." 
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
                  <TableHead className="hidden md:table-cell">Licenses</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Next Billing</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSoftware.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No software payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSoftware.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.userId}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell>{item.software}</TableCell>
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
                              <Edit className="mr-2 h-4 w-4" />
                              Edit payment
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
