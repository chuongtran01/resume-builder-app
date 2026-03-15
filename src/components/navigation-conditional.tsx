'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/navigation';

export function NavigationConditional(): React.ReactElement | null {
  const pathname = usePathname();
  if (pathname === '/auth') return null;
  return <Navigation />;
}
