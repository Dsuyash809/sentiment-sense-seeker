
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Import refactored components
import AnalyzerHeader from "@/components/social-analyzer/AnalyzerHeader";
import SearchForm from "@/components/social-analyzer/SearchForm";
import ErrorMessage from "@/components/social-analyzer/ErrorMessage";
import AnalysisResults from "@/components/social-analyzer/AnalysisResults";

// Mock data generator for demo purposes
const generateMockAnalysisData = (twitterData: any) => {
  // If we already have processed data, return it
  if (twitterData.posts && twitterData.emotions) {
    return twitterData;
  }

  const tweets = twitterData.data || [];
  const timestamp = new Date().toISOString();
  
  // Generate mock sentiment and emotion scores
  const sentiments = ['positive', 'negative', 'neutral'];
  const emotions = ['joy', 'sadness', 'anger', 'surprise', 'fear'];
  
  // Create mock analysis data
  const posts = tweets.map((tweet: any) => ({
    id: tweet.id,
    content: tweet.text,
    date: tweet.created_at,
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    score: Math.random(),
    emotions: emotions.map(type => ({
      type,
      score: Math.random()
    })).sort((a, b) => b.score - a.score).slice(0, 3)
  }));
  
  // Calculate overall sentiment distribution
  const overallSentiment = {
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
  const emotionAnalysis = emotions.map(type => ({
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
    user: twitterData.includes?.users?.[0] || { username },
    posts,
    overallSentiment,
    emotions: emotionAnalysis,
    timestamp,
    _simulated: twitterData._simulated || false,
    originalData: twitterData
  };
};

const SocialAnalyzer: React.FC = () => {
  const { user, signOut } = useAuth();
  const [platform, setPlatform] = useState<'twitter' | 'instagram'>('twitter');
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  const { data, isLoading, isError, refetch, isRefetching, error } = useQuery({
    queryKey: ['socialAnalysis', platform, username],
    queryFn: async () => {
      if (!username) throw new Error('Please enter a username');
      
      try {
        console.log(`Fetching data for ${username} on ${platform}`);
        const { data, error } = await supabase.functions.invoke('fetch-tweets', {
          body: { username, platform }
        });
        
        if (error) {
          console.error('Function error:', error);
          throw new Error(error.message || 'An error occurred while analyzing social media data');
        }
        
        console.log('Raw data received:', data);
        
        // Process and transform the data for our visualization components
        const processedData = generateMockAnalysisData(data);
        console.log('Processed data:', processedData);
        
        return processedData;
      } catch (err: any) {
        console.error('Error fetching social data:', err);
        throw new Error(err.message || 'Failed to analyze social media data');
      }
    },
    enabled: false,
    retry: 1
  });

  const handleAnalyze = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a valid username to analyze.",
        variant: "destructive",
      });
      return;
    }

    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <AnalyzerHeader signOut={signOut} user={user} />

      <main className="container py-8 max-w-6xl mx-auto animate-fade-in">
        <Card className="glass-morphism shadow-lg border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-gradient">
              Social Media Analyzer
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter a username to analyze their social media posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <SearchForm
                platform={platform}
                setPlatform={setPlatform}
                username={username}
                setUsername={setUsername}
                handleAnalyze={handleAnalyze}
                isLoading={isLoading}
                isRefetching={isRefetching}
              />

              {isError && <ErrorMessage error={error instanceof Error ? error : null} />}

              {data && <AnalysisResults data={data} />}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SocialAnalyzer;
