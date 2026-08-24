import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CompanySearchProps {
  defaultValue?: string;
  onSearch: (value: string) => void;
}

export function CompanySearch({ defaultValue = '', onSearch }: CompanySearchProps) {
  const [value, setValue] = useState(defaultValue);

  // Sync internal state if URL changes externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Only trigger onSearch if the value actually changed from the defaultValue
      // (prevents double fetching on mount)
      if (value !== defaultValue) {
        onSearch(value);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [value, onSearch, defaultValue]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search companies..."
        className="pl-9 pr-10 bg-background border-border focus-visible:ring-primary"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors focus:outline-none"
          onClick={() => {
            setValue('');
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
