import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Flame,
  Users,
  ChefHat,
  Bookmark,
  Share2,
  Printer,
  ShoppingBag,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ShieldAlert,
  Archive,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { Recipe, RecipeIngredient, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { CookingModeModal } from './CookingModeModal';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  onAddToShoppingList: (recipe: Recipe) => void;
  onRecordCooking: (recipe: Recipe, servings: number, rating?: number, notes?: string) => void;
  language: SupportedLanguage;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  isFavorite,
  onToggleFavorite,
  onAddToShoppingList,
  onRecordCooking,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [servings, setServings] = useState(recipe.servings || 2);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [isCookingModeOpen, setIsCookingModeOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [shoppingToast, setShoppingToast] = useState(false);

  // Scaling factor for ingredients based on adjusted servings
  const baseServings = recipe.servings || 2;
  const scaleRatio = servings / Math.max(1, baseServings);

  const toggleCheck = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleShare = () => {
    const text = `${recipe.name} on Savora\n${recipe.description}\nCook time: ${recipe.totalTimeMinutes} mins`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\nhttps://savora.kitchen/recipes/${recipe.id}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddShopping = () => {
    onAddToShoppingList(recipe);
    setShoppingToast(true);
    setTimeout(() => setShoppingToast(false), 2500);
  };

  const formatAmount = (amount: number) => {
    const scaled = amount * scaleRatio;
    if (scaled === 0) return '';
    // Format nicely: 0.5 -> 1/2 or clean decimal
    if (Math.abs(scaled - 0.5) < 0.05) return '1/2';
    if (Math.abs(scaled - 0.25) < 0.05) return '1/4';
    if (Math.abs(scaled - 0.75) < 0.05) return '3/4';
    if (Math.abs(scaled - 0.33) < 0.05) return '1/3';
    return Number(scaled.toFixed(1)).toString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn pb-24">
      {/* Back button and action header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-[#E4572E] text-sm font-semibold transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ideas</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(recipe)}
            className={`p-2.5 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-[#E4572E] dark:bg-rose-950/40 dark:border-rose-800'
                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-[#E4572E]'
            }`}
            title={isFavorite ? t.favorited : t.favorite}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#E4572E]' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-[#E4572E] transition-all relative"
            title={t.share}
          >
            <Share2 className="w-4 h-4" />
            {shareToast && (
              <span className="absolute -bottom-8 right-0 bg-stone-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                {t.copiedLink}
              </span>
            )}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-[#E4572E] transition-all"
            title={t.print}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Recipe Card Container */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl">
        {/* Large Hero Image */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Hero Titles & Badges */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#E4572E] text-xs font-bold uppercase tracking-wider text-white shadow-md">
                {recipe.cuisine || 'Home Kitchen'}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                {recipe.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold text-amber-300 border border-amber-400/30">
                {recipe.matchScoreText}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white drop-shadow-md">
              {recipe.name}
            </h1>
          </div>
        </div>

        {/* Recipe Body Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Mouth-watering Description */}
          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-serif italic leading-relaxed">
            "{recipe.description}"
          </p>

          {/* Quick Facts Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FFF8F0] dark:bg-stone-800/80 border border-[#E4572E]/15 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#E4572E]/10 text-[#E4572E]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  {t.cookTime}
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {recipe.totalTimeMinutes} mins
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#4C9F70]/10 text-[#4C9F70]">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  {t.prepTime}
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {recipe.prepTimeMinutes} mins
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#F6B93B]/20 text-amber-700 dark:text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  {t.calories}
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {recipe.caloriesPerServing} kcal
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  Servings
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {servings} people
                </div>
              </div>
            </div>
          </div>

          {/* Cooking Mode Launch Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#E4572E] to-[#c7431c] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-[#E4572E]/25">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F6B93B]" />
                <span>Distraction Free Cooking</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {t.startCookingMode}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-md">
                Full-screen, extra-large text with built-in timers, voice and audio chimes, and automatic screen stay-awake!
              </p>
            </div>
            <button
              onClick={() => setIsCookingModeOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-white text-[#E4572E] font-bold text-sm shadow-lg hover:bg-stone-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-[#E4572E]" />
              <span>{t.startCookingMode}</span>
            </button>
          </div>

          {/* Ingredients Section with Rescaler & Unit Toggle */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Ingredients
                </h3>
                <span className="text-xs text-stone-500">
                  Tick off items as you gather them from your kitchen
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Servings Adjuster */}
                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-xs font-medium text-stone-500">Servings:</span>
                  <button
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    className="w-6 h-6 rounded bg-stone-200 dark:bg-stone-700 text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 w-4 text-center">
                    {servings}
                  </span>
                  <button
                    onClick={() => setServings((s) => Math.min(10, s + 1))}
                    className="w-6 h-6 rounded bg-stone-200 dark:bg-stone-700 text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Metric / Imperial toggle */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium">
                  <button
                    onClick={() => setUnitSystem('metric')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      unitSystem === 'metric'
                        ? 'bg-white dark:bg-stone-700 text-[#E4572E] font-bold shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => setUnitSystem('imperial')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      unitSystem === 'imperial'
                        ? 'bg-white dark:bg-stone-700 text-[#E4572E] font-bold shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    Imperial
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing.name];
                const amount =
                  unitSystem === 'metric'
                    ? formatAmount(ing.amountMetric)
                    : formatAmount(ing.amountImperial);
                const unit =
                  unitSystem === 'metric' ? ing.unitMetric : ing.unitImperial;

                return (
                  <div
                    key={ing.name}
                    onClick={() => toggleCheck(ing.name)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-stone-100/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60'
                        : ing.userHas || ing.isPantryStaple
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 hover:border-emerald-400'
                        : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40 hover:border-rose-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded text-[#4C9F70] focus:ring-[#4C9F70] accent-[#4C9F70] cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isChecked
                              ? 'line-through text-stone-400'
                              : 'text-stone-900 dark:text-stone-100'
                          }`}
                        >
                          {amount} {unit} {ing.name}
                        </span>

                        {ing.userHas ? (
                          <span className="text-[10px] font-bold text-[#4C9F70] bg-[#4C9F70]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                            In Kitchen
                          </span>
                        ) : ing.isPantryStaple ? (
                          <span className="text-[10px] font-medium text-stone-500 bg-stone-200/60 dark:bg-stone-700/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                            Staple
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#E4572E] bg-[#E4572E]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                            Missing
                          </span>
                        )}
                      </div>

                      {/* Smart Substitution Tip if missing */}
                      {!ing.userHas && ing.substitution && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic">
                          💡 Sub: {ing.substitution}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add missing to shopping list button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddShopping}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#4C9F70] hover:text-white dark:hover:bg-[#4C9F70] text-stone-700 dark:text-stone-300 font-semibold text-xs border border-stone-200 dark:border-stone-700 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#4C9F70]" />
                <span>{shoppingToast ? t.addedToShoppingList : t.addToShoppingList}</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="pt-2">
            <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              Step-by-Step Guidance
            </h3>
            <div className="space-y-4">
              {recipe.steps.map((step) => (
                <div
                  key={step.number}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70 hover:border-[#E4572E]/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E4572E] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                        {step.title}
                      </h4>
                      {step.timerRequired && step.timerSeconds && (
                        <span className="text-xs font-mono font-bold text-[#E4572E] bg-[#E4572E]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{Math.round(step.timerSeconds / 60)} min timer</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                      {step.instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chef Tips & Common Mistakes To Avoid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Chef's Pro Tips */}
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-2.5">
                <Lightbulb className="w-4 h-4 text-[#F6B93B]" />
                <span>{t.chefTips}</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 list-disc list-inside leading-relaxed">
                {recipe.chefTips?.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Mistakes to Avoid */}
            <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm mb-2.5">
                <AlertTriangle className="w-4 h-4 text-[#E4572E]" />
                <span>{t.commonMistakes}</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-rose-900/90 dark:text-rose-200/90 list-disc list-inside leading-relaxed">
                {recipe.commonMistakes?.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Leftovers Storage & Food Safety Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                <Archive className="w-4 h-4 text-[#4C9F70]" />
                <span>{t.storage}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {recipe.storageAdvice || 'Refrigerate in an airtight container for up to 3 days.'}
              </p>
            </div>

            {recipe.foodSafetyNote && (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  <span>{t.foodSafety}</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-900/90 dark:text-blue-200/90 leading-relaxed">
                  {recipe.foodSafetyNote}
                </p>
              </div>
            )}
          </div>

          {/* Nutrition Summary per Serving */}
          {recipe.nutrition && (
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                {t.nutrition}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                  <span className="text-xs text-stone-500 block">Calories</span>
                  <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    {recipe.nutrition.calories} kcal
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                  <span className="text-xs text-stone-500 block">Protein</span>
                  <span className="text-lg font-bold text-[#4C9F70]">
                    {recipe.nutrition.proteinGrams}g
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                  <span className="text-xs text-stone-500 block">Carbs</span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {recipe.nutrition.carbsGrams}g
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                  <span className="text-xs text-stone-500 block">Healthy Fats</span>
                  <span className="text-lg font-bold text-[#E4572E]">
                    {recipe.nutrition.fatGrams}g
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cooking Mode Modal */}
      {isCookingModeOpen && (
        <CookingModeModal
          recipe={recipe}
          servings={servings}
          onClose={() => setIsCookingModeOpen(false)}
          onFinishCooking={(rating, notes) => {
            onRecordCooking(recipe, servings, rating, notes);
            setIsCookingModeOpen(false);
          }}
          language={language}
        />
      )}
    </div>
  );
};
