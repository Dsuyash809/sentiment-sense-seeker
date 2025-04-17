
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function validateEnvironmentVariables() {
  if (!API_KEY) throw new Error("Missing TWITTER_CONSUMER_KEY");
  if (!API_SECRET) throw new Error("Missing TWITTER_CONSUMER_SECRET");
  if (!ACCESS_TOKEN) throw new Error("Missing TWITTER_ACCESS_TOKEN");
  if (!ACCESS_TOKEN_SECRET) throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    validateEnvironmentVariables();
    
    const { username } = await req.json();
    if (!username) {
      throw new Error("Username is required");
    }

    const url = `https://api.twitter.com/2/users/by/username/${username}`;
    const bearerToken = btoa(`${API_KEY}:${API_SECRET}`);

    // First, get the user ID
    const userResponse = await fetch(url, {
      headers: {
        'Authorization': `Basic ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Then, fetch their tweets
    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=10`;
    const tweetsResponse = await fetch(tweetsUrl, {
      headers: {
        'Authorization': `Basic ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!tweetsResponse.ok) {
      throw new Error(`Failed to fetch tweets: ${tweetsResponse.statusText}`);
    }

    const tweetsData = await tweetsResponse.json();

    return new Response(JSON.stringify(tweetsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in fetch-tweets function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch tweets' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
