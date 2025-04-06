
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

// Mock sentiment analysis function
export const analyzeSentiment = (text: string): {
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  emotions: { type: string; score: number }[];
} => {
  // Simple mock implementation
  const lowerText = text.toLowerCase();
  
  // Very basic keyword matching for demo purposes
  const positiveWords = ["good", "great", "excellent", "amazing", "love", "happy", "best"];
  const negativeWords = ["bad", "terrible", "awful", "hate", "worst", "disappointed", "issue", "problem"];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  // Count positive and negative words
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore += 1;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore += 1;
  });
  
  // Calculate overall sentiment
  let sentiment: "positive" | "negative" | "neutral";
  let score: number;
  
  if (positiveScore > negativeScore) {
    sentiment = "positive";
    score = 0.5 + (positiveScore / (positiveScore + negativeScore)) * 0.5;
  } else if (negativeScore > positiveScore) {
    sentiment = "negative";
    score = 0.5 + (negativeScore / (positiveScore + negativeScore)) * 0.5;
  } else {
    sentiment = "neutral";
    score = 0.5;
  }
  
  // Mock emotion analysis
  const emotions = [
    { type: "Joy", score: Math.random() * (sentiment === "positive" ? 0.8 : 0.3) },
    { type: "Anger", score: Math.random() * (sentiment === "negative" ? 0.7 : 0.2) },
    { type: "Sadness", score: Math.random() * (sentiment === "negative" ? 0.6 : 0.2) },
    { type: "Surprise", score: Math.random() * 0.5 }
  ].sort((a, b) => b.score - a.score);
  
  return { sentiment, score, emotions };
};
