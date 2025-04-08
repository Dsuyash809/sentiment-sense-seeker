
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Import refactored components
import AnalyzerHeader from "@/components/social-analyzer/AnalyzerHeader";
import SearchForm from "@/components/social-analyzer/SearchForm";
import ErrorMessage from "@/components/social-analyzer/ErrorMessage";
import AnalysisResults from "@/components/social-analyzer/AnalysisResults";

const SocialAnalyzer: React.FC = () => {
  const { user, signOut } = useAuth();
  const [platform, setPlatform] = useState<'twitter' | 'instagram'>('twitter');
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  const { data, isLoading, isError, refetch, isRefetching, error } = useQuery({
    queryKey: ['socialAnalysis', platform, username],
    queryFn: async () => {
      if (!username) throw new Error('Please enter a username');
      
      try {
        const { data, error } = await supabase.functions.invoke('fetch-tweets', {
          body: { username, platform }
        });
        
        if (error) {
          console.error('Function error:', error);
          throw new Error(error.message || 'An error occurred while analyzing social media data');
        }
        
        return data;
      } catch (err: any) {
        console.error('Error fetching social data:', err);
        throw new Error(err.message || 'Failed to analyze social media data');
      }
    },
    enabled: false,
    retry: 1
  });

  const handleAnalyze = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a valid username to analyze.",
        variant: "destructive",
      });
      return;
    }

    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <AnalyzerHeader signOut={signOut} user={user} />

      <main className="container py-8 max-w-6xl mx-auto animate-fade-in">
        <Card className="glass-morphism shadow-lg border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-gradient">
              Social Media Analyzer
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter a username to analyze their social media posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <SearchForm
                platform={platform}
                setPlatform={setPlatform}
                username={username}
                setUsername={setUsername}
                handleAnalyze={handleAnalyze}
                isLoading={isLoading}
                isRefetching={isRefetching}
              />

              {isError && <ErrorMessage error={error instanceof Error ? error : null} />}

              {data && <AnalysisResults data={data} />}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SocialAnalyzer;
