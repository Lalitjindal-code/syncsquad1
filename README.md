Smart Voyage: Your AI-Powered Travel Planner

Smart Voyage is a modern, AI-driven web application designed to take the stress and guesswork out of travel planning. It leverages the power of generative AI (Google Gemini) to create personalized, detailed itineraries, and even tells you what to pack based on the weather at your destination.

✨ Key Features

AI-Powered Itinerary Generation: Get a complete, day-by-day travel plan. Just provide a destination, dates, and number of travelers, and let the AI build your vacation.

"Surprise Me!" Journey: Feeling adventurous? Let the AI pick a destination for you and generate a full itinerary for a true surprise trip.

Dynamic Luggage Checklist: A standout feature. The AI analyzes your destination and travel dates, determines the expected weather and climate, and generates a customized packing list.

Interactive Map Integration: Your generated itinerary is automatically displayed on an interactive map (via Leaflet.js & OpenStreetMap), showing your destination and key points of interest.

Dynamic Traveler Forms: Easily add multiple travelers to a trip. The form dynamically updates to capture each person's Name and Age for a more personalized plan.

Full User Authentication: Secure login, signup, and a "Complete Your Profile" flow on first login (capturing Name, DOB, Gender, Nationality, and Preferred Language).

Multilingual Support: A globally accessible app. The entire site can be translated in real-time using the Google Translate API (implemented securely via a backend endpoint).

FAQ Page: A clean, organized section to answer common user questions.

🚀 Tech Stack

This project integrates a modern set of technologies for a seamless experience:

Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)

AI Model: Google Gemini (via the Gemini API)

Mapping: Leaflet.js & OpenStreetMap (Free, no API key required)

Translation: Google Cloud Translation API

Backend: Node.js / Express.js (To handle secure API calls to Gemini and Google Translate)

Database: (Example) MongoDB or PostgreSQL for storing user profiles and saved itineraries.

🏁 Getting Started

To get a local copy up and running, follow these simple steps.

Prerequisites

Node.js (for the backend server)

API keys for:

Google Gemini

Google Cloud Translation API

Installation

Clone the repo:

git clone [https://github.com/your-username/smart-voyage.git](https://github.com/your-username/smart-voyage.git)
cd smart-voyage


Setup the Backend:

Navigate to the backend directory:

cd backend
npm install


Create a .env file in the backend directory and add your secret keys. This is critical for security.

GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GOOGLE_TRANSLATE_API_KEY=YOUR_TRANSLATE_API_KEY_HERE


Start the backend server:

npm start


Your secure backend is now running (e.g., at http://localhost:3000).

Run the Frontend:

Open the frontend directory.

Simply open the index.html file in your favorite web browser. The frontend JavaScript is configured to send its API requests to your local backend server.

🧭 How It Works (User Flow)

Sign Up & Profile: A new user signs up. On their first login, they are redirected to a mandatory "Complete Your Profile" page.

Choose Journey: The user selects "New Journey" (they pick the destination) or "Surprise Journey" (AI picks for them).

Add Travelers: The user specifies "How many travelers?" and the form dynamically creates fields to enter each person's Name and Age.

Generate Plan: The user submits the form. The frontend sends this data to the backend.

AI Magic: The backend securely calls the Gemini API to generate a JSON object containing:

The itinerary text.

The latitude and longitude of the destination.

The weather-based luggage checklist.

View Results: The frontend receives this JSON. It displays the itinerary text, populates the luggage list, and then uses the coordinates to initialize the Leaflet.js map, centering it on the destination and adding a marker.

Translate: The user can click the language switcher (e.g., to "Hindi"), which securely translates all text on the page.

🔮 Future Roadmap

This project has a strong foundation, but the next steps are even more exciting:

[ ] RAG Integration: Implement Retrieval-Augmented Generation (RAG) to feed the AI with real-time, factual data (e.g., specific museum opening times, current hotel prices, local event schedules) for hyper-realistic and verifiable itineraries.

[ ] Save & Share Itineraries: Allow users to save their favorite generated itineraries to their profile and share them with friends via a unique link.

[ ] Profile-Aware AI: Train the AI to consider the user's profile (age, nationality, language) when suggesting destinations or activities.
