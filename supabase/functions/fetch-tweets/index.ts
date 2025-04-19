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

// Array of realistic tweet templates
const tweetTemplates = [
  // Sports related tweets
  "Just finished an amazing {sport} game! Score was {score} 🏆 #Sports",
  "Can't believe that {team} performance today! {player} was outstanding 🌟",
  "Training session was intense today. New personal best in {exercise} 💪 #Fitness",
  "Match day tomorrow against {opponent}! Let's bring home the win 🏃‍♂️",
  "What a comeback by {team}! From {score1} to {score2} in the last quarter!",
  "Proud to announce my partnership with {brand}! Exciting times ahead 🤝",
  "Recovery day after yesterday's {competition}. Time to rest and recharge 🧘‍♂️",
  "Thanks to all the fans who came out to support us today! Your energy was amazing 🙌",
  "Working on my {skill} technique. Always room for improvement 📈",
  "Big game coming up this weekend! Can't wait to face {opponent} 🏟️",
  // Random scores and stats
  "Season stats update: {stat1} in {games} games. Keep pushing! 📊",
  "New milestone reached: {achievement}! Thanks to my amazing team 🏆",
  "Watching {team1} vs {team2}. What a match! {score} 📺",
  // Lifestyle and motivation
  "Early morning workout completed ✅ Ready to tackle the day!",
  "Rest day activities: {activity}. Balance is key 🎯",
  "Grateful for another day of doing what I love 🙏",
  "Special shoutout to my coach {name} for always pushing me to be better 👊",
  "Film study session. Always learning, always growing 📚",
  "Community event today at {location}! Come say hi! 👋",
  "New gear day! Thanks {brand} for the awesome {equipment} 🎽"
];

const sports = ["basketball", "football", "soccer", "tennis", "baseball"];
const teams = ["Warriors", "Lakers", "Bulls", "Celtics", "Heat", "Nets", "Clippers"];
const players = ["LeBron", "Curry", "Durant", "Giannis", "Jokic", "Doncic"];
const brands = ["Nike", "Adidas", "Under Armour", "Puma", "New Balance"];
const exercises = ["squats", "deadlifts", "sprints", "vertical jump", "agility drills"];
const locations = ["local gym", "community center", "training facility", "stadium"];
const activities = ["yoga", "meditation", "recovery", "stretching", "massage"];
const equipment = ["shoes", "jersey", "gear", "equipment", "accessories"];

function generateRandomTweet(): string {
  const template = tweetTemplates[Math.floor(Math.random() * tweetTemplates.length)];
  return template
    .replace("{sport}", sports[Math.floor(Math.random() * sports.length)])
    .replace("{team}", teams[Math.floor(Math.random() * teams.length)])
    .replace("{player}", players[Math.floor(Math.random() * players.length)])
    .replace("{brand}", brands[Math.floor(Math.random() * brands.length)])
    .replace("{exercise}", exercises[Math.floor(Math.random() * exercises.length)])
    .replace("{opponent}", teams[Math.floor(Math.random() * teams.length)])
    .replace("{location}", locations[Math.floor(Math.random() * locations.length)])
    .replace("{activity}", activities[Math.floor(Math.random() * activities.length)])
    .replace("{equipment}", equipment[Math.floor(Math.random() * equipment.length)])
    .replace("{score}", `${Math.floor(Math.random() * 50)}-${Math.floor(Math.random() * 50)}`)
    .replace("{score1}", `${Math.floor(Math.random() * 50)}`)
    .replace("{score2}", `${Math.floor(Math.random() * 50)}`)
    .replace("{games}", `${Math.floor(Math.random() * 82)}`)
    .replace("{stat1}", `${Math.floor(Math.random() * 30)} points`)
    .replace("{achievement}", `${Math.floor(Math.random() * 1000)}th point`)
    .replace("{team1}", teams[Math.floor(Math.random() * teams.length)])
    .replace("{team2}", teams[Math.floor(Math.random() * teams.length)])
    .replace("{name}", players[Math.floor(Math.random() * players.length)]);
}

/**
 * Generates realistic simulated data for a given username
 */
function generateSimulatedData(username: string): SimulatedData {
  console.log("Generating simulated data for:", username);
  
  // Generate 200 unique mock posts
  const mockPosts: Post[] = Array.from({ length: 200 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365)); // Random date within last year
    
    return {
      id: `sim-${i}-${Date.now()}-${Math.random()}`,
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
  
  // Calculate sentiment distribution
  const overallSentiment: SentimentDistribution = {
    positive: Math.random() * 0.6 + 0.2,
    negative: Math.random() * 0.4,
    neutral: Math.random() * 0.5
  };
  
  // Normalize sentiment scores
  const sentimentSum = Object.values(overallSentiment).reduce((sum, val) => sum + val, 0);
  Object.keys(overallSentiment).forEach(key => {
    overallSentiment[key as keyof typeof overallSentiment] /= sentimentSum;
  });
  
  // Generate emotion analysis
  const emotionAnalysis: Emotion[] = ['joy', 'sadness', 'anger', 'surprise', 'fear']
    .map(type => ({
      type,
      score: Math.random()
    }))
    .sort((a, b) => b.score - a.score);
  
  // Normalize emotion scores
  const emotionSum = emotionAnalysis.reduce((sum, emotion) => sum + emotion.score, 0);
  emotionAnalysis.forEach(emotion => {
    emotion.score /= emotionSum;
  });
  
  return {
    platform: 'twitter',
    user: { 
      username,
      name: username,
      profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}-${Date.now()}`
    },
    posts: mockPosts,
    overallSentiment,
    emotions: emotionAnalysis,
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
