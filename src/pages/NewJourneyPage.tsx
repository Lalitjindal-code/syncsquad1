import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { saveJourneyToHistory } from "@/components/JourneyHistorySidebar";

interface NewJourneyPageProps {
  user: any;
  journeyType: "new" | "surprise";
  onNavigate: (page: string, data?: any) => void;
  onGenerateItinerary: (formData: any) => Promise<string>;
  onFindSurprise: (formData: any) => Promise<string>;
}

export const NewJourneyPage = ({
  user,
  journeyType,
  onNavigate,
  onGenerateItinerary,
  onFindSurprise,
}: NewJourneyPageProps) => {
  const [formData, setFormData] = useState({
    destination: "",
    origin: "",
    date: "",
    travelers: "",
    budget: "",
    interests: [] as string[],
  });

  const [numTravelers, setNumTravelers] = useState(1);
  const [travelerDetails, setTravelerDetails] = useState<Array<{ name: string; age: string }>>([
    { name: "", age: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [surpriseResults, setSurpriseResults] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(true);

  const interestOptions = [
    "Heritage",
    "Adventure",
    "Food",
    "Nature",
    "Spiritual",
    "Beach",
    "Mountains",
    "Culture",
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Generate traveler fields when number changes
  useEffect(() => {
    const count = Math.max(1, Math.min(10, numTravelers));
    setTravelerDetails((prev) => {
      // Preserve existing data, extend or truncate as needed
      const newDetails = Array.from({ length: count }, (_, i) => 
        prev[i] || { name: "", age: "" }
      );
      return newDetails;
    });
  }, [numTravelers]);

  const handleTravelerChange = (index: number, field: "name" | "age", value: string) => {
    const updated = [...travelerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setTravelerDetails(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Include traveler details in form data
    const travelersString = travelerDetails
      .map((t) => `${t.name} (${t.age})`)
      .filter((s) => s.trim() !== "()")
      .join(", ");
    
    const submitData = {
      ...formData,
      travelers: travelersString || `${numTravelers} traveler(s)`,
      travelerDetails: travelerDetails, // Also include structured data
    };
    
    if (journeyType === "new") {
      setLoading(true);
      try {
        const result = await onGenerateItinerary(submitData);
        // Save to journey history
        if (user?.id) {
          saveJourneyToHistory(user.id, result, submitData);
        }
        onNavigate("itinerary", { result, formData: submitData });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const result = await onFindSurprise(submitData);
        // Parse the AI response to extract destinations
        const destinations = parseDestinations(result);
        setSurpriseResults(destinations);
        setShowForm(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const parseDestinations = (text: string) => {
    // Simple parser - in production, you'd want more robust parsing
    const destinations = [];
    const sections = text.split(/##\s*\d+\.\s*/);
    
    for (let i = 1; i < sections.length && i <= 3; i++) {
      const lines = sections[i].split("\n");
      const title = lines[0].trim();
      const description = lines.slice(1).join("\n").trim();
      
      destinations.push({
        name: title,
        description: description,
      });
    }
    
    return destinations;
  };

  const handleDestinationSelect = async (destination: string) => {
    setLoading(true);
    try {
      const itineraryData = { ...formData, destination };
      // Include traveler details in itinerary data
      const travelersString = travelerDetails
        .map((t) => `${t.name} (${t.age})`)
        .filter((s) => s.trim() !== "()")
        .join(", ");
      
      const submitData = {
        ...itineraryData,
        travelers: travelersString || `${numTravelers} traveler(s)`,
        travelerDetails: travelerDetails,
      };
      
      const result = await onGenerateItinerary(submitData);
      // Save to journey history
      if (user?.id) {
        saveJourneyToHistory(user.id, result, submitData);
      }
      onNavigate("itinerary", { result, formData: submitData });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="animate-fade-in">
          {showForm ? (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-3xl">
                  {journeyType === "new" ? "Plan Your Journey" : "Discover Your Surprise Destination"}
                </CardTitle>
                <CardDescription>
                  {journeyType === "new"
                    ? "Tell us about your dream trip and we'll create the perfect itinerary"
                    : "Share your preferences and let AI recommend amazing destinations"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {journeyType === "new" && (
                    <div className="space-y-2">
                      <Label htmlFor="destination">Where do you want to go?</Label>
                      <Input
                        id="destination"
                        placeholder="e.g., Jaipur, Rajasthan"
                        value={formData.destination}
                        onChange={(e) =>
                          setFormData({ ...formData, destination: e.target.value })
                        }
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="origin">Where are you traveling from?</Label>
                    <Input
                      id="origin"
                      placeholder="e.g., Mumbai, Maharashtra"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Travel Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="num-travelers">How many travelers?</Label>
                    <Input
                      id="num-travelers"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="e.g., 2"
                      value={numTravelers}
                      onChange={(e) => setNumTravelers(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div id="traveler-details-container" className="space-y-4">
                    {travelerDetails.map((traveler, index) => (
                      <div key={index} className="traveler-card">
                        <h4 className="text-lg font-semibold mb-3">Traveler {index + 1}</h4>
                        <div className="traveler-input-row">
                          <div className="input-group">
                            <Label htmlFor={`traveler-name-${index + 1}`}>Full Name:</Label>
                            <Input
                              id={`traveler-name-${index + 1}`}
                              type="text"
                              placeholder="e.g., Ravi Kumar"
                              value={traveler.name}
                              onChange={(e) => handleTravelerChange(index, "name", e.target.value)}
                              required
                            />
                          </div>
                          <div className="input-group">
                            <Label htmlFor={`traveler-age-${index + 1}`}>Age:</Label>
                            <Input
                              id={`traveler-age-${index + 1}`}
                              type="number"
                              min="0"
                              max="120"
                              placeholder="e.g., 30"
                              value={traveler.age}
                              onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (INR)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="e.g., 50000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Interests</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {interestOptions.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.interests.includes(interest)}
                            onCheckedChange={() => handleInterestToggle(interest)}
                          />
                          <label
                            htmlFor={interest}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {interest}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : journeyType === "new" ? (
                      "Generate Itinerary"
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Find My Surprise
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Your Surprise Destinations</h2>
                <p className="text-muted-foreground">
                  We found these amazing places just for you. Choose one to generate your itinerary!
                </p>
              </div>

              <div className="grid gap-6">
                {surpriseResults.map((destination, index) => (
                  <Card key={index} className="hover-lift border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                          <p className="text-muted-foreground mb-4">{destination.description}</p>
                          <Button
                            onClick={() => handleDestinationSelect(destination.name)}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              `Generate Itinerary for ${destination.name}`
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(true);
                  setSurpriseResults([]);
                }}
                className="w-full"
              >
                Start Over
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
