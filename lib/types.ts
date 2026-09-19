export type FeedItemType = "onthisday" | "challenge" | "chisme";

export interface FeedItem {
  type: FeedItemType;
  author: string;
  when: string;
  text: string;
  cta?: string;
  reactions?: string;
}

export interface Friend {
  name: string;
  fact?: string;
}

export interface Pilar {
  dia: string;
  tag: string;
  emoji: string;
  desc: string;
  ejemplos: string[];
}

export type TabKey = "feed" | "challenges" | "profiles";
