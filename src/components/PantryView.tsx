import React, { useState } from 'react';
import {
  Refrigerator,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Clock,
  Check,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { IngredientItem, SupportedLanguage } from '../types';
import { INGREDIENTS_DATABASE } from '../data/commonIngredients';
import { TRANSLATIONS } from '../utils/i18n';

interface PantryViewProps {
  pantryItems: IngredientItem[];
  onAddPantryItem: (item: Omit<IngredientItem, 'id'>) => void;
  onRemovePantryItem: (id: string) => void;
  onCookWithPantry: (prioritizeExpiring: boolean) => void;
  language: SupportedLanguage;
}

export const PantryView: React.FC<PantryViewProps> = ({
  pantryItems,
  onAddPantryItem,
  onRemovePantryItem,
  onCookWithPantry,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState<IngredientItem['category']>('produce');
  const [expiryDate, setExpiryDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Group items expiring within 3 days
  const now = new Date();
  const expiringSoonItems = pantryItems.filter((item) => {
    if (item.expiringSoon) return true;
    if (item.expiryDate) {
      const exp = new Date(item.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return diffDays <= 3;
    }
    return false;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let isExpiring = false;
    if (expiryDate) {
      const exp = new Date(expiryDate);
      const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));
      isExpiring = diffDays <= 3;
    }

    onAddPantryItem({
      name: name.trim(),
      quantity: quantity.trim() || undefined,
      category,
      expiryDate: expiryDate || undefined,
      expiringSoon: isExpiring,
    });

    setName('');
    setQuantity('');
    setExpiryDate('');
    setShowAddForm(false);
  };

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'produce', label: 'Produce 🥬' },
    { id: 'dairy', label: 'Dairy & Eggs 🧀' },
    { id: 'meat', label: 'Meat & Protein 🍗' },
    { id: 'pantry', label: 'Grains & Pantry 🍚' },
    { id: 'bakery', label: 'Bakery 🍞' },
  ];

  const filteredItems = pantryItems.filter((i) => {
    if (filterCategory === 'all') return true;
    return i.category === filterCategory;
  });

  const getDaysUntilExpiry = (dateStr?: string) => {
    if (!dateStr) return null;
    const exp = new Date(dateStr);
    const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Expires today!';
    if (diff === 1) return 'Expires tomorrow!';
    return `${diff} days left`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4C9F70]/10 text-[#4C9F70] text-xs font-bold uppercase tracking-wider mb-2">
            <Refrigerator className="w-3.5 h-3.5" />
            <span>Kitchen Inventory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-50">
            {t.myKitchen} ({pantryItems.length} items)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Keep track of what you have at home so you never have to retype them.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4C9F70] hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>

          <button
            onClick={() => onCookWithPantry(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E4572E] hover:bg-[#d04922] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#E4572E]/20 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#F6B93B]" />
            <span>Cook from Kitchen</span>
          </button>
        </div>
      </div>

      {/* "Use These Soon" Urgent Expiry Alert Banner */}
      {expiringSoonItems.length > 0 && (
        <div className="mb-6 p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#E4572E]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  <span>{t.useTheseSoon}</span>
                  <span className="text-xs bg-[#E4572E] text-white px-2 py-0.5 rounded-full font-sans">
                    {expiringSoonItems.length} items
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200/90 mt-0.5">
                  These ingredients are nearing expiration. Let's make a recipe that uses them right now!
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {expiringSoonItems.map((item) => (
                    <span
                      key={item.id}
                      className="px-2.5 py-1 rounded-xl bg-white/90 dark:bg-stone-900/90 border border-amber-300 text-xs font-semibold text-amber-950 dark:text-amber-100 flex items-center gap-1.5"
                    >
                      <span>{item.name}</span>
                      {item.quantity && <span className="opacity-60 font-normal">({item.quantity})</span>}
                      {item.expiryDate && (
                        <span className="text-[10px] text-red-600 font-bold">
                          · {getDaysUntilExpiry(item.expiryDate)}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onCookWithPantry(true)}
              className="px-5 py-2.5 bg-[#E4572E] hover:bg-[#d04922] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md whitespace-nowrap flex items-center justify-center gap-2 self-start sm:self-center"
            >
              <span>Cook Zero-Waste</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Item Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 p-5 sm:p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-lg space-y-4 animate-scaleUp"
        >
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            Add New Item to Kitchen
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Ingredient Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Greek Yogurt, Carrots"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#4C9F70]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Quantity (optional)
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500g, 4 pieces"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#4C9F70]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Expiry Date (optional)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#4C9F70]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200"
              >
                <option value="produce">Produce</option>
                <option value="dairy">Dairy & Eggs</option>
                <option value="meat">Meat & Seafood</option>
                <option value="pantry">Grains & Pantry</option>
                <option value="bakery">Bakery</option>
                <option value="spices">Spices & Condiments</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#4C9F70] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Save to Pantry
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === c.id
                ? 'bg-[#2B2B2B] dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Inventory List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <Refrigerator className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-stone-700 dark:text-stone-300">
            No items in this category
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
            Tap "Add Item" above or use the Camera Photo Scanner on the Home screen to fill your kitchen automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const daysLeft = getDaysUntilExpiry(item.expiryDate);
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-[#4C9F70]/40 transition-all flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">
                      {item.name}
                    </span>
                    {item.expiringSoon && (
                      <span className="w-2 h-2 rounded-full bg-[#E4572E]" title="Expiring soon" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 dark:text-stone-400">
                    {item.quantity && <span>{item.quantity}</span>}
                    {item.expiryDate && (
                      <span
                        className={`font-medium ${
                          item.expiringSoon ? 'text-red-500 font-bold' : ''
                        }`}
                      >
                        · {daysLeft}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onRemovePantryItem(item.id)}
                  className="p-2 text-stone-300 hover:text-red-500 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  title="Remove from pantry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
