
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MessageCircle, Heart, Cloud } from "lucide-react";
import OverviewTab from "./OverviewTab";
import PostsTab from "./PostsTab";
import EmotionsTab from "./EmotionsTab";
import WordCloudTab from "./WordCloudTab";
import { getSentimentBadgeClass, getEmotionColor, getEmotionIcon } from "./utils";

interface AnalysisResultsProps {
  data: any;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  if (!data) return null;

  return (
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
          <TabsTrigger value="wordcloud" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">
            <Cloud className="h-4 w-4 mr-2" />
            Word Cloud
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="custom-slide-up">
          <OverviewTab data={data} getEmotionIcon={getEmotionIcon} getEmotionColor={getEmotionColor} />
        </TabsContent>
        
        <TabsContent value="posts" className="custom-slide-up">
          <PostsTab data={data} getSentimentBadgeClass={getSentimentBadgeClass} />
        </TabsContent>
        
        <TabsContent value="emotions" className="custom-slide-up">
          <EmotionsTab data={data} getEmotionIcon={getEmotionIcon} getEmotionColor={getEmotionColor} />
        </TabsContent>
        
        <TabsContent value="wordcloud" className="custom-slide-up">
          <WordCloudTab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
