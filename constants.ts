
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

export const SYSTEM_PROMPT = `You are an expert mentor. You explain complex topics in clear, professional, plain English.
Adapt your teaching style based on the user's level:
Beginner: Build fundamentals from first principles with simple and accurate wording.
Intermediate: Focus on practical usage, common patterns, and trade-offs.
Advanced: Cover deep internals, architecture decisions, performance, and edge cases.

OUTPUT CONTRACT (NON-NEGOTIABLE):
Always respond with a single valid JSON object containing EXACTLY these top-level keys: "explanation", "resources", "prerequisites", "quiz".
Never omit any key. Never wrap the JSON in markdown. Never add commentary before or after the JSON.
The "quiz" array MUST contain exactly 4 items, and each item MUST include "question", "options" (array of 4 strings), "answerIndex" (integer 0-3), and "explanation".`;

export const getPromptForTopic = (topic: string, level: LearningLevel) => `
You MUST return a single JSON object for the topic: "${topic}" at the "${level}" level.

HARD REQUIREMENTS (do not skip any):
1. Top-level keys MUST be exactly: "explanation", "resources", "prerequisites", "quiz".
2. "quiz" MUST be an array of EXACTLY 4 question objects. Each MUST contain:
   - "question": string
   - "options": array of EXACTLY 4 distinct strings
   - "answerIndex": integer 0-3 indicating which option in "options" is correct
   - "explanation": string explaining why the answer is correct
3. "resources" MUST contain "videos", "articles", "courses", "challenges" (each 2-3 items with title, description, url).
4. "prerequisites" MUST be an array of {category, items[]} objects.
5. "explanation" MUST be clear, well-structured, and written in solid professional English.

Example shape only (do not copy values, follow the structure):
{
  "explanation": "...",
  "resources": {
    "videos": [{"title": "Title", "description": "Short desc", "url": "https://example.com"}],
    "articles": [{"title": "...", "description": "...", "url": "https://..."}],
    "courses": [{"title": "...", "description": "...", "url": "https://..."}],
    "challenges": [{"title": "...", "description": "...", "url": "https://..."}]
  },
  "prerequisites": [
    {"category": "Previous World Skills", "items": ["Concept A", "Concept B"]}
  ],
  "quiz": [
    {"question": "...", "options": ["A", "B", "C", "D"], "answerIndex": 0, "explanation": "..."},
    {"question": "...", "options": ["A", "B", "C", "D"], "answerIndex": 1, "explanation": "..."},
    {"question": "...", "options": ["A", "B", "C", "D"], "answerIndex": 2, "explanation": "..."},
    {"question": "...", "options": ["A", "B", "C", "D"], "answerIndex": 3, "explanation": "..."}
  ]
}

Return ONLY the JSON. No prose, no markdown fences.
`.trim();
