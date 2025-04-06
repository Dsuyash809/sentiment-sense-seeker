
import React from "react";
import Dashboard from "@/components/Dashboard";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SS</span>
            </div>
            <h1 className="text-xl font-bold text-card-foreground tracking-tight">
              SentimentSense
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Social Media Sentiment Analysis Tool
          </div>
        </div>
      </header>
      
      <main className="container py-6">
        <Dashboard />
      </main>
      
      <footer className="border-t bg-muted/40">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          SentimentSense — Designed for Design Thinking & Innovation Project © 2025
        </div>
      </footer>
    </div>
  );
};

export default Index;
