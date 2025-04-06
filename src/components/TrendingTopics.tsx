
import React from "react";
import { trendingTopicsData } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";

const TrendingTopics: React.FC = () => {
  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {trendingTopicsData.map((topic) => (
          <li key={topic.topic} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium">{topic.topic}</span>
              <Badge 
                className={`ml-2 ${
                  topic.sentiment === "positive" 
                    ? "bg-sentiment-positive" 
                    : topic.sentiment === "negative" 
                    ? "bg-sentiment-negative" 
                    : "bg-sentiment-neutral"
                }`}
              >
                {topic.sentiment}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{topic.count} mentions</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingTopics;
