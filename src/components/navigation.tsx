'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut } from 'lucide-react';
import { LoginDialog } from '@/components/login-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

function displayName(user: {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}): string {
  if (user.firstName?.trim() && user.lastName?.trim()) {
    return `${user.firstName.trim()} ${user.lastName.trim()}`;
  }
  if (user.firstName?.trim()) return user.firstName.trim();
  if (user.lastName?.trim()) return user.lastName.trim();
  return user.name ?? user.email ?? '';
}

export function Navigation(): React.ReactElement {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loginOpen, setLoginOpen] = React.useState(false);

  const handleContinueWithEmail = (): void => {
    router.push('/auth');
  };

  const handleSignOut = (): void => {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
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

            {/* CTA or User Menu */}
            {!isPending && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-sm border-border font-sans text-sm"
                  >
                    <span className="truncate max-w-[120px]">
                      {displayName(session.user)}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {displayName(session.user) && (
                        <span className="text-sm font-medium">{displayName(session.user)}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{session.user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="text-sm font-sans text-foreground border border-border px-4 py-2 rounded-sm hover:bg-foreground/5 transition-colors whitespace-nowrap"
              >
                Get Started
              </button>
            )}
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
