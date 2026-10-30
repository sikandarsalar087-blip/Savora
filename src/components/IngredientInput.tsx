import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  X,
  Camera,
  Mic,
  Sparkles,
  Check,
  Flame,
  AlertCircle,
  HelpCircle,
  Trash2,
} from 'lucide-react';
import { IngredientItem, SupportedLanguage } from '../types';
import { INGREDIENTS_DATABASE, QUICK_ADD_INGREDIENTS } from '../data/commonIngredients';
import { TRANSLATIONS } from '../utils/i18n';

interface IngredientInputProps {
  ingredients: IngredientItem[];
  onAddIngredient: (name: string, quantity?: string) => void;
  onRemoveIngredient: (id: string) => void;
  onUpdateQuantity: (id: string, qty: string) => void;
  onClearAll: () => void;
  hasPantryStaples: boolean;
  onTogglePantryStaples: (val: boolean) => void;
  onOpenPhotoScan: () => void;
  onOpenVoiceInput: () => void;
  language: SupportedLanguage;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onUpdateQuantity,
  onClearAll,
  hasPantryStaples,
  onTogglePantryStaples,
  onOpenPhotoScan,
  onOpenVoiceInput,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempQty, setTempQty] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning;
    if (hour < 17) return t.greetingAfternoon;
    return t.greetingEvening;
  };

  // Autocomplete filtering
  useEffect(() => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed.length > 0) {
      const matches = INGREDIENTS_DATABASE
        .map((i) => i.name)
        .filter((name) => name.toLowerCase().includes(trimmed))
        .filter((name) => !ingredients.some((existing) => existing.name.toLowerCase() === name.toLowerCase()))
        .slice(0, 6);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, ingredients]);

  const handleAdd = (nameToAdd?: string) => {
    const target = nameToAdd || inputValue;
    if (!target.trim()) return;

    // Check if user entered quantity prefix like "3 eggs" or "200g rice"
    const trimmed = target.trim();
    const qtyMatch = trimmed.match(/^(\d+(?:\.\d+)?(?:\s*(?:cups?|g|kg|oz|lbs?|tbsp|tsp|cloves?|slices?|cans?|heads?|pieces?))?)\s+(.*)$/i);

    if (qtyMatch) {
      onAddIngredient(qtyMatch[2].trim(), qtyMatch[1].trim());
    } else {
      onAddIngredient(trimmed);
    }

    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        handleAdd(suggestions[0]);
      } else {
        handleAdd();
      }
    }
  };

  const startEditQuantity = (item: IngredientItem) => {
    setEditingId(item.id);
    setTempQty(item.quantity || '');
  };

  const saveEditQuantity = (id: string) => {
    onUpdateQuantity(id, tempQty.trim());
    setEditingId(null);
  };

  return (
    <div className="w-full">
      {/* Time-based warm greeting header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4572E]/10 text-[#E4572E] text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Savora Kitchen AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
          {getGreeting()}, <br className="sm:hidden" />
          <span className="text-[#E4572E]">{t.greetingKitchen}</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto font-sans leading-relaxed">
          {t.heroSubtext}
        </p>
      </div>

      {/* Main Ingredient Input Box */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-stone-900 rounded-3xl shadow-xl shadow-[#E4572E]/5 border-2 border-[#E4572E]/20 dark:border-stone-800 p-4 sm:p-6 transition-all duration-300 hover:border-[#E4572E]/40">
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.inputPlaceholder}
                className="w-full pl-4 pr-12 py-3.5 text-base sm:text-lg bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E4572E] focus:bg-white dark:focus:bg-stone-800 transition-all"
              />
              {inputValue && (
                <button
                  onClick={() => setInputValue('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden z-30">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={suggestion}
                      onClick={() => handleAdd(suggestion)}
                      className={`w-full text-left px-4 py-2.5 text-sm sm:text-base flex items-center justify-between hover:bg-[#FFF8F0] dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors ${
                        idx === 0 ? 'bg-stone-50 dark:bg-stone-800/50 font-medium' : ''
                      }`}
                    >
                      <span>{suggestion}</span>
                      <Plus className="w-4 h-4 text-[#4C9F70]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons: Add, Photo Scan, Voice Dictate */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdd()}
                disabled={!inputValue.trim()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#E4572E] hover:bg-[#d04922] disabled:opacity-50 text-white rounded-2xl font-semibold text-sm transition-all shadow-md shadow-[#E4572E]/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>

              <button
                type="button"
                onClick={onOpenPhotoScan}
                className="p-3.5 bg-[#4C9F70]/10 hover:bg-[#4C9F70]/20 text-[#4C9F70] rounded-2xl border border-[#4C9F70]/30 transition-all hover:scale-105 active:scale-95"
                title={t.photoScan}
              >
                <Camera className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onOpenVoiceInput}
                className="p-3.5 bg-[#F6B93B]/20 hover:bg-[#F6B93B]/30 text-amber-700 dark:text-amber-400 rounded-2xl border border-[#F6B93B]/40 transition-all hover:scale-105 active:scale-95"
                title={t.voiceInput}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick-add chips for common items */}
          <div className="mt-5">
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2 flex items-center justify-between">
              <span>{t.quickAddLabel}</span>
              {ingredients.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-stone-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear all ({ingredients.length})</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {QUICK_ADD_INGREDIENTS.map((item) => {
                const isAdded = ingredients.some(
                  (i) => i.name.toLowerCase() === item.toLowerCase()
                );
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (!isAdded) onAddIngredient(item);
                    }}
                    disabled={isAdded}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isAdded
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-default opacity-60 line-through'
                        : 'bg-[#FFF8F0] dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 border border-[#E4572E]/15 hover:border-[#E4572E]/60 hover:text-[#E4572E] hover:scale-105 active:scale-95'
                    }`}
                  >
                    <span>{item}</span>
                    {isAdded ? (
                      <Check className="w-3 h-3 text-[#4C9F70]" />
                    ) : (
                      <Plus className="w-3 h-3 opacity-60" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Ingredients Chips Display */}
          {ingredients.length > 0 && (
            <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4C9F70] flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Ready in your kitchen ({ingredients.length} items)</span>
                </span>
                <span className="text-xs text-stone-400">Click quantity to edit</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {ingredients.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`group relative inline-flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-2xl text-sm font-medium border transition-all ${
                        item.expiringSoon
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                          : 'bg-[#FFF8F0] dark:bg-stone-800 border-[#E4572E]/25 text-stone-800 dark:text-stone-100 shadow-sm'
                      }`}
                    >
                      <span className="font-semibold">{item.name}</span>

                      {/* Quantity Tag / Inline Edit */}
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={tempQty}
                            onChange={(e) => setTempQty(e.target.value)}
                            onBlur={() => saveEditQuantity(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditQuantity(item.id);
                            }}
                            autoFocus
                            placeholder="e.g. 3"
                            className="w-16 px-1.5 py-0.5 text-xs bg-white dark:bg-stone-700 border border-[#E4572E] rounded text-stone-800 dark:text-stone-100 focus:outline-none"
                          />
                          <button
                            onClick={() => saveEditQuantity(item.id)}
                            className="text-[#4C9F70] hover:text-[#3d855c]"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditQuantity(item)}
                          className="text-xs px-2 py-0.5 rounded-lg bg-stone-200/70 dark:bg-stone-700/70 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                          title="Click to edit quantity"
                        >
                          {item.quantity || 'Qty?'}
                        </button>
                      )}

                      {item.expiringSoon && (
                        <span
                          className="w-2 h-2 rounded-full bg-[#E4572E] animate-ping"
                          title="Use soon!"
                        />
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveIngredient(item.id)}
                        className="p-1 text-stone-400 hover:text-red-500 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-700/50 transition-colors"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pantry Staples Checkbox */}
          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-start gap-3">
            <input
              id="pantry-staples-check"
              type="checkbox"
              checked={hasPantryStaples}
              onChange={(e) => onTogglePantryStaples(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#E4572E] focus:ring-[#E4572E] border-stone-300 dark:border-stone-600 accent-[#E4572E] cursor-pointer"
            />
            <label
              htmlFor="pantry-staples-check"
              className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 cursor-pointer select-none"
            >
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {t.pantryStaplesCheckbox}
              </span>{' '}
              <span className="text-stone-500 dark:text-stone-400">
                {t.pantryStaplesHint}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
