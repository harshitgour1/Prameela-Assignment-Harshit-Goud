import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Building2, Globe, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createCompanySchema, CreateCompanyFormValues } from '@/lib/schemas';
import { useCreateCompany } from '@/hooks/use-create-company';

const INDUSTRIES = [
  'Software',
  'SaaS',
  'Healthcare',
  'Finance',
  'Retail',
  'E-Commerce',
  'Logistics',
  'Supply Chain',
  'Manufacturing',
  'Other',
];

export function CreateCompanyDialog() {
  const [open, setOpen] = useState(false);
  const [isOtherIndustry, setIsOtherIndustry] = useState(false);
  const [customIndustry, setCustomIndustry] = useState('');
  const createMutation = useCreateCompany();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      companyName: '',
      website: '',
      industry: '',
      employeeCount: 0,
    },
  });

  const onSubmit = (data: any) => {
    const finalData = { ...data };
    if (isOtherIndustry && customIndustry.trim()) {
      finalData.industry = `Other - ${customIndustry.trim()}`;
    }
    
    createMutation.mutate(finalData as CreateCompanyFormValues, {
      onSuccess: () => {
        setOpen(false);
        reset();
        setIsOtherIndustry(false);
        setCustomIndustry('');
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
      setIsOtherIndustry(false);
      setCustomIndustry('');
      createMutation.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
        <Plus className="h-4 w-4 mr-2" />
        Add Company
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-xl overflow-hidden p-0 border-0 shadow-2xl">
        <div className="h-2 w-full bg-primary" />
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Add New Company</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter the details of the new company here. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {createMutation.isError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 flex items-center">
                <div className="h-2 w-2 rounded-full bg-destructive mr-2" />
                {createMutation.error instanceof Error ? createMutation.error.message : 'An error occurred'}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="font-semibold text-foreground">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="companyName" 
                    placeholder="Acme Corp" 
                    className={`pl-10 h-11 transition-all ${errors.companyName ? 'border-destructive focus-visible:ring-destructive bg-destructive/10' : 'focus-visible:ring-primary'}`}
                    {...register('companyName')} 
                  />
                </div>
                {errors.companyName && <p className="text-sm text-destructive font-medium">{errors.companyName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="font-semibold text-foreground">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="website" 
                    placeholder="https://acme.com" 
                    className={`pl-10 h-11 transition-all ${errors.website ? 'border-destructive focus-visible:ring-destructive bg-destructive/10' : 'focus-visible:ring-primary'}`}
                    {...register('website')} 
                  />
                </div>
                {errors.website && <p className="text-sm text-destructive font-medium">{errors.website.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="font-semibold text-foreground">Industry</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          setIsOtherIndustry(val === 'Other');
                        }} 
                        value={field.value}
                      >
                        <SelectTrigger className={`w-full pl-10 h-11 bg-background border transition-all ${errors.industry ? 'border-destructive focus:ring-destructive bg-destructive/10' : 'border-border hover:border-muted-foreground/30 focus:ring-primary focus:border-primary'}`}>
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false} sideOffset={8} align="start" className="bg-popover border border-border shadow-xl rounded-lg overflow-hidden w-[var(--anchor-width)]">
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.industry && <p className="text-sm text-destructive font-medium">{errors.industry.message}</p>}
              </div>

              {isOtherIndustry && (
                <div className="space-y-2">
                  <Label htmlFor="customIndustry" className="font-semibold text-foreground">Specify Industry</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="customIndustry" 
                      placeholder="e.g. Space Exploration" 
                      className="pl-10 h-11 transition-all focus-visible:ring-primary"
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="employeeCount" className="font-semibold text-foreground">Employee Count</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="employeeCount" 
                    type="number" 
                    min="0" 
                    placeholder="e.g. 1500"
                    className={`pl-10 h-11 transition-all ${errors.employeeCount ? 'border-destructive focus-visible:ring-destructive bg-destructive/10' : 'focus-visible:ring-primary'}`}
                    {...register('employeeCount')} 
                  />
                </div>
                {errors.employeeCount && <p className="text-sm text-destructive font-medium">{errors.employeeCount.message}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="h-11 px-6 rounded-lg font-medium text-muted-foreground border-border">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="h-11 px-8 rounded-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-md">
                {createMutation.isPending ? 'Saving...' : 'Save Company'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
