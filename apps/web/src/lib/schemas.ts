import { z } from 'zod';

export const createCompanySchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  website: z.string().url('Enter a valid website URL, like https://acme.com').max(255),
  industry: z.string().min(1, 'Industry is required').max(100),
  employeeCount: z.coerce.number().int().min(0, 'Employee count cannot be negative'),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
