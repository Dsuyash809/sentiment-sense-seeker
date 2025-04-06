
import { createHmac } from "node:crypto";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Twitter API credentials
const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function validateEnvironmentVariables() {
  if (!API_KEY) {
    throw new Error("Missing TWITTER_CONSUMER_KEY environment variable");
  }
  if (!API_SECRET) {
    throw new Error("Missing TWITTER_CONSUMER_SECRET environment variable");
  }
  if (!ACCESS_TOKEN) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN environment variable");
  }
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET environment variable");
  }
}

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
  return signature;
}

function generateOAuthHeader(method: string, url: string, additionalParams: Record<string, string> = {}): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
    ...additionalParams
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

// Function to get user timeline (tweets)
async function getUserTimeline(username: string, count: number = 10) {
  const baseUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json";
  const url = `${baseUrl}?screen_name=${encodeURIComponent(username)}&count=${count}&tweet_mode=extended&include_rts=false`;
  const method = "GET";
  
  console.log(`Fetching tweets for ${username}`);
  
  const oauthHeader = generateOAuthHeader(method, baseUrl, {
    screen_name: username,
    count: count.toString(),
    tweet_mode: "extended",
    include_rts: "false"
  });
  
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: oauthHeader,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Twitter API error: ${response.status} - ${errorText}`);
      throw new Error(`Twitter API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching tweets:", error);
    throw error;
  }
}

// Simple sentiment analysis function
function analyzeSentiment(text: string) {
  // List of positive and negative words for simple sentiment analysis
  const positiveWords = [
    "good", "great", "awesome", "fantastic", "excellent", "amazing", 
    "happy", "love", "best", "better", "improved", "thanks", "thank", 
    "beautiful", "perfect", "wonderful", "nice", "enjoy", "impressive"
  ];
  
  const negativeWords = [
    "bad", "worst", "terrible", "awful", "horrible", "hate", "dislike", 
    "poor", "disappointing", "disappointed", "sad", "angry", "failure", 
    "fail", "sucks", "wrong", "problem", "issue", "not working"
  ];

  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Count occurrences of positive and negative words
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) positiveCount += matches.length;
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) negativeCount += matches.length;
  });
  
  // Calculate sentiment score from -1 (negative) to 1 (positive)
  const total = positiveCount + negativeCount;
  let score = 0;
  
  if (total > 0) {
    score = (positiveCount - negativeCount) / total;
  }
  
  // Determine sentiment label
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (score > 0.2) {
    sentiment = 'positive';
  } else if (score < -0.2) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  // Normalize score to 0-1 range for UI display
  const normalizedScore = (score + 1) / 2;
  
  // Mock emotion analysis
  const emotions = [
    { type: 'happiness', score: Math.random() * normalizedScore + 0.2 },
    { type: 'sadness', score: Math.random() * (1 - normalizedScore) + 0.1 },
    { type: 'anger', score: Math.random() * (1 - normalizedScore) * 0.8 },
    { type: 'fear', score: Math.random() * 0.5 },
    { type: 'surprise', score: Math.random() * 0.7 }
  ].sort((a, b) => b.score - a.score);
  
  return {
    sentiment,
    score: normalizedScore,
    emotions
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    validateEnvironmentVariables();
    
    const { username, platform } = await req.json();
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Only process Twitter for now
    if (platform !== 'twitter') {
      return new Response(
        JSON.stringify({ error: "Only Twitter platform is supported currently" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Fetch tweets
    const tweets = await getUserTimeline(username);
    
    // Process the tweets for sentiment analysis
    const posts = tweets.map((tweet: any) => {
      const text = tweet.full_text || tweet.text;
      const sentimentData = analyzeSentiment(text);
      
      return {
        id: tweet.id_str,
        content: text,
        date: tweet.created_at,
        sentiment: sentimentData.sentiment,
        score: sentimentData.score,
        emotions: sentimentData.emotions
      };
    });
    
    // Calculate overall sentiment
    const positivePosts = posts.filter(post => post.sentiment === 'positive').length;
    const negativePosts = posts.filter(post => post.sentiment === 'negative').length;
    const neutralPosts = posts.filter(post => post.sentiment === 'neutral').length;
    const total = posts.length;
    
    const overallSentiment = {
      positive: total > 0 ? positivePosts / total : 0,
      negative: total > 0 ? negativePosts / total : 0,
      neutral: total > 0 ? neutralPosts / total : 0,
    };
    
    // Aggregate emotions
    const emotions = [
      { type: 'happiness', score: posts.reduce((sum, post) => sum + post.emotions.find(e => e.type === 'happiness')!.score, 0) / total },
      { type: 'sadness', score: posts.reduce((sum, post) => sum + post.emotions.find(e => e.type === 'sadness')!.score, 0) / total },
      { type: 'anger', score: posts.reduce((sum, post) => sum + post.emotions.find(e => e.type === 'anger')!.score, 0) / total },
      { type: 'fear', score: posts.reduce((sum, post) => sum + post.emotions.find(e => e.type === 'fear')!.score, 0) / total },
      { type: 'surprise', score: posts.reduce((sum, post) => sum + post.emotions.find(e => e.type === 'surprise')!.score, 0) / total }
    ].sort((a, b) => b.score - a.score);
    
    // Prepare the response data
    const analysisData = {
      posts,
      overallSentiment,
      emotions,
      timestamp: new Date().toISOString(),
      rawTweets: tweets, // Include raw tweets data for reference
    };
    
    return new Response(
      JSON.stringify(analysisData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: any) {
    console.error("Error in fetch-tweets function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while processing the request" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
