
import { Post, User } from './types.ts';
import * as mockData from './mockData.ts';

export function generateRandomTweet(): string {
  const template = mockData.tweetTemplates[Math.floor(Math.random() * mockData.tweetTemplates.length)];
  return template
    .replace("{sport}", mockData.sports[Math.floor(Math.random() * mockData.sports.length)])
    .replace("{team}", mockData.teams[Math.floor(Math.random() * mockData.teams.length)])
    .replace("{player}", mockData.players[Math.floor(Math.random() * mockData.players.length)])
    .replace("{college}", mockData.colleges[Math.floor(Math.random() * mockData.colleges.length)])
    .replace("{department}", mockData.departments[Math.floor(Math.random() * mockData.departments.length)])
    .replace("{state}", mockData.states[Math.floor(Math.random() * mockData.states.length)])
    .replace("{city}", mockData.cities[Math.floor(Math.random() * mockData.cities.length)])
    .replace("{minister}", mockData.ministers[Math.floor(Math.random() * mockData.ministers.length)])
    .replace("{policy}", mockData.policies[Math.floor(Math.random() * mockData.policies.length)])
    .replace("{topic}", mockData.topics[Math.floor(Math.random() * mockData.topics.length)])
    .replace("{festival}", mockData.festivals[Math.floor(Math.random() * mockData.festivals.length)])
    .replace("{monument}", mockData.monuments[Math.floor(Math.random() * mockData.monuments.length)])
    .replace("{event}", mockData.events[Math.floor(Math.random() * mockData.events.length)])
    .replace("{opponent}", mockData.teams[Math.floor(Math.random() * mockData.teams.length)])
    .replace("{score}", `${Math.floor(Math.random() * 200)}`);
}

export function generateUser(): User {
  const randomHandle = mockData.userHandles[Math.floor(Math.random() * mockData.userHandles.length)];
  return {
    username: randomHandle,
    name: randomHandle.replace(/[_-]/g, ' '),
    profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomHandle}-${Date.now()}`
  };
}

// Generate a pool of 500 tweets that we'll sample from
export const tweetPool: Post[] = Array.from({ length: 500 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  
  return {
    id: `tweet-${i}-${Date.now()}-${Math.random()}`,
    content: generateRandomTweet(),
    date: date.toISOString(),
    sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
    score: Math.random(),
    emotions: ['joy', 'sadness', 'anger', 'surprise', 'fear']
      .map(type => ({
        type,
        score: Math.random()
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  };
});

export function getRandomTweets(count: number): Post[] {
  const shuffled = [...tweetPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
