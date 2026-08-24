export interface Company {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  employeeCount: number;
  createdAt: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export class ApiError extends Error {
  statusCode: number;
  error: string;
  messages: string[];

  constructor(statusCode: number, error: string, messages: string[]) {
    super(messages[0] || 'Unknown API Error');
    this.statusCode = statusCode;
    this.error = error;
    this.messages = messages;
  }
}
