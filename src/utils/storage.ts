import { CookingPreferences, CookHistoryItem, IngredientItem, Recipe, ShoppingItem, SupportedLanguage, UserProfile } from '../types';

const STORAGE_KEYS = {
  PANTRY: 'savora_pantry_items_v1',
  PREFERENCES: 'savora_preferences_v1',
  FAVORITES: 'savora_favorite_recipes_v1',
  HISTORY: 'savora_cooking_history_v1',
  SHOPPING_LIST: 'savora_shopping_list_v1',
  USER_PROFILE: 'savora_user_profile_v1',
  LANGUAGE: 'savora_language_v1',
  THEME: 'savora_theme_v1',
  ONBOARDED: 'savora_onboarded_v1',
};

export const DEFAULT_PREFERENCES: CookingPreferences = {
  timeMinutes: 30,
  servings: 2,
  mealType: 'any',
  dietary: [],
  skillLevel: 'beginner',
  cuisine: 'any',
  strictness: 'flexible',
  hasPantryStaples: true,
  zeroWastePriority: false,
};

// Helpful starter pantry for immediate delight
const DEFAULT_INITIAL_PANTRY: IngredientItem[] = [
  { id: 'p1', name: 'Eggs', quantity: '6 eggs', category: 'dairy', expiringSoon: false },
  { id: 'p2', name: 'Ripe Tomatoes', quantity: '3 medium', category: 'produce', expiringSoon: true, expiryDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10) },
  { id: 'p3', name: 'Yellow Onion', quantity: '2 onions', category: 'produce', expiringSoon: false },
  { id: 'p4', name: 'Garlic', quantity: '1 head', category: 'produce', expiringSoon: false },
  { id: 'p5', name: 'Jasmine Rice', quantity: '500g', category: 'pantry', expiringSoon: false },
  { id: 'p6', name: 'Cheddar Cheese', quantity: '150g', category: 'dairy', expiringSoon: true, expiryDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10) },
  { id: 'p7', name: 'Baby Spinach', quantity: '1 bag', category: 'produce', expiringSoon: true, expiryDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
];

export const Storage = {
  getPantry(): IngredientItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PANTRY);
      if (!data) return DEFAULT_INITIAL_PANTRY;
      return JSON.parse(data);
    } catch {
      return DEFAULT_INITIAL_PANTRY;
    }
  },

  savePantry(items: IngredientItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  },

  getPreferences(): CookingPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!data) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: CookingPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error(e);
    }
  },

  getFavorites(): Recipe[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFavorites(recipes: Recipe[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(recipes));
    } catch (e) {
      console.error(e);
    }
  },

  toggleFavorite(recipe: Recipe): boolean {
    const list = Storage.getFavorites();
    const idx = list.findIndex(r => r.id === recipe.id);
    let isNowFavorite = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      isNowFavorite = false;
    } else {
      list.unshift(recipe);
      isNowFavorite = true;
    }
    Storage.saveFavorites(list);
    return isNowFavorite;
  },

  isFavorite(recipeId: string): boolean {
    const list = Storage.getFavorites();
    return list.some(r => r.id === recipeId);
  },

  getHistory(): CookHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordCooking(recipe: Recipe, servingsCooked: number, rating?: number, notes?: string): void {
    const history = Storage.getHistory();
    const newItem: CookHistoryItem = {
      recipeId: recipe.id,
      recipeName: recipe.name,
      cookedAt: new Date().toISOString(),
      servingsCooked,
      rating,
      notes,
    };
    history.unshift(newItem);
    Storage.saveHistory(history.slice(0, 50));

    // Update user stats
    const profile = Storage.getProfile();
    profile.stats.mealsCooked += 1;
    profile.stats.ingredientsSaved += recipe.matchedCount || 4;
    profile.stats.wasteReducedKg = Number((profile.stats.wasteReducedKg + 0.45).toFixed(1));
    profile.stats.moneySavedUsd += Math.round(servingsCooked * 6.5);
    Storage.saveProfile(profile);
  },

  saveHistory(history: CookHistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  },

  getShoppingList(): ShoppingItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveShoppingList(items: ShoppingItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  },

  addMissingToShoppingList(recipe: Recipe): number {
    const current = Storage.getShoppingList();
    let countAdded = 0;
    recipe.ingredients
      .filter(i => !i.userHas && !i.isPantryStaple)
      .forEach(i => {
        const alreadyExists = current.some(item => item.name.toLowerCase() === i.name.toLowerCase() && !item.checked);
        if (!alreadyExists) {
          current.push({
            id: 'shop-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            name: i.name,
            amount: `${i.amountMetric} ${i.unitMetric}`,
            category: 'Missing Recipe Items',
            checked: false,
            recipeSource: recipe.name
          });
          countAdded++;
        }
      });
    Storage.saveShoppingList(current);
    return countAdded;
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      id: 'guest_user',
      name: 'Home Chef',
      email: 'chef@savora.kitchen',
      isGuest: true,
      stats: {
        mealsCooked: 4,
        ingredientsSaved: 18,
        wasteReducedKg: 2.3,
        moneySavedUsd: 48,
      }
    };
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  },

  getLanguage(): SupportedLanguage {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as SupportedLanguage;
      if (['en', 'es', 'fr', 'ar'].includes(lang)) return lang;
    } catch {}
    return 'en';
  },

  saveLanguage(lang: SupportedLanguage): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error(e);
    }
  },

  getTheme(): 'light' | 'dark' {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (theme === 'dark' || theme === 'light') return theme;
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  saveTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error(e);
    }
  },

  isOnboarded(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
  },

  setOnboarded(): void {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  }
};
