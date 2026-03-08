export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-serif font-medium text-foreground mb-2">Craft</h4>
            <p className="text-xs font-sans text-foreground/50">
              Your resume, written with intention.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-4">Product</h5>
            <ul className="space-y-2 text-xs font-sans text-foreground/70">
              <li><a href="#product" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-4">Company</h5>
            <ul className="space-y-2 text-xs font-sans text-foreground/70">
              <li><a href="#blog" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-4">Legal</h5>
            <ul className="space-y-2 text-xs font-sans text-foreground/70">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans text-foreground/50">
            © 2024 Craft. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs font-sans text-foreground/50 hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="text-xs font-sans text-foreground/50 hover:text-foreground transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
