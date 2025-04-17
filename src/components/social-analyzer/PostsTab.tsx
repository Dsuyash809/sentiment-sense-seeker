
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Share2 } from "lucide-react";

interface PostsTabProps {
  data: any;
  getSentimentBadgeClass: (sentiment: string) => string;
}

const PostsTab: React.FC<PostsTabProps> = ({ data, getSentimentBadgeClass }) => {
  return (
    <Card className="glass-morphism border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gradient">Individual Posts Analysis</CardTitle>
        <CardDescription>
          Sentiment analysis of each post
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.posts.map((post: any, index: number) => (
            <Card 
              key={post.id} 
              className="bg-white/30 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">{post.content}</p>
                  <Badge className={`badge-modern ml-2 ${getSentimentBadgeClass(post.sentiment)}`}>
                    {post.sentiment}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1 opacity-70" />
                  Posted on {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.emotions && post.emotions.slice(0, 3).map((emotion: any) => (
                    <Badge 
                      key={emotion.type} 
                      variant="outline" 
                      className="badge-modern bg-white/40"
                    >
                      {emotion.type}: {Math.round(emotion.score * 100)}%
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10 text-primary">
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostsTab;
