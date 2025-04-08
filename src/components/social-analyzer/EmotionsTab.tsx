
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmotionsTabProps {
  data: any;
  getEmotionIcon: (emotion: string) => JSX.Element;
  getEmotionColor: (emotion: string) => string;
}

const EmotionsTab: React.FC<EmotionsTabProps> = ({ data, getEmotionIcon, getEmotionColor }) => {
  return (
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
  );
};

export default EmotionsTab;
