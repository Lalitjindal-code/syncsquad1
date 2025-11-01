import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, Search, ChevronDown } from "lucide-react";

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

interface FAQ {
  category: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

const faqs: FAQ[] = [
  {
    category: "Account & Profile",
    questions: [
      {
        question: "How do I create an account?",
        answer: "Creating an account on Smart Voyage is simple! Click on the 'Sign Up' button in the top right corner of the homepage. You'll need to provide your email address and create a password. Once you've filled in the required information, click 'Create Account' and you're all set! You can then start planning your journeys immediately.",
      },
      {
        question: "How do I reset my password?",
        answer: "If you've forgotten your password, click on 'Login' and then select the 'Forgot Password' option. Enter your registered email address, and we'll send you a password reset link. Click the link in the email to create a new password. Make sure to check your spam folder if you don't see the email in your inbox.",
      },
      {
        question: "How do I update my profile details (like Name, DOB, etc.)?",
        answer: "Currently, profile customization options are limited. However, you can update your basic account information through your account settings (accessible from the dashboard). We're continuously working on adding more profile customization features. For now, the email address you use to sign up will be your primary identifier. Stay tuned for more updates!",
      },
    ],
  },
  {
    category: "Creating a Journey",
    questions: [
      {
        question: "What's the difference between 'Surprise Journey' and 'New Journey'?",
        answer: "'New Journey' allows you to plan a trip to a specific destination you've already chosen. You provide the destination, dates, and preferences, and we generate a detailed, personalized itinerary for that location. 'Surprise Journey' is perfect for when you're unsure where to go - simply provide your travel preferences, budget, and dates, and our AI will suggest 3 amazing destinations in India that match your profile. You can then choose one and generate a full itinerary for it!",
      },
      {
        question: "How do I add multiple travelers (name and age) to my trip?",
        answer: "When creating a journey, you'll see a field asking 'How many travelers?' Enter the number of people traveling (between 1 and 10). Once you enter a number, the system will automatically generate individual traveler cards below. Each card allows you to enter the full name and age of each traveler. This information helps us personalize your itinerary and luggage recommendations based on the composition of your travel group.",
      },
      {
        question: "Can I edit my itinerary after it's generated?",
        answer: "Currently, itineraries are generated as complete documents and cannot be directly edited within the platform. However, you can download your itinerary as a markdown file and edit it manually. We're working on an itinerary editing feature that will allow you to make adjustments and regenerate specific sections. For now, if you need a different itinerary, you can create a new journey with your updated preferences.",
      },
    ],
  },
  {
    category: "Billing & Payments",
    questions: [
      {
        question: "Is the 'Smart Voyage' service free?",
        answer: "Yes! Smart Voyage is completely free to use. You can create unlimited journeys, generate personalized itineraries, get AI-powered luggage checklists, and access all our features without any charges. We believe everyone should have access to smart travel planning tools, so we've made our service free for all users.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "Since Smart Voyage is a free service, no payment methods are required. All features are available at no cost. In the future, if we introduce premium features, we'll ensure transparent pricing and accept multiple payment methods including credit cards, debit cards, UPI, and net banking.",
      },
      {
        question: "How does billing work for group trips?",
        answer: "Smart Voyage doesn't charge for itinerary generation, regardless of whether you're traveling solo or in a group. All travelers can be added to a single journey at no additional cost. The AI-powered itinerary generation, luggage checklist, and all other features work the same way for 1 traveler or 10 travelers - completely free!",
      },
    ],
  },
  {
    category: "Features & Support",
    questions: [
      {
        question: "How accurate is the 'Essential Luggage to Carry' list?",
        answer: "Our AI-powered luggage checklist analyzes your destination, travel dates, and expected weather conditions to generate a personalized list. The system considers Indian seasonal patterns (Monsoon, Winter, Summer, Spring), regional climate variations (Coastal, Mountain, Desert, Plains), and location-specific characteristics. While we strive for accuracy, weather can be unpredictable, so we recommend checking local weather forecasts closer to your travel date and adjusting your packing accordingly.",
      },
      {
        question: "Is the website available in other languages (like Hindi or Odia)?",
        answer: "Currently, Smart Voyage is available in English. However, we understand the importance of multilingual support in India's diverse linguistic landscape. We're actively working on adding support for regional languages including Hindi, Odia, Tamil, Telugu, Bengali, and more. These updates will be rolled out in future releases. Stay tuned for announcements!",
      },
      {
        question: "How can I contact customer support if my question isn't listed here?",
        answer: "If you couldn't find an answer to your question, we're here to help! You can reach out to us through the chatbot feature available on your dashboard (look for the chat icon). Our AI assistant can answer many queries instantly. For more complex issues or feedback, please email us at support@smartvoyage.in or use the contact form available in the footer. We typically respond within 24-48 hours. Your feedback helps us improve Smart Voyage!",
      },
    ],
  },
];

export const FAQPage = ({ onNavigate }: FAQPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (category: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Have questions? We're here to help! Find answers to common queries below.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for questions or answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {filteredFAQs.reduce((acc, cat) => acc + cat.questions.length, 0)} result(s)
              </p>
            )}
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {filteredFAQs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border-2">
                <CardContent className="p-0">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleSection(category.category)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <h2 className="text-xl font-bold text-foreground">{category.category}</h2>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        openSections[category.category] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Questions & Answers */}
                  {(openSections[category.category] === undefined || openSections[category.category]) && (
                    <div className="px-6 pb-6 space-y-4">
                      {category.questions.map((faq, index) => (
                        <details
                          key={index}
                          className="group border-l-2 border-primary/20 pl-4 py-2 hover:border-primary/40 transition-colors"
                        >
                          <summary className="cursor-pointer font-semibold text-foreground hover:text-primary transition-colors list-none">
                            <span className="flex items-center gap-2">
                              <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                              {faq.question}
                            </span>
                          </summary>
                          <p className="mt-3 ml-6 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results Message */}
          {searchQuery && filteredFAQs.length === 0 && (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No results found for "{searchQuery}". Try different keywords or{" "}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-primary hover:underline"
                  >
                    clear your search
                  </button>
                  .
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contact Section */}
          <Card className="border-2 mt-8 bg-primary/5">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find the answer you're looking for? We're here to help!
              </p>
              <Button
                variant="outline"
                onClick={() => onNavigate("dashboard")}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

