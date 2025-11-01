import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plane, Plus, Sparkles, MapPin, Home as HomeIcon, Coffee, MoreVertical, LogOut, Settings, HelpCircle, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileViewEditModal } from "@/components/ProfileViewEditModal";
import { JourneyHistorySidebar } from "@/components/JourneyHistorySidebar";
import { History } from "lucide-react";

interface ProfileData {
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  preferredLanguage: string;
}

interface DashboardProps {
  user: any;
  profile: ProfileData | null;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
  onProfileUpdate: (profile: ProfileData) => void;
}

export const Dashboard = ({ user, profile, onNavigate, onLogout, onProfileUpdate }: DashboardProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showJourneyHistory, setShowJourneyHistory] = useState(false);

  const getUserName = () => {
    if (profile?.name) {
      return profile.name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Traveler";
  };

  const getUserInitials = () => {
    if (profile?.name) {
      const names = profile.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return profile.name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const popularPlaces = [
    {
      name: "Taj Mahal, Agra",
      description: "Marvel at one of the world's most iconic monuments",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
    },
    {
      name: "Goa Beaches",
      description: "Relax on pristine beaches and vibrant culture",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
    },
    {
      name: "Jaipur, Rajasthan",
      description: "Explore the pink city's majestic forts and palaces",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop",
    },
  ];

  const ecoPlace = {
    name: "Kerala Backwaters",
    description: "Experience sustainable houseboat stays in serene waters",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=400&fit=crop",
  };

  const homestay = {
    name: "Himalayan Homestays",
    description: "Authentic village life with mountain views",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop",
  };

  const food = {
    name: "Street Food Tours",
    description: "Taste authentic flavors from local vendors",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=400&fit=crop",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold gradient-text">Smart Voyage</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-foreground font-medium">Hello, {getUserName()}!</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
                  <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 border-b">
                  <p className="text-sm font-medium">{getUserName()}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowJourneyHistory(true)}>
                  <History className="h-4 w-4 mr-2" />
                  Journey History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate("faq")}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Namaste, {getUserName()}!</h1>
          <p className="text-muted-foreground mb-8">Ready to plan your next adventure?</p>

          {/* Journey Creation Buttons */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card
              className="hover-lift cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors"
              onClick={() => onNavigate("new-journey", { type: "new" })}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Create New Journey</h3>
                    <p className="text-muted-foreground">
                      Plan a trip to a specific destination with AI-powered itinerary
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover-lift cursor-pointer border-2 border-accent/20 hover:border-accent transition-colors"
              onClick={() => onNavigate("new-journey", { type: "surprise" })}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Create Surprise Journey</h3>
                    <p className="text-muted-foreground">
                      Let AI recommend perfect destinations based on your preferences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Places */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Popular Places This Season
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {popularPlaces.map((place, index) => (
                <Card key={index} className="hover-lift overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-bold mb-1">{place.name}</h3>
                    <p className="text-sm text-muted-foreground">{place.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Eco-Friendly Place */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Popular Eco-Friendly Place You Need to See
            </h2>
            <Card className="hover-lift overflow-hidden">
              <div className="md:flex">
                <img
                  src={ecoPlace.image}
                  alt={ecoPlace.name}
                  className="w-full md:w-1/2 h-64 object-cover"
                />
                <CardContent className="pt-6 md:w-1/2 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-2">{ecoPlace.name}</h3>
                  <p className="text-muted-foreground">{ecoPlace.description}</p>
                </CardContent>
              </div>
            </Card>
          </section>

          {/* Homestays and Food */}
          <div className="grid md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <HomeIcon className="h-6 w-6 text-gold" />
                Homestays
              </h2>
              <Card className="hover-lift overflow-hidden">
                <img
                  src={homestay.image}
                  alt={homestay.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="pt-4">
                  <h3 className="text-lg font-bold mb-1">{homestay.name}</h3>
                  <p className="text-sm text-muted-foreground">{homestay.description}</p>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Coffee className="h-6 w-6 text-primary" />
                Popular Authentic Food
              </h2>
              <Card className="hover-lift overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="pt-4">
                  <h3 className="text-lg font-bold mb-1">{food.name}</h3>
                  <p className="text-sm text-muted-foreground">{food.description}</p>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>

      <ProfileViewEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onUpdate={onProfileUpdate}
      />

      <JourneyHistorySidebar
        isOpen={showJourneyHistory}
        onClose={() => setShowJourneyHistory(false)}
        userId={user?.id || ""}
        onViewJourney={(journey) => {
          onNavigate("itinerary", {
            result: journey.itinerary,
            formData: journey.formData,
          });
        }}
      />
    </div>
  );
};
