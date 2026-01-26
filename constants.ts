
import { LearningLevel } from './types';

export const COLORS = {
  MARIO_RED: '#E52521',
  MARIO_GREEN: '#43B047',
  MARIO_YELLOW: '#FBD000',
  MARIO_BLUE: '#049CD8',
  BACKGROUND: '#050a14',
  SECONDARY_BG: '#0d1526',
  TEXT_HEADING: '#ffffff',
  TEXT_BODY: '#cbd5e1',
};

export const LEVEL_DESCRIPTIONS = {
  [LearningLevel.BEGINNER]: "Super Mushroom: Basics and analogies.",
  [LearningLevel.INTERMEDIATE]: "Fire Flower: Practical patterns and use cases.",
  [LearningLevel.ADVANCED]: "Super Star: Mastery and system internals."
};

export const SYSTEM_PROMPT = `You are an expert mentor themed as a wise video game character. You explain complex topics with clarity and fun game-related analogies when appropriate.
Adapt your teaching style based on the user's power-up level:
Beginner (Super Mushroom): Grow their knowledge from the ground up. Use simple terms and everyday analogies.
Intermediate (Fire Flower): Give them the power to use the concept. Focus on patterns, application, and common pits to jump over.
Advanced (Super Star): Invincible mastery. Deep architectural internals, performance tradeoffs, and industry system design.`;

export const getPromptForTopic = (topic: string, level: LearningLevel) => `
Provide a comprehensive learning quest for the topic: "${topic}" at the "${level}" level.
Respond in JSON format with the following structure:
{
  "explanation": "A clear, well-structured explanation with paragraphs and bullet points. Feel free to use 1-2 gaming analogies if helpful.",
  "resources": {
    "videos": [{"title": "Title", "description": "Short desc", "url": "https://example.com"}],
    "articles": [...],
    "courses": [...],
    "challenges": [...]
  },
  "prerequisites": [
    {"category": "Previous World Skills", "items": ["Concept A", "Concept B"]}
  ]
}
Each resource section should have 2-3 high-quality items.
`;
