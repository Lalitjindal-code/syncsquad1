import { Plane } from "lucide-react";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  const handleFAQClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("faq");
    }
  };

  return (
    <footer id="footer" className="bg-card border-t border-border py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold gradient-text">Smart Voyage</span>
            </div>
            <p className="text-muted-foreground">
              Your AI-powered travel companion for exploring the incredible diversity of India.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <button
                  onClick={handleFAQClick}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Destinations</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">North India</li>
              <li className="text-muted-foreground">South India</li>
              <li className="text-muted-foreground">East India</li>
              <li className="text-muted-foreground">West India</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2025 Smart Voyage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
