import { Button } from '@/components/ui/button';
import { PaginatedMeta } from '@/lib/types';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface CompanyPaginationProps {
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
}

const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export function CompanyPagination({ meta, onPageChange }: CompanyPaginationProps) {
  const { page, totalPages, totalItems, limit } = meta;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems);

  const pages = generatePagination(page, totalPages);

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm text-muted-foreground hidden sm:block">
        Showing <span className="font-medium text-foreground">{totalItems === 0 ? 0 : start}</span>{' '}
        to <span className="font-medium text-foreground">{end}</span> of{' '}
        <span className="font-medium text-foreground">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 border-border text-muted-foreground p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {pages.map((p, i) => {
          if (p === '...') {
            return (
              <div
                key={`ellipsis-${i}`}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          const pageNumber = p as number;
          const isCurrentPage = pageNumber === page;

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className={`h-8 w-8 p-0 ${
                isCurrentPage
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 border-border text-muted-foreground p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}
