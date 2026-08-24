import { Company, PaginatedResponse, ApiError } from './types';
import { CreateCompanyFormValues } from './schemas';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 204) {
    return null as unknown as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.statusCode || response.status,
      data?.error || response.statusText,
      Array.isArray(data?.message) ? data.message : [data?.message || 'Something went wrong'],
    );
  }

  return data;
}

export const apiClient = {
  getCompanies: (params: { search?: string; page: number; sortBy: string; sortOrder: string }) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    searchParams.set('page', params.page.toString());
    searchParams.set('sortBy', params.sortBy);
    searchParams.set('sortOrder', params.sortOrder);

    return fetchApi<PaginatedResponse<Company>>(`/companies?${searchParams.toString()}`);
  },

  createCompany: (data: CreateCompanyFormValues) => {
    return fetchApi<{ data: Company }>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteCompany: (id: string) => {
    return fetchApi<void>(`/companies/${id}`, {
      method: 'DELETE',
    });
  },
};
