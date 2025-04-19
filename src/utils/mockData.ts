// Mock data types
export interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
}

export interface TrendingTopic {
  topic: string;
  count: number;
  sentiment: "positive" | "negative" | "neutral";
}

export interface EmotionData {
  emotion: string;
  value: number;
  color: string;
}

export interface TrendData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface SocialPost {
  id: string;
  author: string;
  text: string;
  platform: "twitter" | "facebook" | "instagram";
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
}

// Mock sentiment overview data
export const sentimentOverviewData: SentimentData = {
  positive: 45,
  negative: 30,
  neutral: 25
};

// Mock trending topics
export const trendingTopicsData: TrendingTopic[] = [
  { topic: "#CustomerService", count: 1250, sentiment: "positive" },
  { topic: "#ProductLaunch", count: 980, sentiment: "positive" },
  { topic: "#AppIssues", count: 650, sentiment: "negative" },
  { topic: "#IndustryNews", count: 450, sentiment: "neutral" },
  { topic: "#Feedback", count: 320, sentiment: "neutral" }
];

// Mock emotion data
export const emotionData: EmotionData[] = [
  { emotion: "Joy", value: 35, color: "#f59e0b" },
  { emotion: "Satisfaction", value: 25, color: "#10b981" },
  { emotion: "Anger", value: 15, color: "#dc2626" },
  { emotion: "Sadness", value: 10, color: "#3b82f6" },
  { emotion: "Surprise", value: 8, color: "#8b5cf6" },
  { emotion: "Other", value: 7, color: "#6b7280" }
];

// Mock trend data
export const trendData: TrendData[] = [
  { date: "Jan", positive: 30, negative: 15, neutral: 20 },
  { date: "Feb", positive: 40, negative: 20, neutral: 22 },
  { date: "Mar", positive: 45, negative: 25, neutral: 20 },
  { date: "Apr", positive: 55, negative: 18, neutral: 18 },
  { date: "May", positive: 50, negative: 25, neutral: 16 },
  { date: "Jun", positive: 45, negative: 30, neutral: 22 },
  { date: "Jul", positive: 65, negative: 20, neutral: 25 }
];

// Mock social media posts
export const socialPostsData: SocialPost[] = [
  {
    id: "1",
    author: "JaneDoe",
    text: "Just had an amazing experience with your customer service team! They resolved my issue in minutes. #Impressed",
    platform: "twitter",
    timestamp: "2025-04-06T14:30:00",
    sentiment: "positive",
    score: 0.92
  },
  {
    id: "2",
    author: "JohnSmith",
    text: "The new update is causing my app to crash every time I try to upload photos. Please fix this ASAP!",
    platform: "facebook",
    timestamp: "2025-04-06T13:15:00",
    sentiment: "negative",
    score: 0.87
  },
  {
    id: "3",
    author: "TechEnthusiast",
    text: "Looking forward to seeing what features will be included in the next release. Any hints?",
    platform: "twitter",
    timestamp: "2025-04-06T12:45:00",
    sentiment: "neutral",
    score: 0.76
  },
  {
    id: "4",
    author: "MarketingPro",
    text: "The interface is so intuitive. Makes my workflow so much smoother. Thanks for the thoughtful design!",
    platform: "instagram",
    timestamp: "2025-04-06T11:20:00",
    sentiment: "positive",
    score: 0.95
  },
  {
    id: "5",
    author: "FrustatedUser",
    text: "Billing issue for the third month in a row. Ready to switch to a competitor if this isn't fixed immediately.",
    platform: "facebook",
    timestamp: "2025-04-06T10:05:00",
    sentiment: "negative",
    score: 0.89
  }
];

