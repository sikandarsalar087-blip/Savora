import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Utensils,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { IngredientItem, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface MealPlanDay {
  day: string;
  lunch: { name: string; timeMinutes: number; uses: string[] };
  dinner: { name: string; timeMinutes: number; uses: string[] };
  wasteReductionTip: string;
}

interface MealPlannerViewProps {
  pantryItems: IngredientItem[];
  onCookRecipeName: (recipeName: string) => void;
  language: SupportedLanguage;
}

export const MealPlannerView: React.FC<MealPlannerViewProps> = ({
  pantryItems,
  onCookRecipeName,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [days, setDays] = useState<3 | 7>(3);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MealPlanDay[]>([
    {
      day: 'Day 1',
      lunch: {
        name: 'Rustic Pantry Shakshuka',
        timeMinutes: 20,
        uses: ['Eggs', 'Tomatoes', 'Onions'],
      },
      dinner: {
        name: 'Golden Fragrant Fried Rice',
        timeMinutes: 15,
        uses: ['Rice', 'Eggs', 'Soy Sauce'],
      },
      wasteReductionTip: 'Uses up open ripe tomatoes and leftover rice right away.',
    },
    {
      day: 'Day 2',
      lunch: {
        name: 'Silky Garlic & Herb Quick Pasta',
        timeMinutes: 15,
        uses: ['Pasta', 'Garlic', 'Olive Oil'],
      },
      dinner: {
        name: 'Caramelized Onion & Egg Skillet',
        timeMinutes: 25,
        uses: ['Onions', 'Eggs', 'Cheese'],
      },
      wasteReductionTip: 'Transforms simple onions into a sweet, caramelized foundation.',
    },
    {
      day: 'Day 3',
      lunch: {
        name: 'Crispy Rice Frittata',
        timeMinutes: 18,
        uses: ['Rice', 'Eggs', 'Spinach'],
      },
      dinner: {
        name: 'Rich Tomato & Garlic Stew with Bread',
        timeMinutes: 20,
        uses: ['Tomatoes', 'Garlic', 'Bread'],
      },
      wasteReductionTip: 'Finishes remaining produce and bread before they turn stale.',
    },
  ]);

  const handleGenerate = async (selectedDays: 3 | 7) => {
    setDays(selectedDays);
    setLoading(true);
    try {
      const res = await fetch('/api/meal-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: pantryItems,
          days: selectedDays,
        }),
      });
      const data = await res.json();
      if (data.plan && data.plan.length > 0) {
        setPlan(data.plan);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6B93B]/20 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Smart Zero-Waste Meal Plan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-50">
            {t.planner}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            An organized schedule that cross-utilizes your pantry so nothing ever goes to waste.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerate(3)}
            disabled={loading}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              days === 3
                ? 'bg-[#E4572E] text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            3 Days
          </button>
          <button
            onClick={() => handleGenerate(7)}
            disabled={loading}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              days === 7
                ? 'bg-[#E4572E] text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => handleGenerate(days)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#4C9F70] hover:bg-emerald-600 text-white font-bold transition-colors"
            title="Regenerate plan"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 animate-pulse">
          <Sparkles className="w-10 h-10 text-[#F6B93B] mx-auto mb-3 animate-spin" />
          <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
            Crafting your zero-waste meal plan...
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Matching pantry items across days to optimize freshness and eliminate waste.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {plan.map((dayItem, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
                <span className="font-serif text-lg font-bold text-[#E4572E]">
                  {dayItem.day}
                </span>
                <span className="text-xs bg-[#4C9F70]/10 text-[#4C9F70] font-semibold px-2.5 py-1 rounded-full">
                  Zero-Waste Day
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Lunch */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Lunch
                  </span>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {dayItem.lunch.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dayItem.lunch.timeMinutes} mins</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {dayItem.lunch.uses.map((ing) => (
                      <span
                        key={ing}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#4C9F70]/10 text-emerald-800 dark:text-emerald-300"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dinner */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Dinner
                  </span>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {dayItem.dinner.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dayItem.dinner.timeMinutes} mins</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {dayItem.dinner.uses.map((ing) => (
                      <span
                        key={ing}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#4C9F70]/10 text-emerald-800 dark:text-emerald-300"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Waste Tip */}
              {dayItem.wasteReductionTip && (
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">🌱 Waste Saver:</span>
                  <span>{dayItem.wasteReductionTip}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
