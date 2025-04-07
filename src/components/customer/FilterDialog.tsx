
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export interface CustomerFilters {
  portalReady: boolean | null;
  bankAppSubmitted: boolean | null;
  softwarePaid: boolean | null;
}

interface FilterDialogProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FilterDialog = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onOpenChange 
}: FilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<CustomerFilters>(filters);

  const handleFilterChange = (key: keyof CustomerFilters, value: boolean | null) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleFilter = (key: keyof CustomerFilters) => {
    // Cycle through true -> false -> null (unset)
    const currentValue = localFilters[key];
    let newValue: boolean | null;
    
    if (currentValue === true) newValue = false;
    else if (currentValue === false) newValue = null;
    else newValue = true;
    
    handleFilterChange(key, newValue);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const resetFilters = () => {
    const resetValues: CustomerFilters = {
      portalReady: null,
      bankAppSubmitted: null,
      softwarePaid: null
    };
    setLocalFilters(resetValues);
    onFiltersChange(resetValues);
  };

  const getFilterStateLabel = (value: boolean | null): string => {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "Any";
  };

  const getFilterStateClass = (value: boolean | null): string => {
    if (value === true) return "bg-green-100 text-green-800 border-green-300";
    if (value === false) return "bg-red-100 text-red-800 border-red-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Customers</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="portal-filter" className="text-sm font-medium">Portal Ready</Label>
              <button
                onClick={() => toggleFilter("portalReady")}
                className={`px-2 py-0.5 text-xs rounded border ${getFilterStateClass(localFilters.portalReady)}`}
              >
                {getFilterStateLabel(localFilters.portalReady)}
              </button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bank-app-filter" className="text-sm font-medium">Bank App Submitted</Label>
              <button
                onClick={() => toggleFilter("bankAppSubmitted")}
                className={`px-2 py-0.5 text-xs rounded border ${getFilterStateClass(localFilters.bankAppSubmitted)}`}
              >
                {getFilterStateLabel(localFilters.bankAppSubmitted)}
              </button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="software-filter" className="text-sm font-medium">Software Paid</Label>
              <button
                onClick={() => toggleFilter("softwarePaid")}
                className={`px-2 py-0.5 text-xs rounded border ${getFilterStateClass(localFilters.softwarePaid)}`}
              >
                {getFilterStateLabel(localFilters.softwarePaid)}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
          <Button onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
