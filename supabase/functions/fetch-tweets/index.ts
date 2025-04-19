import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define interfaces for type safety
interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}

interface Emotion {
  type: string;
  score: number;
}

interface Post {
  id: string;
  content: string;
  date: string;
  sentiment: string;
  score: number;
  emotions: Emotion[];
}

interface User {
  username: string;
  name: string;
  profile_image_url: string;
}

interface SimulatedData {
  platform: string;
  user: User;
  posts: Post[];
  overallSentiment: SentimentDistribution;
  emotions: Emotion[];
  timestamp: string;
  _simulated: boolean;
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Array of tweet templates with diverse topics
const tweetTemplates = [
  // Sports tweets
  "Just watched an incredible {sport} match! {team} vs {opponent} was epic 🏆",
  "What a game by {player}! {score} points in tonight's match 🌟",
  "{team} making history with their performance this season 🔥",
  
  // College tweets (English)
  "First day at {college}! Can't wait to start this new journey 🎓",
  "Campus life at {college} is incredible. Making memories every day 📚",
  "Finals week at {college}. Time to pull those all-nighters ✍️",
  "Proud to be part of {college}'s {department} department! #CollegeLife",
  
  // College tweets (Hindi)
  "{college} में नया सेमेस्टर शुरू! नई उम्मीदें 🎓",
  "कॉलेज का आखिरी साल {college} में। यादें हमेशा रहेंगी 💫",
  "{college} के फेस्ट में आज धमाल! #CollegeFest",
  
  // Politics tweets (English)
  "Important discussion in Parliament today about {policy} #IndianPolitics",
  "Election results in {state} showing interesting trends! #Elections2025",
  "New policy announcement by {minister} regarding {topic} #GovtPolicy",
  
  // Politics tweets (Hindi)
  "{state} में नई सरकार की बड़ी घोषणा! #Politics",
  "{minister} ने {topic} पर दिया बड़ा बयान #IndianPolitics",
  "चुनाव प्रचार में {leader} का जोरदार भाषण #Elections",
  
  // India general tweets
  "Celebrating the spirit of India at {festival} 🪔",
  "Amazing street food tour in {city}! Nothing beats Indian cuisine 😋",
  "Beautiful sunset at {monument} today 🌅 #IncredibleIndia",
  
  // Mixed Hindi tweets
  "आज का दिन {city} में बहुत खास रहा 💫",
  "{festival} की हार्दिक शुभकामनाएं 🪔",
  "भारत की विविधता में एकता का उत्सव {event} 🇮🇳"
];

// Data arrays for tweet generation
const sports = ["cricket", "football", "hockey", "kabaddi", "badminton"];
const teams = ["Team India", "Mumbai Indians", "Chennai Kings", "Delhi Capitals", "Bengaluru FC"];
const players = ["Virat", "Rohit", "Dhoni", "Hardik", "KL Rahul", "Jadeja"];
const colleges = ["Delhi University", "IIT Bombay", "AIIMS", "St. Stephen's", "Lady Shri Ram", "Miranda House"];
const departments = ["Engineering", "Arts", "Science", "Commerce", "Medical", "Law"];
const states = ["UP", "Maharashtra", "Delhi", "Karnataka", "Gujarat", "Punjab"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad"];
const ministers = ["Home Minister", "Education Minister", "PM", "Finance Minister"];
const policies = ["education", "healthcare", "infrastructure", "economy", "technology"];
const topics = ["digital india", "smart cities", "startup india", "clean energy"];
const festivals = ["Diwali", "Holi", "Durga Puja", "Ganesh Chaturthi"];
const monuments = ["Taj Mahal", "Red Fort", "India Gate", "Gateway of India"];
const events = ["Republic Day", "Independence Day", "Unity Day"];
const userHandles = [
  "IndianStudent", "TechGuru", "SportsFanatic", "PoliticsDaily",
  "FoodieExplorer", "TravelIndia", "NewsUpdate", "StartupPro",
  "CricketLover", "CollegeLife", "DelhiVibes", "MumbaiMeri",
  "कॉलेज_लाइफ", "भारत_दर्शन", "खेल_समाचार", "राजनीति_विशेष"
];

function generateRandomTweet(): string {
  const template = tweetTemplates[Math.floor(Math.random() * tweetTemplates.length)];
  return template
    .replace("{sport}", sports[Math.floor(Math.random() * sports.length)])
    .replace("{team}", teams[Math.floor(Math.random() * teams.length)])
    .replace("{player}", players[Math.floor(Math.random() * players.length)])
    .replace("{college}", colleges[Math.floor(Math.random() * colleges.length)])
    .replace("{department}", departments[Math.floor(Math.random() * departments.length)])
    .replace("{state}", states[Math.floor(Math.random() * states.length)])
    .replace("{city}", cities[Math.floor(Math.random() * cities.length)])
    .replace("{minister}", ministers[Math.floor(Math.random() * ministers.length)])
    .replace("{policy}", policies[Math.floor(Math.random() * policies.length)])
    .replace("{topic}", topics[Math.floor(Math.random() * topics.length)])
    .replace("{festival}", festivals[Math.floor(Math.random() * festivals.length)])
    .replace("{monument}", monuments[Math.floor(Math.random() * monuments.length)])
    .replace("{event}", events[Math.floor(Math.random() * events.length)])
    .replace("{opponent}", teams[Math.floor(Math.random() * teams.length)])
    .replace("{score}", `${Math.floor(Math.random() * 200)}`);
}

function generateUser(): User {
  const randomHandle = userHandles[Math.floor(Math.random() * userHandles.length)];
  return {
    username: randomHandle,
    name: randomHandle.replace(/[_-]/g, ' '),
    profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomHandle}-${Date.now()}`
  };
}

// Generate a pool of 500 tweets that we'll sample from
const tweetPool: Post[] = Array.from({ length: 500 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  
  return {
    id: `tweet-${i}-${Date.now()}-${Math.random()}`,
    content: generateRandomTweet(),
    date: date.toISOString(),
    sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
    score: Math.random(),
    emotions: ['joy', 'sadness', 'anger', 'surprise', 'fear']
      .map(type => ({
        type,
        score: Math.random()
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  };
});

function getRandomTweets(count: number): Post[] {
  const shuffled = [...tweetPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSimulatedData(username: string): SimulatedData {
  const randomTweets = getRandomTweets(10); // Get 10 random tweets from the pool
  
  // Calculate sentiment distribution based on selected tweets
  const overallSentiment: SentimentDistribution = {
    positive: randomTweets.filter(t => t.sentiment === 'positive').length / 10,
    negative: randomTweets.filter(t => t.sentiment === 'negative').length / 10,
    neutral: randomTweets.filter(t => t.sentiment === 'neutral').length / 10
  };
  
  // Generate emotion analysis based on selected tweets
  const emotionScores: { [key: string]: number } = {};
  randomTweets.forEach(tweet => {
    tweet.emotions.forEach(emotion => {
      emotionScores[emotion.type] = (emotionScores[emotion.type] || 0) + emotion.score;
    });
  });
  
  const emotions = Object.entries(emotionScores)
    .map(([type, score]) => ({
      type,
      score: score / randomTweets.length
    }))
    .sort((a, b) => b.score - a.score);
  
  return {
    platform: 'twitter',
    user: generateUser(), // Generate a random user for each analysis
    posts: randomTweets,
    overallSentiment,
    emotions,
    timestamp: new Date().toISOString(),
    _simulated: true
  };
}

/**
 * Handles the incoming request
 */
async function handleRequest(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) {
      throw new Error("Username is required");
    }

    console.log(`Processing request for username: ${username}`);
    const data = generateSimulatedData(username);
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error: any) {
    console.error("Error processing request:", error);
    // Still return a 200 status with simulated data even on error
    const fallbackData = generateSimulatedData("demo_user");
    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  }
}

// Main server
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return handleRequest(req);
});
