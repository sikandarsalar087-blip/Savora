import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { ShoppingItem, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (name: string, category?: string) => void;
  onClearCompleted: () => void;
  language: SupportedLanguage;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onToggleItem,
  onRemoveItem,
  onAddItem,
  onClearCompleted,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [newItemName, setNewItemName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim());
    setNewItemName('');
  };

  const handleCopyList = () => {
    const uncompleted = items.filter((i) => !i.checked);
    const text = `Savora Grocery List:\n` + uncompleted.map((i) => `• ${i.name} ${i.amount ? `(${i.amount})` : ''}`).join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group by category
  const grouped: Record<string, ShoppingItem[]> = {};
  items.forEach((item) => {
    const cat = item.category || 'General';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4C9F70]/10 text-[#4C9F70] text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Smart Grocery List</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-50">
            {t.shoppingList} ({items.length - checkedCount} to get)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Auto-built from missing ingredients in your selected recipes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={handleCopyList}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy List'}</span>
            </button>
          )}

          {checkedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:text-red-500 text-stone-600 dark:text-stone-400 rounded-xl text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done ({checkedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Item Input */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add an extra item (e.g. olive oil, heavy cream)..."
          className="flex-1 px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#4C9F70]"
        />
        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="px-5 py-3 bg-[#4C9F70] hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Grouped Shopping Items */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-stone-700 dark:text-stone-300">
            Your shopping list is clear
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
            When you view a recipe, tap "Add missing items to shopping list" to automatically organize missing ingredients here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div
              key={category}
              className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
                {category}
              </h3>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      item.checked
                        ? 'bg-stone-50 dark:bg-stone-800/40 opacity-60'
                        : 'bg-stone-50/70 dark:bg-stone-800/80 hover:bg-[#FFF8F0] dark:hover:bg-stone-800'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => onToggleItem(item.id)}
                        className="w-5 h-5 rounded text-[#4C9F70] focus:ring-[#4C9F70] accent-[#4C9F70] cursor-pointer"
                      />
                      <div className="min-w-0">
                        <span
                          className={`text-sm font-semibold ${
                            item.checked
                              ? 'line-through text-stone-400'
                              : 'text-stone-800 dark:text-stone-100'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.amount && (
                          <span className="text-xs text-stone-500 ml-2">
                            ({item.amount})
                          </span>
                        )}
                        {item.recipeSource && (
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            For: {item.recipeSource}
                          </div>
                        )}
                      </div>
                    </label>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-stone-300 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-stone-700 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
