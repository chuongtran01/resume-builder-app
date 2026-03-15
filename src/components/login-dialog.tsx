'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GoogleIcon } from '@/components/auth/google-icon';

export interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueWithEmail?: () => void;
}

export function LoginDialog({
  open,
  onOpenChange,
  onContinueWithEmail,
}: LoginDialogProps): React.ReactElement {
  const handleContinueWithEmail = (): void => {
    onOpenChange(false);
    onContinueWithEmail?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Logo */}
        <p className="font-serif text-2xl text-[#1A1714] text-left">
          Craft
        </p>

        {/* Title & subtitle */}
        <div className="text-left">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Start Building.
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create free account
          </p>
        </div>

        {/* Social login */}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-none font-sans text-sm gap-2 border-[#D6D0C8]"
          >
            <GoogleIcon className="h-[18px] w-[18px]" />
            Continue with Google
          </Button>
        </div>

        {/* OR separator */}
        <div className="relative flex items-center py-1">
          <Separator className="bg-[#D6D0C8]" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-xs font-sans text-muted-foreground">
            OR
          </span>
        </div>

        {/* Continue with email (primary) */}
        <Button
          type="button"
          onClick={handleContinueWithEmail}
          className="w-full rounded-none bg-[#C4622D] text-white hover:opacity-90 transition-opacity duration-150 font-sans text-sm"
        >
          Continue with email
        </Button>

        {/* Legal */}
        <p className="text-xs font-sans text-muted-foreground text-center">
          By continuing, you agree to the{' '}
          <Link href="#" className="text-[#C4622D] hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-[#C4622D] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
