import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xl font-bold text-gradient">Yatri</span>
            <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              AI
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered trip planning for unforgettable Indian adventures.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Popular</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Jaipur</span>
            <span className="text-sm text-muted-foreground">Goa</span>
            <span className="text-sm text-muted-foreground">Rishikesh</span>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Legal</h4>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
            <span className="text-sm text-muted-foreground">Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 Yatri AI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
