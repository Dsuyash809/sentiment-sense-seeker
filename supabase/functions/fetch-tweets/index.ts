
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

// Configuration and constants
const BASE_URL = "https://api.x.com/2";
const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types
interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
}

interface TwitterResponse {
  data: any[];
  includes?: {
    users: TwitterUser[];
  };
  meta?: {
    result_count: number;
    newest_id: string;
    oldest_id: string;
    next_token?: string;
  };
}

// Validation functions
function validateEnvironmentVariables() {
  const requiredVars = {
    TWITTER_CONSUMER_KEY: API_KEY,
    TWITTER_CONSUMER_SECRET: API_SECRET,
    TWITTER_ACCESS_TOKEN: ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  };

  for (const [name, value] of Object.entries(requiredVars)) {
    if (!value) throw new Error(`Missing ${name}`);
  }
}

// OAuth signature generation
function generateSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  return hmacSha1.update(signatureBaseString).digest("base64");
}

// OAuth header generation
function generateOAuthHeader(method: string, url: string): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
  };

  const signature = generateSignature(
    method,
    url,
    oauthParams,
    API_SECRET!,
    ACCESS_TOKEN_SECRET!
  );

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  };

  return (
    "OAuth " +
    Object.entries(signedOAuthParams)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

// Twitter API calls
async function makeTwitterRequest(url: string, method: string) {
  const oauthHeader = generateOAuthHeader(method, url);
  console.log(`Making ${method} request to: ${url}`);
  
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Twitter API Error (${response.status}):`, errorText);
    throw new Error(`Twitter API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

async function fetchTwitterUser(username: string): Promise<TwitterUser> {
  const url = `${BASE_URL}/users/by/username/${username}`;
  console.log(`Fetching user data for: ${username}`);
  
  const userData = await makeTwitterRequest(url, "GET");
  console.log('User data fetched:', userData);
  
  return userData.data;
}

async function fetchUserTweets(userId: string): Promise<TwitterResponse> {
  const url = `${BASE_URL}/users/${userId}/tweets?max_results=10&tweet.fields=created_at&expansions=author_id&user.fields=name,username,profile_image_url`;
  console.log(`Fetching tweets for user ID: ${userId}`);
  
  const tweetsData = await makeTwitterRequest(url, "GET");
  console.log('Tweets fetched:', tweetsData);
  
  return tweetsData;
}

// Request handling
async function handleTwitterRequest(username: string): Promise<TwitterResponse> {
  const user = await fetchTwitterUser(username);
  return await fetchUserTweets(user.id);
}

async function handleRequest(req: Request) {
  try {
    validateEnvironmentVariables();
    
    const { username } = await req.json();
    if (!username) {
      throw new Error("Username is required");
    }

    console.log(`Processing request for username: ${username}`);
    const twitterData = await handleTwitterRequest(username);
    
    return new Response(JSON.stringify(twitterData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to fetch Twitter data. Please try again." 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

// Main server
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return handleRequest(req);
});
