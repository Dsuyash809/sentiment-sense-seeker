
import React from "react";
import { Link } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

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
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground hidden md:block">
              Social Media Sentiment Analysis Tool
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login"><LogIn className="mr-2 h-4 w-4" /> Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Welcome to SentimentSense</h2>
          <Button asChild>
            <Link to="/social-analyzer">Try Social Media Analyzer</Link>
          </Button>
        </div>
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
