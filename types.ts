
export enum LearningLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum ContentTab {
  EXPLANATION = 'Explanation',
  RESOURCES = 'Resources',
  PREREQUISITES = 'Prerequisites',
  OVERVIEW = 'Overview'
}

export interface ResourceItem {
  title: string;
  description: string;
  url: string;
}

export interface PrerequisitesGroup {
  category: string;
  items: string[];
}

export interface LevelContent {
  explanation: string;
  resources: {
    videos: ResourceItem[];
    articles: ResourceItem[];
    courses: ResourceItem[];
    challenges: ResourceItem[];
  };
  prerequisites: PrerequisitesGroup[];
}

export interface TopicData {
  topic: string;
  levels: Record<LearningLevel, LevelContent | null>;
  visuals: Record<LearningLevel, string | null>;
}
