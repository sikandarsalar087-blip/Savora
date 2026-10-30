import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

function callWithTimeout<T>(promise: Promise<T>, timeoutMs: number, message = 'AI call timed out'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), timeoutMs)),
  ]);
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware with large limits for base64 photo scans
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google Gen AI client with telemetry header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Curated high quality food photography for recipe cards
const FOOD_IMAGES: Record<string, string> = {
  eggs: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  pasta: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
  rice: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  chicken: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  stirfry: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
  curry: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
  toast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  dessert: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
};

function pickBestImage(name: string, description: string): string {
  const text = (name + ' ' + description).toLowerCase();
  if (text.includes('pasta') || text.includes('spaghetti') || text.includes('noodle')) return FOOD_IMAGES.pasta;
  if (text.includes('rice') || text.includes('fried rice') || text.includes('risotto') || text.includes('pilaf')) return FOOD_IMAGES.rice;
  if (text.includes('egg') || text.includes('omelet') || text.includes('shakshuka') || text.includes('frittata')) return FOOD_IMAGES.eggs;
  if (text.includes('chicken') || text.includes('poultry') || text.includes('roast')) return FOOD_IMAGES.chicken;
  if (text.includes('soup') || text.includes('broth') || text.includes('stew')) return FOOD_IMAGES.soup;
  if (text.includes('salad') || text.includes('bowl')) return FOOD_IMAGES.salad;
  if (text.includes('stir-fry') || text.includes('stir fry') || text.includes('wok')) return FOOD_IMAGES.stirfry;
  if (text.includes('curry') || text.includes('masala') || text.includes('tikka')) return FOOD_IMAGES.curry;
  if (text.includes('pancake') || text.includes('toast') || text.includes('breakfast')) return FOOD_IMAGES.breakfast;
  return FOOD_IMAGES.default;
}

