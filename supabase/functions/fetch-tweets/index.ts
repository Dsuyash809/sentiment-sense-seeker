
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

/**
 * Generates realistic simulated data for a given username
 */
function generateSimulatedData(username: string): SimulatedData {
  console.log("Generating simulated data for:", username);
  
  // Create mock posts with realistic content
  const mockPosts: Post[] = Array.from({ length: 5 }, (_, i) => ({
    id: `sim-${i}-${Date.now()}`,
    content: [
      `Just watched an amazing game! Can't believe the score! #SportsFan`,
      `Training session was intense today. Making progress! 💪 #Fitness`,
      `What a match! The team showed great spirit today. #Champion`,
      `New personal record in today's workout! Feeling accomplished 🏃‍♂️`,
      `Game day tomorrow! Can't wait to hit the field! #Excited`
    ][i],
    date: new Date(Date.now() - i * 86400000).toISOString(),
    sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
    score: Math.random(),
    emotions: ['joy', 'sadness', 'anger', 'surprise', 'fear'].map(type => ({
      type,
      score: Math.random()
    })).sort((a, b) => b.score - a.score).slice(0, 3)
  }));
  
  // Calculate simulated sentiment distribution
  const overallSentiment: SentimentDistribution = {
    positive: Math.random() * 0.6 + 0.2,
    negative: Math.random() * 0.4,
    neutral: Math.random() * 0.5
  };
  
  // Normalize to sum to 1
  const sentimentSum = Object.values(overallSentiment).reduce((sum, val) => sum + val, 0);
  Object.keys(overallSentiment).forEach(key => {
    overallSentiment[key as keyof typeof overallSentiment] /= sentimentSum;
  });
  
  // Generate emotion analysis
  const emotionAnalysis: Emotion[] = ['joy', 'sadness', 'anger', 'surprise', 'fear'].map(type => ({
    type,
    score: Math.random()
  })).sort((a, b) => b.score - a.score);
  
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
      profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
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
