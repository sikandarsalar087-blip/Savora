import React from 'react';
import {
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ChevronRight,
  Sparkles,
  ChefHat,
  ArrowRight,
} from 'lucide-react';
import { Recipe, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  language: SupportedLanguage;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  isFavorite,
  onToggleFavorite,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const haveCount = recipe.ingredients.filter((i) => i.userHas || i.isPantryStaple).length;
  const totalCount = recipe.ingredients.length;
  const missingCount = totalCount - haveCount;
  const matchPercentage = Math.round((haveCount / Math.max(1, totalCount)) * 100);

  const missingIngredients = recipe.ingredients.filter((i) => !i.userHas && !i.isPantryStaple);

  return (
    <div className="group relative bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Hero Image Container */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Match Score Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md ${
              missingCount === 0
                ? 'bg-[#4C9F70]/90 border border-emerald-300/40'
                : matchPercentage >= 70
                ? 'bg-[#E4572E]/90 border border-orange-300/40'
                : 'bg-amber-600/90'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#F6B93B]" />
            <span>
              {missingCount === 0
                ? '100% Match'
                : `${haveCount} of ${totalCount} items`}
            </span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-700 dark:text-stone-200 hover:text-[#E4572E] shadow-md transition-all active:scale-90"
          title={isFavorite ? t.favorited : t.favorite}
        >
          <Bookmark
            className={`w-4 h-4 ${
              isFavorite
                ? 'fill-[#E4572E] text-[#E4572E]'
                : 'text-stone-700 dark:text-stone-200'
            }`}
          />
        </button>

        {/* Bottom Banner Over Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="px-2.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md uppercase tracking-wider text-[11px] font-bold text-[#F6B93B]">
            {recipe.cuisine || 'Home Style'}
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 text-stone-300" />
              <span>{recipe.totalTimeMinutes}m</span>
            </span>
            <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-[#E4572E]" />
              <span>{recipe.caloriesPerServing} kcal</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#4C9F70]">
              {recipe.difficulty}
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50 line-clamp-2 group-hover:text-[#E4572E] transition-colors">
            {recipe.name}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {/* Ingredients Breakdown */}
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
            {/* Items user has */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#4C9F70] flex items-center gap-1 mr-1">
                <CheckCircle2 className="w-3 h-3 text-[#4C9F70]" />
                <span>You have:</span>
              </span>
              {recipe.ingredients
                .filter((i) => i.userHas || i.isPantryStaple)
                .slice(0, 4)
                .map((ing) => (
                  <span
                    key={ing.name}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-[#4C9F70]/10 text-emerald-800 dark:text-emerald-200 font-medium"
                  >
                    {ing.name}
                  </span>
                ))}
              {recipe.ingredients.filter((i) => i.userHas || i.isPantryStaple).length > 4 && (
                <span className="text-[10px] text-stone-500 font-medium">
                  +{recipe.ingredients.filter((i) => i.userHas || i.isPantryStaple).length - 4} more
                </span>
              )}
            </div>

            {/* Missing items with soft red indicator */}
            {missingIngredients.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#E4572E] flex items-center gap-1 mr-1">
                  <AlertCircle className="w-3 h-3 text-[#E4572E]" />
                  <span>Missing:</span>
                </span>
                {missingIngredients.map((ing) => (
                  <span
                    key={ing.name}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-[#E4572E]/10 text-[#E4572E] font-medium"
                    title={ing.substitution ? `Sub: ${ing.substitution}` : undefined}
                  >
                    {ing.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View Recipe Button */}
        <div className="mt-6 pt-3">
          <button
            onClick={() => onSelect(recipe)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FFF8F0] dark:bg-stone-800 hover:bg-[#E4572E] hover:text-white dark:hover:bg-[#E4572E] text-[#E4572E] rounded-2xl font-semibold text-sm transition-all duration-200 group/btn border border-[#E4572E]/20 hover:border-[#E4572E]"
          >
            <span>{t.cookThisButton}</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
