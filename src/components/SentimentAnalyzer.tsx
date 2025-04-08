
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSentiment } from "@/utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Send, BarChart, Smile, Frown, Meh, Activity, Clock, Heart, Brain } from "lucide-react";

const SentimentAnalyzer: React.FC = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    sentiment: "positive" | "negative" | "neutral";
    score: number;
    emotions: { type: string; score: number }[];
  } | null>(null);

  const handleAnalyze = () => {
    if (text.trim()) {
      setIsAnalyzing(true);
      // Simulate API call delay
      setTimeout(() => {
        setResult(analyzeSentiment(text));
        setIsAnalyzing(false);
      }, 1200);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="h-5 w-5 text-sentiment-positive animate-bounce-light" />;
      case "negative":
        return <Frown className="h-5 w-5 text-sentiment-negative animate-bounce-light" />;
      case "neutral":
        return <Meh className="h-5 w-5 text-sentiment-neutral animate-bounce-light" />;
      default:
        return null;
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "joy":
        return <Heart className="h-4 w-4" />;
      case "anger":
        return <Activity className="h-4 w-4" />;
      case "sadness":
        return <Clock className="h-4 w-4" />;
      case "surprise":
        return <Brain className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Textarea
        placeholder="Enter text to analyze sentiment (e.g., 'I really love your product, it has improved my workflow significantly!')"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[100px] input-modern"
      />
      <Button 
        onClick={handleAnalyze} 
        disabled={!text.trim() || isAnalyzing} 
        className="btn-primary"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin-slow h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Analyze Sentiment
          </>
        )}
      </Button>

      {isAnalyzing && (
        <Card className="mt-4 glass-morphism border-0 shadow-md animate-pulse-slow p-8 flex justify-center">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-primary/10 mb-3">
              <Brain className="h-6 w-6 text-primary animate-spin-slow" />
            </div>
            <p className="text-sm text-muted-foreground">Analyzing sentiment...</p>
          </div>
        </Card>
      )}

      {result && !isAnalyzing && (
        <Card className="mt-4 card-gradient border-0 shadow-lg custom-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              <span className="text-gradient">Sentiment Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center glass-morphism p-3 rounded-xl">
              <div className="flex items-center">
                {getSentimentIcon(result.sentiment)}
                <Badge
                  className={`sentiment-badge-${result.sentiment} ml-2`}
                >
                  {result.sentiment}
                </Badge>
              </div>
              <span className="text-sm font-medium badge-primary">{Math.round(result.score * 100)}% confidence</span>
            </div>

            <div className="space-y-1 glass-morphism p-3 rounded-xl">
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

            <div className="space-y-2 glass-morphism p-4 rounded-xl">
              <h4 className="text-sm font-medium">Emotion Detection</h4>
              <div className="space-y-3 mt-3">
                {result.emotions.map((emotion) => (
                  <div key={emotion.type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        {getEmotionIcon(emotion.type)}
                        <span className="capitalize ml-1.5">{emotion.type}</span>
                      </div>
                      <span className="font-medium">{Math.round(emotion.score * 100)}%</span>
                    </div>
                    <Progress 
                      value={emotion.score * 100} 
                      className="h-1.5"
                      indicatorClassName={
                        emotion.type === "joy" ? "bg-sentiment-joy" :
                        emotion.type === "sadness" ? "bg-sentiment-sadness" :
                        emotion.type === "anger" ? "bg-sentiment-negative" :
                        emotion.type === "fear" ? "bg-purple-500" :
                        emotion.type === "surprise" ? "bg-sentiment-surprise" :
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
