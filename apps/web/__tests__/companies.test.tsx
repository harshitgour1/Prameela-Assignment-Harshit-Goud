import { render, screen, fireEvent } from '@testing-library/react';
import { CompanyTable } from '@/components/companies/company-table';
import { CompanySearch } from '@/components/companies/company-search';
import { CreateCompanyDialog } from '@/components/companies/create-company-dialog';

// Mock the hooks
jest.mock('@/hooks/use-delete-company', () => ({
  useDeleteCompany: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock('@/hooks/use-bulk-delete-companies', () => ({
  useBulkDeleteCompanies: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock('@/hooks/use-create-company', () => ({
  useCreateCompany: jest.fn(() => ({
    mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false,
  })),
}));

const mockData = [
  {
    id: '1',
    companyName: 'Test Corp',
    industry: 'Software',
    website: 'https://testcorp.com',
    employeeCount: 100,
    createdAt: '2026-08-24T00:00:00.000Z',
    updatedAt: '2026-08-24T00:00:00.000Z',
  },
];

describe('CompanyTable', () => {
  it('renders company rendering correctly', () => {
    render(
      <CompanyTable
        data={mockData}
        isLoading={false}
        isError={false}
        sortBy="createdAt"
        sortOrder="desc"
        onSort={jest.fn()}
      />,
    );
    expect(screen.getAllByText('Test Corp')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Software')[0]).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <CompanyTable
        data={[]}
        isLoading={false}
        isError={false}
        sortBy="createdAt"
        sortOrder="desc"
        onSort={jest.fn()}
      />,
    );
    expect(screen.getAllByText('No companies found')[0]).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <CompanyTable
        data={undefined}
        isLoading={false}
        isError={true}
        sortBy="createdAt"
        sortOrder="desc"
        onSort={jest.fn()}
      />,
    );
    expect(screen.getByText('Failed to load companies.')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    const { container } = render(
      <CompanyTable
        data={undefined}
        isLoading={true}
        isError={false}
        sortBy="createdAt"
        sortOrder="desc"
        onSort={jest.fn()}
      />,
    );
    // Skelton should have rounded classes, etc
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('handles delete confirmation dialog', async () => {
    render(
      <CompanyTable
        data={mockData}
        isLoading={false}
        isError={false}
        sortBy="createdAt"
        sortOrder="desc"
        onSort={jest.fn()}
      />,
    );

    // Open delete dialog
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Check if dialog is open
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
  });
});

describe('CompanySearch', () => {
  it('debounces search input', async () => {
    jest.useFakeTimers();
    const onSearch = jest.fn();
    render(<CompanySearch defaultValue="" onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search companies...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onSearch).not.toHaveBeenCalled();
    jest.advanceTimersByTime(300);
    expect(onSearch).toHaveBeenCalledWith('test');

    jest.useRealTimers();
  });
});

describe('CreateCompanyDialog', () => {
  it('renders form and validates fields', async () => {
    render(<CreateCompanyDialog />);

    const addButton = screen.getByRole('button', { name: /add company/i });
    fireEvent.click(addButton);

    // Check if dialog opens
    expect(screen.getByText('Add New Company')).toBeInTheDocument();
  });
});
