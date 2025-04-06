
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SentimentOverview from "@/components/SentimentOverview";
import SentimentTrends from "@/components/SentimentTrends";
import TrendingTopics from "@/components/TrendingTopics";
import EmotionBreakdown from "@/components/EmotionBreakdown";
import SocialMediaFeed from "@/components/SocialMediaFeed";
import SentimentAnalyzer from "@/components/SentimentAnalyzer";

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">SentimentSense Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time sentiment analysis of social media content
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sentiment Overview</CardTitle>
            <CardDescription>Current sentiment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentOverview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>Popular hashtags and keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendingTopics />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Emotion Breakdown</CardTitle>
            <CardDescription>Detailed emotional analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <EmotionBreakdown />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Sentiment Trends</CardTitle>
            <CardDescription>Sentiment changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentTrends />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Social Media Feed</CardTitle>
            <CardDescription>Recent posts with sentiment analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <SocialMediaFeed />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Analyze New Content</CardTitle>
          <CardDescription>Enter text to analyze sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <SentimentAnalyzer />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
