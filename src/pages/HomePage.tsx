import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Sparkles, Heart, Compass, Coffee, Home } from "lucide-react";
import { useEffect, useRef } from "react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll(".observe-card");
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onLoginClick={() => onNavigate("login", { mode: "login" })}
        onSignUpClick={() => onNavigate("login", { mode: "signup" })}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover India with{" "}
              <span className="gradient-text">AI-Powered</span> Travel Planning
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let artificial intelligence craft your perfect journey through India's
              breathtaking landscapes, rich culture, and unforgettable experiences.
            </p>
            <Button
              size="lg"
              onClick={scrollToHowItWorks}
              className="text-lg px-8 py-6 glow"
            >
              Explore Now
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your perfect Indian adventure in three simple steps
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="observe-card hover-lift border-2">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Tell Us Your Interests</h3>
                <p className="text-muted-foreground">
                  Share your travel preferences, budget, and interests. Whether it's
                  heritage sites, adventure sports, or culinary delights - we've got you
                  covered.
                </p>
              </CardContent>
            </Card>

            <Card className="observe-card hover-lift border-2">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Get Your AI Itinerary</h3>
                <p className="text-muted-foreground">
                  Our advanced AI analyzes thousands of possibilities to create a
                  personalized itinerary tailored just for you, complete with
                  recommendations and insider tips.
                </p>
              </CardContent>
            </Card>

            <Card className="observe-card hover-lift border-2">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                  <Compass className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Explore India</h3>
                <p className="text-muted-foreground">
                  Follow your custom itinerary and discover the magic of India. From
                  bustling cities to serene villages, every moment is curated for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose-us" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose Smart Voyage</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience travel planning like never before
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="observe-card hover-lift text-center">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Personalized</h3>
                <p className="text-muted-foreground">
                  Every itinerary is uniquely crafted for your preferences
                </p>
              </CardContent>
            </Card>

            <Card className="observe-card hover-lift text-center">
              <CardContent className="pt-6">
                <Coffee className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Authentic</h3>
                <p className="text-muted-foreground">
                  Discover local gems and authentic experiences
                </p>
              </CardContent>
            </Card>

            <Card className="observe-card hover-lift text-center">
              <CardContent className="pt-6">
                <Home className="h-12 w-12 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
                <p className="text-muted-foreground">
                  Sustainable travel options for conscious explorers
                </p>
              </CardContent>
            </Card>

            <Card className="observe-card hover-lift text-center">
              <CardContent className="pt-6">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Smart recommendations powered by advanced AI
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
