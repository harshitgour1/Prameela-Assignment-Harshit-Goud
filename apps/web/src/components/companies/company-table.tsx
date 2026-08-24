import { useState } from 'react';
import { Company } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useDeleteCompany } from '@/hooks/use-delete-company';
import { useBulkDeleteCompanies } from '@/hooks/use-bulk-delete-companies';
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2, ExternalLink, Search, MoreHorizontal, Globe, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CompanyTableProps {
  data?: Company[];
  isLoading: boolean;
  isFetching?: boolean;
  isError: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
  sortBy: string;
  sortOrder: string;
  onSort: (column: string) => void;
}

const getIndustryBadge = (industry: string) => {
  const lower = industry.toLowerCase();
  if (lower.includes('software') || lower.includes('saas')) return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300';
  if (lower.includes('finance')) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
  if (lower.includes('health')) return 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300';
  if (lower.includes('retail') || lower.includes('commerce')) return 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
  return 'bg-gray-100 text-gray-700 dark:bg-muted dark:text-muted-foreground';
};

export function CompanyTable({ 
  data, 
  isLoading, 
  isFetching,
  isError, 
  searchQuery, 
  onClearSearch, 
  sortBy, 
  sortOrder, 
  onSort 
}: CompanyTableProps) {
  const deleteMutation = useDeleteCompany();
  const bulkDeleteMutation = useBulkDeleteCompanies();
  const [companyToDelete, setCompanyToDelete] = useState<{id: string, name: string} | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-foreground" /> : <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-foreground" />;
  };

  const handleDelete = () => {
    if (companyToDelete) {
      deleteMutation.mutate(companyToDelete.id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(companyToDelete.id);
        return next;
      });
      setCompanyToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0 && confirm(`Are you sure you want to delete ${selectedIds.size} selected companies?`)) {
      bulkDeleteMutation.mutate(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const toggleSelectAll = () => {
    if (!data) return;
    
    // Check if all items on the current page are already selected
    const allOnPageSelected = data.length > 0 && data.every(c => selectedIds.has(c.id));
    
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        // Deselect all on current page
        data.forEach(c => next.delete(c.id));
      } else {
        // Select all on current page
        data.forEach(c => next.add(c.id));
      }
      return next;
    });
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isError) {
    return (
      <div className="p-16 text-center flex flex-col items-center justify-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
          <Trash2 className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-foreground font-semibold text-lg">Failed to load companies.</p>
        <p className="text-sm text-muted-foreground max-w-sm">There was an issue connecting to the database. Please check your network and try again.</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md"
        >
          Reload Page
        </Button>
      </div>
    );
  }

  const allSelected = !!(data && data.length > 0 && data.every(c => selectedIds.has(c.id)));
  const someSelected = !!(data && data.some(c => selectedIds.has(c.id)) && !allSelected);

  return (
    <div className="w-full bg-transparent">
      <AlertDialog open={!!companyToDelete} onOpenChange={(open) => !open && setCompanyToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong className="text-foreground">{companyToDelete?.name}</strong>? This action cannot be undone and will permanently remove this company from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top-2 fade-in duration-200">
          <span className="text-sm font-medium text-primary">
            {selectedIds.size} compan{selectedIds.size === 1 ? 'y' : 'ies'} selected
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleteMutation.isPending}
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md px-4"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="hidden sm:block overflow-x-auto px-2">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="border-b-0">
              <TableHead className="w-12 px-4 py-5">
                  <Checkbox 
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  className="rounded-[4px]"
                />
              </TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider py-5 group cursor-pointer" onClick={() => onSort('companyName')}>
                <div className="flex items-center">
                  Company Name {renderSortIcon('companyName')}
                </div>
              </TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider py-5">Industry</TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider py-5 hidden md:table-cell">Website</TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider py-5 group cursor-pointer text-center hidden sm:table-cell" onClick={() => onSort('employeeCount')}>
                <div className="flex items-center justify-center">
                  Employees {renderSortIcon('employeeCount')}
                </div>
              </TableHead>
              <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wider py-5 group cursor-pointer hidden lg:table-cell" onClick={() => onSort('createdAt')}>
                <div className="flex items-center">
                  Created At {renderSortIcon('createdAt')}
                </div>
              </TableHead>
              <TableHead className="text-center font-medium text-muted-foreground text-xs uppercase tracking-wider py-5 w-[100px] hidden sm:table-cell">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={`transition-opacity duration-200 ${isFetching && !isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b-0 hover:bg-transparent">
                  <TableCell className="px-4 py-4"><Skeleton className="h-4 w-4 rounded" /></TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4"><Skeleton className="h-6 w-24 rounded-md" /></TableCell>
                  <TableCell className="py-4 hidden md:table-cell"><Skeleton className="h-6 w-24 rounded-md" /></TableCell>
                  <TableCell className="py-4 text-center hidden sm:table-cell"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="py-4 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="py-4 text-center hidden sm:table-cell"><Skeleton className="h-8 w-16 mx-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : data?.length === 0 ? (
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell colSpan={7} className="h-64">
                  <div className="flex flex-col items-center justify-center space-y-4 h-full">
                    {searchQuery ? (
                      <>
                        <p className="text-muted-foreground font-medium text-lg">No companies match "{searchQuery}"</p>
                        {onClearSearch && (
                          <Button 
                            variant="outline" 
                            onClick={onClearSearch}
                            className="mt-2 rounded-md"
                          >
                            Clear search filter
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-2">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-foreground font-semibold text-lg">No companies found</p>
                        <p className="text-sm text-muted-foreground">Get started by adding your first company to the directory.</p>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.map((company) => {
                const isSelected = selectedIds.has(company.id);
                const isDeleting = (deleteMutation.isPending && deleteMutation.variables === company.id) || 
                                   (bulkDeleteMutation.isPending && selectedIds.has(company.id));
                const initial = company.companyName.charAt(0).toUpperCase();
                
                return (
                  <TableRow 
                    key={company.id} 
                    className={`border-b-0 transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'} ${isDeleting ? 'opacity-40' : ''}`}
                  >
                    <TableCell className="px-4 py-4 w-12">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectRow(company.id)}
                        className="rounded-[4px]"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <Popover>
                        <PopoverTrigger className="flex items-center space-x-3 cursor-pointer group focus:outline-none text-left">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shadow-sm border border-background">
                              {initial}
                            </div>
                            <span className="font-semibold text-foreground text-[15px] group-hover:text-primary transition-colors">{company.companyName}</span>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 max-w-[calc(100vw-2rem)] p-0 overflow-hidden rounded-2xl border-border shadow-xl" sideOffset={8} align="start">
                          <div className="h-20 w-full bg-primary/10 relative">
                            {/* Decorative sparkles effect */}
                            <div className="absolute top-2 right-4 w-1 h-1 bg-primary rounded-full opacity-70"></div>
                            <div className="absolute top-4 right-10 w-2 h-2 bg-primary rounded-full opacity-50 blur-[1px]"></div>
                            <div className="absolute top-8 right-6 w-1 h-1 bg-primary rounded-full opacity-80"></div>
                          </div>
                          <div className="px-5 pb-5 relative">
                            <div className="absolute -top-10 left-5 h-20 w-20 rounded-full bg-card p-1 shadow-sm z-10">
                              <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                                {initial}
                              </div>
                            </div>
                            <div className="pt-14 flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-bold text-foreground">{company.companyName}</h4>
                                <p className="text-sm text-primary font-medium mb-4">{company.industry}</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-sm">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <a href={company.website} target="_blank" rel="noreferrer" className="text-foreground hover:text-primary truncate flex items-center gap-1">
                                  {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">{company.employeeCount.toLocaleString()} employees</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">Added {format(new Date(company.createdAt), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-medium ${getIndustryBadge(company.industry)}`}>
                        {company.industry}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 hidden md:table-cell">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-md text-[13px] font-medium text-foreground hover:bg-muted hover:border-muted-foreground/30 transition-colors"
                      >
                        {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    </TableCell>
                    <TableCell className="py-4 text-center font-medium text-foreground text-[15px] hidden sm:table-cell">
                      {company.employeeCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground text-[14px] font-medium hidden lg:table-cell">
                      {format(new Date(company.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="py-4 text-center hidden sm:table-cell">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-md border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors px-3 font-medium"
                        onClick={() => setCompanyToDelete({ id: company.id, name: company.companyName })}
                        disabled={isDeleting}
                      >
                        Delete
                        <Trash2 className="h-3 w-3 ml-1.5 opacity-60" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View (Industry Standard for Data Directories) */}
      <div className="block sm:hidden p-4 space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))
        ) : data?.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center justify-center shadow-sm">
            {searchQuery ? (
              <>
                <p className="text-muted-foreground font-medium text-lg mb-4">No match found</p>
                {onClearSearch && (
                  <Button variant="outline" onClick={onClearSearch} className="rounded-md">
                    Clear search filter
                  </Button>
                )}
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-foreground font-semibold">No companies found</p>
              </>
            )}
          </div>
        ) : (
          data?.map((company) => {
            const isSelected = selectedIds.has(company.id);
            const isDeleting = (deleteMutation.isPending && deleteMutation.variables === company.id) || 
                               (bulkDeleteMutation.isPending && selectedIds.has(company.id));
            const initial = company.companyName.charAt(0).toUpperCase();

            return (
              <div 
                key={company.id} 
                className={`bg-card border rounded-xl p-4 shadow-sm transition-colors ${isSelected ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border'} ${isDeleting ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground border border-background shadow-sm">
                      {initial}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-[15px]">{company.companyName}</h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${getIndustryBadge(company.industry)}`}>
                        {company.industry}
                      </span>
                    </div>
                  </div>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => toggleSelectRow(company.id)}
                    className="rounded-[4px] mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-4 bg-muted/30 p-3 rounded-lg border border-border/50">
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold mb-0.5">Employees</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5"><Users className="h-3 w-3 text-muted-foreground"/> {company.employeeCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold mb-0.5">Added</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3 text-muted-foreground"/> {format(new Date(company.createdAt), 'MMM d, yy')}</p>
                  </div>
                  <div className="col-span-2 pt-2 mt-1 border-t border-border/50">
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium text-[13px] flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive px-3 font-medium rounded-md w-full sm:w-auto border border-destructive/20"
                    onClick={() => setCompanyToDelete({ id: company.id, name: company.companyName })}
                    disabled={isDeleting}
                  >
                    Delete Company
                    <Trash2 className="h-3 w-3 ml-2 opacity-70" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
