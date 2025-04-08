
import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TagCloud } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Use dynamic import to avoid SSR issues with react-wordcloud
const ReactWordcloud = dynamic(
  () => import("react-wordcloud").then((mod) => mod.default),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);

// Common words to be excluded from the analysis
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "for", "nor", "so", "yet",
  "to", "of", "in", "on", "at", "by", "for", "with", "about", "against",
  "i", "me", "my", "mine", "you", "your", "yours", "he", "him", "his",
  "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they",
  "them", "their", "theirs", "this", "that", "these", "those", "is", "am",
  "are", "was", "were", "be", "been", "being", "do", "does", "did", "will",
  "would", "shall", "should", "can", "could", "may", "might", "must", "have",
  "has", "had", "having", "rt", "via", "https", "http", "t.co"
]);

interface WordCloudTabProps {
  data: any;
}

const WordCloudTab: React.FC<WordCloudTabProps> = ({ data }) => {
  // Process the text data from posts to generate word cloud data
  const words = useMemo(() => {
    if (!data || !data.posts || !Array.isArray(data.posts)) {
      return [];
    }

    // Extract text from all posts
    const allText = data.posts.map((post: any) => post.content).join(" ");
    
    // Tokenize, normalize, and count word occurrences
    const wordCounts: Record<string, number> = {};
    allText
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 2 && !STOP_WORDS.has(word)) // Filter out small words and stop words
      .forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    
    // Convert to format expected by react-wordcloud
    return Object.entries(wordCounts)
      .filter(([_, count]) => count > 1) // Only include words that appear more than once
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value) // Sort by frequency
      .slice(0, 100); // Take top 100 words max
  }, [data]);

  const options = {
    colors: [
      "#34D399", // sentiment-positive
      "#F472B6", // sentiment-negative
      "#64748b", // sentiment-neutral
      "#FBBF24", // sentiment-joy
      "#3b82f6", // sentiment-sadness
      "#9333EA"  // sentiment-surprise
    ],
    enableTooltip: true,
    deterministic: true,
    fontFamily: "sans-serif",
    fontSizes: [15, 60],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 2,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
  };

  const callbacks = {
    getWordTooltip: (word: { text: string; value: number }) => `${word.text}: ${word.value} occurrences`
  };

  return (
    <Card className="glass-morphism border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gradient flex items-center">
          <TagCloud className="h-5 w-5 mr-2 text-primary" />
          Word Cloud Analysis
        </CardTitle>
        <CardDescription>
          Visualization of most frequently used words in the posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px] w-full bg-white/20 backdrop-blur-sm rounded-lg">
          {words && words.length > 0 ? (
            <ReactWordcloud words={words} options={options} callbacks={callbacks} />
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">Not enough data to generate a word cloud</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WordCloudTab;
