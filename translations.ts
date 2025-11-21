import { Language } from "./types";

export const TRANSLATIONS = {
  en: {
    common: {
      brandName: "AmazighFood",
      tagline: "Intelligent Food Processing"
    },
    nav: {
      home: "Home",
      createRecipe: "Create Recipe",
      foodVision: "Food Vision",
      chefChat: "Chef Chat"
    },
    hero: {
      badge: "AI-Powered Culinary Heritage",
      titlePrefix: "Taste the Spirit of",
      titleSuffix: "Amazigh Food",
      description: "Experience the future of food processing. Generate authentic recipes, analyze your meals for nutrition, and consult with our AI chef specializing in North African flavors.",
      btnRecipe: "Generate Recipe",
      btnAnalyze: "Analyze Food Image"
    },
    home: {
      feat1Title: "Smart Recipe Generation",
      feat1Desc: "Transform random ingredients into structured recipes. Our AI understands flavor profiles from Amazigh Tagines to Sushi.",
      feat2Title: "Visual Food Analysis",
      feat2Desc: "Upload a photo of any dish. Get instant nutritional estimation, ingredient breakdown, and health ratings.",
      feat3Title: "Expert Culinary Chat",
      feat3Desc: "Chat with Amayas, our AI chef. Get cooking tips, history of Berber cuisine, or help with dietary restrictions.",
      platesTitle: "Signature Plates",
      platesSubtitle: "Explore the timeless flavors of the Atlas Mountains",
      createOwn: "Create your own",
      plates: [
        { title: "Seven Vegetable Couscous", desc: "The crown jewel of Amazigh cuisine. Fluffy steamed semolina crowned with tender root vegetables and chickpeas.", tag: "Friday Special" },
        { title: "Lamb Tagine w/ Prunes", desc: "A sweet and savory masterpiece. Tender meat slow-cooked in earthenware with caramelized prunes and roasted almonds.", tag: "Classic" },
        { title: "Berber Shakshouka", desc: "A rustic mountain dish. Poached eggs nestled in a spicy sauce of tomatoes, peppers, and aromatic herbs.", tag: "Breakfast" },
        { title: "Moroccan Mint Tea", desc: "The drink of hospitality. Green tea brewed with fresh spearmint and plenty of sugar, poured from a height.", tag: "Drink" }
      ]
    },
    recipe: {
      title: "AI Recipe Architect",
      subtitle: "Enter your available ingredients, and let our AI craft a culinary masterpiece for you.",
      labelIngredients: "Ingredients",
      placeholderIngredients: "e.g., Couscous, lamb, carrots, zucchini, chickpeas...",
      labelPreferences: "Preferences / Restrictions (Optional)",
      placeholderPreferences: "e.g., Spicy, Low-carb, Vegetarian, Quick meal...",
      btnGenerate: "Generate Recipe",
      processing: "Processing...",
      generatingImage: "Generating Chef's Visualization...",
      prepTime: "Prep Time",
      cookTime: "Cook Time",
      servings: "Servings",
      ingredients: "Ingredients",
      instructions: "Instructions",
      nutrition: "Nutritional Info (Per Serving)",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat",
      error: "Failed to generate recipe. Please try again.",
      btnShare: "Share Recipe",
      btnListen: "Listen",
      copied: "Copied to clipboard!"
    },
    analyzer: {
      title: "Food Vision AI",
      subtitle: "Upload a photo OR simply type a dish name to analyze ingredients, calories, and health insights.",
      uploadPrompt: "Upload or Take Photo",
      supportText: "Supports JPEG, PNG, WEBP",
      labelContext: "Food Name / Description / Notes",
      placeholderContext: "e.g., 'Couscous Royal' OR 'Is this salad gluten-free?'",
      btnAnalyze: "Analyze Food",
      btnCreateFromAnalysis: "Generate Recipe from Ingredients",
      processing: "Analyzing...",
      emptyState: "Analysis results will appear here",
      calories: "Calories",
      healthScore: "Health Score",
      ingredients: "Main Ingredients",
      tags: "Tags",
      errorValidImage: "Please upload a valid image file.",
      errorAnalyze: "Could not analyze. Please try again."
    },
    chat: {
      chefName: "Chef Amayas",
      online: "Online",
      welcome: "Azul! I am Amayas, your Amazigh culinary guide. Ask me anything about food processing, recipes, or traditional Berber dishes.",
      placeholder: "Ask about Tagine, Couscous, or cooking tips..."
    }
  },
  fr: {
    common: {
      brandName: "AmazighFood",
      tagline: "Traitement Alimentaire Intelligent"
    },
    nav: {
      home: "Accueil",
      createRecipe: "Créer Recette",
      foodVision: "Vision Alimentaire",
      chefChat: "Chat Chef"
    },
    hero: {
      badge: "Héritage Culinaire IA",
      titlePrefix: "Goûtez l'Esprit de",
      titleSuffix: "La Cuisine Amazighe",
      description: "Découvrez le futur du traitement alimentaire. Générez des recettes authentiques, analysez la nutrition de vos repas et consultez notre chef IA spécialisé dans les saveurs nord-africaines.",
      btnRecipe: "Générer Recette",
      btnAnalyze: "Analyser Image"
    },
    home: {
      feat1Title: "Génération de Recettes Intelligente",
      feat1Desc: "Transformez des ingrédients aléatoires en recettes structurées. Notre IA comprend les profils de saveurs, des Tajines Amazighs aux Sushis.",
      feat2Title: "Analyse Alimentaire Visuelle",
      feat2Desc: "Téléchargez une photo de n'importe quel plat. Obtenez une estimation nutritionnelle instantanée et les ingrédients.",
      feat3Title: "Chat Culinaire Expert",
      feat3Desc: "Discutez avec Amayas, notre chef IA. Obtenez des conseils de cuisine, l'histoire de la cuisine berbère ou de l'aide pour les régimes.",
      platesTitle: "Plats Signature",
      platesSubtitle: "Explorez les saveurs intemporelles des montagnes de l'Atlas",
      createOwn: "Créez le vôtre",
      plates: [
        { title: "Couscous aux Sept Légumes", desc: "Le joyau de la cuisine amazighe. Semoule cuite à la vapeur couronnée de légumes racines tendres et de pois chiches.", tag: "Spécial Vendredi" },
        { title: "Tajine d'Agneau aux Pruneaux", desc: "Un chef-d'œuvre sucré-salé. Viande tendre mijotée dans un plat en terre cuite avec des pruneaux caramélisés.", tag: "Classique" },
        { title: "Chakchouka Berbère", desc: "Un plat montagnard rustique. Œufs pochés nichés dans une sauce épicée aux tomates et poivrons.", tag: "Petit-déjeuner" },
        { title: "Thé à la Menthe Marocain", desc: "La boisson de l'hospitalité. Thé vert infusé avec de la menthe fraîche et beaucoup de sucre.", tag: "Boisson" }
      ]
    },
    recipe: {
      title: "Architecte de Recettes IA",
      subtitle: "Entrez vos ingrédients disponibles et laissez notre IA créer un chef-d'œuvre culinaire pour vous.",
      labelIngredients: "Ingrédients",
      placeholderIngredients: "ex: Couscous, agneau, carottes, courgettes, pois chiches...",
      labelPreferences: "Préférences / Restrictions (Optionnel)",
      placeholderPreferences: "ex: Épicé, Faible en glucides, Végétarien...",
      btnGenerate: "Générer Recette",
      processing: "Traitement...",
      generatingImage: "Génération de la visualisation du Chef...",
      prepTime: "Préparation",
      cookTime: "Cuisson",
      servings: "Personnes",
      ingredients: "Ingrédients",
      instructions: "Instructions",
      nutrition: "Infos Nutritionnelles (Par part)",
      calories: "Calories",
      protein: "Protéines",
      carbs: "Glucides",
      fat: "Lipides",
      error: "Échec de la génération de la recette. Veuillez réessayer.",
      btnShare: "Partager la recette",
      btnListen: "Écouter",
      copied: "Copié dans le presse-papier !"
    },
    analyzer: {
      title: "Vision Alimentaire IA",
      subtitle: "Téléchargez une photo OU tapez simplement le nom d'un plat pour analyser les ingrédients et calories.",
      uploadPrompt: "Télécharger ou Prendre une Photo",
      supportText: "Supporte JPEG, PNG, WEBP",
      labelContext: "Nom du plat / Description / Notes",
      placeholderContext: "ex: 'Couscous Royal' OU 'Est-ce que cette salade est sans gluten ?'",
      btnAnalyze: "Analyser Nourriture",
      btnCreateFromAnalysis: "Générer une recette avec ces ingrédients",
      processing: "Analyse en cours...",
      emptyState: "Les résultats de l'analyse apparaîtront ici",
      calories: "Calories",
      healthScore: "Score Santé",
      ingredients: "Ingrédients Principaux",
      tags: "Tags",
      errorValidImage: "Veuillez télécharger un fichier image valide.",
      errorAnalyze: "Impossible d'analyser. Veuillez réessayer."
    },
    chat: {
      chefName: "Chef Amayas",
      online: "En ligne",
      welcome: "Azul ! Je suis Amayas, votre guide culinaire Amazigh. Posez-moi des questions sur la cuisine ou les plats berbères.",
      placeholder: "Demandez à propos du Tajine, du Couscous..."
    }
  },
  ar: {
    common: {
      brandName: "أمازيغ فود",
      tagline: "معالجة الأغذية الذكية"
    },
    nav: {
      home: "الرئيسية",
      createRecipe: "إنشاء وصفة",
      foodVision: "رؤية الطعام",
      chefChat: "محادثة الشيف"
    },
    hero: {
      badge: "تراث طهي مدعوم بالذكاء الاصطناعي",
      titlePrefix: "تذوق روح",
      titleSuffix: "المطبخ الأمازيغي",
      description: "جرب مستقبل معالجة الأغذية. قم بإنشاء وصفات أصلية، وحلل وجباتك للتغذية، واستشر طاهينا الذكي المتخصص في نكهات شمال إفريقيا.",
      btnRecipe: "إنشاء وصفة",
      btnAnalyze: "تحليل صورة طعام"
    },
    home: {
      feat1Title: "توليد وصفات ذكي",
      feat1Desc: "حول المكونات العشوائية إلى وصفات منظمة. يفهم ذكاؤنا الاصطناعي ملفات النكهة من الطواجن الأمازيغية إلى السوشي.",
      feat2Title: "تحليل الطعام البصري",
      feat2Desc: "حمل صورة لأي طبق. احصل على تقدير فوري للتغذية، وتفصيل المكونات، وتقييمات صحية.",
      feat3Title: "محادثة طهي خبيرة",
      feat3Desc: "تحدث مع أماياس، شيف الذكاء الاصطناعي لدينا. احصل على نصائح للطبخ، وتاريخ المطبخ البربري، أو مساعدة في القيود الغذائية.",
      platesTitle: "أطباق مميزة",
      platesSubtitle: "استكشف النكهات الخالدة لجبال الأطلس",
      createOwn: "أنشئ خاصتك",
      plates: [
        { title: "كسكس بسبع خضار", desc: "جوهرة المطبخ الأمازيغي. سميد رقيق مطهو على البخار متوج بخضروات جذرية طرية وحمص.", tag: "طبق الجمعة" },
        { title: "طاجين اللحم بالبرقوق", desc: "تحفة حلوة ومالحة. لحم طري مطهو ببطء في الفخار مع البرقوق المكرمل واللوز المحمص.", tag: "كلاسيكي" },
        { title: "شكشوكة بربرية", desc: "طبق جبلي ريفي. بيض مسلوق في صلصة حارة من الطماطم والفلفل والأعشاب العطرية.", tag: "فطور" },
        { title: "شاي بالنعناع مغربي", desc: "مشروب الضيافة. شاي أخضر مخمر بالنعناع الطازج والكثير من السكر.", tag: "مشروب" }
      ]
    },
    recipe: {
      title: "مهندس الوصفات الذكي",
      subtitle: "أدخل المكونات المتاحة لديك، ودع ذكاءنا الاصطناعي يصنع لك تحفة طهوية.",
      labelIngredients: "المكونات",
      placeholderIngredients: "مثال: كسكس، لحم ضأن، جزر، كوسة، حمص...",
      labelPreferences: "تفضيلات / قيود (اختياري)",
      placeholderPreferences: "مثال: حار، قليل الكربوهيدرات، نباتي...",
      btnGenerate: "إنشاء وصفة",
      processing: "جاري المعالجة...",
      generatingImage: "جاري إنشاء تصور الشيف...",
      prepTime: "وقت التحضير",
      cookTime: "وقت الطهي",
      servings: "الوجبات",
      ingredients: "المكونات",
      instructions: "التعليمات",
      nutrition: "المعلومات الغذائية (لكل حصة)",
      calories: "سعرات حرارية",
      protein: "بروتين",
      carbs: "كربوهيدرات",
      fat: "دهون",
      error: "فشل في إنشاء الوصفة. يرجى المحاولة مرة أخرى.",
      btnShare: "شارك الوصفة",
      btnListen: "استمع",
      copied: "تم النسخ إلى الحافظة!"
    },
    analyzer: {
      title: "رؤية الطعام الذكية",
      subtitle: "التقط صورة أو اكتب اسم أي طبق للتعرف على المكونات والسعرات الحرارية والرؤى الصحية.",
      uploadPrompt: "تحميل أو التقاط صورة",
      supportText: "يدعم JPEG, PNG, WEBP",
      labelContext: "اسم الطبق / وصف / ملاحظات",
      placeholderContext: "مثال: 'كسكس ملكي' أو 'هل هذا خالي من الغلوتين؟'",
      btnAnalyze: "تحليل الطعام",
      btnCreateFromAnalysis: "إنشاء وصفة من المكونات",
      processing: "جاري التحليل...",
      emptyState: "ستظهر نتائج التحليل هنا",
      calories: "سعرات حرارية",
      healthScore: "التقييم الصحي",
      ingredients: "المكونات الرئيسية",
      tags: "وسوم",
      errorValidImage: "يرجى تحميل ملف صورة صالح.",
      errorAnalyze: "تعذر التحليل. يرجى المحاولة مرة أخرى."
    },
    chat: {
      chefName: "الشيف أماياس",
      online: "متصل",
      welcome: "أزول! أنا أماياس، دليلك للطهي الأمازيغي. اسألني أي شيء عن معالجة الطعام أو الوصفات أو الأطباق البربرية التقليدية.",
      placeholder: "اسأل عن الطاجين، الكسكس، أو نصائح الطبخ..."
    }
  }
};