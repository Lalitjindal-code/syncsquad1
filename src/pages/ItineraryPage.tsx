import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Loader2, Luggage } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

interface ItineraryPageProps {
  itinerary: string;
  formData?: any;
  onNavigate: (page: string) => void;
}

interface LuggageChecklist {
  weatherSummary: string;
  categories: {
    clothing: string[];
    essentials: string[];
    electronics: string[];
    medical: string[];
  };
}

export const ItineraryPage = ({ itinerary, formData, onNavigate }: ItineraryPageProps) => {
  const [luggageChecklist, setLuggageChecklist] = useState<LuggageChecklist | null>(null);
  const [loadingLuggage, setLoadingLuggage] = useState(false);

  useEffect(() => {
    // Fetch luggage checklist when component mounts
    if (formData && (formData.destination || formData.origin)) {
      fetchLuggageChecklist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLuggageChecklist = async () => {
    if (!formData) return;

    setLoadingLuggage(true);
    try {
      // Calculate duration from date
      const travelDate = formData.date ? new Date(formData.date) : null;
      const duration = travelDate 
        ? `${travelDate.toLocaleString('default', { month: 'long' })} travel`
        : "Not specified";

      const { data, error } = await supabase.functions.invoke("generate-luggage-checklist", {
        body: {
          destination: formData.destination || "India",
          date: formData.date,
          travelers: formData.travelers || "1 traveler",
          interests: formData.interests || [],
          duration: duration,
        },
      });

      if (error) throw error;

      if (data?.luggageChecklist) {
        setLuggageChecklist(data.luggageChecklist);
      }
    } catch (error) {
      console.error("Error fetching luggage checklist:", error);
      // Don't show error to user, just skip the luggage section
    } finally {
      setLoadingLuggage(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([itinerary], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "smart-voyage-itinerary.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Smart Voyage Itinerary",
          text: itinerary,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
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

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {navigator.share && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Personalized Itinerary</h1>
            <p className="text-muted-foreground">
              Your AI-crafted journey through India awaits
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl font-bold mt-6 mb-4 text-foreground" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xl font-bold mt-4 mb-2 text-foreground" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-foreground leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="mb-4 ml-6 list-disc text-foreground" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="mb-4 ml-6 list-decimal text-foreground" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-2 text-foreground" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-primary" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-accent" {...props} />
                    ),
                  }}
                >
                  {itinerary}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Luggage Checklist */}
          {loadingLuggage ? (
            <Card className="border-2 mt-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span className="text-muted-foreground">Generating your luggage checklist...</span>
                </div>
              </CardContent>
            </Card>
          ) : luggageChecklist ? (
            <Card className="border-2 mt-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Luggage className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">AI-Powered Luggage Checklist</CardTitle>
                    <CardDescription className="mt-1">
                      Based on the expected weather in {formData?.destination || "your destination"}:{" "}
                      <span className="font-medium text-foreground">{luggageChecklist.weatherSummary}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Clothing Section */}
                {luggageChecklist.categories.clothing && luggageChecklist.categories.clothing.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Clothing (Weather-Specific)</h3>
                    <ul className="space-y-2 ml-4">
                      {luggageChecklist.categories.clothing.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Essentials Section */}
                {luggageChecklist.categories.essentials && luggageChecklist.categories.essentials.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Essentials & Documents</h3>
                    <ul className="space-y-2 ml-4">
                      {luggageChecklist.categories.essentials.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Electronics Section */}
                {luggageChecklist.categories.electronics && luggageChecklist.categories.electronics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Electronics</h3>
                    <ul className="space-y-2 ml-4">
                      {luggageChecklist.categories.electronics.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Medical Section */}
                {luggageChecklist.categories.medical && luggageChecklist.categories.medical.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Medical & Toiletries</h3>
                    <ul className="space-y-2 ml-4">
                      {luggageChecklist.categories.medical.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => onNavigate("dashboard")}>
              Create Another Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
