
import React from "react";
import { socialPostsData } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const SocialMediaFeed: React.FC = () => {
  return (
    <ScrollArea className="h-[300px] w-full pr-4">
      <div className="space-y-4">
        {socialPostsData.map((post) => (
          <div 
            key={post.id} 
            className="border rounded-lg p-3 space-y-2 transition-all hover:bg-accent/50"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {post.author.charAt(0)}
                </div>
                <div className="ml-2">
                  <p className="font-medium text-sm">{post.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <Badge
                className={`sentiment-badge-${post.sentiment}`}
              >
                {post.sentiment} ({Math.round(post.score * 100)}%)
              </Badge>
            </div>
            <p className="text-sm">{post.text}</p>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="text-xs">
                {post.platform}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SocialMediaFeed;
