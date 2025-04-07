
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSentiment } from "@/utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Send, BarChart, Smile, Frown, Meh } from "lucide-react";

const SentimentAnalyzer: React.FC = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    sentiment: "positive" | "negative" | "neutral";
    score: number;
    emotions: { type: string; score: number }[];
  } | null>(null);

  const handleAnalyze = () => {
    if (text.trim()) {
      setResult(analyzeSentiment(text));
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="h-5 w-5 text-sentiment-positive" />;
      case "negative":
        return <Frown className="h-5 w-5 text-sentiment-negative" />;
      case "neutral":
        return <Meh className="h-5 w-5 text-sentiment-neutral" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Textarea
        placeholder="Enter text to analyze sentiment (e.g., 'I really love your product, it has improved my workflow significantly!')"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[100px] bg-white/50 backdrop-blur-sm border border-border/50 focus:border-primary/50 transition-all duration-300"
      />
      <Button onClick={handleAnalyze} disabled={!text.trim()} className="btn-gradient">
        <Send className="mr-2 h-4 w-4" />
        Analyze Sentiment
      </Button>

      {result && (
        <Card className="mt-4 card-gradient border-0 shadow-lg animate-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Sentiment Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <div className="flex items-center">
                {getSentimentIcon(result.sentiment)}
                <Badge
                  className={`sentiment-badge-${result.sentiment} ml-2`}
                >
                  {result.sentiment}
                </Badge>
              </div>
              <span className="text-sm font-medium">{Math.round(result.score * 100)}% confidence</span>
            </div>

            <div className="space-y-1 bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Sentiment Score</span>
                <span>{Math.round(result.score * 100)}%</span>
              </div>
              <Progress 
                value={result.score * 100} 
                className={`h-2 ${
                  result.sentiment === "positive" 
                    ? "bg-sentiment-positive/20" 
                    : result.sentiment === "negative" 
                      ? "bg-sentiment-negative/20" 
                      : "bg-sentiment-neutral/20"
                }`}
                indicatorClassName={`
                  ${result.sentiment === "positive" 
                    ? "bg-sentiment-positive" 
                    : result.sentiment === "negative" 
                      ? "bg-sentiment-negative" 
                      : "bg-sentiment-neutral"
                  }`
                }
              />
            </div>

            <div className="space-y-2 bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <h4 className="text-sm font-medium">Emotion Detection</h4>
              <div className="space-y-3 mt-2">
                {result.emotions.map((emotion) => (
                  <div key={emotion.type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{emotion.type}</span>
                      <span className="font-medium">{Math.round(emotion.score * 100)}%</span>
                    </div>
                    <Progress 
                      value={emotion.score * 100} 
                      className="h-1.5"
                      indicatorClassName={
                        emotion.type === "joy" ? "bg-amber-500" :
                        emotion.type === "sadness" ? "bg-blue-500" :
                        emotion.type === "anger" ? "bg-red-500" :
                        emotion.type === "fear" ? "bg-purple-500" :
                        emotion.type === "surprise" ? "bg-yellow-500" :
                        "bg-gray-500"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SentimentAnalyzer;
