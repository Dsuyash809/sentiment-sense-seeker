
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data to simulate tweets
function generateMockTweets(username: string, count: number = 10) {
  const topics = ['technology', 'sports', 'politics', 'entertainment', 'business'];
  const sentiments = ['positive', 'negative', 'neutral'];
  const emotions = ['happiness', 'sadness', 'anger', 'fear', 'surprise'];
  
  // Generate random date in the past week
  const getRandomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    return date.toISOString();
  };
  
  // Generate random tweet content
  const generateTweetContent = (topic: string, sentiment: string) => {
    const positiveWords = ['great', 'amazing', 'excellent', 'love', 'happy', 'wonderful', 'exciting'];
    const negativeWords = ['terrible', 'awful', 'disappointed', 'hate', 'sad', 'frustrating', 'annoying'];
    const neutralWords = ['okay', 'fine', 'average', 'standard', 'normal', 'regular'];
    
    let wordPool;
    if (sentiment === 'positive') wordPool = positiveWords;
    else if (sentiment === 'negative') wordPool = negativeWords;
    else wordPool = neutralWords;
    
    const reactions = [
      `I ${wordPool[Math.floor(Math.random() * wordPool.length)]} this new development in ${topic}!`,
      `${topic} news today is ${wordPool[Math.floor(Math.random() * wordPool.length)]}.`,
      `My thoughts on the latest ${topic} trends: ${wordPool[Math.floor(Math.random() * wordPool.length)]}.`,
      `${wordPool[Math.floor(Math.random() * wordPool.length)].charAt(0).toUpperCase() + wordPool[Math.floor(Math.random() * wordPool.length)].slice(1)} experience with the new ${topic} changes.`,
      `Just experienced the ${topic} event. It was ${wordPool[Math.floor(Math.random() * wordPool.length)]}.`
    ];
    
    return reactions[Math.floor(Math.random() * reactions.length)];
  };
  
  // Generate mock tweets
  return Array.from({ length: count }, (_, i) => {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    // Generate sentiment-based content
    const content = generateTweetContent(topic, sentiment);
    
    // Generate random emotion scores with primary emotion matching sentiment
    let emotionScores = emotions.map(emotion => {
      let baseScore = Math.random() * 0.5; // Base random score
      
      // Adjust scores based on sentiment
      if (sentiment === 'positive' && emotion === 'happiness') {
        baseScore += 0.3; // Boost happiness for positive tweets
      } else if (sentiment === 'negative' && (emotion === 'sadness' || emotion === 'anger')) {
        baseScore += 0.3; // Boost negative emotions for negative tweets
      } else if (sentiment === 'neutral' && (emotion === 'surprise')) {
        baseScore += 0.2; // Boost surprise for neutral tweets
      }
      
      return { type: emotion, score: Math.min(baseScore, 0.95) }; // Cap at 0.95
    });
    
    // Sort emotions by score
    emotionScores = emotionScores.sort((a, b) => b.score - a.score);
    
    // Calculate sentiment score (0-1 range, higher = more positive)
    let sentimentScore;
    if (sentiment === 'positive') {
      sentimentScore = 0.7 + (Math.random() * 0.3); // 0.7-1.0
    } else if (sentiment === 'negative') {
      sentimentScore = Math.random() * 0.3; // 0.0-0.3
    } else {
      sentimentScore = 0.3 + (Math.random() * 0.4); // 0.3-0.7
    }
    
    return {
      id_str: `mock_${Date.now()}_${i}`,
      full_text: content,
      text: content, // For compatibility
      created_at: getRandomDate(),
      user: {
        screen_name: username,
        name: `${username} (Mock)`
      }
    };
  });
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
  
  // Generate emotion analysis with primary emotion matching sentiment
  let emotions = [];
  
  if (sentiment === 'positive') {
    emotions = [
      { type: 'happiness', score: 0.6 + Math.random() * 0.4 },
      { type: 'surprise', score: 0.3 + Math.random() * 0.4 },
      { type: 'sadness', score: Math.random() * 0.3 },
      { type: 'anger', score: Math.random() * 0.2 },
      { type: 'fear', score: Math.random() * 0.2 }
    ];
  } else if (sentiment === 'negative') {
    emotions = [
      { type: 'sadness', score: 0.5 + Math.random() * 0.5 },
      { type: 'anger', score: 0.4 + Math.random() * 0.4 },
      { type: 'fear', score: 0.3 + Math.random() * 0.4 },
      { type: 'surprise', score: Math.random() * 0.4 },
      { type: 'happiness', score: Math.random() * 0.2 }
    ];
  } else {
    emotions = [
      { type: 'surprise', score: 0.4 + Math.random() * 0.4 },
      { type: 'happiness', score: 0.2 + Math.random() * 0.4 },
      { type: 'sadness', score: 0.2 + Math.random() * 0.3 },
      { type: 'fear', score: 0.1 + Math.random() * 0.3 },
      { type: 'anger', score: 0.1 + Math.random() * 0.2 }
    ];
  }
  
  // Sort emotions by score
  emotions = emotions.sort((a, b) => b.score - a.score);
  
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
    
    console.log(`Generating mock tweets for ${username}`);
    
    // Generate mock tweets instead of fetching real ones
    const tweets = generateMockTweets(username, 10);
    
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
      rawTweets: tweets, // Include mock tweets data for reference
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
