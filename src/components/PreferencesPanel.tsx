import React from 'react';
import {
  Clock,
  Users,
  Utensils,
  Leaf,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CookingPreferences, CuisineMood, MealType, SkillLevel, Strictness, SupportedLanguage } from '../types';
import { CUISINE_OPTIONS, DIETARY_OPTIONS } from '../data/commonIngredients';
import { TRANSLATIONS } from '../utils/i18n';

interface PreferencesPanelProps {
  preferences: CookingPreferences;
  onChangePreferences: (prefs: CookingPreferences) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  language: SupportedLanguage;
}

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({
  preferences,
  onChangePreferences,
  isOpen,
  onToggleOpen,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const timeOptions = [10, 20, 30, 45, 60];
  const mealTypes: { id: MealType; label: string; icon: string }[] = [
    { id: 'any', label: 'Any Meal', icon: '🍽️' },
    { id: 'breakfast', label: 'Breakfast', icon: '🥞' },
    { id: 'lunch', label: 'Lunch', icon: '🥪' },
    { id: 'dinner', label: 'Dinner', icon: '🍲' },
    { id: 'snack', label: 'Snack', icon: '🥨' },
    { id: 'dessert', label: 'Dessert', icon: '🍨' },
  ];

  const skillLevels: { id: SkillLevel; label: string; desc: string }[] = [
    { id: 'beginner', label: 'Beginner', desc: 'Simple steps & basic tools' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Standard cooking skills' },
    { id: 'confident', label: 'Confident', desc: 'Advanced techniques' },
  ];

  const toggleDietary = (id: string) => {
    const current = preferences.dietary;
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    onChangePreferences({ ...preferences, dietary: updated });
  };

  const updateServings = (delta: number) => {
    const next = Math.max(1, Math.min(10, preferences.servings + delta));
    onChangePreferences({ ...preferences, servings: next });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      {/* Toggle Bar */}
      <button
        onClick={onToggleOpen}
        type="button"
        className="w-full flex items-center justify-between px-5 py-3.5 bg-stone-100/90 dark:bg-stone-900/90 hover:bg-stone-200/70 dark:hover:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 transition-all font-medium text-sm"
      >
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-[#E4572E]" />
          <span className="font-semibold">{t.preferencesButton}</span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-normal">
            ({preferences.timeMinutes}m · {preferences.servings}{' '}
            {preferences.servings === 1 ? 'serving' : 'servings'} ·{' '}
            {preferences.strictness === 'strict' ? 'Strict' : 'Flexible'})
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-stone-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-500" />
        )}
      </button>

      {/* Expanded Preferences Content */}
      {isOpen && (
        <div className="mt-2 p-5 sm:p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-lg space-y-6 animate-fadeIn">
          {/* Row 1: Time Available & Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Time Available */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
                <Clock className="w-4 h-4 text-[#E4572E]" />
                <span>{t.timeAvailable}</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      onChangePreferences({ ...preferences, timeMinutes: time })
                    }
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                      preferences.timeMinutes === time
                        ? 'bg-[#E4572E] text-white border-[#E4572E] shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#E4572E]/50'
                    }`}
                  >
                    {time === 60 ? '1h+' : `${time}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Servings Stepper */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
                <Users className="w-4 h-4 text-[#4C9F70]" />
                <span>{t.servings} (1 - 10)</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center justify-between px-4 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => updateServings(-1)}
                    disabled={preferences.servings <= 1}
                    className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-700 disabled:opacity-40 text-stone-800 dark:text-stone-200 font-bold flex items-center justify-center text-base hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-stone-900 dark:text-stone-100 font-sans">
                    {preferences.servings}{' '}
                    <span className="text-xs font-normal text-stone-500">
                      {preferences.servings === 1 ? 'person' : 'people'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => updateServings(1)}
                    disabled={preferences.servings >= 10}
                    className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-700 disabled:opacity-40 text-stone-800 dark:text-stone-200 font-bold flex items-center justify-center text-base hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Type */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
              <Utensils className="w-4 h-4 text-[#F6B93B]" />
              <span>{t.mealType}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {mealTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onChangePreferences({ ...preferences, mealType: item.id })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                    preferences.mealType === item.id
                      ? 'bg-[#E4572E] text-white border-[#E4572E] shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#E4572E]/40'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Needs */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5">
              <Leaf className="w-4 h-4 text-[#4C9F70]" />
              <span>{t.dietaryNeeds}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((item) => {
                const isSelected = preferences.dietary.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleDietary(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#4C9F70] text-white border-[#4C9F70] shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#4C9F70]/40'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cuisine Mood & Skill Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Cuisine Mood */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5 block">
                {t.cuisineMood}
              </label>
              <select
                value={preferences.cuisine}
                onChange={(e) =>
                  onChangePreferences({
                    ...preferences,
                    cuisine: e.target.value as CuisineMood,
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E4572E]"
              >
                {CUISINE_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill Level */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5 block">
                {t.skillLevel}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {skillLevels.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      onChangePreferences({ ...preferences, skillLevel: s.id })
                    }
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
                      preferences.skillLevel === s.id
                        ? 'bg-[#2B2B2B] text-white border-[#2B2B2B] dark:bg-stone-200 dark:text-stone-900'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Strictness Toggle */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2.5 block">
              {t.strictness}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  onChangePreferences({ ...preferences, strictness: 'strict' })
                }
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  preferences.strictness === 'strict'
                    ? 'border-[#E4572E] bg-[#FFF8F0] dark:bg-[#E4572E]/10 ring-1 ring-[#E4572E]'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:border-stone-300'
                }`}
              >
                <ShieldCheck
                  className={`w-5 h-5 mt-0.5 ${
                    preferences.strictness === 'strict'
                      ? 'text-[#E4572E]'
                      : 'text-stone-400'
                  }`}
                />
                <div>
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {t.strictOnly}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Strict adherence to what you entered + basic staples.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChangePreferences({ ...preferences, strictness: 'flexible' })
                }
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  preferences.strictness === 'flexible'
                    ? 'border-[#4C9F70] bg-emerald-50/50 dark:bg-[#4C9F70]/10 ring-1 ring-[#4C9F70]'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:border-stone-300'
                }`}
              >
                <Zap
                  className={`w-5 h-5 mt-0.5 ${
                    preferences.strictness === 'flexible'
                      ? 'text-[#4C9F70]'
                      : 'text-stone-400'
                  }`}
                />
                <div>
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {t.strictAllowExtras}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Suggests 1-2 common extras for greater recipe variety.
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
