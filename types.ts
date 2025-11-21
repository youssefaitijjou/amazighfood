export type Language = 'en' | 'fr' | 'ar';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  cuisineType: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  imageUrl?: string;
}

export interface FoodAnalysis {
  dishName: string;
  description: string;
  estimatedCalories: string;
  mainIngredients: string[];
  healthRating: number; // 1-10
  dietaryTags: string[]; // e.g. "Gluten-Free", "Vegan"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  HOME = 'HOME',
  RECIPES = 'RECIPES',
  ANALYZER = 'ANALYZER',
  CHAT = 'CHAT'
}