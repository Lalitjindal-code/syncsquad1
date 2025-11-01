import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, MapPin, Calendar, Eye, X } from "lucide-react";
import { format } from "date-fns";

interface JourneyHistoryItem {
  id: string;
  destination: string;
  origin: string;
  date: string;
  itinerary: string;
  formData: any;
  createdAt: string;
}

interface JourneyHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onViewJourney: (journey: JourneyHistoryItem) => void;
}

export const JourneyHistorySidebar = ({
  isOpen,
  onClose,
  userId,
  onViewJourney,
}: JourneyHistorySidebarProps) => {
  const [journeys, setJourneys] = useState<JourneyHistoryItem[]>([]);

  useEffect(() => {
    if (isOpen && userId) {
      loadJourneyHistory();
    }
  }, [isOpen, userId]);

  const loadJourneyHistory = () => {
    const stored = localStorage.getItem(`journey_history_${userId}`);
    if (stored) {
      try {
        const history = JSON.parse(stored);
        // Sort by date (newest first)
        const sorted = history.sort(
          (a: JourneyHistoryItem, b: JourneyHistoryItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setJourneys(sorted);
      } catch (error) {
        console.error("Error loading journey history:", error);
        setJourneys([]);
      }
    } else {
      setJourneys([]);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this journey?")) {
      const updated = journeys.filter((journey) => journey.id !== id);
      setJourneys(updated);
      localStorage.setItem(`journey_history_${userId}`, JSON.stringify(updated));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTravelDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch {
      return dateString || "Not specified";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Journey History</SheetTitle>
          <SheetDescription>
            View and manage your previously created itineraries
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {journeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No journey history yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your created itineraries will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4 pr-4">
              {journeys.map((journey) => (
                <Card key={journey.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {journey.destination || "Unknown Destination"}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            Travel Date: {formatTravelDate(journey.date)}
                          </p>
                          <p>Created: {formatDate(journey.createdAt)}</p>
                          {journey.origin && (
                            <p className="text-xs">From: {journey.origin}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(journey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onViewJourney(journey);
                        onClose();
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Itinerary
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// Helper functions to save and load journey history
export const saveJourneyToHistory = (
  userId: string,
  itinerary: string,
  formData: any
) => {
  const journey: JourneyHistoryItem = {
    id: `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    destination: formData.destination || "Unknown",
    origin: formData.origin || "",
    date: formData.date || "",
    itinerary,
    formData,
    createdAt: new Date().toISOString(),
  };

  const stored = localStorage.getItem(`journey_history_${userId}`);
  let history: JourneyHistoryItem[] = [];

  if (stored) {
    try {
      history = JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing journey history:", error);
      history = [];
    }
  }

  // Add new journey at the beginning
  history.unshift(journey);

  // Keep only last 50 journeys
  if (history.length > 50) {
    history = history.slice(0, 50);
  }

  localStorage.setItem(`journey_history_${userId}`, JSON.stringify(history));
};