// Fallback high-fidelity recipes when offline or no API key provided
function generateMockRecipes(ingredients: any[], timeMinutes: number, servings: number) {
  const names = ingredients.map(i => typeof i === 'string' ? i.toLowerCase() : i.name.toLowerCase());
  const hasEggs = names.some(n => n.includes('egg'));
  const hasTomatoes = names.some(n => n.includes('tomato'));
  const hasOnion = names.some(n => n.includes('onion') || n.includes('shallot'));
  const hasRice = names.some(n => n.includes('rice'));
  const hasPasta = names.some(n => n.includes('pasta') || n.includes('spaghetti'));
  const hasGarlic = names.some(n => n.includes('garlic'));
  const hasChicken = names.some(n => n.includes('chicken'));

  const recipes = [];

  if (hasEggs || hasTomatoes || hasOnion) {
    recipes.push({
      id: 'recipe-shakshuka-' + Date.now(),
      name: 'Rustic Kitchen Shakshuka',
      description: 'Gently poached eggs in a rich, spiced tomato and sautéed onion sauce. A Mediterranean comfort classic that turns basic kitchen staples into pure magic.',
      prepTimeMinutes: 5,
      cookTimeMinutes: Math.min(timeMinutes, 15),
      totalTimeMinutes: 20,
      difficulty: 'Easy',
      servings: servings,
      caloriesPerServing: 280,
      cuisine: 'Mediterranean',
      mealType: 'any',
      matchScoreText: 'You have almost all ingredients',
      matchedCount: Math.min(names.length, 4),
      totalIngredientsCount: 5,
      imageUrl: FOOD_IMAGES.eggs,
      ingredients: [
        { name: 'eggs', amountMetric: servings * 2, unitMetric: 'large', amountImperial: servings * 2, unitImperial: 'large', userHas: hasEggs, isPantryStaple: false, substitution: 'Firm tofu scramble or white beans' },
        { name: 'ripe tomatoes or canned tomato', amountMetric: servings * 150, unitMetric: 'g', amountImperial: servings * 5, unitImperial: 'oz', userHas: hasTomatoes, isPantryStaple: false, substitution: 'Tomato paste with warm water or salsa' },
        { name: 'onion', amountMetric: Math.max(1, Math.round(servings / 2)), unitMetric: 'medium', amountImperial: Math.max(1, Math.round(servings / 2)), unitImperial: 'medium', userHas: hasOnion, isPantryStaple: false, substitution: 'Shallots, leeks, or scallions' },
        { name: 'garlic', amountMetric: 2, unitMetric: 'cloves', amountImperial: 2, unitImperial: 'cloves', userHas: hasGarlic, isPantryStaple: true, substitution: 'Garlic powder (1/2 tsp)' },
        { name: 'olive oil, cumin, salt & pepper', amountMetric: 15, unitMetric: 'ml', amountImperial: 1, unitImperial: 'tbsp', userHas: true, isPantryStaple: true, substitution: 'Any cooking oil and smoked paprika' }
      ],
      steps: [
        { number: 1, title: 'Sauté the Aromatics', instruction: 'Heat olive oil in a skillet over medium heat. Add diced onions and minced garlic; cook for 4 minutes until golden and fragrant.', durationMinutes: 4, timerRequired: true, timerSeconds: 240 },
        { number: 2, title: 'Simmer the Sauce', instruction: 'Add chopped tomatoes, cumin, salt, and pepper. Simmer gently until the sauce thickens and smells deeply rich.', durationMinutes: 6, timerRequired: true, timerSeconds: 360 },
        { number: 3, title: 'Create Wells & Crack Eggs', instruction: 'Make small indentations in the sauce with a spoon. Crack an egg into each well. Cover with a lid and cook until egg whites are set and yolks remain soft.', durationMinutes: 5, timerRequired: true, timerSeconds: 300 },
        { number: 4, title: 'Finish & Serve', instruction: 'Garnish with freshly cracked black pepper and fresh herbs if you have them. Serve warm straight from the pan.', durationMinutes: 1, timerRequired: false }
      ],
      chefTips: [
        'Do not overcook the eggs; pull the skillet off the heat while yolks still have a gentle wobble as residual heat keeps cooking them.',
        'A pinch of sugar balances acidic canned tomatoes perfectly.'
      ],
      commonMistakes: [
        'Cracking eggs directly onto high heat where the bottom burns before whites solidify. Keep heat medium-low.'
      ],
      substitutions: [
        'Substitute bell peppers or zucchini into the sauce for extra vegetable bulk.',
        'Sprinkle crumbled feta, goat cheese, or cheddar on top if available.'
      ],
      storageAdvice: 'Store leftover tomato sauce in an airtight container for up to 3 days. We recommend poaching fresh eggs upon reheating.',
      foodSafetyNote: 'Ensure egg whites are fully coagulated and safe. If serving to vulnerable groups, cook yolks through.',
      nutrition: { calories: 280, proteinGrams: 16, carbsGrams: 14, fatGrams: 18, fiberGrams: 3 }
    });
  }

  if (hasRice || hasOnion || hasEggs) {
    recipes.push({
      id: 'recipe-fried-rice-' + Date.now(),
      name: 'Golden Pantry Fried Rice',
      description: 'The ultimate zero-waste dish: turn leftover or freshly cooked grains into a savory, fragrant stir-fry bursting with wok aroma and crispy bits.',
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      totalTimeMinutes: 15,
      difficulty: 'Easy',
      servings: servings,
      caloriesPerServing: 350,
      cuisine: 'Asian',
      mealType: 'any',
      matchScoreText: 'You have almost all ingredients',
      matchedCount: Math.min(names.length, 4),
      totalIngredientsCount: 5,
      imageUrl: FOOD_IMAGES.rice,
      ingredients: [
        { name: 'cooked rice (day-old preferred)', amountMetric: servings * 180, unitMetric: 'g', amountImperial: servings * 1, unitImperial: 'cup', userHas: hasRice, isPantryStaple: false, substitution: 'Quinoa, bulgur, or cauliflower rice' },
        { name: 'eggs', amountMetric: servings, unitMetric: 'large', amountImperial: servings, unitImperial: 'large', userHas: hasEggs, isPantryStaple: false, substitution: 'Cubed tofu or edamame' },
        { name: 'onion or scallions', amountMetric: 1, unitMetric: 'medium', amountImperial: 1, unitImperial: 'medium', userHas: hasOnion, isPantryStaple: false, substitution: 'Shallots or leek' },
        { name: 'soy sauce or salt', amountMetric: servings * 10, unitMetric: 'ml', amountImperial: servings * 2, unitImperial: 'tsp', userHas: true, isPantryStaple: true, substitution: 'Tamari, coconut aminos, or fish sauce' },
        { name: 'cooking oil', amountMetric: 15, unitMetric: 'ml', amountImperial: 1, unitImperial: 'tbsp', userHas: true, isPantryStaple: true, substitution: 'Butter or sesame oil' }
      ],
      steps: [
        { number: 1, title: 'Scramble the Eggs', instruction: 'Whisk eggs with a pinch of salt. Heat oil in a pan over high heat, pour in eggs, softly scramble for 60 seconds, and transfer to a side plate.', durationMinutes: 2, timerRequired: true, timerSeconds: 90 },
        { number: 2, title: 'Char the Aromatics', instruction: 'Add another dash of oil to the pan. Sauté diced onions and any diced vegetables you have until edges develop a slight char.', durationMinutes: 3, timerRequired: true, timerSeconds: 180 },
        { number: 3, title: 'Toss the Grains', instruction: 'Turn heat to highest setting. Toss in the rice, pressing gently with a spatula to separate grains so each kernel fries evenly.', durationMinutes: 3, timerRequired: true, timerSeconds: 180 },
        { number: 4, title: 'Season and Combine', instruction: 'Drizzle soy sauce around the rim of the pan so it caramelizes before hitting the rice. Fold in scrambled eggs and toss together vigorously.', durationMinutes: 2, timerRequired: true, timerSeconds: 120 }
      ],
      chefTips: [
        'Cold, refrigerated rice works best because excess moisture has evaporated, preventing mushy rice.',
        'Drizzle seasoning around the screaming hot edges of the skillet for authentic restaurant flavor.'
      ],
      commonMistakes: [
        'Crowding the pan with too much cold wet ingredients which drops pan temperature.'
      ],
      substitutions: [
        'Add any leftover proteins: shredded chicken, shrimp, ham, or paneer.'
      ],
      storageAdvice: 'Cool quickly and refrigerate in an airtight container within 1 hour. Safe for up to 2 days.',
      foodSafetyNote: 'Cooked rice must be cooled rapidly and eaten within 2 days to prevent Bacillus cereus growth.',
      nutrition: { calories: 350, proteinGrams: 12, carbsGrams: 48, fatGrams: 11, fiberGrams: 2 }
    });
  }

  // Pasta or quick skillet recipe
  recipes.push({
    id: 'recipe-aglio-olio-' + Date.now(),
    name: 'Silky Garlic & Herb Quick Pasta',
    description: 'An Italian culinary miracle that turns pasta, garlic, oil, and whatever you have into a glossy, restaurant-caliber emulsion.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    totalTimeMinutes: 17,
    difficulty: 'Easy',
    servings: servings,
    caloriesPerServing: 420,
    cuisine: 'Italian',
    mealType: 'dinner',
    matchScoreText: 'You have almost all ingredients',
    matchedCount: Math.min(names.length, 3),
    totalIngredientsCount: 4,
    imageUrl: FOOD_IMAGES.pasta,
    ingredients: [
      { name: 'pasta (spaghetti, penne, or whatever you have)', amountMetric: servings * 90, unitMetric: 'g', amountImperial: servings * 3, unitImperial: 'oz', userHas: hasPasta, isPantryStaple: false, substitution: 'Egg noodles, gnocchi, or spiralized zucchini' },
      { name: 'garlic', amountMetric: 4, unitMetric: 'cloves', amountImperial: 4, unitImperial: 'cloves', userHas: hasGarlic, isPantryStaple: true, substitution: 'Garlic powder or shallots' },
      { name: 'olive oil or butter', amountMetric: 30, unitMetric: 'ml', amountImperial: 2, unitImperial: 'tbsp', userHas: true, isPantryStaple: true, substitution: 'Any neutral cooking oil' },
      { name: 'red pepper flakes or black pepper', amountMetric: 2, unitMetric: 'g', amountImperial: 0.5, unitImperial: 'tsp', userHas: true, isPantryStaple: true, substitution: 'Fresh chili or paprika' }
    ],
    steps: [
      { number: 1, title: 'Boil Pasta in Salted Water', instruction: 'Bring a pot of heavily salted water to a rolling boil. Cook pasta until 1 minute shy of al dente. Reserve 1/2 cup of starchy pasta water before draining!', durationMinutes: 9, timerRequired: true, timerSeconds: 540 },
      { number: 2, title: 'Infuse Warm Olive Oil', instruction: 'While pasta cooks, thinly slice garlic. In a wide skillet, heat oil over low-medium heat with garlic and pepper flakes until garlic turns pale golden (do not let it brown!).', durationMinutes: 3, timerRequired: true, timerSeconds: 180 },
      { number: 3, title: 'Create Glossy Emulsion', instruction: 'Add the drained pasta and 1/4 cup of starchy pasta water to the garlic oil. Swirl and shake the pan vigorously for 1 minute until a luscious, creamy glaze coats every noodle.', durationMinutes: 2, timerRequired: true, timerSeconds: 120 }
    ],
    chefTips: [
      'The starchy boiling water is liquid gold; the starch combines with hot oil to form a velvety sauce without needing heavy cream.',
      'Remove garlic from heat the instant it starts to turn pale blonde; burnt garlic turns acrid and bitter.'
    ],
    commonMistakes: [
      'Discarding all pasta water down the sink! Always save a cup before draining.'
    ],
    substitutions: [
      'Toss in cherry tomatoes, canned tuna, wilted spinach, or parmesan if you have them.'
    ],
    storageAdvice: 'Refrigerate in a sealed container for up to 3 days. Reheat with a splash of water.',
    foodSafetyNote: 'Always cook pasta in properly boiling water. Serve immediately.',
    nutrition: { calories: 420, proteinGrams: 11, carbsGrams: 64, fatGrams: 14, fiberGrams: 3 }
  });

  return recipes;
}

