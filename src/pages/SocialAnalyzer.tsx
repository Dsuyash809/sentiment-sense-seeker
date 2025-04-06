
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type Platform = "twitter" | "instagram";
type PostAnalysis = {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  emotions: { type: string; score: number }[];
};

const SocialAnalyzer: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [username, setUsername] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PostAnalysis[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // This is a placeholder for actual API integration
      // In a real app, you would connect to Twitter/Instagram APIs through a backend
      
      // For demo purposes, we'll generate mock data
      setTimeout(() => {
        const mockResults = generateMockAnalysis(platform, username);
        setResults(mockResults);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis complete",
          description: `Analyzed ${mockResults.length} ${platform === "twitter" ? "tweets" : "posts"} from @${username}`,
        });
      }, 2000);
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the social media content.",
        variant: "destructive",
      });
    }
  };

  // Helper function to generate sentiment summary data
  const getSentimentSummary = () => {
    if (!results.length) return [];
    
    const counts = {
      positive: 0,
      negative: 0,
      neutral: 0
    };
    
    results.forEach(post => {
      counts[post.sentiment]++;
    });
    
    return [
      { name: "Positive", value: counts.positive, color: "#4ade80" },
      { name: "Negative", value: counts.negative, color: "#f87171" },
      { name: "Neutral", value: counts.neutral, color: "#94a3b8" }
    ];
  };

  // Helper function to generate emotion summary data
  const getEmotionSummary = () => {
    if (!results.length) return [];
    
    const emotions: Record<string, number> = {};
    
    results.forEach(post => {
      post.emotions.forEach(emotion => {
        if (!emotions[emotion.type]) {
          emotions[emotion.type] = 0;
        }
        emotions[emotion.type] += emotion.score;
      });
    });
    
    // Convert to array and sort by score
    return Object.entries(emotions)
      .map(([name, value]) => ({ 
        name, 
        value: value / results.length, 
        color: getEmotionColor(name)
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Helper function to get color for emotions
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      "joy": "#facc15",
      "sadness": "#3b82f6",
      "anger": "#ef4444",
      "fear": "#a855f7",
      "surprise": "#ec4899",
      "disgust": "#84cc16",
      "love": "#f472b6",
      "humor": "#fb923c"
    };
    
    return colors[emotion.toLowerCase()] || "#94a3b8";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Social Media Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze sentiment and emotions from social media posts
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Select Platform and Username</CardTitle>
          <CardDescription>
            Choose a social media platform and enter a username to analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <Select
                value={platform}
                onValueChange={(value) => setPlatform(value as Platform)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="flex w-full items-center space-x-2">
                <span className="text-muted-foreground">@</span>
                <Input
                  placeholder={`Enter ${platform} username`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !username.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <Tabs defaultValue="posts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="space-y-4">
              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-4">
                  {results.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {post.author.charAt(0)}
                            </div>
                            <div className="ml-2">
                              <p className="font-medium text-sm">{post.author}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(post.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`
                              ${post.sentiment === "positive" 
                                ? "bg-sentiment-positive" 
                                : post.sentiment === "negative" 
                                  ? "bg-sentiment-negative" 
                                  : "bg-sentiment-neutral"
                              }`
                            }
                          >
                            {post.sentiment} ({Math.round(post.score * 100)}%)
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-4">{post.content}</p>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Emotions</h4>
                          <div className="space-y-1">
                            {post.emotions.map((emotion) => (
                              <div key={emotion.type} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{emotion.type}</span>
                                  <span>{Math.round(emotion.score * 100)}%</span>
                                </div>
                                <Progress 
                                  value={emotion.score * 100} 
                                  className="h-1.5"
                                  indicatorClassName={`bg-[${getEmotionColor(emotion.type)}]`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="summary">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Sentiment Distribution</CardTitle>
                    <CardDescription>Overall sentiment breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getSentimentSummary()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {getSentimentSummary().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Emotion Analysis</CardTitle>
                    <CardDescription>Top emotions detected</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getEmotionSummary().slice(0, 5)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {getEmotionSummary().slice(0, 5).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

// Mock data generator
const generateMockAnalysis = (platform: Platform, username: string): PostAnalysis[] => {
  const emotions = ["joy", "sadness", "anger", "fear", "surprise", "disgust", "love", "humor"];
  const results: PostAnalysis[] = [];
  
  // Generate 10 mock posts
  for (let i = 0; i < 10; i++) {
    const sentiment = ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)] as "positive" | "negative" | "neutral";
    const score = sentiment === "neutral" 
      ? 0.4 + Math.random() * 0.2 
      : 0.6 + Math.random() * 0.4;
    
    // Generate 2-4 emotions for each post
    const postEmotions = [];
    const emotionCount = 2 + Math.floor(Math.random() * 3);
    const shuffledEmotions = [...emotions].sort(() => 0.5 - Math.random());
    
    for (let j = 0; j < emotionCount; j++) {
      postEmotions.push({
        type: shuffledEmotions[j],
        score: 0.2 + Math.random() * 0.8
      });
    }
    
    // Normalize emotion scores to sum to 1
    const totalScore = postEmotions.reduce((sum, emotion) => sum + emotion.score, 0);
    postEmotions.forEach(emotion => {
      emotion.score = emotion.score / totalScore;
    });
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    results.push({
      id: `post-${i}`,
      author: username,
      content: generateMockContent(platform, sentiment),
      timestamp: date.toISOString(),
      sentiment,
      score: sentiment === "neutral" ? 0.5 : score,
      emotions: postEmotions
    });
  }
  
  return results;
};

// Generate mock content based on platform and sentiment
const generateMockContent = (platform: Platform, sentiment: string): string => {
  const contents = {
    twitter: {
      positive: [
        "Just had the most amazing experience with this product! Highly recommend! 🌟",
        "The latest update is incredibly helpful. So impressed with the improvements! #innovation",
        "Can't believe how quick the customer service was today. Kudos to the team! 👏",
        "This is game-changing! Absolutely love how it's transformed my workflow!",
        "The best decision I made this year was switching to this service. Worth every penny!"
      ],
      negative: [
        "Extremely disappointed with the quality. Definitely not what I expected. 😡",
        "The new interface is so confusing. Why change something that worked perfectly fine?",
        "Waited for hours just to be told they couldn't help. Worst service ever.",
        "This app keeps crashing every time I try to use it. Fix this immediately!",
        "Not worth the hype at all. Save your money and look elsewhere."
      ],
      neutral: [
        "Just got the new update. Trying to figure out how everything works now.",
        "Interesting approach to solving this problem. Not sure if it'll catch on though.",
        "Here's my unboxing of the latest product. Will share my thoughts after using it.",
        "Anyone else notice the change in policy? Wondering what prompted this.",
        "The features are comprehensive but might be overwhelming for new users."
      ]
    },
    instagram: {
      positive: [
        "Absolutely loving this view! Nature never disappoints. ❤️ #blessed #naturelovers",
        "Best day ever with my favorite people! Creating memories that will last a lifetime. ✨",
        "Finally achieved my fitness goal! The journey was worth every drop of sweat. 💪 #motivation",
        "This new café is a hidden gem! The atmosphere is perfect and the coffee is divine. ☕",
        "Grateful for these moments of peace and reflection. Finding joy in the simple things. 🙏"
      ],
      negative: [
        "Worst travel experience ever. Don't book with this company unless you want your vacation ruined. 😠",
        "So disappointed with this restaurant. Overpriced and underwhelming food. Not coming back.",
        "The quality of this product is terrible. Completely falling apart after just one week. #ripoff",
        "Can't believe how rude the staff was today. Customer service seems to be a forgotten concept.",
        "Traffic has been a nightmare all week. City planning needs serious improvement. 🚗😤"
      ],
      neutral: [
        "Just another day at the office. Working through the project deadlines one by one.",
        "Weather forecast says rain tomorrow. Might need to reschedule the outdoor activities.",
        "Trying out this new recipe tonight. Let's see how it turns out compared to the original.",
        "The exhibition was interesting. Different from what I expected but worth checking out.",
        "Taking a social media break next week. Will be back with updates soon."
      ]
    }
  };
  
  const options = contents[platform][sentiment as keyof typeof contents[typeof platform]];
  return options[Math.floor(Math.random() * options.length)];
};

export default SocialAnalyzer;
