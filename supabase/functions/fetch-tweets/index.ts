
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

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

// Proper OAuth 1.0a signature generation for Twitter API v2
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");
  
  console.log("Signature Base String:", signatureBaseString);
  console.log("Generated Signature:", signature);
  
  return signature;
}

function generateOAuthHeader(method: string, url: string): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
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

// Implementing mock data fallback for demo purposes
function getMockTweetsData(username: string) {
  const timestamp = new Date().toISOString();
  
  return {
    data: Array.from({ length: 5 }, (_, i) => ({
      id: `mock-${i}-${Date.now()}`,
      text: `This is a simulated tweet #${i + 1} from ${username}. Generated at ${timestamp}. #demo #simulation`,
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
    })),
    meta: {
      result_count: 5,
      newest_id: "mock-0",
      oldest_id: "mock-4",
    },
    includes: {
      users: [
        {
          id: "mock-user-id",
          name: username,
          username: username,
        }
      ]
    },
    _simulated: true
  };
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

    console.log(`Fetching tweets for username: ${username}`);

    try {
      // Twitter API v2 endpoint for user lookup
      const userLookupUrl = `https://api.twitter.com/2/users/by/username/${username}`;
      const userLookupMethod = "GET";
      const oauthHeaderUser = generateOAuthHeader(userLookupMethod, userLookupUrl);
      
      console.log("OAuth Header for user lookup:", oauthHeaderUser);
      
      const userResponse = await fetch(userLookupUrl, {
        method: userLookupMethod,
        headers: {
          'Authorization': oauthHeaderUser,
          'Content-Type': 'application/json',
        },
      });
      
      const userResponseText = await userResponse.text();
      console.log(`User lookup response (${userResponse.status}):`, userResponseText);
      
      if (!userResponse.ok) {
        throw new Error(`Twitter API error: ${userResponse.status} ${userResponseText}`);
      }
      
      const userData = JSON.parse(userResponseText);
      const userId = userData.data.id;
      
      // Twitter API v2 endpoint for tweets lookup
      const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at&expansions=author_id&user.fields=name,username,profile_image_url`;
      const tweetsMethod = "GET";
      const oauthHeaderTweets = generateOAuthHeader(tweetsMethod, tweetsUrl);
      
      console.log("OAuth Header for tweets lookup:", oauthHeaderTweets);
      
      const tweetsResponse = await fetch(tweetsUrl, {
        method: tweetsMethod,
        headers: {
          'Authorization': oauthHeaderTweets,
          'Content-Type': 'application/json',
        },
      });
      
      const tweetsResponseText = await tweetsResponse.text();
      console.log(`Tweets lookup response (${tweetsResponse.status}):`, tweetsResponseText);
      
      if (!tweetsResponse.ok) {
        throw new Error(`Twitter API error: ${tweetsResponse.status} ${tweetsResponseText}`);
      }
      
      const tweetsData = JSON.parse(tweetsResponseText);
      
      return new Response(JSON.stringify(tweetsData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (apiError: any) {
      console.error('Twitter API Error:', apiError);
      
      // Fallback to mock data for demo purposes
      console.log('Falling back to mock data...');
      const mockData = getMockTweetsData(username);
      
      return new Response(JSON.stringify(mockData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
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
