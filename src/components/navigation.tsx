'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoginDialog } from '@/components/login-dialog';

export function Navigation(): React.ReactElement {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const router = useRouter();

  const handleContinueWithEmail = (): void => {
    router.push('/auth');
  };

  return (
    <>
      <nav className="border-b border-border bg-background">
        <div className="max-w-editorial mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-serif font-medium text-foreground hover:opacity-80 transition-opacity"
            >
              Craft
            </Link>

            {/* Center Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="#product" className="text-sm font-sans hover:underline transition-colors">
                Product
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-sans  hover:underline transition-colors"
              >
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm font-sans hover:underline transition-colors">
                Pricing
              </Link>
              <Link href="#blog" className="text-sm font-sans hover:underline transition-colors">
                Blog
              </Link>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="text-sm font-sans text-foreground border border-border px-4 py-2 rounded-sm hover:bg-foreground/5 transition-colors whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onContinueWithEmail={handleContinueWithEmail}
      />
    </>
  );
}
