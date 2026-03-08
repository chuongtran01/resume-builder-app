import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-serif font-medium text-foreground hover:opacity-80 transition-opacity">
            Craft
          </Link>
          
          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#product" className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors">
              Product
            </Link>
            <Link href="#how-it-works" className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#blog" className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors">
              Blog
            </Link>
          </div>
          
          {/* CTA Button */}
          <Link
            href="#get-started"
            className="text-sm font-sans text-foreground border border-border px-4 py-2 rounded-sm hover:bg-foreground/5 transition-colors whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
