
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
import { ArrowLeft, LogOut, RefreshCw, Twitter, Instagram, AlertTriangle } from "lucide-react";
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'neutral': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happiness': return 'bg-green-500';
      case 'sadness': return 'bg-blue-500';
      case 'anger': return 'bg-red-500';
      case 'fear': return 'bg-purple-500';
      case 'surprise': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
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
              <div className="text-sm">
                <span className="text-muted-foreground mr-2">Signed in as:</span>
                <span className="font-medium">{user.email}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Social Media Analyzer</CardTitle>
            <CardDescription>
              Enter a username to analyze their social media posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label htmlFor="platform" className="text-sm font-medium mb-2 block">
                    Platform
                  </label>
                  <Select 
                    value={platform} 
                    onValueChange={(value: 'twitter' | 'instagram') => setPlatform(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </div>
                      </SelectItem>
                      <SelectItem value="instagram" disabled>
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          Instagram (Coming soon)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="username" className="text-sm font-medium mb-2 block">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder={`Enter ${platform} username (without @)`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button 
                    onClick={handleAnalyze} 
                    className="w-full" 
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
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
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
                <div className="mt-8">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="posts">Posts Analysis</TabsTrigger>
                      <TabsTrigger value="emotions">Emotion Breakdown</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <Card>
                        <CardHeader>
                          <CardTitle>Overall Sentiment Analysis</CardTitle>
                          <CardDescription>
                            Analysis of {username}'s recent {platform === 'twitter' ? 'tweets' : 'posts'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(data.overallSentiment).map(([sentiment, score]) => (
                              <div key={sentiment} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-sm font-medium capitalize">{sentiment}</h3>
                                  <span className="text-sm">{Math.round(Number(score) * 100)}%</span>
                                </div>
                                <Progress 
                                  value={Number(score) * 100} 
                                  className="h-2"
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4">Top Emotions</h3>
                            <div className="space-y-4">
                              {data.emotions.slice(0, 3).map((emotion: any) => (
                                <div key={emotion.type} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium capitalize">{emotion.type}</span>
                                    <span className="text-sm">{Math.round(emotion.score * 100)}%</span>
                                  </div>
                                  <Progress 
                                    value={emotion.score * 100} 
                                    className={`h-2 ${getEmotionColor(emotion.type)} bg-opacity-20`}
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
                      <Card>
                        <CardHeader>
                          <CardTitle>Individual Posts Analysis</CardTitle>
                          <CardDescription>
                            Sentiment analysis of each post
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {data.posts.map((post: any) => (
                              <Card key={post.id} className="p-4 shadow-sm border">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="text-sm">{post.content}</p>
                                  <Badge className={`${getSentimentColor(post.sentiment)} text-white`}>
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
                                      className="text-xs"
                                    >
                                      {emotion.type}: {Math.round(emotion.score * 100)}%
                                    </Badge>
                                  ))}
                                </div>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="emotions">
                      <Card>
                        <CardHeader>
                          <CardTitle>Detailed Emotion Analysis</CardTitle>
                          <CardDescription>
                            Breakdown of emotional context across all analyzed posts
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {data.emotions.map((emotion: any) => (
                              <div key={emotion.type} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-sm font-medium capitalize">{emotion.type}</h3>
                                  <span className="text-sm">{Math.round(emotion.score * 100)}%</span>
                                </div>
                                <Progress 
                                  value={emotion.score * 100} 
                                  className={`h-3 ${getEmotionColor(emotion.type)} bg-opacity-20`}
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
