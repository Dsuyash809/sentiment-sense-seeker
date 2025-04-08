
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Smile, Frown, Meh, Clock } from "lucide-react";

interface OverviewTabProps {
  data: any;
  getEmotionIcon: (emotion: string) => JSX.Element;
  getEmotionColor: (emotion: string) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data, getEmotionIcon, getEmotionColor }) => {
  return (
    <Card className="glass-morphism border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gradient">Overall Sentiment Analysis</CardTitle>
        <CardDescription>
          Analysis of recent {data.platform === 'twitter' ? 'tweets' : 'posts'}
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
  );
};

export default OverviewTab;
