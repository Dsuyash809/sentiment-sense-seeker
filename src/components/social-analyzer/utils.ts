import React from "react";
import { Heart, Activity, Frown, AlertTriangle, Brain, Smile, TagCloud } from "lucide-react";

export const getSentimentBadgeClass = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive': return 'bg-sentiment-positive/10 text-sentiment-positive';
    case 'negative': return 'bg-sentiment-negative/10 text-sentiment-negative';
    case 'neutral': return 'bg-sentiment-neutral/10 text-sentiment-neutral';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
  }
};

export const getEmotionColor = (emotion: string) => {
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

export const getEmotionIcon = (emotion: string) => {
  switch (emotion.toLowerCase()) {
    case 'joy':
      return React.createElement(Heart, { className: "h-4 w-4 text-sentiment-joy" });
    case 'anger':
      return React.createElement(Activity, { className: "h-4 w-4 text-sentiment-negative" });
    case 'sadness':
      return React.createElement(Frown, { className: "h-4 w-4 text-sentiment-sadness" });
    case 'fear':
      return React.createElement(AlertTriangle, { className: "h-4 w-4 text-purple-500" });
    case 'surprise':
      return React.createElement(Brain, { className: "h-4 w-4 text-sentiment-surprise" });
    case 'happiness':
      return React.createElement(Smile, { className: "h-4 w-4 text-sentiment-positive" });
    default:
      return React.createElement(Heart, { className: "h-4 w-4 text-gray-500" });
  }
};
