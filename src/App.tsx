import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { NewJourneyPage } from "./pages/NewJourneyPage";
import { ItineraryPage } from "./pages/ItineraryPage";
import { FAQPage } from "./pages/FAQPage";
import { Chatbot } from "./components/Chatbot";
import { MessageModal } from "./components/MessageModal";
import { ProfileCreationModal } from "./components/ProfileCreationModal";
import { toast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

interface ProfileData {
  name: string;
  dob: string;
  gender: string;
  nationality: string;
  preferredLanguage: string;
}

const getProfile = (userId: string): ProfileData | null => {
  const stored = localStorage.getItem(`profile_${userId}`);
  return stored ? JSON.parse(stored) : null;
};

const saveProfile = (userId: string, profile: ProfileData) => {
  localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showProfileCreation, setShowProfileCreation] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "error" | "success" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const userProfile = getProfile(session.user.id);
        setProfile(userProfile);
        setCurrentPage("dashboard");
        // Show profile creation if profile doesn't exist
        if (!userProfile) {
          setShowProfileCreation(true);
        }
      } else {
        setProfile(null);
        if (currentPage !== "home" && currentPage !== "login") {
          setCurrentPage("home");
        }
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const userProfile = getProfile(session.user.id);
        setProfile(userProfile);
        setCurrentPage("dashboard");
        // Show profile creation if profile doesn't exist
        if (!userProfile) {
          setShowProfileCreation(true);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showModal = (title: string, message: string, type: "error" | "success" | "info" = "info") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if profile exists
      if (data.user) {
        const userProfile = getProfile(data.user.id);
        setProfile(userProfile);
        if (!userProfile) {
          setShowProfileCreation(true);
        }
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      showModal("Login Failed", error.message || "Invalid email or password", "error");
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Show profile creation for new users
      if (data.user) {
        setShowProfileCreation(true);
      }

      toast({
        title: "Account created!",
        description: "Welcome to Smart Voyage!",
      });
    } catch (error: any) {
      showModal("Sign Up Failed", error.message || "Could not create account", "error");
      throw error;
    }
  };

  const handleProfileSave = (profileData: ProfileData) => {
    if (user) {
      saveProfile(user.id, profileData);
      setProfile(profileData);
      setShowProfileCreation(false);
      toast({
        title: "Profile saved!",
        description: "Your profile has been created successfully.",
      });
    }
  };

  const handleProfileUpdate = (profileData: ProfileData) => {
    if (user) {
      saveProfile(user.id, profileData);
      setProfile(profileData);
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentPage("home");
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      showModal("Error", error.message || "Could not sign out", "error");
    }
  };

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
  };

  const handleGenerateItinerary = async (formData: any): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-itinerary", {
        body: formData,
      });

      if (error) throw error;

      return data.itinerary;
    } catch (error: any) {
      showModal("Error", error.message || "Could not generate itinerary", "error");
      throw error;
    }
  };

  const handleFindSurprise = async (formData: any): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke("find-surprise", {
        body: formData,
      });

      if (error) throw error;

      return data.recommendations;
    } catch (error: any) {
      showModal("Error", error.message || "Could not find surprise destinations", "error");
      throw error;
    }
  };

  const handleChatMessage = async (message: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke("chatbot", {
        body: { message },
      });

      if (error) throw error;

      return data.reply;
    } catch (error: any) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MessageModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />

        {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}

        {currentPage === "login" && (
          <LoginPage
            onNavigate={handleNavigate}
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            initialMode={pageData?.mode || "login"}
          />
        )}

        {currentPage === "dashboard" && user && (
          <Dashboard
            user={user}
            profile={profile}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        <ProfileCreationModal
          isOpen={showProfileCreation && !profile}
          onSave={handleProfileSave}
        />

        {currentPage === "new-journey" && user && pageData && (
          <NewJourneyPage
            user={user}
            journeyType={pageData.type}
            onNavigate={handleNavigate}
            onGenerateItinerary={handleGenerateItinerary}
            onFindSurprise={handleFindSurprise}
          />
        )}

        {currentPage === "itinerary" && user && pageData && (
          <ItineraryPage 
            itinerary={pageData.result} 
            formData={pageData.formData}
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === "faq" && (
          <FAQPage onNavigate={handleNavigate} />
        )}

        {user && <Chatbot onSendMessage={handleChatMessage} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