// 1. API: Generate Recipes from Kitchen Ingredients
app.post('/api/recipes/generate', async (req: Request, res: Response) => {
  try {
    const {
      ingredients = [],
      hasPantryStaples = true,
      timeMinutes = 30,
      servings = 2,
      mealType = 'any',
      dietary = [],
      skillLevel = 'beginner',
      cuisine = 'any',
      strictness = 'flexible',
      zeroWastePriority = false,
      language = 'en',
    } = req.body;

    const ingredientDescriptions = ingredients.map((item: any) => {
      if (typeof item === 'string') return item;
      return `${item.name}${item.quantity ? ` (${item.quantity})` : ''}${item.expiringSoon ? ' [EXPIRING SOON - PRIORITIZE]' : ''}`;
    }).join(', ');

    // If Gemini client is not initialized or API call fails, use realistic intelligent fallback
    if (!ai) {
      console.warn('GEMINI_API_KEY not configured. Using high-quality culinary fallback.');
      const mock = generateMockRecipes(ingredients, timeMinutes, servings);
      return res.json({ recipes: mock, source: 'fallback' });
    }

    const systemPrompt = `You are Savora, a warm and expert home-cooking assistant. Create realistic, delicious recipes that mainly use the ingredients the user already has. Respect time, servings, diet, and skill level. Give precise quantities. Never invent unsafe food combinations. Always include food safety notes for meat, eggs, and rice. If the ingredients are too few, suggest one or two smart additions. Keep instructions short, clear, and encouraging. Return only valid JSON.`;

    const userPrompt = `
Generate 3 to 4 realistic, appetizing recipes based on the user's kitchen:
- User's Ingredients: ${ingredientDescriptions || 'eggs, tomatoes, onions, garlic, olive oil'}
- Basic Pantry Staples available (salt, pepper, oil, water, flour, common dried spices): ${hasPantryStaples ? 'YES' : 'NO'}
- Time available: ${timeMinutes} minutes
- Number of servings: ${servings}
- Meal Type: ${mealType}
- Dietary Needs: ${dietary.length ? dietary.join(', ') : 'None specified'}
- Skill Level: ${skillLevel}
- Cuisine Mood: ${cuisine}
- Strictness: ${strictness === 'strict' ? 'Strict (Use only what I have)' : 'Allow 1 or 2 extra everyday ingredients'}
- Zero-waste priority: ${zeroWastePriority ? 'HIGH: prioritize ingredients marked as expiring soon' : 'Normal'}
- Language for response: ${language === 'ar' ? 'Arabic' : language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English'}

Important:
Return a JSON object with a single key "recipes" which is an array of 3 or 4 recipes.
Each recipe must strictly follow this structure:
- id: unique string
- name: appetizing recipe name
- description: 1-2 mouth-watering sentences
- prepTimeMinutes: number
- cookTimeMinutes: number
- totalTimeMinutes: number (must be <= ${timeMinutes})
- difficulty: "Easy", "Medium", or "Intermediate"
- servings: ${servings}
- caloriesPerServing: number
- cuisine: cuisine name
- mealType: meal category
- matchScoreText: e.g. "You have 5 of 6 ingredients"
- matchedCount: number of ingredients user already has
- totalIngredientsCount: total ingredients in recipe
- ingredients: array of objects with { name: string, amountMetric: number, unitMetric: string, amountImperial: number, unitImperial: string, userHas: boolean, isPantryStaple: boolean, substitution: string }
- steps: array of objects with { number: number, title: string, instruction: string, durationMinutes: number, timerRequired: boolean, timerSeconds: number }
- chefTips: array of 2 expert tips
- commonMistakes: array of 1-2 mistakes to avoid
- substitutions: array of 1-3 smart substitution suggestions
- storageAdvice: how to store leftovers safely
- foodSafetyNote: specific food safety guidance (especially for meat, poultry, eggs, and leftover rice)
- nutrition: { calories: number, proteinGrams: number, carbsGrams: number, fatGrams: number, fiberGrams: number }
`;

    const response = await callWithTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      6000,
      'Gemini recipe generation timed out'
    );

    const rawText = (response.text ?? '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error('Failed to parse Gemini JSON output:', rawText);
      const mock = generateMockRecipes(ingredients, timeMinutes, servings);
      return res.json({ recipes: mock, source: 'fallback_parse_error' });
    }

    const recipeList = Array.isArray(parsed) ? parsed : (parsed.recipes || parsed.items || []);
    
    // Attach photos and ensure IDs
    const enrichedRecipes = recipeList.map((r: any, idx: number) => ({
      ...r,
      id: r.id || `recipe-${Date.now()}-${idx}`,
      imageUrl: r.imageUrl || pickBestImage(r.name || '', r.description || ''),
    }));

    return res.json({ recipes: enrichedRecipes, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating recipes with Gemini:', error);
    const mock = generateMockRecipes(req.body.ingredients || [], req.body.timeMinutes || 30, req.body.servings || 2);
    return res.json({ recipes: mock, source: 'fallback_error', error: error?.message });
  }
});

// 2. API: Vision Scan - Detect ingredients from photo
app.post('/api/vision/detect-ingredients', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // Clean base64 header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    if (!ai) {
      // Friendly mock response if no key
      return res.json({
        ingredients: [
          { name: 'Eggs', estimatedQuantity: '6 eggs', category: 'Dairy & Eggs', confidence: 0.95 },
          { name: 'Milk', estimatedQuantity: '1 carton', category: 'Dairy & Eggs', confidence: 0.92 },
          { name: 'Cheddar Cheese', estimatedQuantity: '1 block', category: 'Dairy & Eggs', confidence: 0.88 },
          { name: 'Tomatoes', estimatedQuantity: '4 medium', category: 'Produce', confidence: 0.90 },
          { name: 'Bell Pepper', estimatedQuantity: '2 peppers', category: 'Produce', confidence: 0.85 },
          { name: 'Spinach', estimatedQuantity: '1 bag', category: 'Produce', confidence: 0.87 },
          { name: 'Carrots', estimatedQuantity: '3 carrots', category: 'Produce', confidence: 0.82 },
          { name: 'Onions', estimatedQuantity: '2 onions', category: 'Produce', confidence: 0.80 },
        ],
        source: 'fallback'
      });
    }

    const prompt = `
Look carefully at this photo of a refrigerator, pantry, countertop, or food storage.
Identify all visible food ingredients, raw produce, dairy, condiments, proteins, vegetables, and staples.
Return a clean JSON object with a single key "ingredients" containing an array of detected items.
Each item should have:
- "name": string (singular, friendly, e.g. "Eggs", "Tomato", "Greek Yogurt", "Spinach", "Parmesan")
- "estimatedQuantity": string (e.g. "6 eggs", "2 medium", "1 container", "Half block")
- "category": string ("Produce", "Dairy & Eggs", "Meat & Seafood", "Pantry & Grains", "Condiments & Sauces", "Bakery")
- "confidence": number between 0.0 and 1.0
Do not list non-food containers or trash.
`;

    const response = await callWithTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanBase64,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      6000,
      'Vision analysis timed out'
    );

    const parsed = JSON.parse(response.text ?? '{"ingredients": []}');
    return res.json({
      ingredients: parsed.ingredients || [],
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Error detecting ingredients:', error);
    return res.status(500).json({
      error: 'Failed to scan image',
      ingredients: [
        { name: 'Eggs', estimatedQuantity: '6 eggs', category: 'Dairy & Eggs', confidence: 0.95 },
        { name: 'Tomatoes', estimatedQuantity: '3 medium', category: 'Produce', confidence: 0.9 },
        { name: 'Onions', estimatedQuantity: '2 onions', category: 'Produce', confidence: 0.85 }
      ]
    });
  }
});

