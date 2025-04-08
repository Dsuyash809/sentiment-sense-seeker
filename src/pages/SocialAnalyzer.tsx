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
  Heart,
  TrendingUp,
  User,
  Share2,
  Search,
  Smile,
  Frown,
  Meh,
  Clock,
  Activity,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";

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
      case 'positive': return 'bg-sentiment-positive/10 text-sentiment-positive';
      case 'negative': return 'bg-sentiment-negative/10 text-sentiment-negative';
      case 'neutral': return 'bg-sentiment-neutral/10 text-sentiment-neutral';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happiness': return 'bg-sentiment-positive';
      case 'sadness': return 'bg-sentiment-sadness';
      case 'anger': return 'bg-sentiment-negative';
      case 'fear': return 'bg-purple-500';
      case 'surprise': return 'bg-sentiment-surprise';
      case 'joy': return 'bg-sentiment-joy';
      default: return 'bg-gray-500';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'joy':
        return <Heart className="h-4 w-4 text-sentiment-joy" />;
      case 'anger':
        return <Activity className="h-4 w-4 text-sentiment-negative" />;
      case 'sadness':
        return <Frown className="h-4 w-4 text-sentiment-sadness" />;
      case 'fear':
        return <AlertTriangle className="h-4 w-4 text-purple-500" />;
      case 'surprise':
        return <Brain className="h-4 w-4 text-sentiment-surprise" />;
      case 'happiness':
        return <Smile className="h-4 w-4 text-sentiment-positive" />;
      default:
        return <Heart className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover-scale">
              <ArrowLeft className="h-4 w-4" />
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SS</span>
              </div>
              <h1 className="text-xl font-bold text-gradient tracking-tight">
                SentimentSense
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-sm glass-morphism px-3 py-1.5 rounded-full flex items-center">
                <User className="h-3.5 w-3.5 text-primary mr-1.5" />
                <span className="text-muted-foreground mr-1">Hello,</span>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label htmlFor="platform" className="text-sm font-medium mb-2 block text-muted-foreground">
                    Platform
                  </label>
                  <Select 
                    value={platform} 
                    onValueChange={(value: 'twitter' | 'instagram') => setPlatform(value)}
                  >
                    <SelectTrigger className="w-full input-modern">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="dropdown-modern">
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
                    className="input-modern"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button 
                    onClick={handleAnalyze} 
                    className="w-full btn-primary" 
                    disabled={isLoading || isRefetching || !username.trim()}
                  >
                    {(isLoading || isRefetching) ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isError && (
                <div className="bg-sentiment-negative/5 border border-sentiment-negative/20 rounded-xl p-4 mt-4 custom-slide-up">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-sentiment-negative mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-sentiment-negative">Analysis Failed</h3>
                      <p className="text-sm text-sentiment-negative/80 mt-1">
                        {error instanceof Error ? error.message : "There was an error processing your request. Please try again."}
                      </p>
                      <p className="text-xs text-sentiment-negative/70 mt-2">
                        Note: This is a demo application using simulated data. Real Twitter API connections are not enabled.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {data && (
                <div className="mt-8 animate-fade-in">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-4 glass-morphism p-1 rounded-full">
                      <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="posts" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Posts Analysis
                      </TabsTrigger>
                      <TabsTrigger value="emotions" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">
                        <Heart className="h-4 w-4 mr-2" />
                        Emotion Breakdown
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="custom-slide-up">
                      <Card className="glass-morphism border-none">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold text-gradient">Overall Sentiment Analysis</CardTitle>
                          <CardDescription>
                            Analysis of @{username}'s recent {platform === 'twitter' ? 'tweets' : 'posts'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(data.overallSentiment).map(([sentiment, score]) => (
                              <div key={sentiment} className="space-y-2 glass-morphism p-4 rounded-xl card-hover">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-sm font-medium capitalize flex items-center">
                                    {sentiment === 'positive' && <Smile className="h-4 w-4 mr-1.5 text-sentiment-positive" />}
                                    {sentiment === 'negative' && <Frown className="h-4 w-4 mr-1.5 text-sentiment-negative" />}
                                    {sentiment === 'neutral' && <Meh className="h-4 w-4 mr-1.5 text-sentiment-neutral" />}
                                    {sentiment}
                                  </h3>
                                  <span className="text-sm font-semibold badge-modern bg-white/20">
                                    {Math.round(Number(score) * 100)}%
                                  </span>
                                </div>
                                <Progress 
                                  value={Number(score) * 100} 
                                  className="h-2 bg-white/10"
                                  indicatorClassName={`${
                                    sentiment === 'positive' ? 'bg-sentiment-positive' : 
                                    sentiment === 'negative' ? 'bg-sentiment-negative' : 
                                    'bg-sentiment-neutral'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-8 glass-morphism p-6 rounded-xl">
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                              Top Emotions
                            </h3>
                            <div className="space-y-4">
                              {data.emotions.slice(0, 3).map((emotion: any) => (
                                <div key={emotion.type} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium capitalize flex items-center">
                                      {getEmotionIcon(emotion.type)}
                                      <span className="ml-1.5">{emotion.type}</span>
                                    </span>
                                    <span className="text-sm font-semibold">{Math.round(emotion.score * 100)}%</span>
                                  </div>
                                  <Progress 
                                    value={emotion.score * 100} 
                                    className="h-2 bg-white/20"
                                    indicatorClassName={getEmotionColor(emotion.type)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-6 text-sm text-muted-foreground flex items-center justify-end">
                            <Clock className="h-4 w-4 mr-1.5 opacity-70" />
                            <p>Analysis performed at {new Date(data.timestamp).toLocaleString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="posts" className="custom-slide-up">
                      <Card className="glass-morphism border-none">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold text-gradient">Individual Posts Analysis</CardTitle>
                          <CardDescription>
                            Sentiment analysis of each post
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {data.posts.map((post: any, index: number) => (
                              <Card 
                                key={post.id} 
                                className="bg-white/30 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 card-hover"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm">{post.content}</p>
                                    <Badge className={`badge-modern ml-2 ${getSentimentBadgeClass(post.sentiment)}`}>
                                      {post.sentiment}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground mb-2 flex items-center">
                                    <Clock className="h-3 w-3 mr-1 opacity-70" />
                                    Posted on {new Date(post.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {post.emotions.slice(0, 3).map((emotion: any) => (
                                      <Badge 
                                        key={emotion.type} 
                                        variant="outline" 
                                        className="badge-modern bg-white/40"
                                      >
                                        {emotion.type}: {Math.round(emotion.score * 100)}%
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex justify-end mt-3">
                                    <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10 text-primary">
                                      <Share2 className="h-3 w-3 mr-1" />
                                      Share
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="emotions" className="custom-slide-up">
                      <Card className="glass-morphism border-none">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold text-gradient">Detailed Emotion Analysis</CardTitle>
                          <CardDescription>
                            Breakdown of emotional context across all analyzed posts
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.emotions.map((emotion: any, index: number) => (
                              <div 
                                key={emotion.type} 
                                className="glass-morphism p-4 rounded-xl card-hover"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="text-sm font-medium capitalize flex items-center">
                                    {getEmotionIcon(emotion.type)}
                                    <span className="ml-1.5">{emotion.type}</span>
                                  </h3>
                                  <span className="text-sm font-semibold badge-modern bg-white/20">
                                    {Math.round(emotion.score * 100)}%
                                  </span>
                                </div>
                                <Progress 
                                  value={emotion.score * 100} 
                                  className="h-3 bg-white/20"
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
