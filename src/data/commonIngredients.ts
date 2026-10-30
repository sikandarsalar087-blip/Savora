export interface CommonIngredientOption {
  name: string;
  category: 'produce' | 'dairy' | 'meat' | 'pantry' | 'bakery' | 'spices' | 'other';
  icon: string;
  isQuickChip?: boolean;
}

export const QUICK_ADD_INGREDIENTS = [
  'Eggs',
  'Tomatoes',
  'Onions',
  'Garlic',
  'Rice',
  'Pasta',
  'Potatoes',
  'Chicken',
  'Cheese',
  'Milk',
  'Bread',
  'Spinach',
  'Lemon',
  'Yogurt'
];

export const INGREDIENTS_DATABASE: CommonIngredientOption[] = [
  // Produce
  { name: 'Tomatoes', category: 'produce', icon: '🍅', isQuickChip: true },
  { name: 'Onions', category: 'produce', icon: '🧅', isQuickChip: true },
  { name: 'Garlic', category: 'produce', icon: '🧄', isQuickChip: true },
  { name: 'Potatoes', category: 'produce', icon: '🥔', isQuickChip: true },
  { name: 'Spinach', category: 'produce', icon: '🥬', isQuickChip: true },
  { name: 'Lemon', category: 'produce', icon: '🍋', isQuickChip: true },
  { name: 'Bell Pepper', category: 'produce', icon: '🫑' },
  { name: 'Carrots', category: 'produce', icon: '🥕' },
  { name: 'Broccoli', category: 'produce', icon: '🥦' },
  { name: 'Mushrooms', category: 'produce', icon: '🍄' },
  { name: 'Zucchini', category: 'produce', icon: '🥒' },
  { name: 'Avocado', category: 'produce', icon: '🥑' },
  { name: 'Cucumber', category: 'produce', icon: '🥒' },
  { name: 'Ginger', category: 'produce', icon: '🫚' },
  { name: 'Cilantro', category: 'produce', icon: '🌿' },
  { name: 'Basil', category: 'produce', icon: '🌿' },
  { name: 'Green Beans', category: 'produce', icon: '🫘' },
  { name: 'Lime', category: 'produce', icon: '🍈' },
  { name: 'Sweet Potato', category: 'produce', icon: '🍠' },
  { name: 'Corn', category: 'produce', icon: '🌽' },
  { name: 'Cabbage', category: 'produce', icon: '🥬' },
  { name: 'Cauliflower', category: 'produce', icon: '🥦' },
  { name: 'Chili Pepper', category: 'produce', icon: '🌶️' },

  // Dairy & Eggs
  { name: 'Eggs', category: 'dairy', icon: '🥚', isQuickChip: true },
  { name: 'Cheese', category: 'dairy', icon: '🧀', isQuickChip: true },
  { name: 'Milk', category: 'dairy', icon: '🥛', isQuickChip: true },
  { name: 'Yogurt', category: 'dairy', icon: '🥣', isQuickChip: true },
  { name: 'Butter', category: 'dairy', icon: '🧈' },
  { name: 'Parmesan', category: 'dairy', icon: '🧀' },
  { name: 'Heavy Cream', category: 'dairy', icon: '🥛' },
  { name: 'Feta Cheese', category: 'dairy', icon: '🧀' },
  { name: 'Mozzarella', category: 'dairy', icon: '🧀' },
  { name: 'Sour Cream', category: 'dairy', icon: '🥣' },

  // Pantry & Grains
  { name: 'Rice', category: 'pantry', icon: '🍚', isQuickChip: true },
  { name: 'Pasta', category: 'pantry', icon: '🍝', isQuickChip: true },
  { name: 'Bread', category: 'bakery', icon: '🍞', isQuickChip: true },
  { name: 'Oats', category: 'pantry', icon: '🥣' },
  { name: 'Flour', category: 'pantry', icon: '🌾' },
  { name: 'Canned Tomatoes', category: 'pantry', icon: '🥫' },
  { name: 'Canned Beans', category: 'pantry', icon: '🥫' },
  { name: 'Chickpeas', category: 'pantry', icon: '🫘' },
  { name: 'Lentils', category: 'pantry', icon: '🫘' },
  { name: 'Soy Sauce', category: 'pantry', icon: '🥢' },
  { name: 'Olive Oil', category: 'pantry', icon: '🫒' },
  { name: 'Honey', category: 'pantry', icon: '🍯' },
  { name: 'Peanut Butter', category: 'pantry', icon: '🥜' },
  { name: 'Tortillas', category: 'bakery', icon: '🫓' },
  { name: 'Noodles', category: 'pantry', icon: '🍜' },

  // Meat & Seafood & Alternatives
  { name: 'Chicken', category: 'meat', icon: '🍗', isQuickChip: true },
  { name: 'Ground Beef', category: 'meat', icon: '🥩' },
  { name: 'Bacon', category: 'meat', icon: '🥓' },
  { name: 'Tuna (canned)', category: 'meat', icon: '🐟' },
  { name: 'Salmon', category: 'meat', icon: '🍣' },
  { name: 'Shrimp', category: 'meat', icon: '🦐' },
  { name: 'Tofu', category: 'meat', icon: '🧊' },
  { name: 'Sausage', category: 'meat', icon: '🌭' },
];

export const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🌱' },
  { id: 'vegan', label: 'Vegan', icon: '🌿' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'halal', label: 'Halal', icon: '✨' },
  { id: 'low-carb', label: 'Low-Carb', icon: '🥩' },
  { id: 'high-protein', label: 'High-Protein', icon: '💪' },
  { id: 'nut-free', label: 'Nut-Free', icon: '🥜' },
];

export const CUISINE_OPTIONS = [
  { id: 'any', label: 'Any Mood', icon: '✨' },
  { id: 'Mediterranean', label: 'Mediterranean', icon: '🫒' },
  { id: 'Italian', label: 'Italian', icon: '🍝' },
  { id: 'Asian', label: 'Asian', icon: '🥢' },
  { id: 'Middle Eastern', label: 'Middle Eastern', icon: '🧆' },
  { id: 'Mexican', label: 'Mexican', icon: '🌮' },
  { id: 'Comfort Food', label: 'Comfort Food', icon: '🍲' },
];
