import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Craft - Your resume, written with intention',
  description: 'Craft uses AI to translate your experience into clear, compelling language — tailored to every role you apply for.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navigation />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
