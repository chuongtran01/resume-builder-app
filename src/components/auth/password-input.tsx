'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface PasswordInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  error?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
      <div className="relative">
        <Input
          type={show ? 'text' : 'password'}
          ref={ref}
          className={cn(
            'rounded-none border-[#D6D0C8] pr-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#C4622D] transition-colors duration-150',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1A1714]/50 hover:text-[#1A1714] p-1"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