// Improved sentiment analysis function with better pattern recognition
export const analyzeSentiment = (text: string): {
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  emotions: { type: string; score: number }[];
} => {
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase().trim();
  
  // Enhanced positive patterns with more complex sentences and contexts
  const positivePatterns = [
    // Direct expressions
    /\bi('| a)?m happy\b/i,
    /\bi('| a)?m glad\b/i,
    /\bi('| a)?m delighted\b/i,
    /\bi('| a)?m pleased\b/i,
    /\bi('| a)?m excited\b/i,
    /\bi('| a)?m thrilled\b/i,
    /\bi('| a)?m content\b/i,
    /\bi('| a)?m joyful\b/i,
    
    // Positive emotion words
    /\bhappy\b/i, /\bjoy\b/i, /\blove\b/i, /\bgreat\b/i, /\bamazing\b/i, /\bexcellent\b/i,
    /\bfantastic\b/i, /\bwonderful\b/i, /\bsuperb\b/i, /\bimpressive\b/i, /\bpleasant\b/i,
    /\bdelighted\b/i, /\bsatisfied\b/i, /\bthankful\b/i, /\bgrateful\b/i,
    
    // Complex positive phrases
    /\breally (like|love|enjoy)\b/i,
    /\bvery (good|well|nice)\b/i,
    /\bextremely (helpful|useful|beneficial)\b/i,
    /\bexceeded (expectations|hopes)\b/i,
    /\bappreciate\b/i,
    /\bimpressed\b/i,
    /\bthank you\b/i,
    /\bthanks\b/i,
    /\bkudos\b/i,
    /\bwell done\b/i,
    /\bgreat job\b/i,
    /\bperfect\b/i,
    /\bimpressive\b/i,
    
    // Additional positive terms
    /\bhelpful\b/i,
    /\bbeautiful\b/i,
    /\bexcited\b/i,
    /\bawesome\b/i,
    /\bglad\b/i,
    /\bpleasure\b/i,
    /\bsuccess\b/i,
    /\bbrilliant\b/i,
    /\bhope\b/i,
    /\bwish\b/i,
    /\bgood\b/i
  ];
  
  // Enhanced negative patterns with more complex sentences and contexts
  const negativePatterns = [
    // Direct expressions
    /\bi('| a)?m sad\b/i,
    /\bi('| a)?m unhappy\b/i,
    /\bi('| a)?m depressed\b/i,
    /\bi('| a)?m upset\b/i,
    /\bi('| a)?m angry\b/i,
    /\bi('| a)?m frustrated\b/i,
    /\bi('| a)?m disappointed\b/i,
    /\bi('| a)?m worried\b/i,
    
    // Negative emotion words
    /\bsad\b/i, /\bangry\b/i, /\bupset\b/i, /\bhate\b/i, /\bterrible\b/i, /\bawful\b/i,
    /\bpoor\b/i, /\bdisappointing\b/i, /\bunfortunate\b/i, /\bfail\b/i, /\bhorrible\b/i,
    /\bdisappointed\b/i, /\bfrustrated\b/i, /\birritated\b/i, /\bannoy(ed|ing)\b/i,
    
    // Complex negative phrases
    /\breally (hate|dislike|annoyed)\b/i,
    /\bvery (bad|poor|disappointing)\b/i,
    /\bextremely (frustrating|annoying|irritating)\b/i,
    /\bnot working\b/i,
    /\bdidn't work\b/i,
    /\bfailed to\b/i,
    /\bcouldn't\b/i,
    /\bnever\b/i,
    /\bwaste of\b/i,
    /\bterrible experience\b/i,
    /\bissue\b/i,
    /\bproblem\b/i,
    /\bbug\b/i,
    /\bbroken\b/i,
    /\bfix\b/i
  ];
  
  // Weighted sentiment matching - count matches but give higher weight to stronger expressions
  let positiveScore = 0;
  let negativeScore = 0;
  
  // Check for positive patterns with weighted scoring
  positivePatterns.forEach((pattern, index) => {
    const matches = (lowerText.match(pattern) || []).length;
    // First patterns are stronger direct expressions, give them higher weight
    const weight = index < 8 ? 2.0 : 1.0; 
    positiveScore += matches * weight;
  });
  
  // Check for negative patterns with weighted scoring
  negativePatterns.forEach((pattern, index) => {
    const matches = (lowerText.match(pattern) || []).length;
    // First patterns are stronger direct expressions, give them higher weight
    const weight = index < 8 ? 2.0 : 1.0;
    negativeScore += matches * weight;
  });
  
  // Check for negation patterns that flip sentiment
  const negations = [
    /\bnot\b/i, /\bno\b/i, /\bnever\b/i, /\bcan't\b/i, /\bcannot\b/i, 
    /\bwon't\b/i, /\bwouldn't\b/i, /\bdidn't\b/i, /\bdoesn't\b/i,
    /\bisn't\b/i, /\baren't\b/i, /\bwasn't\b/i, /\bweren't\b/i
  ];
  
  // If negation exists near positive words, it might flip the sentiment
  let negationCount = 0;
  negations.forEach(pattern => {
    negationCount += (lowerText.match(pattern) || []).length;
  });
  
  // Simple negation handling - if negations are present and positive score is higher, 
  // reduce positive impact and potentially increase negative
  if (negationCount > 0 && positiveScore > negativeScore) {
    const transferAmount = Math.min(positiveScore * 0.5, negationCount);
    positiveScore -= transferAmount;
    negativeScore += transferAmount;
  }
  
  // Contextual analysis - certain phrases might have context-specific sentiment
  const contextualPhrases = [
    { pattern: /\bcouldn't be happier\b/i, positive: 2.0, negative: 0 },
    { pattern: /\bcouldn't be better\b/i, positive: 2.0, negative: 0 },
    { pattern: /\bnot bad\b/i, positive: 0.5, negative: 0 },
    { pattern: /\bnot good\b/i, positive: 0, negative: 0.5 },
    { pattern: /\bso good\b/i, positive: 1.5, negative: 0 },
    { pattern: /\bso bad\b/i, positive: 0, negative: 1.5 },
  ];
  
  // Apply contextual phrase scoring
  contextualPhrases.forEach(phrase => {
    if (phrase.pattern.test(lowerText)) {
      positiveScore += phrase.positive;
      negativeScore += phrase.negative;
    }
  });
  
  // Determine sentiment based on scores with a lower threshold for classifying as positive/negative
  let sentiment: "positive" | "negative" | "neutral";
  let score: number;
  
  const totalScore = positiveScore + negativeScore;
  const neutralThreshold = 0.15; // Lowered threshold for neutral classification
  
  if (totalScore < neutralThreshold) {
    // Not enough sentiment signals, classify as neutral
    sentiment = "neutral";
    score = 0.5;
  } else if (positiveScore > negativeScore) {
    sentiment = "positive";
    // Normalize score between 0.5 and 1.0
    score = 0.5 + (0.5 * (positiveScore / (positiveScore + negativeScore)));
  } else {
    sentiment = "negative";
    // Normalize score between 0.0 and 0.5
    score = 0.5 - (0.5 * (negativeScore / (positiveScore + negativeScore)));
  }
  
  // Generate emotion analysis based on sentiment
  let emotions;
  
  if (sentiment === "positive") {
    emotions = [
      { type: "joy", score: 0.3 + (Math.random() * 0.7) },
      { type: "surprise", score: Math.random() * 0.6 },
      { type: "sadness", score: Math.random() * 0.1 },
      { type: "anger", score: Math.random() * 0.05 }
    ];
  } else if (sentiment === "negative") {
    emotions = [
      { type: "sadness", score: 0.3 + (Math.random() * 0.5) },
      { type: "anger", score: 0.2 + (Math.random() * 0.5) },
      { type: "fear", score: Math.random() * 0.4 },
      { type: "joy", score: Math.random() * 0.1 }
    ];
  } else {
    emotions = [
      { type: "surprise", score: 0.2 + (Math.random() * 0.3) },
      { type: "joy", score: 0.1 + (Math.random() * 0.3) },
      { type: "sadness", score: 0.1 + (Math.random() * 0.2) },
      { type: "anger", score: Math.random() * 0.2 }
    ];
  }
  
  // Sort emotions by score
  emotions.sort((a, b) => b.score - a.score);
  
  return { sentiment, score, emotions };
};
