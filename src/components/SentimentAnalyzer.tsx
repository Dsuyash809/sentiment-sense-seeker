
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSentiment } from "@/utils/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter text to analyze sentiment (e.g., 'I really love your product, it has improved my workflow significantly!')"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[100px]"
      />
      <Button onClick={handleAnalyze} disabled={!text.trim()}>
        Analyze Sentiment
      </Button>

      {result && (
        <Card className="mt-4 bg-muted/40">
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Sentiment Analysis Results</h3>
              <Badge
                className={`sentiment-badge-${result.sentiment}`}
              >
                {result.sentiment}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Sentiment Score</span>
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

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Emotion Detection</h4>
              <div className="space-y-1">
                {result.emotions.map((emotion) => (
                  <div key={emotion.type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{emotion.type}</span>
                      <span>{Math.round(emotion.score * 100)}%</span>
                    </div>
                    <Progress 
                      value={emotion.score * 100} 
                      className="h-1.5"
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
