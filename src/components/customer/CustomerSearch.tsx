
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FilterIcon } from "lucide-react";
import { useState } from "react";
import { FilterDialog, CustomerFilters } from "./FilterDialog";

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
}

export const CustomerSearch = ({ 
  searchTerm, 
  onSearchChange,
  filters,
  onFiltersChange
}: CustomerSearchProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => value !== null).length;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        onClick={() => setIsFilterOpen(true)}
        className="relative"
      >
        <Search className="h-4 w-4 mr-2" />
        Filter
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <FilterDialog
        filters={filters}
        onFiltersChange={onFiltersChange}
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
      />
    </div>
  );
};
