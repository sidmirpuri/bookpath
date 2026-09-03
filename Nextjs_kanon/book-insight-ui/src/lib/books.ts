export type ReadingLevel = "beginner" | "intermediate" | "advanced";

export interface ReadingLevelOption {
  value: ReadingLevel;
  title: string;
  description: string;
}

export const READING_LEVELS: ReadingLevelOption[] = [
  {
    value: "beginner",
    title: "Beginner",
    description: "New to the topic, looking for foundational knowledge.",
  },
  {
    value: "intermediate",
    title: "Intermediate Reading",
    description: "Have some knowledge, ready to deepen my understanding.",
  },
  {
    value: "advanced",
    title: "Advanced Reading",
    description: "Looking for in-depth insights and expert perspectives.",
  },
];

export interface Book {
  title: string;
  // The current catalog has no author data, so this stays optional rather
  // than showing a made-up value.
  author?: string;
  category: string;
  description: string;
  whyThisBook: string;
  amazonUrl?: string;
  coverImageUrl?: string;
}
