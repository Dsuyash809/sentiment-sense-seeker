
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Twitter } from "lucide-react";

interface SearchFormProps {
  platform: 'twitter' | 'instagram';
  setPlatform: (value: 'twitter' | 'instagram') => void;
  username: string;
  setUsername: (value: string) => void;
  handleAnalyze: () => void;
  isLoading: boolean;
  isRefetching: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  platform,
  setPlatform,
  username,
  setUsername,
  handleAnalyze,
  isLoading,
  isRefetching
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <label htmlFor="platform" className="text-sm font-medium mb-2 block text-muted-foreground">
          Platform
        </label>
        <Select 
          value={platform} 
          onValueChange={(value: 'twitter' | 'instagram') => setPlatform(value)}
        >
          <SelectTrigger className="w-full input-modern">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent className="dropdown-modern">
            <SelectItem value="twitter">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter/X
              </div>
            </SelectItem>
            <SelectItem value="instagram" disabled>
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-500" />
                Instagram (Coming soon)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="username" className="text-sm font-medium mb-2 block text-muted-foreground">
          Username
        </label>
        <Input
          id="username"
          placeholder="Enter Twitter handle (without @)"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace('@', ''))}
          className="input-modern"
        />
      </div>
      <div className="md:col-span-1 flex items-end">
        <Button 
          type="submit"
          className="w-full btn-primary" 
          disabled={isLoading || isRefetching || !username.trim()}
        >
          {(isLoading || isRefetching) ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
