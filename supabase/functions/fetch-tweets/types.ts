
export interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}

export interface Emotion {
  type: string;
  score: number;
}

export interface Post {
  id: string;
  content: string;
  date: string;
  sentiment: string;
  score: number;
  emotions: Emotion[];
}

export interface User {
  username: string;
  name: string;
  profile_image_url: string;
}

export interface SimulatedData {
  platform: string;
  user: User;
  posts: Post[];
  overallSentiment: SentimentDistribution;
  emotions: Emotion[];
  timestamp: string;
  _simulated: boolean;
}

