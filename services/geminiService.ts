import { GoogleGenAI, Type, Schema, Chat, Modality } from "@google/genai";
import { Recipe, FoodAnalysis, Language } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to strip Markdown code blocks from JSON response
const cleanJson = (text: string): string => {
  if (!text) return "{}";
  // Remove ```json or ``` at start, and ``` at end
  let cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  return cleaned.trim();
};

// --- Recipe Generation ---

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    prepTime: { type: Type.STRING },
    cookTime: { type: Type.STRING },
    servings: { type: Type.INTEGER },
    cuisineType: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING },
        },
        required: ["name", "amount"],
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING },
        },
        required: ["stepNumber", "instruction"],
      },
    },
    nutritionalInfo: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.INTEGER },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING },
      },
      required: ["calories", "protein", "carbs", "fat"],
    },
  },
  required: ["title", "description", "prepTime", "cookTime", "servings", "cuisineType", "ingredients", "steps", "nutritionalInfo"],
};

export const generateRecipe = async (ingredients: string, preferences: string, language: Language): Promise<Recipe> => {
  const ai = getAIClient();
  
  const languageInstruction = language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English';

  const prompt = `
    Create a delicious recipe based on these ingredients: ${ingredients}.
    Additional preferences/context: ${preferences}.
    If no specific cuisine is requested, lean towards Amazigh (North African) flavors if suitable, otherwise standard international.
    IMPORTANT: The entire content of the recipe (title, description, ingredients, steps, etc.) MUST be in ${languageInstruction}.
    Return the result strictly as JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
      systemInstruction: `You are a world-class chef specializing in Amazigh (Berber) and Mediterranean cuisine. You provide accurate, safe, and delicious recipes in ${languageInstruction}.`,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(cleanJson(text)) as Recipe;
};

export const generateFoodImage = async (description: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Professional food photography of ${description}. High quality, appetizing, shallow depth of field, restaurant presentation.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Failed to generate image:", error);
    return null;
  }
};

export const generateRecipeAudio = async (text: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Audio generation failed:", error);
    return null;
  }
};

// --- Food Analysis ---

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dishName: { type: Type.STRING },
    description: { type: Type.STRING },
    estimatedCalories: { type: Type.STRING },
    mainIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    healthRating: { type: Type.INTEGER, description: "Rating from 1 (unhealthy) to 10 (very healthy)" },
    dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["dishName", "description", "estimatedCalories", "mainIngredients", "healthRating", "dietaryTags"],
};

export const analyzeFoodImage = async (base64Image: string, mimeType: string, language: Language, context?: string): Promise<FoodAnalysis> => {
  const ai = getAIClient();
  const languageInstruction = language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English';

  let promptText = `Analyze this food image. Identify the dish, estimate its nutritional content per serving, and list main visible ingredients. Provide a health rating. Provide all text responses in ${languageInstruction}.`;

  if (context && context.trim().length > 0) {
    promptText += `\n\nUser Notes/Questions about this image: "${context}". \nPlease take these notes into account for the description and analysis if relevant.`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: promptText,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  return JSON.parse(cleanJson(text)) as FoodAnalysis;
};

export const analyzeFoodText = async (query: string, language: Language): Promise<FoodAnalysis> => {
  const ai = getAIClient();
  const languageInstruction = language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English';

  const prompt = `
    Analyze the food described as: "${query}".
    Identify the dish (or closest match), estimate its typical nutritional content per serving, and list main ingredients.
    Provide a health rating (1-10).
    Provide all text responses in ${languageInstruction}.
    Return result as JSON matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(cleanJson(text)) as FoodAnalysis;
};

// --- Chat ---

export const createChatSession = (language: Language): Chat => {
  const ai = getAIClient();
  const languageInstruction = language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English';
  
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are 'Amayas', a friendly and wise AI chef expert in Amazigh culture and global food processing. You help users with cooking tips, ingredient substitutions, and food science questions. Keep answers concise and helpful. Always reply in ${languageInstruction}.`,
    },
  });
};