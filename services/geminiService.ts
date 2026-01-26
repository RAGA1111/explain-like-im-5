
import { GoogleGenAI, Type } from "@google/genai";
import { LearningLevel, LevelContent } from "../types";
import { SYSTEM_PROMPT, getPromptForTopic } from "../constants";

// The API key must be obtained exclusively from the environment variable VITE_GEMINI_API_KEY.
const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const fetchLevelContent = async (topic: string, level: LearningLevel): Promise<LevelContent> => {
  const ai = getAI();
  const prompt = getPromptForTopic(topic, level);

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
              videos: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { 
                    title: { type: Type.STRING }, 
                    description: { type: Type.STRING }, 
                    url: { type: Type.STRING } 
                  } 
                } 
              },
              articles: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, url: { type: Type.STRING } } } },
              courses: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, url: { type: Type.STRING } } } },
              challenges: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, url: { type: Type.STRING } } } }
            }
          },
          prerequisites: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        },
        required: ["explanation", "resources", "prerequisites"]
      }
    }
  });

  // Extract text directly from the response object
  const jsonStr = response.text || '{}';
  return JSON.parse(jsonStr);
};

export const generateOverviewVisual = async (topic: string, level: LearningLevel): Promise<string> => {
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

  // Use gemini-2.5-flash-image for default image generation via generateContent
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  // Iterate through all parts to find the image data
  const candidate = response.candidates?.[0];
  if (candidate && candidate.content.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Failed to generate image: No image data returned from model.");
};
