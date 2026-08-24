'use client';

import { Suspense, useTransition, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCompanies } from '@/hooks/use-companies';
import { CompanyTable } from '@/components/companies/company-table';
import { CompanyPagination } from '@/components/companies/company-pagination';
import { CompanySearch } from '@/components/companies/company-search';
import { CreateCompanyDialog } from '@/components/companies/create-company-dialog';
import { ThemeToggle } from '@/components/theme-toggle';

function CompaniesContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get('search') || '';
  const parsedPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const { data, isLoading, isError, isFetching } = useCompanies({
    search,
    page,
    sortBy,
    sortOrder,
  });

  // Fallback for out-of-bounds pagination
  useEffect(() => {
    if (data && data.data.length === 0 && page > 1) {
      const params = new URLSearchParams(searchParams.toString());
      const targetPage = Math.max(1, data.meta.totalPages);
      params.set('page', targetPage.toString());
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [data, page, pathname, replace, searchParams]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('search', value);
    else params.delete('search');
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams);
    if (sortBy === column) {
      params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sortBy', column);
      params.set('sortOrder', 'desc');
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <CompanySearch defaultValue={search} onSearch={handleSearch} />
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <CompanyTable
          data={data?.data}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          searchQuery={search}
          onClearSearch={clearSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
        {data?.meta && (
          <div className="p-4 border-t border-border flex justify-end">
            <CompanyPagination
              meta={data.meta}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default function CompaniesPage() {
  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Companies</h1>
          <p className="text-sm text-muted-foreground">Manage your company directory and details.</p>
        </div>
        <div className="flex items-center gap-3">
          <CreateCompanyDialog />
          <ThemeToggle />
        </div>
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg"></div>}>
        <CompaniesContent />
      </Suspense>
    </main>
  );
}
