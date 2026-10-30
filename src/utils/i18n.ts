import { SupportedLanguage } from '../types';

export interface Translations {
  tagline: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  greetingKitchen: string;
  heroSubtext: string;
  inputPlaceholder: string;
  quickAddLabel: string;
  pantryStaplesCheckbox: string;
  pantryStaplesHint: string;
  preferencesButton: string;
  findRecipesButton: string;
  surpriseMeButton: string;
  zeroWasteButton: string;
  zeroWasteActive: string;
  timeAvailable: string;
  servings: string;
  mealType: string;
  dietaryNeeds: string;
  skillLevel: string;
  cuisineMood: string;
  strictness: string;
  strictOnly: string;
  strictAllowExtras: string;
  suggestionsTitle: string;
  matchScore: string;
  youHave: string;
  missing: string;
  cookTime: string;
  prepTime: string;
  calories: string;
  difficulty: string;
  cookThisButton: string;
  cookingModeTitle: string;
  startCookingMode: string;
  step: string;
  of: string;
  nextStep: string;
  prevStep: string;
  finishCooking: string;
  chefTips: string;
  commonMistakes: string;
  substitutions: string;
  storage: string;
  foodSafety: string;
  nutrition: string;
  addToShoppingList: string;
  addedToShoppingList: string;
  favorite: string;
  favorited: string;
  share: string;
  copiedLink: string;
  print: string;
  unitMetric: string;
  unitImperial: string;
  myKitchen: string;
  shoppingList: string;
  favorites: string;
  history: string;
  planner: string;
  useTheseSoon: string;
  photoScan: string;
  voiceInput: string;
  disclaimer: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    tagline: 'Cook with what you have.',
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    greetingKitchen: "what's in your kitchen?",
    heroSubtext: 'Tell us what you have. We turn your ingredients into mouth-watering meals with zero waste.',
    inputPlaceholder: 'Add ingredient (e.g. 3 eggs, tomatoes, rice)...',
    quickAddLabel: 'Quick tap to add common staples:',
    pantryStaplesCheckbox: 'I also have basic pantry staples',
    pantryStaplesHint: '(Salt, pepper, cooking oil, sugar, flour, common spices, and water)',
    preferencesButton: 'Preferences & Filters',
    findRecipesButton: 'Find me something to cook',
    surpriseMeButton: 'Surprise me!',
    zeroWasteButton: 'Zero-Waste Mode',
    zeroWasteActive: 'Prioritizing expiring items',
    timeAvailable: 'Time available',
    servings: 'Number of servings',
    mealType: 'Meal type',
    dietaryNeeds: 'Dietary preferences',
    skillLevel: 'Skill level',
    cuisineMood: 'Cuisine mood',
    strictness: 'Strictness',
    strictOnly: 'Use only what I have',
    strictAllowExtras: 'Allow a few extra ingredients',
    suggestionsTitle: 'Delicious ideas from your kitchen',
    matchScore: 'Match score',
    youHave: 'You have',
    missing: 'Missing',
    cookTime: 'Cook time',
    prepTime: 'Prep time',
    calories: 'Calories',
    difficulty: 'Difficulty',
    cookThisButton: 'View Recipe & Cook',
    cookingModeTitle: 'Full-Screen Cooking Mode',
    startCookingMode: 'Start Cooking Mode',
    step: 'Step',
    of: 'of',
    nextStep: 'Next Step',
    prevStep: 'Previous Step',
    finishCooking: 'Done Cooking!',
    chefTips: "Chef's Pro Tips",
    commonMistakes: 'Mistakes to Avoid',
    substitutions: 'Smart Substitutions',
    storage: 'How to Store Leftovers',
    foodSafety: 'Food Safety & Handling',
    nutrition: 'Nutrition per Serving',
    addToShoppingList: 'Add missing items to shopping list',
    addedToShoppingList: 'Added to shopping list!',
    favorite: 'Save Recipe',
    favorited: 'Saved in Favorites',
    share: 'Share Recipe',
    copiedLink: 'Recipe copied to clipboard!',
    print: 'Print Recipe',
    unitMetric: 'Metric (g, ml)',
    unitImperial: 'Imperial (oz, cups)',
    myKitchen: 'My Kitchen',
    shoppingList: 'Shopping List',
    favorites: 'Favorites',
    history: 'Cooking History',
    planner: 'Meal Planner',
    useTheseSoon: 'Use These Soon',
    photoScan: 'Scan Fridge Photo',
    voiceInput: 'Voice Dictate',
    disclaimer: 'Always check ingredients for allergies and cook food thoroughly to safe internal temperatures.'
  },
  es: {
    tagline: 'Cocina con lo que tienes.',
    greetingMorning: 'Buenos días',
    greetingAfternoon: 'Buenas tardes',
    greetingEvening: 'Buenas noches',
    greetingKitchen: '¿qué hay en tu cocina hoy?',
    heroSubtext: 'Dinos qué ingredientes tienes y te daremos recetas deliciosas paso a paso sin desperdicios.',
    inputPlaceholder: 'Añadir ingrediente (ej. 3 huevos, tomates, arroz)...',
    quickAddLabel: 'Toque rápido para agregar básicos:',
    pantryStaplesCheckbox: 'También tengo básicos de despensa',
    pantryStaplesHint: '(Sal, pimienta, aceite, azúcar, harina, especias comunes y agua)',
    preferencesButton: 'Preferencias y filtros',
    findRecipesButton: 'Encuéntrame algo para cocinar',
    surpriseMeButton: '¡Sorpréndeme!',
    zeroWasteButton: 'Modo Cero Desperdicio',
    zeroWasteActive: 'Priorizando lo próximo a caducar',
    timeAvailable: 'Tiempo disponible',
    servings: 'Número de porciones',
    mealType: 'Tipo de comida',
    dietaryNeeds: 'Dietas y preferencias',
    skillLevel: 'Nivel culinario',
    cuisineMood: 'Tipo de cocina',
    strictness: 'Nivel de exigencia',
    strictOnly: 'Solo lo que tengo',
    strictAllowExtras: 'Permitir ingredientes extra',
    suggestionsTitle: 'Ideas deliciosas de tu cocina',
    matchScore: 'Coincidencia',
    youHave: 'Tienes',
    missing: 'Te falta',
    cookTime: 'Tiempo de cocción',
    prepTime: 'Preparación',
    calories: 'Calorías',
    difficulty: 'Dificultad',
    cookThisButton: 'Ver receta y cocinar',
    cookingModeTitle: 'Modo Cocina Pantalla Completa',
    startCookingMode: 'Iniciar Modo Cocina',
    step: 'Paso',
    of: 'de',
    nextStep: 'Siguiente',
    prevStep: 'Anterior',
    finishCooking: '¡Plato listo!',
    chefTips: 'Consejos del Chef',
    commonMistakes: 'Errores a evitar',
    substitutions: 'Sustituciones inteligentes',
    storage: 'Cómo conservar sobras',
    foodSafety: 'Seguridad alimentaria',
    nutrition: 'Nutrición por porción',
    addToShoppingList: 'Añadir faltantes a la lista de compras',
    addedToShoppingList: '¡Añadido a la lista!',
    favorite: 'Guardar receta',
    favorited: 'Guardada en favoritos',
    share: 'Compartir',
    copiedLink: '¡Receta copiada!',
    print: 'Imprimir',
    unitMetric: 'Métrico (g, ml)',
    unitImperial: 'Imperial (oz, tazas)',
    myKitchen: 'Mi Despensa',
    shoppingList: 'Lista de Compras',
    favorites: 'Favoritos',
    history: 'Historial',
    planner: 'Planificador',
    useTheseSoon: 'Usar pronto',
    photoScan: 'Escanear nevera',
    voiceInput: 'Dictar por voz',
    disclaimer: 'Verifica siempre alergias y cocina los alimentos a temperaturas seguras.'
  },
  fr: {
    tagline: 'Cuisinez avec ce que vous avez.',
    greetingMorning: 'Bonjour',
    greetingAfternoon: 'Bon après-midi',
    greetingEvening: 'Bonsoir',
    greetingKitchen: "qu'avez-vous dans votre cuisine ?",
    heroSubtext: 'Indiquez vos ingrédients, Savora prépare des recettes savoureuses sans gaspillage.',
    inputPlaceholder: 'Ajouter un ingrédient (ex: 3 œufs, tomates, riz)...',
    quickAddLabel: 'Ajout rapide d’ingrédients courants :',
    pantryStaplesCheckbox: "J'ai aussi les ingrédients de base",
    pantryStaplesHint: '(Sel, poivre, huile, sucre, farine, épices et eau)',
    preferencesButton: 'Préférences & filtres',
    findRecipesButton: 'Trouvez-moi une recette',
    surpriseMeButton: 'Surprenez-moi !',
    zeroWasteButton: 'Mode Zéro Gaspillage',
    zeroWasteActive: 'Priorité aux aliments à consommer rapidement',
    timeAvailable: 'Temps disponible',
    servings: 'Nombre de portions',
    mealType: 'Type de repas',
    dietaryNeeds: 'Régimes & allergies',
    skillLevel: 'Niveau en cuisine',
    cuisineMood: 'Envie culinaire',
    strictness: 'Rigueur des ingrédients',
    strictOnly: 'Uniquement ce que j’ai',
    strictAllowExtras: 'Tolérer quelques ingrédients courants',
    suggestionsTitle: 'Idées gourmandes de votre frigo',
    matchScore: 'Score de correspondance',
    youHave: 'Vous avez',
    missing: 'Manquant',
    cookTime: 'Temps de cuisson',
    prepTime: 'Préparation',
    calories: 'Calories',
    difficulty: 'Difficulté',
    cookThisButton: 'Voir la recette & cuisiner',
    cookingModeTitle: 'Mode Cuisine Plein Écran',
    startCookingMode: 'Lancer le Mode Cuisine',
    step: 'Étape',
    of: 'sur',
    nextStep: 'Étape suivante',
    prevStep: 'Étape précédente',
    finishCooking: 'C’est prêt !',
    chefTips: 'Astuces du Chef',
    commonMistakes: 'Erreurs à éviter',
    substitutions: 'Remplacements malins',
    storage: 'Conservation des restes',
    foodSafety: 'Sécurité alimentaire',
    nutrition: 'Nutrition par portion',
    addToShoppingList: 'Ajouter les manquants aux courses',
    addedToShoppingList: 'Ajouté à la liste !',
    favorite: 'Enregistrer',
    favorited: 'Enregistré',
    share: 'Partager',
    copiedLink: 'Recette copiée !',
    print: 'Imprimer',
    unitMetric: 'Métrique (g, ml)',
    unitImperial: 'Impérial (oz, tasses)',
    myKitchen: 'Ma Cuisine',
    shoppingList: 'Liste de Courses',
    favorites: 'Favoris',
    history: 'Historique',
    planner: 'Planning Repas',
    useTheseSoon: 'À consommer vite',
    photoScan: 'Scanner le frigo',
    voiceInput: 'Dictée vocale',
    disclaimer: 'Vérifiez toujours les allergènes et cuisez les viandes et œufs à cœur.'
  },
  ar: {
    tagline: 'اطبخ بما لديك في مطبخك.',
    greetingMorning: 'صباح الخير',
    greetingAfternoon: 'طاب مساؤك',
    greetingEvening: 'مساء الخير',
    greetingKitchen: 'ماذا يوجد في مطبخك اليوم؟',
    heroSubtext: 'أخبرنا بما تملكه، وسنقدم لك وصفات واقعية ولذيذة خطوة بخطوة للحد من هدر الطعام.',
    inputPlaceholder: 'أضف مكوناً (مثال: ٣ بيضات، طماطم، أرز)...',
    quickAddLabel: 'نقرة سريعة لإضافة المكونات الشائعة:',
    pantryStaplesCheckbox: 'لدي أيضاً أساسيات المطبخ',
    pantryStaplesHint: '(ملح، فلفل، زيت، سكر، دقيق، بهارات شائعة، وماء)',
    preferencesButton: 'التفضيلات والتصفية',
    findRecipesButton: 'ابحث لي عن وجبة أطبخها',
    surpriseMeButton: 'فاجئني!',
    zeroWasteButton: 'وضع مكافحة الهدر',
    zeroWasteActive: 'أولوية للمكونات القريبة من انتهاء الصلاحية',
    timeAvailable: 'الوقت المتاح',
    servings: 'عدد الحصص',
    mealType: 'نوع الوجبة',
    dietaryNeeds: 'الاحتياجات الغذائية',
    skillLevel: 'مستوى الطهي',
    cuisineMood: 'طابع المطبخ',
    strictness: 'الالتزام بالمكونات',
    strictOnly: 'استخدم فقط ما أملكه',
    strictAllowExtras: 'السماح بمكونات إضافية بسيطة',
    suggestionsTitle: 'أفكار شهية من مطبخك',
    matchScore: 'نسبة التطابق',
    youHave: 'لديك',
    missing: 'ناقص',
    cookTime: 'وقت الطبخ',
    prepTime: 'التحضير',
    calories: 'سعرة حرارية',
    difficulty: 'الصعوبة',
    cookThisButton: 'عرض الوصفة والبدء',
    cookingModeTitle: 'وضع الطبخ بملء الشاشة',
    startCookingMode: 'بدء وضع الطبخ الموجه',
    step: 'الخطوة',
    of: 'من',
    nextStep: 'الخطوة التالية',
    prevStep: 'الخطوة السابقة',
    finishCooking: 'تم الانتهاء!',
    chefTips: 'نصائح الشيف',
    commonMistakes: 'أخطاء تجنبها',
    substitutions: 'بدائل ذكية',
    storage: 'حفظ بقايا الطعام',
    foodSafety: 'سلامة الغذاء',
    nutrition: 'القيمة الغذائية لكل حصة',
    addToShoppingList: 'إضافة النواقص لقائمة التسوق',
    addedToShoppingList: 'تمت الإضافة!',
    favorite: 'حفظ الوصفة',
    favorited: 'محفوظة',
    share: 'مشاركة',
    copiedLink: 'تم نسخ الرابط!',
    print: 'طباعة',
    unitMetric: 'متري (غرام، مل)',
    unitImperial: 'إمبراطوري (أونصة، كوب)',
    myKitchen: 'مطبخي',
    shoppingList: 'قائمة التسوق',
    favorites: 'المفضلة',
    history: 'سجل الطبخ',
    planner: 'مخطط الوجبات',
    useTheseSoon: 'استخدمها قريباً',
    photoScan: 'مسح صورة الثلاجة',
    voiceInput: 'الإملاء الصوتي',
    disclaimer: 'تأكد دائماً من مسببات الحساسية واطبخ الطعام جيداً لدرجات حرارة آمنة.'
  }
};
