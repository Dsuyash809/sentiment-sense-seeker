
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SimulatedData } from './types';
import { generateUser, getRandomTweets } from './tweetGenerator';

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateSimulatedData(username: string): SimulatedData {
  const randomTweets = getRandomTweets(10);
  
  // Calculate sentiment distribution based on selected tweets
  const overallSentiment = {
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
    user: generateUser(),
    posts: randomTweets,
    overallSentiment,
    emotions,
    timestamp: new Date().toISOString(),
    _simulated: true
  };
}

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return handleRequest(req);
});

