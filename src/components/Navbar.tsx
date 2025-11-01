import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

interface NavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

export const Navbar = ({ onLoginClick, onSignUpClick }: NavbarProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold gradient-text">Smart Voyage</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-foreground hover:text-primary transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("why-choose-us")}
            className="text-foreground hover:text-primary transition-colors"
          >
            Why Choose Us
          </button>
          <button
            onClick={() => scrollToSection("footer")}
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onLoginClick}>
            Login
          </Button>
          <Button onClick={onSignUpClick}>Sign Up</Button>
        </div>
      </div>
    </nav>
  );
};
