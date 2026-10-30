export interface IngredientItem {
  id: string;
  name: string;
  quantity?: string;
  category?: 'produce' | 'dairy' | 'meat' | 'pantry' | 'bakery' | 'spices' | 'other';
  expiryDate?: string; // YYYY-MM-DD
  expiringSoon?: boolean;
}

export interface RecipeIngredient {
  name: string;
  amountMetric: number;
  unitMetric: string;
  amountImperial: number;
  unitImperial: string;
  userHas: boolean;
  isPantryStaple?: boolean;
  substitution?: string;
}

export interface RecipeStep {
  number: number;
  title: string;
  instruction: string;
  durationMinutes: number;
  timerRequired: boolean;
  timerSeconds?: number;
}

export interface NutritionInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Intermediate' | 'Advanced';
  servings: number;
  caloriesPerServing: number;
  cuisine: string;
  mealType: string;
  matchScoreText: string;
  matchedCount: number;
  totalIngredientsCount: number;
  imageUrl: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  chefTips: string[];
  commonMistakes: string[];
  substitutions: string[];
  storageAdvice: string;
  foodSafetyNote?: string;
  nutrition: NutritionInfo;
}

export type MealType = 'any' | 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';

export type SkillLevel = 'beginner' | 'intermediate' | 'confident';

export type CuisineMood = 'any' | 'Mediterranean' | 'Middle Eastern' | 'Asian' | 'Italian' | 'Mexican' | 'Comfort Food';

export type Strictness = 'strict' | 'flexible';

export interface CookingPreferences {
  timeMinutes: number;
  servings: number;
  mealType: MealType;
  dietary: string[];
  skillLevel: SkillLevel;
  cuisine: CuisineMood;
  strictness: Strictness;
  hasPantryStaples: boolean;
  zeroWastePriority: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount?: string;
  category: string;
  checked: boolean;
  recipeSource?: string;
}

export interface CookHistoryItem {
  recipeId: string;
  recipeName: string;
  cookedAt: string;
  rating?: number;
  notes?: string;
  servingsCooked: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  avatarUrl?: string;
  stats: {
    mealsCooked: number;
    ingredientsSaved: number;
    wasteReducedKg: number;
    moneySavedUsd: number;
  };
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'ar';
