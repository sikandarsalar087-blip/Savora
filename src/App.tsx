/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Utensils,
  Clock,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Dices,
  ChefHat,
  Bookmark,
} from 'lucide-react';
import {
  CookingPreferences,
  IngredientItem,
  Recipe,
  ShoppingItem,
  SupportedLanguage,
  UserProfile,
} from './types';
import { Storage, DEFAULT_PREFERENCES } from './utils/storage';
import { TRANSLATIONS } from './utils/i18n';
import { Navbar, ActiveTab } from './components/Navbar';
import { IngredientInput } from './components/IngredientInput';
import { PreferencesPanel } from './components/PreferencesPanel';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { PantryView } from './components/PantryView';
import { ShoppingListView } from './components/ShoppingListView';
import { FavoritesView } from './components/FavoritesView';
import { MealPlannerView } from './components/MealPlannerView';
import { PhotoScanModal } from './components/PhotoScanModal';
import { VoiceInputModal } from './components/VoiceInputModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { SavoraLogo } from './components/SavoraLogo';

export default function App() {
  // Navigation & Screen States
  const [activeTab, setActiveTab] = useState<ActiveTab>('cook');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Core Data States
  const [ingredients, setIngredients] = useState<IngredientItem[]>(() => Storage.getPantry());
  const [preferences, setPreferences] = useState<CookingPreferences>(() => Storage.getPreferences());
  const [favorites, setFavorites] = useState<Recipe[]>(() => Storage.getFavorites());
  const [history, setHistory] = useState(() => Storage.getHistory());
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => Storage.getShoppingList());
  const [profile, setProfile] = useState<UserProfile>(() => Storage.getProfile());

  // Preferences UI & Recipes State
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  // Modals
  const [isPhotoScanOpen, setIsPhotoScanOpen] = useState(false);
  const [isVoiceInputOpen, setIsVoiceInputOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Theme & Language
  const [language, setLanguage] = useState<SupportedLanguage>(() => Storage.getLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => Storage.getTheme());

  const t = TRANSLATIONS[language];

  // Playful loading messages
  const loadingMessages = [
    'Raiding your fridge for delicious possibilities...',
    'Checking pantry shelves and pairing spices...',
    'Balancing cook times and fresh ingredients...',
    'Whisking up chef-tested home recipes...',
  ];

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Storage.saveTheme(theme);
  }, [theme]);

  // Sync language and RTL
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    Storage.saveLanguage(language);
  }, [language]);

  // Check onboarding on first visit
  useEffect(() => {
    if (!Storage.isOnboarded()) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    Storage.savePantry(ingredients);
  }, [ingredients]);

  useEffect(() => {
    Storage.savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    Storage.saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    Storage.saveShoppingList(shoppingList);
  }, [shoppingList]);

  // Rotating loading messages
  useEffect(() => {
    let interval: any = null;
    if (isLoadingRecipes) {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isLoadingRecipes]);

  // Ingredient Helpers
  const handleAddIngredient = (name: string, quantity?: string) => {
    if (!name.trim()) return;
    const exists = ingredients.some(
      (i) => i.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (!exists) {
      const newItem: IngredientItem = {
        id: 'ing-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        name: name.trim(),
        quantity: quantity?.trim() || undefined,
        category: 'produce',
      };
      setIngredients((prev) => [newItem, ...prev]);
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: string) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty || undefined } : i))
    );
  };

  const handleClearAll = () => {
    setIngredients([]);
  };

  const handleAddDetectedIngredients = (items: { name: string; quantity?: string }[]) => {
    items.forEach((item) => handleAddIngredient(item.name, item.quantity));
  };

  // Generate Recipes API Call
  const fetchRecipes = async (zeroWasteOverride = false, surpriseMe = false) => {
    setIsLoadingRecipes(true);
    setRecipeError(null);
    setSelectedRecipe(null);

    try {
      const payload = {
        ingredients: ingredients,
        hasPantryStaples: preferences.hasPantryStaples,
        timeMinutes: surpriseMe ? 25 : preferences.timeMinutes,
        servings: preferences.servings,
        mealType: surpriseMe ? 'any' : preferences.mealType,
        dietary: preferences.dietary,
        skillLevel: preferences.skillLevel,
        cuisine: surpriseMe ? 'any' : preferences.cuisine,
        strictness: preferences.strictness,
        zeroWastePriority: zeroWasteOverride || preferences.zeroWastePriority,
        language,
      };

      const res = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.recipes && data.recipes.length > 0) {
        setRecipes(data.recipes);
        // Scroll smoothly to results
        setTimeout(() => {
          document.getElementById('recipes-results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setRecipeError("We couldn't reach the kitchen, please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setRecipeError("We couldn't reach the kitchen right now. Please try again.");
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // Favorites Helper
  const handleToggleFavorite = (recipe: Recipe) => {
    const isNowFav = Storage.toggleFavorite(recipe);
    setFavorites(Storage.getFavorites());
  };

  // Shopping List Helpers
  const handleAddToShoppingList = (recipe: Recipe) => {
    Storage.addMissingToShoppingList(recipe);
    setShoppingList(Storage.getShoppingList());
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleRemoveShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddCustomShoppingItem = (name: string, category = 'General') => {
    const newItem: ShoppingItem = {
      id: 'shop-' + Date.now(),
      name,
      category,
      checked: false,
    };
    setShoppingList((prev) => [newItem, ...prev]);
  };

  const handleClearCompletedShopping = () => {
    setShoppingList((prev) => prev.filter((i) => !i.checked));
  };

  // Recording Cook History
  const handleRecordCooking = (
    recipe: Recipe,
    servingsCooked: number,
    rating?: number,
    notes?: string
  ) => {
    Storage.recordCooking(recipe, servingsCooked, rating, notes);
    setHistory(Storage.getHistory());
    setProfile(Storage.getProfile());
  };

  const expiringCount = ingredients.filter((i) => i.expiringSoon).length;

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-stone-950 text-[#2B2B2B] dark:text-stone-100 transition-colors flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedRecipe(null);
        }}
        language={language}
        onChangeLanguage={setLanguage}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        shoppingCount={shoppingList.filter((i) => !i.checked).length}
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        expiringCount={expiringCount}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: COOK (HOME) */}
        {activeTab === 'cook' && (
          <>
            {selectedRecipe ? (
              <RecipeDetail
                recipe={selectedRecipe}
                onBack={() => setSelectedRecipe(null)}
                isFavorite={favorites.some((f) => f.id === selectedRecipe.id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToShoppingList={handleAddToShoppingList}
                onRecordCooking={handleRecordCooking}
                language={language}
              />
            ) : (
              <div className="space-y-8 animate-fadeIn pb-24">
                {/* Hero Ingredient Input */}
                <IngredientInput
                  ingredients={ingredients}
                  onAddIngredient={handleAddIngredient}
                  onRemoveIngredient={handleRemoveIngredient}
                  onUpdateQuantity={handleUpdateQuantity}
                  onClearAll={handleClearAll}
                  hasPantryStaples={preferences.hasPantryStaples}
                  onTogglePantryStaples={(val) =>
                    setPreferences({ ...preferences, hasPantryStaples: val })
                  }
                  onOpenPhotoScan={() => setIsPhotoScanOpen(true)}
                  onOpenVoiceInput={() => setIsVoiceInputOpen(true)}
                  language={language}
                />

                {/* Inline Preferences Panel */}
                <PreferencesPanel
                  preferences={preferences}
                  onChangePreferences={setPreferences}
                  isOpen={isPreferencesOpen}
                  onToggleOpen={() => setIsPreferencesOpen(!isPreferencesOpen)}
                  language={language}
                />

                {/* Main Action Buttons */}
                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {/* Big Friendly Button: Find Me Something to Cook */}
                  <button
                    onClick={() => fetchRecipes(false, false)}
                    disabled={isLoadingRecipes || ingredients.length === 0}
                    className="w-full sm:flex-1 py-4 px-6 rounded-3xl bg-[#E4572E] hover:bg-[#d04922] disabled:opacity-50 text-white font-bold text-base sm:text-lg shadow-xl shadow-[#E4572E]/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {isLoadingRecipes ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Searching kitchen...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-[#F6B93B]" />
                        <span>{t.findRecipesButton}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Surprise Me Button */}
                  <button
                    onClick={() => fetchRecipes(false, true)}
                    disabled={isLoadingRecipes || ingredients.length === 0}
                    className="w-full sm:w-auto py-4 px-5 rounded-3xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-stone-900 font-bold text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    title="Generate a spontaneous creative dish"
                  >
                    <Dices className="w-5 h-5 text-stone-900" />
                    <span>{t.surpriseMeButton}</span>
                  </button>

                  {/* Zero-Waste Priority Toggle Button */}
                  {expiringCount > 0 && (
                    <button
                      onClick={() => fetchRecipes(true, false)}
                      disabled={isLoadingRecipes}
                      className="w-full sm:w-auto py-4 px-5 rounded-3xl bg-[#4C9F70] hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      title="Prioritize ingredients expiring in your kitchen"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                      <span>Zero-Waste ({expiringCount})</span>
                    </button>
                  )}
                </div>

                {/* Loading State with Playful Messages */}
                {isLoadingRecipes && (
                  <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-4 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-[#E4572E]/10 text-[#E4572E] flex items-center justify-center mx-auto">
                      <ChefHat className="w-8 h-8 animate-bounce" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                      {loadingMessages[loadingMessageIdx]}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Formulating exact measurements, substitutions, and step-by-step guidance.
                    </p>
                  </div>
                )}

                {/* Recipe Error Message */}
                {recipeError && (
                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-[#E4572E]" />
                    <span>{recipeError}</span>
                  </div>
                )}

                {/* Recipe Suggestions Results */}
                {recipes.length > 0 && !isLoadingRecipes && (
                  <div id="recipes-results-section" className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-50">
                          {t.suggestionsTitle}
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                          Found {recipes.length} delicious dishes you can make right now.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onSelect={(r) => setSelectedRecipe(r)}
                          isFavorite={favorites.some((f) => f.id === recipe.id)}
                          onToggleFavorite={handleToggleFavorite}
                          language={language}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* TAB 2: MY KITCHEN (PANTRY) */}
        {activeTab === 'kitchen' && (
          <PantryView
            pantryItems={ingredients}
            onAddPantryItem={(item) => {
              const newItem: IngredientItem = {
                id: 'p-' + Date.now(),
                ...item,
              };
              setIngredients((prev) => [newItem, ...prev]);
            }}
            onRemovePantryItem={(id) => handleRemoveIngredient(id)}
            onCookWithPantry={(prioritizeExpiring) => {
              setActiveTab('cook');
              fetchRecipes(prioritizeExpiring, false);
            }}
            language={language}
          />
        )}

        {/* TAB 3: SHOPPING LIST */}
        {activeTab === 'shopping' && (
          <ShoppingListView
            items={shoppingList}
            onToggleItem={handleToggleShoppingItem}
            onRemoveItem={handleRemoveShoppingItem}
            onAddItem={handleAddCustomShoppingItem}
            onClearCompleted={handleClearCompletedShopping}
            language={language}
          />
        )}

        {/* TAB 4: MEAL PLANNER */}
        {activeTab === 'planner' && (
          <MealPlannerView
            pantryItems={ingredients}
            onCookRecipeName={(name) => {
              setActiveTab('cook');
              fetchRecipes(false, false);
            }}
            language={language}
          />
        )}

        {/* TAB 5: FAVORITES & HISTORY */}
        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            history={history}
            onSelectRecipe={(r) => {
              setSelectedRecipe(r);
              setActiveTab('cook');
            }}
            onRemoveFavorite={handleToggleFavorite}
            language={language}
          />
        )}
      </main>

      {/* Safety Disclaimer Footer */}
      <footer className="w-full py-6 border-t border-stone-200 dark:border-stone-800 bg-[#FFF8F0] dark:bg-stone-950 text-stone-500 dark:text-stone-400 text-xs text-center px-4">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="flex items-center justify-center gap-1.5 font-medium text-stone-600 dark:text-stone-300">
            <ShieldCheck className="w-4 h-4 text-[#4C9F70]" />
            <span>{t.disclaimer}</span>
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-1">
            <span>Savora Kitchen</span>
            <span>·</span>
            <span>Zero-Waste Cooking</span>
            <span>·</span>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>How it works</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isPhotoScanOpen && (
        <PhotoScanModal
          onClose={() => setIsPhotoScanOpen(false)}
          onAddDetectedIngredients={handleAddDetectedIngredients}
          language={language}
        />
      )}

      {isVoiceInputOpen && (
        <VoiceInputModal
          onClose={() => setIsVoiceInputOpen(false)}
          onAddIngredients={(items) => items.forEach((i) => handleAddIngredient(i))}
          language={language}
        />
      )}

      {isOnboardingOpen && (
        <OnboardingModal
          onComplete={(dietary) => {
            if (dietary.length > 0) {
              setPreferences({ ...preferences, dietary });
            }
            Storage.setOnboarded();
            setIsOnboardingOpen(false);
          }}
        />
      )}

      {isProfileOpen && (
        <ProfileModal
          profile={profile}
          onUpdateProfile={(p) => {
            setProfile(p);
            Storage.saveProfile(p);
          }}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
