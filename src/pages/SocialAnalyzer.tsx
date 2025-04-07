
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  LogOut, 
  RefreshCw, 
  Twitter, 
  Instagram, 
  AlertTriangle, 
  BarChart3, 
  MessageCircle, 
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";

const SocialAnalyzer: React.FC = () => {
  const { user, signOut } = useAuth();
  const [platform, setPlatform] = useState<'twitter' | 'instagram'>('twitter');
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  // Modified to use our edge function with better error handling
  const { data, isLoading, isError, refetch, isRefetching, error } = useQuery({
    queryKey: ['socialAnalysis', platform, username],
    queryFn: async () => {
      if (!username) throw new Error('Please enter a username');
      
      try {
        const { data, error } = await supabase.functions.invoke('fetch-tweets', {
          body: { username, platform }
        });
        
        if (error) {
          console.error('Function error:', error);
          throw new Error(error.message || 'An error occurred while analyzing social media data');
        }
        
        return data;
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

  const getSentimentBadgeClass = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'neutral': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happiness': return 'bg-green-500';
      case 'sadness': return 'bg-blue-500';
      case 'anger': return 'bg-red-500';
      case 'fear': return 'bg-purple-500';
      case 'surprise': return 'bg-yellow-500';
      case 'joy': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover-scale">
              <ArrowLeft className="h-4 w-4" />
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SS</span>
              </div>
              <h1 className="text-xl font-bold text-card-foreground tracking-tight">
                SentimentSense
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-sm bg-secondary/50 px-3 py-1.5 rounded-full">
                <span className="text-muted-foreground mr-2">Hello,</span>
                <span className="font-medium">{user.user_metadata?.name || user.email}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => signOut()} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-6xl mx-auto animate-fade-in">
        <Card className="card-gradient shadow-lg border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Social Media Analyzer
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter a username to analyze their social media posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label htmlFor="platform" className="text-sm font-medium mb-2 block text-muted-foreground">
                    Platform
                  </label>
                  <Select 
                    value={platform} 
                    onValueChange={(value: 'twitter' | 'instagram') => setPlatform(value)}
                  >
                    <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm border border-border/50">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-blue-400" />
                          Twitter
                        </div>
                      </SelectItem>
                      <SelectItem value="instagram" disabled>
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-500" />
                          Instagram (Coming soon)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="username" className="text-sm font-medium mb-2 block text-muted-foreground">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder={`Enter ${platform} username (without @)`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/50 backdrop-blur-sm border border-border/50"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button 
                    onClick={handleAnalyze} 
                    className="w-full btn-gradient" 
                    disabled={isLoading || isRefetching || !username.trim()}
                  >
                    {(isLoading || isRefetching) ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze'
                    )}
                  </Button>
                </div>
              </div>

              {/* Error message display with improved UI */}
              {isError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-4 animate-slide-up">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
                      <p className="text-sm text-red-700 mt-1">
                        {error instanceof Error ? error.message : "There was an error processing your request. Please try again."}
                      </p>
                      <p className="text-xs text-red-600 mt-2">
                        Note: This is a demo application using simulated data. Real Twitter API connections are not enabled.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results section */}
              {data && (
                <div className="mt-8 animate-fade-in">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-4 bg-white/30 backdrop-blur-sm p-1 rounded-full">
                      <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-white">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="posts" className="rounded-full data-[state=active]:bg-white">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Posts Analysis
                      </TabsTrigger>
                      <TabsTrigger value="emotions" className="rounded-full data-[state=active]:bg-white">
                        <Heart className="h-4 w-4 mr-2" />
                        Emotion Breakdown
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <Card className="glass-card border-0">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold">Overall Sentiment Analysis</CardTitle>
                          <CardDescription>
                            Analysis of @{username}'s recent {platform === 'twitter' ? 'tweets' : 'posts'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(data.overallSentiment).map(([sentiment, score]) => (
                              <div key={sentiment} className="space-y-2 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-sm font-medium capitalize">{sentiment}</h3>
                                  <span className="text-sm font-semibold">{Math.round(Number(score) * 100)}%</span>
                                </div>
                                <Progress 
                                  value={Number(score) * 100} 
                                  className="h-2 bg-primary/20"
                                  indicatorClassName={`bg-${sentiment === 'positive' ? 'green' : sentiment === 'negative' ? 'red' : 'blue'}-500`}
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-8 bg-white/20 backdrop-blur-sm p-6 rounded-xl">
                            <h3 className="text-lg font-medium mb-4">Top Emotions</h3>
                            <div className="space-y-4">
                              {data.emotions.slice(0, 3).map((emotion: any) => (
                                <div key={emotion.type} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium capitalize">{emotion.type}</span>
                                    <span className="text-sm font-semibold">{Math.round(emotion.score * 100)}%</span>
                                  </div>
                                  <Progress 
                                    value={emotion.score * 100} 
                                    className="h-2 bg-white/30"
                                    indicatorClassName={getEmotionColor(emotion.type)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-6 text-sm text-muted-foreground">
                            <p>Analysis performed at {new Date(data.timestamp).toLocaleString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="posts">
                      <Card className="glass-card border-0">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold">Individual Posts Analysis</CardTitle>
                          <CardDescription>
                            Sentiment analysis of each post
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {data.posts.map((post: any) => (
                              <Card key={post.id} className="bg-white/30 backdrop-blur-sm border-0 hover:shadow-lg transition-all duration-300 hover-scale">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm">{post.content}</p>
                                    <Badge className={`${getSentimentBadgeClass(post.sentiment)}`}>
                                      {post.sentiment}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground mb-2">
                                    Posted on {new Date(post.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {post.emotions.slice(0, 3).map((emotion: any) => (
                                      <Badge 
                                        key={emotion.type} 
                                        variant="outline" 
                                        className="text-xs bg-white/50"
                                      >
                                        {emotion.type}: {Math.round(emotion.score * 100)}%
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="emotions">
                      <Card className="glass-card border-0">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold">Detailed Emotion Analysis</CardTitle>
                          <CardDescription>
                            Breakdown of emotional context across all analyzed posts
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.emotions.map((emotion: any) => (
                              <div key={emotion.type} className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="text-sm font-medium capitalize">{emotion.type}</h3>
                                  <span className="text-sm font-semibold">{Math.round(emotion.score * 100)}%</span>
                                </div>
                                <Progress 
                                  value={emotion.score * 100} 
                                  className="h-3 bg-white/30"
                                  indicatorClassName={getEmotionColor(emotion.type)}
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SocialAnalyzer;
