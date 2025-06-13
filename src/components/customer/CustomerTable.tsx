
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Customer } from "@/types/customer";
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { ExportButton } from "@/components/common/ExportButton";

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (id: number) => void;
}

export const CustomerTable = ({ customers, onDelete }: CustomerTableProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (id: number) => {
    navigate(`/customers/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Customer List</h2>
        <ExportButton 
          data={customers} 
          filename="customers" 
          type="customers"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Portal</TableHead>
              <TableHead className="hidden lg:table-cell">Bank App</TableHead>
              <TableHead className="hidden lg:table-cell">Software</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.userId}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className={`w-3 h-3 rounded-full ${customer.portalReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className={`w-3 h-3 rounded-full ${customer.bankAppSubmitted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className={`w-3 h-3 rounded-full ${customer.softwarePaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 z-50">
                        <DropdownMenuItem onClick={() => handleViewDetails(customer.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(customer.id)}
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
    </div>
  );
};
