'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/auth/password-input';
import { GoogleIcon } from '@/components/auth/google-icon';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const LABEL_CLASS =
  'text-[10px] uppercase tracking-widest text-[#1A1714]/50 font-sans';
const INPUT_CLASS =
  'rounded-none border-[#D6D0C8] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#C4622D] transition-colors duration-150';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type Tab = 'signin' | 'signup';

export function AuthForm(): React.ReactElement {
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>('signin');
  const [success, setSuccess] = React.useState<'signin' | 'signup' | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  // Sign In
  const [signInEmail, setSignInEmail] = React.useState('');
  const [signInPassword, setSignInPassword] = React.useState('');
  const [signInErrors, setSignInErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});

  // Sign Up
  const [signUpFirstName, setSignUpFirstName] = React.useState('');
  const [signUpLastName, setSignUpLastName] = React.useState('');
  const [signUpEmail, setSignUpEmail] = React.useState('');
  const [signUpPassword, setSignUpPassword] = React.useState('');
  const [signUpConfirm, setSignUpConfirm] = React.useState('');
  const [signUpErrors, setSignUpErrors] = React.useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const resetForms = React.useCallback(() => {
    setSignInEmail('');
    setSignInPassword('');
    setSignInErrors({});
    setSignUpFirstName('');
    setSignUpLastName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpConfirm('');
    setSignUpErrors({});
    setAuthError(null);
  }, []);

  const switchTab = (newTab: Tab): void => {
    setTab(newTab);
    resetForms();
  };

  const handleSignInSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setAuthError(null);
    const errors: { email?: string; password?: string } = {};
    if (!signInEmail.trim()) errors.email = 'Email is required';
    else if (!isValidEmail(signInEmail)) errors.email = 'Enter a valid email address';
    if (!signInPassword) errors.password = 'Password is required';
    setSignInErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    void authClient.signIn.email(
      {
        email: signInEmail.trim(),
        password: signInPassword,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setLoading(false);
          setSuccess('signin');
        },
        onError: (ctx) => {
          setLoading(false);
          setAuthError(ctx.error.message ?? 'Sign in failed');
        },
      }
    );
  };

  const handleSignUpSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setAuthError(null);
    const errors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirm?: string;
    } = {};
    if (!signUpFirstName.trim()) errors.firstName = 'First name is required';
    if (!signUpLastName.trim()) errors.lastName = 'Last name is required';
    if (!signUpEmail.trim()) errors.email = 'Email is required';
    else if (!isValidEmail(signUpEmail)) errors.email = 'Enter a valid email address';
    if (signUpPassword.length < 8) errors.password = 'Password must be at least 8 characters';
    if (signUpPassword !== signUpConfirm) errors.confirm = 'Passwords do not match';
    setSignUpErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const firstName = signUpFirstName.trim();
    const lastName = signUpLastName.trim();
    const name = `${firstName} ${lastName}`.trim() || signUpEmail.trim();
    void authClient.signUp.email(
      {
        email: signUpEmail.trim(),
        password: signUpPassword,
        name,
        firstName,
        lastName,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push('/');
        },
        onError: (ctx) => {
          setLoading(false);
          setAuthError(ctx.error.message ?? 'Sign up failed');
        },
      }
    );
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-12"
      >
        <Check className="h-10 w-10 text-[#C4622D]" strokeWidth={2} />
        <p className="font-serif text-[#1A1714] text-xl">
          {success === 'signin' ? "You're in." : 'Account created.'}
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <h1 className="font-serif text-2xl text-[#1A1714]">Craft</h1>
      <Separator className="my-4 bg-[#D6D0C8]" />
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => switchTab('signin')}
          className={cn(
            'py-2 text-sm font-sans text-[#1A1714] transition-colors',
            tab === 'signin'
              ? 'border-b-2 border-[#C4622D] font-medium'
              : 'opacity-40'
          )}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchTab('signup')}
          className={cn(
            'py-2 text-sm font-sans text-[#1A1714] transition-colors',
            tab === 'signup'
              ? 'border-b-2 border-[#C4622D] font-medium'
              : 'opacity-40'
          )}
        >
          Sign Up
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'signin' ? (
          <motion.form
            key="signin"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ exit: { duration: 0.15 }, enter: { duration: 0.2 } }}
            onSubmit={handleSignInSubmit}
            className="mt-6 flex flex-col gap-5"
          >
            <div className="space-y-2">
              <Label htmlFor="signin-email" className={LABEL_CLASS}>
                EMAIL
              </Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className={cn(INPUT_CLASS, signInErrors.email && 'border-red-400')}
              />
              {signInErrors.email && (
                <p className="text-xs font-sans text-red-500">
                  {signInErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password" className={LABEL_CLASS}>
                  PASSWORD
                </Label>
              </div>
              <PasswordInput
                id="signin-password"
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                error={!!signInErrors.password}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-[#C4622D] hover:underline font-sans"
                >
                  Forgot password?
                </button>
              </div>
              {signInErrors.password && (
                <p className="text-xs font-sans text-red-500">
                  {signInErrors.password}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none bg-[#C4622D] text-white hover:opacity-90 transition-opacity duration-150"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
            {authError && (
              <p className="text-xs font-sans text-red-500 border-l-2 border-red-400 pl-3">
                {authError}
              </p>
            )}
            <SeparatorWithOr />
            <OAuthButtons />
            <FooterSignIn onSwitch={() => switchTab('signup')} />
          </motion.form>
        ) : (
          <motion.form
            key="signup"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ exit: { duration: 0.15 }, enter: { duration: 0.2 } }}
            onSubmit={handleSignUpSubmit}
            className="mt-6 flex flex-col gap-5"
          >
            <div className="flex gap-5">
              <div className="flex-1 space-y-2">
                <Label htmlFor="signup-first-name" className={LABEL_CLASS}>
                  FIRST NAME
                </Label>
                <Input
                  id="signup-first-name"
                  type="text"
                  placeholder="First name"
                  value={signUpFirstName}
                  onChange={(e) => setSignUpFirstName(e.target.value)}
                  className={cn(INPUT_CLASS, signUpErrors.firstName && 'border-red-400')}
                />
                {signUpErrors.firstName && (
                  <p className="text-xs font-sans text-red-500">
                    {signUpErrors.firstName}
                  </p>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="signup-last-name" className={LABEL_CLASS}>
                  LAST NAME
                </Label>
                <Input
                  id="signup-last-name"
                  type="text"
                  placeholder="Last name"
                  value={signUpLastName}
                  onChange={(e) => setSignUpLastName(e.target.value)}
                  className={cn(INPUT_CLASS, signUpErrors.lastName && 'border-red-400')}
                />
                {signUpErrors.lastName && (
                  <p className="text-xs font-sans text-red-500">
                    {signUpErrors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className={LABEL_CLASS}>
                EMAIL
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className={cn(INPUT_CLASS, signUpErrors.email && 'border-red-400')}
              />
              {signUpErrors.email && (
                <p className="text-xs font-sans text-red-500">
                  {signUpErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className={LABEL_CLASS}>
                PASSWORD
              </Label>
              <PasswordInput
                id="signup-password"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                error={!!signUpErrors.password}
              />
              <p className="text-xs font-sans text-[#1A1714]/50">
                Must be at least 8 characters.
              </p>
              {signUpErrors.password && (
                <p className="text-xs font-sans text-red-500">
                  {signUpErrors.password}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm" className={LABEL_CLASS}>
                CONFIRM PASSWORD
              </Label>
              <PasswordInput
                id="signup-confirm"
                placeholder="Re-enter your password"
                value={signUpConfirm}
                onChange={(e) => setSignUpConfirm(e.target.value)}
                error={!!signUpErrors.confirm}
              />
              {signUpErrors.confirm && (
                <p className="text-xs font-sans text-red-500">
                  {signUpErrors.confirm}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none bg-[#C4622D] text-white hover:opacity-90 transition-opacity duration-150"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>
            {authError && (
              <p className="text-xs font-sans text-red-500 border-l-2 border-red-400 pl-3">
                {authError}
              </p>
            )}
            <SeparatorWithOr />
            <OAuthButtons />
            <FooterSignUp onSwitch={() => switchTab('signin')} />
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}

function SeparatorWithOr(): React.ReactElement {
  return (
    <div className="relative flex items-center py-2">
      <Separator className="bg-[#D6D0C8]" />
      <span className="absolute left-1/2 -translate-x-1/2 bg-[#FAF9F6] px-2 text-xs font-sans text-[#1A1714]/50">
        or
      </span>
    </div>
  );
}

function OAuthButtons(): React.ReactElement {
  return (
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
  );
}

function FooterSignIn({ onSwitch }: { onSwitch: () => void }): React.ReactElement {
  return (
    <div className="space-y-3 pt-2">
      <p className="text-sm font-sans text-[#1A1714]">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-[#C4622D] hover:underline"
        >
          Create one
        </button>
      </p>
      <p className="text-xs font-sans text-[#1A1714]/50">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}

function FooterSignUp({ onSwitch }: { onSwitch: () => void }): React.ReactElement {
  return (
    <div className="space-y-3 pt-2">
      <p className="text-sm font-sans text-[#1A1714]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-[#C4622D] hover:underline"
        >
          Sign in
        </button>
      </p>
      <p className="text-xs font-sans text-[#1A1714]/50">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}