// 3. API: Weekly Meal Planner from Pantry
app.post('/api/meal-plan/generate', async (req: Request, res: Response) => {
  try {
    const { ingredients = [], days = 3, dietary = [], servings = 2 } = req.body;
    const items = ingredients.map((i: any) => typeof i === 'string' ? i : i.name).join(', ');

    if (!ai) {
      return res.json({
        plan: [
          {
            day: 'Day 1',
            lunch: { name: 'Rustic Shakshuka', timeMinutes: 20, uses: ['Eggs', 'Tomatoes', 'Onions'] },
            dinner: { name: 'Golden Pantry Fried Rice', timeMinutes: 15, uses: ['Rice', 'Eggs', 'Onion'] },
            wasteReductionTip: 'Uses up open tomatoes and day-old rice.'
          },
          {
            day: 'Day 2',
            lunch: { name: 'Garlic & Herb Quick Pasta', timeMinutes: 15, uses: ['Pasta', 'Garlic', 'Olive Oil'] },
            dinner: { name: 'Caramelized Onion & Egg Skillet', timeMinutes: 25, uses: ['Onions', 'Eggs'] },
            wasteReductionTip: 'Caramelizes remaining onions slowly for natural sweetness.'
          },
          {
            day: 'Day 3',
            lunch: { name: 'Crispy Rice Frittata', timeMinutes: 18, uses: ['Rice', 'Eggs', 'Herbs'] },
            dinner: { name: 'Rich Tomato & Garlic Soup with Toasted Bread', timeMinutes: 20, uses: ['Tomatoes', 'Garlic', 'Bread'] },
            wasteReductionTip: 'Utilizes end-of-week bread and soft tomatoes.'
          }
        ]
      });
    }

    const prompt = `
Create a ${days}-day waste-free meal plan (Lunch and Dinner) for ${servings} people using these ingredients:
${items || 'Eggs, Rice, Tomatoes, Onions, Pasta, Cheese, Garlic'}
Dietary needs: ${dietary.join(', ') || 'None'}.
Return a JSON object with "plan" array.
Each day has:
- "day": string (e.g. "Day 1")
- "lunch": { "name": string, "timeMinutes": number, "uses": string[] }
- "dinner": { "name": string, "timeMinutes": number, "uses": string[] }
- "wasteReductionTip": 1 sentence explaining how this day helps avoid waste.
`;

    const response = await callWithTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      6000,
      'Meal plan generation timed out'
    );

    const parsed = JSON.parse(response.text ?? '{"plan": []}');
    return res.json({ plan: parsed.plan || [] });
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    return res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🍳 Savora backend listening on port ${PORT}`);
  });
}

startServer();
