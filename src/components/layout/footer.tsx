export function Footer() {
  return (
    <footer className="bg-background border-t ">
      <div className="px-4 p-4 md:p-6  mx-auto">
        <div className="  flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <a
              href="/"
              className="text-foreground hover:text-foreground/80 text-xl font-bold transition-colors"
            >
              ShopNex
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <a
              href="/shop"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Shop
            </a>
            <a
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              About
            </a>
            <a
              href="/faq"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              FAQ
            </a>
            <a
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
