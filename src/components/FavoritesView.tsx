import React, { useState } from 'react';
import {
  Bookmark,
  History,
  Star,
  Clock,
  Flame,
  ArrowRight,
  Trash2,
  ChefHat,
  MessageSquare,
} from 'lucide-react';
import { CookHistoryItem, Recipe, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface FavoritesViewProps {
  favorites: Recipe[];
  history: CookHistoryItem[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveFavorite: (recipe: Recipe) => void;
  language: SupportedLanguage;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  history,
  onSelectRecipe,
  onRemoveFavorite,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [activeSubTab, setActiveSubTab] = useState<'favorites' | 'history'>('favorites');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4572E]/10 text-[#E4572E] text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved & Cooked</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-50">
            {t.favorites} & {t.history}
          </h2>
        </div>

        {/* Sub-tab pills */}
        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setActiveSubTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'favorites'
                ? 'bg-white dark:bg-stone-700 text-[#E4572E] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {t.favorites} ({favorites.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'history'
                ? 'bg-white dark:bg-stone-700 text-[#E4572E] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {t.history} ({history.length})
          </button>
        </div>
      </div>

      {/* Favorites List */}
      {activeSubTab === 'favorites' && (
        <>
          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
              <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-stone-700 dark:text-stone-300">
                No saved recipes yet
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
                When you discover a dish you love, tap the bookmark icon to save it here for quick access any night!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#E4572E]">
                          {recipe.cuisine || 'Home'}
                        </span>
                        <button
                          onClick={() => onRemoveFavorite(recipe)}
                          className="text-stone-300 hover:text-red-500 p-1"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 truncate mt-1">
                        {recipe.name}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                        {recipe.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{recipe.totalTimeMinutes}m</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#E4572E]" />
                          <span>{recipe.caloriesPerServing} kcal</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1">
                    <button
                      onClick={() => onSelectRecipe(recipe)}
                      className="w-full py-2.5 bg-stone-50 dark:bg-stone-800 hover:bg-[#E4572E] hover:text-white dark:hover:bg-[#E4572E] text-[#E4572E] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View & Cook Again</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Cooking History List */}
      {activeSubTab === 'history' && (
        <>
          {history.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
              <History className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-stone-700 dark:text-stone-300">
                No cooking history yet
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
                Complete a recipe in Cooking Mode and your dishes, ratings, and chef notes will appear here!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-[#4C9F70]" />
                      <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                        {item.recipeName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
                      <span>Cooked for {item.servingsCooked} servings</span>
                      <span>·</span>
                      <span>{new Date(item.cookedAt).toLocaleDateString()}</span>
                    </div>

                    {item.notes && (
                      <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-700 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>"{item.notes}"</span>
                      </p>
                    )}
                  </div>

                  {item.rating && (
                    <div className="flex items-center gap-1 self-start sm:self-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= item.rating!
                              ? 'fill-[#F6B93B] text-[#F6B93B]'
                              : 'text-stone-300 dark:text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
