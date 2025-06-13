
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationHelper, PaginatedResult } from "@/utils/performance/pagination";

interface PaginationControlsProps {
  pagination: PaginatedResult<any>['pagination'];
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationControls = ({ pagination, onPageChange, className }: PaginationControlsProps) => {
  const { page, pages, hasNext, hasPrevious, total, limit } = pagination;
  const pageNumbers = PaginationHelper.getPageNumbers(page, pages, 5);
  const paginationText = PaginationHelper.getPaginationText(page, limit, total);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="text-sm text-gray-600">
        {paginationText}
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasPrevious) onPageChange(page - 1);
              }}
              className={!hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {pageNumbers[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(1);
                  }}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {pageNumbers[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}
          
          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNumber);
                }}
                isActive={pageNumber === page}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {pageNumbers[pageNumbers.length - 1] < pages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < pages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(pages);
                  }}
                  className="cursor-pointer"
                >
                  {pages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasNext) onPageChange(page + 1);
              }}
              className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
