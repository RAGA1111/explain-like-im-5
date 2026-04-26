
import { GoogleGenAI, Type } from "@google/genai";
import { AIProvider, LearningLevel, LevelContent } from "../types";
import { SYSTEM_PROMPT, getPromptForTopic } from "../constants";

// The API key must be obtained exclusively from the environment variable VITE_GEMINI_API_KEY.
const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const normalizeLevelContent = (raw: any): LevelContent => {
  const safeResources = raw?.resources ?? {};
  return {
    explanation: raw?.explanation ?? "No explanation generated.",
    resources: {
      videos: Array.isArray(safeResources.videos) ? safeResources.videos : [],
      articles: Array.isArray(safeResources.articles) ? safeResources.articles : [],
      courses: Array.isArray(safeResources.courses) ? safeResources.courses : [],
      challenges: Array.isArray(safeResources.challenges) ? safeResources.challenges : [],
    },
    prerequisites: Array.isArray(raw?.prerequisites) ? raw.prerequisites : [],
    quiz: Array.isArray(raw?.quiz) ? raw.quiz : [],
  };
};

const extractJson = (text: string): any => {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }
  const codeBlockMatch = trimmed.match(/```json\s*([\s\S]*?)```/i) ?? trimmed.match(/```\s*([\s\S]*?)```/i);
  if (codeBlockMatch?.[1]) {
    return JSON.parse(codeBlockMatch[1]);
  }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
  }
  throw new Error("Model did not return valid JSON.");
};

const toFriendlyProviderError = (err: unknown, fallback: string): Error => {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes("quota") || lower.includes("resource_exhausted") || lower.includes("429")) {
    return new Error("Provider quota exceeded. Switch provider to Groq or try again later.");
  }
  if (lower.includes("api key") || lower.includes("unauthorized") || lower.includes("401")) {
    return new Error("Invalid or missing API key. Update your .env file and restart dev server.");
  }
  if (lower.includes("rate")) {
    return new Error("Rate limit reached. Please wait a moment and retry.");
  }

  return new Error(fallback);
};

const fetchWithGemini = async (topic: string, level: LearningLevel): Promise<LevelContent> => {
  try {
    const ai = getAI();
    const prompt = getPromptForTopic(topic, level);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            resources: {
              type: Type.OBJECT,
              properties: {
                videos: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, url: { type: Type.STRING } } } },
                articles: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, url: { type: Type.STRING } } } },
                courses: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, url: { type: Type.STRING } } } },
                challenges: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, url: { type: Type.STRING } } } }
              }
            },
            prerequisites: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, items: { type: Type.ARRAY, items: { type: Type.STRING } } } }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                }
              }
            }
          },
          required: ["explanation", "resources", "prerequisites", "quiz"]
        }
      }
    });

    const jsonStr = response.text || "{}";
    return normalizeLevelContent(JSON.parse(jsonStr));
  } catch (err) {
    throw toFriendlyProviderError(err, "Failed to generate lesson content with Gemini.");
  }
};

const fetchWithGroq = async (topic: string, level: LearningLevel): Promise<LevelContent> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Groq provider selected but VITE_GROQ_API_KEY is missing.");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        max_tokens: 4096,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "system",
            content:
              'Reminder: respond with a single JSON object containing exactly these keys: "explanation", "resources", "prerequisites", "quiz". The "quiz" array MUST contain exactly 4 items. Never omit "quiz". Never wrap in markdown.',
          },
          { role: "user", content: getPromptForTopic(topic, level) },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const text = payload?.choices?.[0]?.message?.content ?? "{}";
    return normalizeLevelContent(extractJson(text));
  } catch (err) {
    throw toFriendlyProviderError(err, "Failed to generate lesson content with Groq.");
  }
};

export const fetchLevelContent = async (
  topic: string,
  level: LearningLevel,
  provider: AIProvider = AIProvider.GEMINI
): Promise<LevelContent> => {
  return provider === AIProvider.GROQ ? fetchWithGroq(topic, level) : fetchWithGemini(topic, level);
};

export const generateOverviewVisual = async (
  topic: string,
  level: LearningLevel,
  provider: AIProvider = AIProvider.GEMINI
): Promise<string> => {
  if (provider === AIProvider.GROQ) {
    throw new Error("Visual overview is currently available only with Gemini provider.");
  }
  try {
    const ai = getAI();
    const complexity = level === LearningLevel.BEGINNER 
      ? "simple, high-level conceptual diagram" 
      : level === LearningLevel.INTERMEDIATE 
      ? "structured process flow or relationship map" 
      : "detailed system architecture and internal mechanics";

    const prompt = `Create an educational conceptual visual for the topic "${topic}". 
    The visualization should be a ${complexity}. 
    Use a clean, premium, dark-themed aesthetic with blue and gray tones. 
    Ensure it looks professional and aids learning.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data returned.");
  } catch (err) {
    throw toFriendlyProviderError(err, "Failed to generate overview visual.");
  }
};
