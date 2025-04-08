
import React from "react";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AnalyzerHeaderProps {
  signOut: () => void;
  user: any;
}

const AnalyzerHeader: React.FC<AnalyzerHeaderProps> = ({ signOut, user }) => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 hover-scale">
            <ArrowLeft className="h-4 w-4" />
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SS</span>
            </div>
            <h1 className="text-xl font-bold text-gradient tracking-tight">
              SentimentSense
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-sm glass-morphism px-3 py-1.5 rounded-full flex items-center">
              <User className="h-3.5 w-3.5 text-primary mr-1.5" />
              <span className="text-muted-foreground mr-1">Hello,</span>
              <span className="font-medium">{user.user_metadata?.name || user.email}</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => signOut()} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AnalyzerHeader;
