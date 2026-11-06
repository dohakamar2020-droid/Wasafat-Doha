import type { Creator, Recipe } from "./data";

// مصادر يوتيوب تحققت منها المراجعة بتاريخ ٦ نوفمبر ٢٠٢٦؛ ليست مقادير الملف مراجعة.
export const IMPORT_CREATORS: Creator[] = [
  {
    "id": "chef-lorious",
    "name": "Chef Lorious",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@CalibamaCookingwithChefLorious"
  },
  {
    "id": "tasty-susan",
    "name": "Tasty With Susan",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@tastywithsusan"
  },
  {
    "id": "awkward-kitchen",
    "name": "The Awkward Kitchen PH",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@TheAwkwardKitchenPH"
  },
  {
    "id": "verna",
    "name": "Verna",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@verna.banana"
  },
  {
    "id": "little-calm",
    "name": "a little calm",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@calmingmomentss"
  },
  {
    "id": "rania-elnagar",
    "name": "rania elnagar",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@raniaelnagar9122"
  },
  {
    "id": "sweetsmin",
    "name": "SweetsMin",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@SweetsMin"
  },
  {
    "id": "cakes-by-mk",
    "name": "Cakes by MK",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@CakesbyMK"
  },
  {
    "id": "akis-petretzikis",
    "name": "Akis Petretzikis",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@akispetretzikisen"
  },
  {
    "id": "cooking-with-nisa",
    "name": "Cooking with Nisa",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@CookingwithNisa"
  },
  {
    "id": "sweet-recipes",
    "name": "Sweet Recipes",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@sweetrecps"
  },
  {
    "id": "taijis-kitchen",
    "name": "Taiji ́s Kitchen",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@taijiskitchen"
  },
  {
    "id": "indicious-kitchen",
    "name": "Indicious Kitchen",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@indiciouskitchen"
  },
  {
    "id": "basbousa-kitchen",
    "name": "Basbousa Kitchen مطبخ بسبوسة",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@basbousakitchen1"
  },
  {
    "id": "bonas-kitchen",
    "name": "Bona’s Kitchen",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@BonasKitchen"
  },
  {
    "id": "sally-baking",
    "name": "Sally’s Baking Recipes",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@SallysBaking"
  },
  {
    "id": "baking-habit",
    "name": "Baking Habit",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@BakingHabit"
  },
  {
    "id": "happy-pear",
    "name": "The Happy Pear",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@thehappypear"
  },
  {
    "id": "oregano-kitchen",
    "name": "أوريغانو | OREGANO",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@Kitchen_Oregano"
  },
  {
    "id": "grace-kim",
    "name": "Grace Kim",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@mohaesu"
  },
  {
    "id": "im-simply-lc",
    "name": "ImSimplyLC",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@ImSimplyLC"
  },
  {
    "id": "allrecipes",
    "name": "Allrecipes",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@allrecipes"
  },
  {
    "id": "east-meets-kitchen",
    "name": "East Meets Kitchen",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@EastMeetsKitchen"
  },
  {
    "id": "season-liberally",
    "name": "Season Liberally",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@SeasonLiberally"
  },
  {
    "id": "divas-can-cook",
    "name": "Divas Can Cook",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@divascancook"
  },
  {
    "id": "gimme-some-oven",
    "name": "Gimme Some Oven",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@gimmesomeovenblog"
  },
  {
    "id": "nikas-kitchen",
    "name": "Nika’s Kitchen Cravings",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@NikasKitchenCravings"
  },
  {
    "id": "savor-easy",
    "name": "Savor Easy",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@SavorEasy"
  },
  {
    "id": "grandma-cheap",
    "name": "Grandma Cheap Cheap",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@grandmacheapcheap"
  },
  {
    "id": "oaks-kitchen",
    "name": "Oak’s Kitchen",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@gitaoak"
  },
  {
    "id": "very-easy-recipes",
    "name": "Very Easy Recipes",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@VeryEasyRecipes"
  },
  {
    "id": "natalie-minassian",
    "name": "Natalie Minassian",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@natalieminassian"
  },
  {
    "id": "ifoodreal",
    "name": "iFoodReal",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@ifoodreal"
  },
  {
    "id": "patty-yumyum",
    "name": "Patty",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@yumyum_adventures"
  },
  {
    "id": "hungry-hobby",
    "name": "Hungry Hobby",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@HungryHobby"
  },
  {
    "id": "clean-delicious",
    "name": "Clean & Delicious",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@CleanandDeliciousDani"
  },
  {
    "id": "plant-based-recipes",
    "name": "Plant Based Recipes",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@ytplantbasedrecipes"
  },
  {
    "id": "mass-general",
    "name": "MassGeneralHospital",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@MassGeneralHospital"
  },
  {
    "id": "kitchen-decoded",
    "name": "Kitchen Decoded",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@KitchenDecoded"
  },
  {
    "id": "barista-nawras",
    "name": "Barista nawras باريستا نورس",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@baristanawras1996"
  },
  {
    "id": "linda-ahmed",
    "name": "Linda Ahmed - ليندا احمد",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@LindaAhmed"
  },
  {
    "id": "healthy-foodie-ph",
    "name": "Healthy Foodie PH",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@HealthyFoodiePH"
  },
  {
    "id": "paqupel-japan",
    "name": "Paqupel Japan",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@paqupeljapan"
  },
  {
    "id": "food-network",
    "name": "Food Network",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@FoodNetwork"
  },
  {
    "id": "bobby-parrish",
    "name": "Bobby Parrish",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@BobbyParrish"
  },
  {
    "id": "stefania-marzelia",
    "name": "Stefania Marzelia",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@StefaniaMarzelia"
  },
  {
    "id": "gags-kitchen",
    "name": "Gags Kitchen",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@gagskitchen"
  },
  {
    "id": "umami-patrick",
    "name": "Umami Patrick",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@UmamiPatrick"
  },
  {
    "id": "baba-food",
    "name": "BaBa Food RRC",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@BaBaFoodRRC"
  },
  {
    "id": "chef-kristal-kay",
    "name": "Chef Kristal Kay",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@chefkristalkay"
  },
  {
    "id": "nana-kitchen",
    "name": "أكلك أحلى مع نانا nana kitchen",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@nana_kitchen"
  },
  {
    "id": "kitchen-hadeer",
    "name": "Kitchen by Hadeer",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@KitchenbyHadeer"
  },
  {
    "id": "elwasfa",
    "name": "ELWASFA",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@elwasfa"
  },
  {
    "id": "easy-eats",
    "name": "EasyEats",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@EasyEats299"
  },
  {
    "id": "cooking-with-dave",
    "name": "Cooking With Dave",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@CookingWthDave"
  },
  {
    "id": "damn-delicious",
    "name": "Damn Delicious",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@DamnDeliciousblog"
  },
  {
    "id": "pinch-of-yum",
    "name": "Pinch of Yum",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@pinchofyum"
  },
  {
    "id": "healthy-foodie-girl",
    "name": "Healthy Foodie Girl",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@HealthyFoodieGirl"
  },
  {
    "id": "plated",
    "name": "PLATED",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@plated4109"
  },
  {
    "id": "chow-with-lau",
    "name": "Chow With Lau",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@ChowWithLau"
  },
  {
    "id": "plain-chicken",
    "name": "Plain Chicken",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@Plainchicken"
  },
  {
    "id": "lucy-parissi",
    "name": "Lucy Parissi",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@LucyParissi"
  },
  {
    "id": "eat-with-carmen",
    "name": "Eat with Carmen",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@eatwithcarmen"
  },
  {
    "id": "recipetin-eats",
    "name": "RecipeTin Eats",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@Recipetineats"
  },
  {
    "id": "life-with-kiona",
    "name": "Life With Kiona",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@life-with-kiona"
  },
  {
    "id": "cooking-foodie",
    "name": "The Cooking Foodie",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@TheCookingFoodie"
  },
  {
    "id": "breakfast-for-one",
    "name": "Breakfast For One",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@BreakfastForOne"
  },
  {
    "id": "noosa",
    "name": "Noosa⚘️نوسة",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@lamsat_yum"
  },
  {
    "id": "nicola-yardstyle",
    "name": "Nicola yardstyle cooking & more",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@Nicolayardstylecookingmore"
  },
  {
    "id": "ahlam-recipes",
    "name": "وصفات أحلام Ahlam recipes",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@ahlamrecipes3137"
  },
  {
    "id": "icca-dubai",
    "name": "ICCA - Dubai & Abu Dhabi",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@iccadubai_iccaabudhabi"
  },
  {
    "id": "created-to-coffee",
    "name": "Created to Coffee",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@CreatedtoCoffee"
  },
  {
    "id": "lone-goose-bakery",
    "name": "Lone Goose Bakery Co.",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@lonegoosebakery"
  },
  {
    "id": "seattle-coffee-gear",
    "name": "Seattle Coffee Gear",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@SeattleCoffeeGear"
  },
  {
    "id": "detroit-free-press",
    "name": "Detroit Free Press",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@DetroitFreePress"
  },
  {
    "id": "mona-almashrqi",
    "name": "Mona almashrqi | مُنى المشرقي",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@mona.almashrqi"
  },
  {
    "id": "huda-ingredients",
    "name": "Huda_ingredients (هدى صالح حرسي)مكونات هدى",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@Hudaingredients"
  },
  {
    "id": "hekmat-evan",
    "name": "Hekmat&Evan | حكمت و ايفان",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@hekmatevan8776"
  },
  {
    "id": "abdulaziz-almatrafi",
    "name": "Abdulaziz almatrafi",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@abdulazizalmatrafi4731"
  },
  {
    "id": "audrey-rogers",
    "name": "Audrey Rogers",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@cook.withauds"
  },
  {
    "id": "larie-midkiff",
    "name": "Larie Midkiff",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@FitbyLarie"
  },
  {
    "id": "peppa-foodie",
    "name": "Peppa Foodie",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@PeppaFoodie"
  },
  {
    "id": "retro-guy",
    "name": "RetroGuy MrPie",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@retroguymrpie5173"
  },
  {
    "id": "olipop",
    "name": "OLIPOP",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@OLIPOP"
  },
  {
    "id": "nahla-suliman",
    "name": "Nahla Suliman",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@nahlasuliman6778"
  },
  {
    "id": "grit-groceries",
    "name": "Grit and Groceries",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@gritandgroceries"
  },
  {
    "id": "nadas-coffee",
    "name": "Nada's coffee",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@nadascoffee7357"
  },
  {
    "id": "lets-cook-olet",
    "name": "Letscookolet",
    "tagline": "وصفات وأفكار مصوّرة",
    "style": "وصفات وفيديوهات من القناة الأصلية",
    "channelHint": "youtube.com/@Letscookolet"
  }
];

export const IMPORT_CANDIDATES: Recipe[] = [
  {
    "slug": "no-churn-vanilla-ice-cream",
    "title": "آيس كريم البيت بدون آلة",
    "creatorId": "chef-lorious",
    "category": "حلويات باردة",
    "mainIngredients": [
      "كريمة خفق",
      "حليب مكثف",
      "فانيليا"
    ],
    "textures": [],
    "needs": [],
    "why": "بديل يوتيوب لآيس كريم الفانيليا بدون آلة؛ الإضافات اختيارية. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "PLeILH9jMXM",
        "kind": "video",
        "published": "07/2021",
        "uploadedAt": "2021-07-10",
        "durationSec": 485,
        "views": 824,
        "sourceNo": 172
      }
    ],
    "views": 824,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "dubai-chocolate-ice-cream-bars",
    "title": "أعواد آيس كريم شوكولاتة دبي",
    "creatorId": "tasty-susan",
    "category": "حلويات باردة",
    "mainIngredients": [
      "كنافة",
      "فستق",
      "شوكولاتة",
      "كريمة"
    ],
    "textures": [],
    "needs": [],
    "why": "نسخة بكريمة الفستق والكنافة في قالب آيس كريم، مختلفة عن مقادير الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "eoECMsINuPE",
        "kind": "short",
        "published": "08/2025",
        "uploadedAt": "2025-08-21",
        "durationSec": 40,
        "views": 221579,
        "sourceNo": 173
      }
    ],
    "views": 221579,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "lotus-biscoff-brownies",
    "title": "براوني اللوتس بيسكوف",
    "creatorId": "awkward-kitchen",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "شوكولاتة",
      "بسكوف",
      "دقيق"
    ],
    "textures": [],
    "needs": [],
    "why": "براوني الشوكولاتة بكريمة وبسكويت بيسكوف؛ نسخة بديلة من القناة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "tsHSBpD3WeA",
        "kind": "video",
        "published": "05/2023",
        "uploadedAt": "2023-05-06",
        "durationSec": 431,
        "views": 2142,
        "sourceNo": 174
      }
    ],
    "views": 2142,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "matcha-mochi-brownie",
    "title": "براوني الماتشا الموتشي",
    "creatorId": "verna",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "دقيق أرز لزج",
      "ماتشا",
      "زبدة"
    ],
    "textures": [],
    "needs": [],
    "why": "نسخة فردية من صاحبة الفكرة في القلاية؛ ليست المقادير المكتوبة في الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "5iH2wp-qX10",
        "kind": "short",
        "published": "03/2025",
        "uploadedAt": "2025-03-17",
        "durationSec": 50,
        "views": 22752,
        "sourceNo": 175
      }
    ],
    "views": 22752,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "dubai-chocolate-brownies",
    "title": "براوني شوكولاتة دبي",
    "creatorId": "little-calm",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "شوكولاتة",
      "كنافة",
      "كريمة فستق"
    ],
    "textures": [],
    "needs": [],
    "why": "براوني مع كنافة الفستق وطبقة شوكولاتة؛ وصفة الفيديو تختلف عن الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "Bv0J6KnXjcQ",
        "kind": "video",
        "published": "09/2025",
        "uploadedAt": "2025-09-12",
        "durationSec": 637,
        "views": 93488,
        "sourceNo": 176
      }
    ],
    "views": 93488,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "mango-basbousa",
    "title": "بسبوسة المانجو بطريقة محلات الحلويات",
    "creatorId": "rania-elnagar",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "سميد",
      "مانجا",
      "كريمة"
    ],
    "textures": [],
    "needs": [],
    "why": "البسبوسة تُخبز قبل الكريمة والفاكهة في الفيديو؛ لا تتبعي خطوات الملف المخالفة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "FW076JEIoqQ",
        "kind": "video",
        "published": "09/2021",
        "uploadedAt": "2021-09-26",
        "durationSec": 750,
        "views": 3068,
        "sourceNo": 177
      }
    ],
    "views": 3068,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "basque-burnt-cheesecake",
    "title": "تشيز كيك الباسك المحروق",
    "creatorId": "sweetsmin",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جبنة كريمي",
      "بيض",
      "كريمة"
    ],
    "textures": [],
    "needs": [],
    "why": "تشيز كيك باسك مخبوزة؛ نسخة صغيرة من SweetsMin. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "DJ-_E1O_ArE",
        "kind": "video",
        "published": "11/2023",
        "uploadedAt": "2023-11-05",
        "durationSec": 209,
        "views": 2793,
        "sourceNo": 178
      }
    ],
    "views": 2793,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "baklava-cheesecake",
    "title": "تشيز كيك البقلاوة",
    "creatorId": "cakes-by-mk",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جلاش",
      "جبنة كريمي",
      "فستق"
    ],
    "textures": [],
    "needs": [],
    "why": "تشيز كيك بالبقلاوة والمكسرات؛ راجعي الفيديو والوصف للمقادير. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "sqosn0Ok-3A",
        "kind": "video",
        "published": "04/2023",
        "uploadedAt": "2023-04-20",
        "durationSec": 433,
        "views": 140560,
        "sourceNo": 179
      }
    ],
    "views": 140560,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "dubai-chocolate-cheesecake",
    "title": "تشيز كيك شوكولاتة دبي",
    "creatorId": "akis-petretzikis",
    "category": "حلويات باردة",
    "mainIngredients": [
      "كنافة",
      "فستق",
      "جبنة كريمي",
      "شوكولاتة"
    ],
    "textures": [],
    "needs": [],
    "why": "تشيز كيك بالفستق والشوكولاتة على قاعدة كنافة؛ نسخة بديلة بدون خبز. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "7dG2BXqij-s",
        "kind": "video",
        "published": "04/2025",
        "uploadedAt": "2025-04-04",
        "durationSec": 182,
        "views": 20710,
        "sourceNo": 180
      }
    ],
    "views": 20710,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "dubai-chocolate-stuffed-dates",
    "title": "تمر محشو شوكولاتة دبي",
    "creatorId": "cooking-with-nisa",
    "category": "حلويات باردة",
    "mainIngredients": [
      "تمر",
      "كنافة",
      "فستق",
      "شوكولاتة"
    ],
    "textures": [],
    "needs": [],
    "why": "تمر محشو بكنافة وفستق ومغطى بالشوكولاتة؛ نسخة يوتيوب بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "SqkQxD9kkrY",
        "kind": "video",
        "published": "02/2025",
        "uploadedAt": "2025-02-23",
        "durationSec": 273,
        "views": 595,
        "sourceNo": 181
      }
    ],
    "views": 595,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "condensed-milk-donuts",
    "title": "دونات الحليب المكثف السريعة",
    "creatorId": "sweet-recipes",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "حليب مكثف",
      "بيض",
      "دقيق"
    ],
    "textures": [],
    "needs": [],
    "why": "دونات مقلية بالحليب المكثف؛ لا نستخدم توقيت العنوان كوقت إجمالي. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "4J1Uui9cqdg",
        "kind": "video",
        "published": "06/2026",
        "uploadedAt": "2026-06-18",
        "durationSec": 282,
        "views": 1823441,
        "sourceNo": 182
      }
    ],
    "views": 1823441,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "pon-de-ring-mochi-donuts",
    "title": "دونات الموتشي اليابانية بون دي رينغ",
    "creatorId": "taijis-kitchen",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "دقيق أرز لزج",
      "دقيق",
      "زبادي"
    ],
    "textures": [],
    "needs": [],
    "why": "دونات يابانية بحلقات الموتشي؛ الفيديو يستخدم التوفو أو الزبادي حسب المصدر. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "XHD5XjBU92k",
        "kind": "video",
        "published": "08/2025",
        "uploadedAt": "2025-08-02",
        "durationSec": 539,
        "views": 16163,
        "sourceNo": 183
      }
    ],
    "views": 16163,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "dubai-chocolate-bar",
    "title": "شوكولاتة دبي بالفستق والكنافة (البار الفيروسي)",
    "creatorId": "indicious-kitchen",
    "category": "حلويات باردة",
    "mainIngredients": [
      "شوكولاتة",
      "كنافة",
      "زبدة فستق"
    ],
    "textures": [],
    "needs": [],
    "why": "لوح شوكولاتة محشو بالكنافة وكريمة الفستق. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "D36bvh3kqAo",
        "kind": "video",
        "published": "06/2024",
        "uploadedAt": "2024-06-07",
        "durationSec": 136,
        "views": 69100,
        "sourceNo": 184
      }
    ],
    "views": 69100,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "mango-kunafa",
    "title": "كنافة المانجو بالكريمة",
    "creatorId": "basbousa-kitchen",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "كنافة",
      "مانجا"
    ],
    "textures": [],
    "needs": [],
    "why": "كنافة بالمانجا من الفيديو المرفق؛ تفاصيل الوصفة تحتاج مراجعة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "jWJAKUQQtJc",
        "kind": "video",
        "published": "07/2023",
        "uploadedAt": "2023-07-05",
        "durationSec": 634,
        "views": 218,
        "sourceNo": 185
      }
    ],
    "views": 218,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "dubai-chocolate-cookies",
    "title": "كوكيز شوكولاتة دبي بالكنافة والفستق",
    "creatorId": "bonas-kitchen",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "شوكولاتة",
      "كنافة",
      "فستق"
    ],
    "textures": [],
    "needs": [],
    "why": "كوكيز بحشوة الفستق والكنافة؛ نسخة الفيديو بديلة عن رابط الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "DwAspVb1I5E",
        "kind": "video",
        "published": "06/2025",
        "uploadedAt": "2025-06-28",
        "durationSec": 519,
        "views": 2083,
        "sourceNo": 186
      }
    ],
    "views": 2083,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "giant-chocolate-chip-cookies",
    "title": "كوكيز نيويورك العملاقة",
    "creatorId": "sally-baking",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "دقيق",
      "شوكولاتة"
    ],
    "textures": [],
    "needs": [],
    "why": "كوكيز شوكولاتة كبيرة؛ وصفة بديلة من Sally’s Baking. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "25_ykgz3ihE",
        "kind": "video",
        "published": "02/2021",
        "uploadedAt": "2021-02-01",
        "durationSec": 62,
        "views": 39367,
        "sourceNo": 187
      }
    ],
    "views": 39367,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "japanese-cotton-cheesecake",
    "title": "كيك القطن الياباني",
    "creatorId": "baking-habit",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جبنة كريمي",
      "بيض",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "بديل حقيقي للفيديو المرفق الذي يصف نفسه بأنه محتوى طعام مولّد بالذكاء الاصطناعي. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "x1LMyzsaqbo",
        "kind": "video",
        "published": "10/2020",
        "uploadedAt": "2020-10-30",
        "durationSec": 792,
        "views": 6161,
        "sourceNo": 188
      }
    ],
    "views": 6161,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "dubai-chocolate-cake",
    "title": "كيك شوكولاتة دبي",
    "creatorId": "happy-pear",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "شوكولاتة",
      "فستق",
      "جلاش"
    ],
    "textures": [],
    "needs": [],
    "why": "نسخة نباتية بجلاش مقرمش بدل الكنافة من The Happy Pear. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "WSjgbMVHgWo",
        "kind": "video",
        "published": "04/2025",
        "uploadedAt": "2025-04-10",
        "durationSec": 546,
        "views": 18242,
        "sourceNo": 189
      }
    ],
    "views": 18242,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "october-chocolate-filled-cake",
    "title": "كيكة أكتوبر بحشوة الشوكولاتة",
    "creatorId": "oregano-kitchen",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "دقيق",
      "شوكولاتة",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "كيكة بحشوة شوكولاتة؛ الفيديو يخبز الكيك ٤٥ دقيقة، لا وقت الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "HVVwMgB23dQ",
        "kind": "video",
        "published": "11/2026",
        "uploadedAt": "2026-11-05",
        "durationSec": 111,
        "views": 2128,
        "sourceNo": 190
      }
    ],
    "views": 2128,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "churro-cheesecake-bars",
    "title": "مربعات تشيز كيك الشورو",
    "creatorId": "little-calm",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جبنة كريمي",
      "قرفة",
      "عجين كرواسون"
    ],
    "textures": [],
    "needs": [],
    "why": "مربعات تشيز كيك بالقرفة وعجين الكرواسون. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "-WM3E9sG2cw",
        "kind": "video",
        "published": "07/2025",
        "uploadedAt": "2025-07-21",
        "durationSec": 485,
        "views": 28232,
        "sourceNo": 191
      }
    ],
    "views": 28232,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "layered-chocolate-mochi",
    "title": "موتشي الشوكولاتة الطبقات الكوري",
    "creatorId": "grace-kim",
    "category": "حلويات باردة",
    "mainIngredients": [
      "دقيق أرز لزج",
      "شوكولاتة",
      "كاكاو"
    ],
    "textures": [],
    "needs": [],
    "why": "موتشي بطبقات الشوكولاتة؛ مقادير الفيديو مختلفة عن الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "YnKvAeTJSug",
        "kind": "short",
        "published": "11/2026",
        "uploadedAt": "2026-11-05",
        "durationSec": 28,
        "views": 7584,
        "sourceNo": 192
      }
    ],
    "views": 7584,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "salmon-rice-bowl",
    "title": "بول السلمون الفيروسي بمايو الكيمتشي",
    "creatorId": "easy-peasy-pan",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "سلمون",
      "أرز",
      "أفوكادو"
    ],
    "textures": [],
    "needs": [],
    "why": "نسخة بول السلمون مع مايونيز وسريراتشا؛ ليس صوص الكيمتشي المذكور بالملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "HXEVOwDnurE",
        "kind": "video",
        "published": "10/2021",
        "uploadedAt": "2021-10-29",
        "durationSec": 145,
        "views": 92064,
        "sourceNo": 193
      }
    ],
    "views": 92064,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "chipotle-chicken-burrito-bowl",
    "title": "بول دجاج البوريتو ستايل تشيبوتلي",
    "creatorId": "im-simply-lc",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "أرز",
      "فاصوليا سوداء"
    ],
    "textures": [],
    "needs": [],
    "why": "بول دجاج وأرز وفاصوليا على طريقة تشيبوتلي؛ نسخة بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "aWfkoCmxcpc",
        "kind": "video",
        "published": "05/2020",
        "uploadedAt": "2020-05-09",
        "durationSec": 542,
        "views": 182,
        "sourceNo": 194
      }
    ],
    "views": 182,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "chicken-cobbler",
    "title": "تشيكن كوبلر الفيروسي",
    "creatorId": "allrecipes",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "خضار",
      "خليط بسكويت"
    ],
    "textures": [],
    "needs": [],
    "why": "صينية دجاج وخضار بطبقة بسكويت؛ راجعي الفيديو للمكونات. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "P_DSnkS7N8U",
        "kind": "short",
        "published": "09/2023",
        "uploadedAt": "2023-09-16",
        "durationSec": 45,
        "views": 445266,
        "sourceNo": 195
      }
    ],
    "views": 445266,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "rose-tteokbokki",
    "title": "توكبوكي كوري بالصلصة الوردية (روز توكبوكي)",
    "creatorId": "easy-peasy-pan",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "كعك أرز",
      "حليب",
      "ثوم"
    ],
    "textures": [],
    "needs": [],
    "why": "توكبوكي وردي بالحليب؛ تحققي من مكونات السجق وكعك السمك في المصدر. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "3lckcIKUR9Y",
        "kind": "video",
        "published": "06/2023",
        "uploadedAt": "2023-06-25",
        "durationSec": 143,
        "views": 3027,
        "sourceNo": 196
      }
    ],
    "views": 3027,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "chicken-katsu-curry",
    "title": "دجاج كاتسو بالكاري الياباني",
    "creatorId": "east-meets-kitchen",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "كاري",
      "أرز"
    ],
    "textures": [],
    "needs": [],
    "why": "دجاج كاتسو مقرمش وصوص كاري؛ وصفة بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "M4BW0ecEzOA",
        "kind": "video",
        "published": "10/2015",
        "uploadedAt": "2015-10-01",
        "durationSec": 227,
        "views": 28072,
        "sourceNo": 197
      }
    ],
    "views": 28072,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "birria-ramen",
    "title": "رامن البيريا المكسيكي",
    "creatorId": "season-liberally",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "لحم",
      "رامن",
      "فلفل مجفف"
    ],
    "textures": [],
    "needs": [],
    "why": "رامن بمرق البيريا واللحم؛ راجعي مصدر الفيديو للتفاصيل. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "CeLo9ygdBQo",
        "kind": "video",
        "published": "08/2024",
        "uploadedAt": "2024-08-27",
        "durationSec": 400,
        "views": 3612,
        "sourceNo": 198
      }
    ],
    "views": 3612,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "million-dollar-spaghetti",
    "title": "سباغيتي المليون دولار المخبوزة",
    "creatorId": "easy-peasy-pan",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "مكرونة",
      "لحمة مفرومة",
      "كريمة"
    ],
    "textures": [],
    "needs": [],
    "why": "سباغيتي باللحمة وصوص ألفريدو من Easy Peasy Pan. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "rql-yJ8hfZc",
        "kind": "video",
        "published": "12/2022",
        "uploadedAt": "2022-12-02",
        "durationSec": 323,
        "views": 48985,
        "sourceNo": 199
      }
    ],
    "views": 48985,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "philly-cheesesteak-sliders",
    "title": "سلايدرز الفيلي تشيز ستيك",
    "creatorId": "divas-can-cook",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "لحم",
      "جبنة",
      "خبز"
    ],
    "textures": [],
    "needs": [],
    "why": "سلايدرز ستيك وفلفل وبصل وجبنة؛ نسخة يوتيوب بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "OsSZ4u7Sz6s",
        "kind": "video",
        "published": "01/2014",
        "uploadedAt": "2014-01-31",
        "durationSec": 181,
        "views": 191773,
        "sourceNo": 200
      }
    ],
    "views": 191773,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "potsticker-soup",
    "title": "شوربة الدامبلنغ الكريمية",
    "creatorId": "gimme-some-oven",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دامبلينج",
      "خضار"
    ],
    "textures": [],
    "needs": [],
    "why": "فيديو من صاحبة الرابط الأصلي؛ راجعي حشوة الدامبلينج والمقادير قبل التحضير. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "GJ0AdarMBwg",
        "kind": "video",
        "published": "12/2024",
        "uploadedAt": "2024-12-20",
        "durationSec": 67,
        "views": 1676,
        "sourceNo": 201
      }
    ],
    "views": 1676,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "spicy-tuna-onigiri",
    "title": "أونيغيري بالتونة",
    "creatorId": "easy-peasy-pan",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "أرز",
      "تونة",
      "نوري"
    ],
    "textures": [],
    "needs": [],
    "why": "أونيغيري بحشوة تونة ومايونيز حار من Easy Peasy Pan. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "hkMLNyIfd-M",
        "kind": "video",
        "published": "07/2022",
        "uploadedAt": "2022-07-16",
        "durationSec": 110,
        "views": 73933,
        "sourceNo": 202
      }
    ],
    "views": 73933,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "korean-cheese-corn-dogs",
    "title": "الكورن دوج الكوري بالجبن",
    "creatorId": "nikas-kitchen",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "موزاريلا",
      "دقيق",
      "بطاطس"
    ],
    "textures": [],
    "needs": [],
    "why": "نسخة جبنة وسجق بقري من الفيديو؛ تحققي من المكونات عند الشراء. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "6Gd7namlvXw",
        "kind": "video",
        "published": "02/2021",
        "uploadedAt": "2021-02-26",
        "durationSec": 263,
        "views": 203,
        "sourceNo": 203
      }
    ],
    "views": 203,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "korean-cream-cheese-garlic-bread",
    "title": "خبز الثوم الكوري بالجبن الكريمي",
    "creatorId": "savor-easy",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جبنة كريمي",
      "ثوم",
      "دقيق"
    ],
    "textures": [],
    "needs": [],
    "why": "خبز الثوم الكوري بحشوة الجبنة الكريمية. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "TktRc6mqLCI",
        "kind": "video",
        "published": "07/2020",
        "uploadedAt": "2020-07-09",
        "durationSec": 420,
        "views": 592264,
        "sourceNo": 204
      }
    ],
    "views": 592264,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "hot-corn-cheese-dip",
    "title": "ديب الذرة الساخن الكريمي",
    "creatorId": "grandma-cheap",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "ذرة",
      "جبنة",
      "مايونيز"
    ],
    "textures": [],
    "needs": [],
    "why": "غموس ذرة وجبنة ساخن؛ فيديو بديل. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "Vm3QSKYVn3A",
        "kind": "video",
        "published": "12/2012",
        "uploadedAt": "2012-12-20",
        "durationSec": 409,
        "views": 5410,
        "sourceNo": 205
      }
    ],
    "views": 5410,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "puff-pastry-pizza-twists",
    "title": "لفائف البف باستري بالبيتزا",
    "creatorId": "oaks-kitchen",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "بف باستري",
      "جبنة",
      "صوص بيتزا"
    ],
    "textures": [],
    "needs": [],
    "why": "لفائف بف باستري بالجبنة وصوص البيتزا. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "6cC5QURePb0",
        "kind": "video",
        "published": "01/2025",
        "uploadedAt": "2025-01-13",
        "durationSec": 63,
        "views": 1723,
        "sourceNo": 206
      }
    ],
    "views": 1723,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "strawberry-french-toast-roll-ups",
    "title": "رولات الفرنش توست المحشوة",
    "creatorId": "very-easy-recipes",
    "category": "فطار",
    "mainIngredients": [
      "توست",
      "فراولة",
      "بيض"
    ],
    "textures": [],
    "needs": [],
    "why": "فرنش توست ملفوف بالفراولة والنوتيلا أو الجبنة الكريمية. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "0fsP2S47daw",
        "kind": "video",
        "published": "05/2018",
        "uploadedAt": "2018-05-02",
        "durationSec": 218,
        "views": 16157,
        "sourceNo": 207
      }
    ],
    "views": 16157,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "protein-overnight-oats",
    "title": "أوفرنايت أوتس بالبروتين",
    "creatorId": "natalie-minassian",
    "category": "فطار",
    "mainIngredients": [
      "شوفان",
      "حليب",
      "بروتين بودرة"
    ],
    "textures": [],
    "needs": [],
    "why": "شوفان يُنقع بالثلاجة مع اللبن والبروتين؛ راجعي مدة النقع في المصدر. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "UQpUfCpp6Q8",
        "kind": "video",
        "published": "12/2025",
        "uploadedAt": "2025-12-16",
        "durationSec": 478,
        "views": 299,
        "sourceNo": 208
      }
    ],
    "views": 299,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "chocolate-protein-pudding",
    "title": "بودينج الشوكولاتة عالي البروتين",
    "creatorId": "ifoodreal",
    "category": "حلويات باردة",
    "mainIngredients": [
      "زبادي يوناني",
      "كاكاو",
      "عسل"
    ],
    "textures": [],
    "needs": [],
    "why": "بودينج زبادي وكاكاو؛ النسخة لا تعتمد على بروتين بودرة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "1yLItr9wfag",
        "kind": "short",
        "published": "04/2024",
        "uploadedAt": "2024-04-27",
        "durationSec": 18,
        "views": 8093,
        "sourceNo": 209
      }
    ],
    "views": 8093,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "mayak-marinated-eggs",
    "title": "بيض الماياك الكوري المتبل",
    "creatorId": "patty-yumyum",
    "category": "فطار",
    "mainIngredients": [
      "بيض",
      "صويا صوص",
      "ثوم"
    ],
    "textures": [],
    "needs": [],
    "why": "بيض منقوع بصوص الصويا؛ الميرين اختياري بحسب وصف الفيديو. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "ikRyTSS0qB4",
        "kind": "short",
        "published": "07/2023",
        "uploadedAt": "2023-07-14",
        "durationSec": 30,
        "views": 5135,
        "sourceNo": 210
      }
    ],
    "views": 5135,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "protein-chia-pudding",
    "title": "تشيا بودينغ بالبروتين",
    "creatorId": "hungry-hobby",
    "category": "حلويات باردة",
    "mainIngredients": [
      "شيا",
      "حليب لوز",
      "بروتين بودرة"
    ],
    "textures": [],
    "needs": [],
    "why": "بودينج شيا بالبروتين بنكهتي الفانيليا والشوكولاتة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "gGpOPaONzqE",
        "kind": "short",
        "published": "01/2024",
        "uploadedAt": "2024-01-23",
        "durationSec": 43,
        "views": 7169,
        "sourceNo": 211
      }
    ],
    "views": 7169,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "cottage-cheese-flatbread",
    "title": "خبز الجبنة القريش بمكونين",
    "creatorId": "clean-delicious",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جبنة قريش",
      "بيض"
    ],
    "textures": [],
    "needs": [],
    "why": "خبز مسطح من الجبنة والبيض والتوابل؛ الإضافات اختيارية. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "wVT50ZR6sl0",
        "kind": "video",
        "published": "10/2024",
        "uploadedAt": "2024-10-11",
        "durationSec": 326,
        "views": 423537,
        "sourceNo": 212
      }
    ],
    "views": 423537,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "crispy-rice-paper-dumplings",
    "title": "دامبلنغ ورق الأرز المقرمش",
    "creatorId": "plant-based-recipes",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "ورق أرز",
      "مشروم",
      "كرنب"
    ],
    "textures": [],
    "needs": [],
    "why": "دامبلينج بورق الأرز وحشوة خضار؛ نسخة بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "5-o8JTSMlRY",
        "kind": "short",
        "published": "06/2023",
        "uploadedAt": "2023-06-18",
        "durationSec": 34,
        "views": 313,
        "sourceNo": 213
      }
    ],
    "views": 313,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "cottage-cheese-queso",
    "title": "ديب الكيسو بالجبنة القريش",
    "creatorId": "ifoodreal",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "جبنة قريش",
      "شيدر",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "غموس كيسو بالجبنة القريش والشيدر، مختلف عن غموس الرانش الموجود. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "vYfcd5Hjv6U",
        "kind": "short",
        "published": "02/2025",
        "uploadedAt": "2025-02-08",
        "durationSec": 16,
        "views": 963,
        "sourceNo": 214
      }
    ],
    "views": 963,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "french-grated-carrot-salad",
    "title": "سلطة الجزر المبشورة الفرنسية",
    "creatorId": "mass-general",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "جزر",
      "ليمون",
      "خردل"
    ],
    "textures": [],
    "needs": [],
    "why": "سلطة جزر مبشور بصلصة الليمون والخردل. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "5pKbTacHNnY",
        "kind": "video",
        "published": "04/2022",
        "uploadedAt": "2022-04-06",
        "durationSec": 143,
        "views": 196,
        "sourceNo": 215
      }
    ],
    "views": 196,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "baked-banana-oats",
    "title": "كيك الشوفان المخبوز",
    "creatorId": "easy-peasy-pan",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "شوفان",
      "موز",
      "بيض"
    ],
    "textures": [],
    "needs": [],
    "why": "شوفان مخبوز بالموز وحبيبات الشوكولاتة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "ZRvtwQC1FPE",
        "kind": "video",
        "published": "03/2021",
        "uploadedAt": "2021-03-02",
        "durationSec": 80,
        "views": 166433,
        "sourceNo": 216
      }
    ],
    "views": 166433,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "air-fryer-salmon-bites",
    "title": "مكعبات السلمون المقرمشة بالقلاع الهوائية",
    "creatorId": "kitchen-decoded",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "سلمون",
      "صويا صوص",
      "ثوم"
    ],
    "textures": [],
    "needs": [],
    "why": "مكعبات سلمون متبلة بالقلاية الهوائية؛ التفاصيل في الفيديو. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "VX82IP1dhfY",
        "kind": "video",
        "published": "07/2025",
        "uploadedAt": "2025-07-15",
        "durationSec": 117,
        "views": 635,
        "sourceNo": 217
      }
    ],
    "views": 635,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "iced-date-latte",
    "title": "آيس لاتيه التمر",
    "creatorId": "barista-nawras",
    "category": "مشروبات",
    "mainIngredients": [
      "تمر",
      "قهوة",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "لاتيه تمر بارد مع القرفة والكراميل. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "aqrR-MkeezY",
        "kind": "short",
        "published": "09/2025",
        "uploadedAt": "2025-09-21",
        "durationSec": 24,
        "views": 49437,
        "sourceNo": 218
      }
    ],
    "views": 49437,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "jelly-seven-up-drink",
    "title": "مشروب الجيلي بالسفن أب",
    "creatorId": "linda-ahmed",
    "category": "مشروبات",
    "mainIngredients": [
      "جيلي",
      "سفن أب",
      "ثلج"
    ],
    "textures": [],
    "needs": [],
    "why": "مشروب الجيلي والسفن أب بالفراولة أو المانجا. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "l06qmzYkjOY",
        "kind": "short",
        "published": "06/2026",
        "uploadedAt": "2026-06-29",
        "durationSec": 54,
        "views": 432,
        "sourceNo": 219
      }
    ],
    "views": 432,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "condensed-milk-cheesecake",
    "title": "تشيز كيك الحليب المكثف",
    "creatorId": "healthy-foodie-ph",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جبنة كريمي",
      "حليب مكثف",
      "بسكويت"
    ],
    "textures": [],
    "needs": [],
    "why": "تشيز كيك بالحليب المكثف؛ فيديو بديل بمقادير مختلفة عن الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "CEvpG4CzZWk",
        "kind": "video",
        "published": "06/2020",
        "uploadedAt": "2020-06-29",
        "durationSec": 187,
        "views": 150553,
        "sourceNo": 220
      }
    ],
    "views": 150553,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "matcha-strawberry-daifuku",
    "title": "موتشي الفراولة بالشاي الأخضر",
    "creatorId": "paqupel-japan",
    "category": "حلويات باردة",
    "mainIngredients": [
      "فراولة",
      "ماتشا",
      "دقيق أرز لزج"
    ],
    "textures": [],
    "needs": [],
    "why": "موتشي الفراولة بحشوة الفاصوليا والماتشا؛ نسخة يوتيوب بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "_mSNI9mtHEE",
        "kind": "video",
        "published": "07/2026",
        "uploadedAt": "2026-07-21",
        "durationSec": 301,
        "views": 221,
        "sourceNo": 221
      }
    ],
    "views": 221,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "cottage-cheese-bagels",
    "title": "بيغل الجبن القريش عالي البروتين",
    "creatorId": "food-network",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "جبنة قريش",
      "دقيق",
      "بيض"
    ],
    "textures": [],
    "needs": [],
    "why": "بيغل بالجبنة القريش من Food Network. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "y-xZI0c7IKs",
        "kind": "video",
        "published": "12/2025",
        "uploadedAt": "2025-12-28",
        "durationSec": 128,
        "views": 73669,
        "sourceNo": 222
      }
    ],
    "views": 73669,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "starbucks-egg-white-bites",
    "title": "إيغ وايت بايتس على طريقة ستاربكس",
    "creatorId": "bobby-parrish",
    "category": "فطار",
    "mainIngredients": [
      "بياض البيض",
      "جبنة كريمي",
      "فلفل"
    ],
    "textures": [],
    "needs": [],
    "why": "قوالب بياض البيض والجبنة والفلفل المشوي على طريقة ستاربكس. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "h2OEO2AmQoI",
        "kind": "video",
        "published": "01/2020",
        "uploadedAt": "2020-01-06",
        "durationSec": 290,
        "views": 69067,
        "sourceNo": 223
      }
    ],
    "views": 69067,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "brown-sugar-shaken-espresso",
    "title": "آيس برون شوجر شاكن إسبريسو",
    "creatorId": "stefania-marzelia",
    "category": "مشروبات",
    "mainIngredients": [
      "إسبريسو",
      "سكر بني",
      "حليب شوفان"
    ],
    "textures": [],
    "needs": [],
    "why": "إسبريسو مخفوق بشراب السكر البني والحليب. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "NftewEYgRRc",
        "kind": "short",
        "published": "10/2023",
        "uploadedAt": "2023-10-24",
        "durationSec": 44,
        "views": 43583,
        "sourceNo": 224
      }
    ],
    "views": 43583,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "iced-strawberry-matcha-latte",
    "title": "آيس ستروبيري ماتشا لاتيه",
    "creatorId": "gags-kitchen",
    "category": "مشروبات",
    "mainIngredients": [
      "ماتشا",
      "فراولة",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "لاتيه ماتشا بهريس الفراولة والحليب والثلج. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "LEnaOClrkGU",
        "kind": "video",
        "published": "03/2025",
        "uploadedAt": "2025-03-16",
        "durationSec": 147,
        "views": 2178,
        "sourceNo": 225
      }
    ],
    "views": 2178,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "espresso-tonic",
    "title": "إسبريسو تونيك",
    "creatorId": "umami-patrick",
    "category": "مشروبات",
    "mainIngredients": [
      "قهوة",
      "تونك",
      "ثلج"
    ],
    "textures": [],
    "needs": [],
    "why": "قهوة باردة بماء التونك والثلج؛ وصفة بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "ivGGZ4ZIYEs",
        "kind": "video",
        "published": "11/2025",
        "uploadedAt": "2025-11-06",
        "durationSec": 65,
        "views": 210,
        "sourceNo": 226
      }
    ],
    "views": 210,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "date-milk-shake",
    "title": "حليب التمر البارد",
    "creatorId": "baba-food",
    "category": "مشروبات",
    "mainIngredients": [
      "تمر",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "ميلك شيك التمر؛ لا يظهر تأكيد القرفة في وصف الفيديو. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "sXnrrPpHI_c",
        "kind": "video",
        "published": "03/2021",
        "uploadedAt": "2021-03-20",
        "durationSec": 226,
        "views": 469263,
        "sourceNo": 227
      }
    ],
    "views": 469263,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "iced-tiramisu-latte",
    "title": "لاتيه التيراميسو",
    "creatorId": "chef-kristal-kay",
    "category": "مشروبات",
    "mainIngredients": [
      "قهوة",
      "ماسكاربوني",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "لاتيه تيراميسو بموس الماسكاربوني؛ تحققي من نوع شراب الأماريتو المستخدم في الفيديو. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "UfLrTGSTd9A",
        "kind": "video",
        "published": "05/2024",
        "uploadedAt": "2024-05-27",
        "durationSec": 171,
        "views": 5759,
        "sourceNo": 228
      }
    ],
    "views": 5759,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "kunafa-basbousa",
    "title": "بسبوسة الكنافة المقرمشة",
    "creatorId": "nana-kitchen",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "سميد",
      "كنافة",
      "قشطة"
    ],
    "textures": [],
    "needs": [],
    "why": "بسبوسة وكنافة بحشوة القشطة؛ نسخة مختلفة عن رابط الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "kez282t-dN8",
        "kind": "video",
        "published": "01/2025",
        "uploadedAt": "2025-01-11",
        "durationSec": 442,
        "views": 1055,
        "sourceNo": 229
      }
    ],
    "views": 1055,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "strawberry-cream-kunafa",
    "title": "كنافة بالكريمة والفراولة الباردة",
    "creatorId": "kitchen-hadeer",
    "category": "حلويات باردة",
    "mainIngredients": [
      "كنافة",
      "فراولة",
      "كريمة"
    ],
    "textures": [],
    "needs": [],
    "why": "كنافة باردة بالكريمة والفراولة وصوص الفراولة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "0oeWXI9tuiQ",
        "kind": "video",
        "published": "04/2021",
        "uploadedAt": "2021-04-22",
        "durationSec": 480,
        "views": 79629,
        "sourceNo": 230
      }
    ],
    "views": 79629,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "sweet-cream-baked-rice",
    "title": "الأرز المعمر الفلاحي بالقشطة",
    "creatorId": "elwasfa",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "أرز",
      "قشطة",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "طاجن رز معمر حلو بالقشطة والحليب. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "Z5991iiGLDE",
        "kind": "video",
        "published": "01/2024",
        "uploadedAt": "2024-01-02",
        "durationSec": 294,
        "views": 179626,
        "sourceNo": 231
      }
    ],
    "views": 179626,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "crispy-potato-tacos",
    "title": "تاكوس البطاطس المقرمشة",
    "creatorId": "easy-eats",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "بطاطس",
      "تورتيلا",
      "جبنة"
    ],
    "textures": [],
    "needs": [],
    "why": "تاكو بطاطس مهروسة بالجبنة؛ نسخة بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "VoATVLPGgvk",
        "kind": "video",
        "published": "04/2024",
        "uploadedAt": "2024-04-27",
        "durationSec": 208,
        "views": 320723,
        "sourceNo": 232
      }
    ],
    "views": 320723,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "three-cheese-lasagna-soup",
    "title": "حساء اللازانيا بالجبن الثلاثي",
    "creatorId": "cooking-with-dave",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "مكرونة",
      "طماطم",
      "جبنة",
      "لحم"
    ],
    "textures": [],
    "needs": [],
    "why": "الوصف يذكر نبيذًا اختياريًا وسجقًا بديلًا؛ تحققي من المكونات واختاري ما يناسبك. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "Cq6Q6rnDll8",
        "kind": "video",
        "published": "09/2023",
        "uploadedAt": "2023-09-25",
        "durationSec": 968,
        "views": 47333,
        "sourceNo": 233
      }
    ],
    "views": 47333,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "bang-bang-chicken",
    "title": "دجاج بانغ بانغ بصوص المايو الحار",
    "creatorId": "damn-delicious",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "مايونيز",
      "صوص فلفل حلو"
    ],
    "textures": [],
    "needs": [],
    "why": "دجاج مقرمش بصوص المايونيز والفلفل الحلو. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "EkxI29czG8I",
        "kind": "short",
        "published": "07/2023",
        "uploadedAt": "2023-07-01",
        "durationSec": 47,
        "views": 8776,
        "sourceNo": 234
      }
    ],
    "views": 8776,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "focaccia-grinder-sandwich",
    "title": "ساندويتش الجراينر بالفوكاتشا",
    "creatorId": "pinch-of-yum",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "فوكاتشا",
      "جبنة",
      "سلامي"
    ],
    "textures": [],
    "needs": [],
    "why": "فيديو صاحبة الفكرة يستخدم سلامي؛ تحققي من نوع اللحم ومكوناته واختاري ما يناسبك. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "Ekl5TlPUIb8",
        "kind": "short",
        "published": "02/2026",
        "uploadedAt": "2026-02-20",
        "durationSec": 29,
        "views": 104384,
        "sourceNo": 235
      }
    ],
    "views": 104384,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "parmesan-cabbage-steaks",
    "title": "شرائح الملفوف المشوية بالبارميزان والثوم",
    "creatorId": "healthy-foodie-girl",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "ملفوف",
      "بارميزان",
      "ثوم"
    ],
    "textures": [],
    "needs": [],
    "why": "شرائح ملفوف مشوية بالبارميزان والثوم البودرة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "p5ILhG1zTKA",
        "kind": "video",
        "published": "04/2026",
        "uploadedAt": "2026-04-04",
        "durationSec": 78,
        "views": 2673,
        "sourceNo": 236
      }
    ],
    "views": 2673,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "mississippi-pot-roast",
    "title": "لحم المسيسيبي بالفلفل المخلل",
    "creatorId": "plated",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "لحم",
      "فلفل مخلل",
      "زبدة"
    ],
    "textures": [],
    "needs": [],
    "why": "لحم مسيسيبي مطهو بالفرن والفلفل المخلل؛ تحققي من مكونات أكياس التوابل. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "gTn83bbJj84",
        "kind": "video",
        "published": "12/2021",
        "uploadedAt": "2021-12-29",
        "durationSec": 612,
        "views": 2285,
        "sourceNo": 237
      }
    ],
    "views": 2285,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "crispy-chilli-beef",
    "title": "لحم بقري مقرمش بالفلفل الحار",
    "creatorId": "chow-with-lau",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "لحم",
      "فلفل حار",
      "نشا"
    ],
    "textures": [],
    "needs": [],
    "why": "شرائح لحم مقلية بصوص فلفل حلو وحار. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "cRKAaqIk0ZU",
        "kind": "video",
        "published": "08/2021",
        "uploadedAt": "2021-08-14",
        "durationSec": 338,
        "views": 8194,
        "sourceNo": 238
      }
    ],
    "views": 8194,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "million-dollar-mac-cheese",
    "title": "ماك اند تشيز المليون دولار المخبوزة",
    "creatorId": "plain-chicken",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "مكرونة",
      "جبنة قريش",
      "شيدر"
    ],
    "textures": [],
    "needs": [],
    "why": "ماك أند تشيز بالجبنة القريش والكريمة الحامضة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "lClJcDUOEAY",
        "kind": "short",
        "published": "05/2019",
        "uploadedAt": "2019-05-09",
        "durationSec": 60,
        "views": 1038,
        "sourceNo": 239
      }
    ],
    "views": 1038,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "marry-me-chicken-spinach-pasta",
    "title": "مكرونة دجاج ماري مي بالسبانخ",
    "creatorId": "lucy-parissi",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "مكرونة",
      "دجاج",
      "سبانخ"
    ],
    "textures": [],
    "needs": [],
    "why": "نسخة مخبوزة بالبشاميل والطماطم المجففة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "VkFo4EuMwkw",
        "kind": "video",
        "published": "04/2025",
        "uploadedAt": "2025-04-13",
        "durationSec": 72,
        "views": 800,
        "sourceNo": 240
      }
    ],
    "views": 800,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "caramelized-onion-pasta",
    "title": "مكرونة البصل المكرمل",
    "creatorId": "eat-with-carmen",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "مكرونة",
      "بصل",
      "صويا صوص"
    ],
    "textures": [],
    "needs": [],
    "why": "سباغيتي بالبصل المكرمل وفتات الخبز؛ نسخة بديلة من فكرة النودلز. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "w2Eg9LnTdec",
        "kind": "short",
        "published": "04/2024",
        "uploadedAt": "2024-04-24",
        "durationSec": 18,
        "views": 18808,
        "sourceNo": 241
      }
    ],
    "views": 18808,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "creamy-mushroom-soup",
    "title": "شوربة كريمة الفطر الحريرية",
    "creatorId": "recipetin-eats",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "فطر",
      "كريمة"
    ],
    "textures": [],
    "needs": [],
    "why": "فيديو صاحبة مصدر الملف لشوربة الفطر الكريمية. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "qUYsotniaH8",
        "kind": "video",
        "published": "04/2021",
        "uploadedAt": "2021-04-14",
        "durationSec": 104,
        "views": 150556,
        "sourceNo": 242
      }
    ],
    "views": 150556,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "onion-boil",
    "title": "بصل أونيون بويل بالزبدة الحارة",
    "creatorId": "life-with-kiona",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "بصل",
      "زبدة",
      "ثوم"
    ],
    "textures": [],
    "needs": [],
    "why": "بصلة بالزبدة والتوابل مخبوزة في ورق الألومنيوم. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "iKMVRAdI4OA",
        "kind": "video",
        "published": "02/2025",
        "uploadedAt": "2025-02-08",
        "durationSec": 236,
        "views": 209269,
        "sourceNo": 243
      }
    ],
    "views": 209269,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "date-oat-energy-balls",
    "title": "كرات الطاقة بالتمر والشوفان",
    "creatorId": "cooking-foodie",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "تمر",
      "شوفان"
    ],
    "textures": [],
    "needs": [],
    "why": "ثلاث نكهات لكرات التمر والشوفان، منها زبدة الفول والطحينة والكاكاو. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "LoWTjUl9t4Y",
        "kind": "video",
        "published": "01/2021",
        "uploadedAt": "2021-01-09",
        "durationSec": 225,
        "views": 126801,
        "sourceNo": 244
      }
    ],
    "views": 126801,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "cottage-cheese-egg-bites",
    "title": "قوالب البيض بالجبنة",
    "creatorId": "breakfast-for-one",
    "category": "فطار",
    "mainIngredients": [
      "بيض",
      "جبنة قريش",
      "فطر"
    ],
    "textures": [],
    "needs": [],
    "why": "قوالب بيض بالجبنة القريش والفيتا والفطر. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "84DZjEm93GE",
        "kind": "video",
        "published": "05/2025",
        "uploadedAt": "2025-05-27",
        "durationSec": 155,
        "views": 13037,
        "sourceNo": 245
      }
    ],
    "views": 13037,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "crunchoco-lazy-cat-cake",
    "title": "كيكة الكرنشوكو «ليزي كات» — ترند أحمد الزامل",
    "creatorId": "noosa",
    "category": "كيك ومخبوزات",
    "mainIngredients": [
      "كيك شوكولاتة",
      "كريمة",
      "أرز مقرمش"
    ],
    "textures": [],
    "needs": [],
    "why": "كيكة بطبقات الكريمة والشوكولاتة والأرز المقرمش. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "JWkcEg8k3ME",
        "kind": "video",
        "published": "03/2025",
        "uploadedAt": "2025-03-10",
        "durationSec": 190,
        "views": 139011,
        "sourceNo": 246
      }
    ],
    "views": 139011,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "cherry-cream-soda",
    "title": "صودا الكرز بالكريمة",
    "creatorId": "nicola-yardstyle",
    "category": "مشروبات",
    "mainIngredients": [
      "صودا كرز",
      "كريمة",
      "ثلج"
    ],
    "textures": [],
    "needs": [],
    "why": "نسخة صودا الكرز مع الكريمة والثلج. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "ROKQOwXSia4",
        "kind": "video",
        "published": "07/2026",
        "uploadedAt": "2026-07-19",
        "durationSec": 153,
        "views": 68,
        "sourceNo": 247
      }
    ],
    "views": 68,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "sahlab-mastic",
    "title": "سحلب بالمستكة",
    "creatorId": "ahlam-recipes",
    "category": "مشروبات",
    "mainIngredients": [
      "حليب",
      "مستكة",
      "نشا"
    ],
    "textures": [],
    "needs": [],
    "why": "سحلب بطريقتين؛ المكسرات للزينة حسب الرغبة وليست فستقًا محددًا في المصدر. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "WCSFzFLERZ8",
        "kind": "video",
        "published": "12/2021",
        "uploadedAt": "2021-12-06",
        "durationSec": 169,
        "views": 2899,
        "sourceNo": 248
      }
    ],
    "views": 2899,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "iced-rose-karak",
    "title": "شاي كرك بالحليب المثلج (كرك لاتيه)",
    "creatorId": "icca-dubai",
    "category": "مشروبات",
    "mainIngredients": [
      "شاي",
      "حليب",
      "ورد"
    ],
    "textures": [],
    "needs": [],
    "why": "كرك مثلج بنكهة الورد من المعهد؛ وصفة بديلة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "V2WAvJEDS9s",
        "kind": "video",
        "published": "05/2020",
        "uploadedAt": "2020-05-19",
        "durationSec": 61,
        "views": 2475,
        "sourceNo": 249
      }
    ],
    "views": 2475,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "dubai-chocolate-iced-latte",
    "title": "لاتيه الشوكولاتة الدبي",
    "creatorId": "created-to-coffee",
    "category": "مشروبات",
    "mainIngredients": [
      "إسبريسو",
      "فستق",
      "شوكولاتة"
    ],
    "textures": [],
    "needs": [],
    "why": "لاتيه مثلج بالشوكولاتة والفستق والإسبريسو المخفوق. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "63DVjWa_rKk",
        "kind": "video",
        "published": "04/2025",
        "uploadedAt": "2025-04-26",
        "durationSec": 101,
        "views": 4084,
        "sourceNo": 250
      }
    ],
    "views": 4084,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "pistachio-latte",
    "title": "لاتيه الفستق الحلبي",
    "creatorId": "lone-goose-bakery",
    "category": "مشروبات",
    "mainIngredients": [
      "فستق",
      "قهوة",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "لاتيه ساخن بشراب فستق محضر منزليًا. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "6tvFXTIRQp8",
        "kind": "video",
        "published": "01/2025",
        "uploadedAt": "2025-01-23",
        "durationSec": 371,
        "views": 1952,
        "sourceNo": 251
      }
    ],
    "views": 1952,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "iced-ube-latte",
    "title": "لاتيه اليوبي البنفسجي",
    "creatorId": "seattle-coffee-gear",
    "category": "مشروبات",
    "mainIngredients": [
      "يوبي",
      "إسبريسو",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "لاتيه مثلج بخلاصة اليوبي ورغوة الحليب. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "ALbKX6OcNjE",
        "kind": "short",
        "published": "01/2026",
        "uploadedAt": "2026-01-23",
        "durationSec": 28,
        "views": 3293,
        "sourceNo": 252
      }
    ],
    "views": 3293,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "tomato-lemonade",
    "title": "ليمونادة الطماطم",
    "creatorId": "detroit-free-press",
    "category": "مشروبات",
    "mainIngredients": [
      "طماطم",
      "ليمون"
    ],
    "textures": [],
    "needs": [],
    "why": "المشروب الأساسي طماطم وليمون؛ يذكر الفيديو إمكانية إضافة الكحول اختياريًا. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "EmVVvQiXL00",
        "kind": "video",
        "published": "07/2026",
        "uploadedAt": "2026-07-03",
        "durationSec": 79,
        "views": 306,
        "sourceNo": 253
      }
    ],
    "views": 306,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "saudi-chicken-jareesh",
    "title": "الجريش السعودي بالدجاج",
    "creatorId": "mona-almashrqi",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "جريش",
      "دجاج",
      "لبن"
    ],
    "textures": [],
    "needs": [],
    "why": "جريش بالدجاج واللبن ومسمنة البصل. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "2FekzCZaSgk",
        "kind": "video",
        "published": "12/2024",
        "uploadedAt": "2024-12-29",
        "durationSec": 304,
        "views": 1492,
        "sourceNo": 254
      }
    ],
    "views": 1492,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "saudi-matazeez",
    "title": "المطازيز السعودي بالمرق الأحمر",
    "creatorId": "huda-ingredients",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "لحم",
      "دقيق بر",
      "خضار"
    ],
    "textures": [],
    "needs": [],
    "why": "مطازيز باللحم والخضار والمرق الأحمر. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "S-fHvX_Nk0Y",
        "kind": "video",
        "published": "01/2024",
        "uploadedAt": "2024-01-22",
        "durationSec": 495,
        "views": 11170,
        "sourceNo": 255
      }
    ],
    "views": 11170,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "chicken-eggplant-maqluba",
    "title": "المقلوبة الفلسطينية بالدجاج والباذنجان",
    "creatorId": "hekmat-evan",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "باذنجان",
      "أرز"
    ],
    "textures": [],
    "needs": [],
    "why": "مقلوبة بالدجاج والباذنجان والأرز. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "bhzZG1tfRoM",
        "kind": "video",
        "published": "09/2021",
        "uploadedAt": "2021-09-28",
        "durationSec": 557,
        "views": 598,
        "sourceNo": 256
      }
    ],
    "views": 598,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "date-biscuit-nut-dessert",
    "title": "حلا التمر بالبسكويت والمكسرات",
    "creatorId": "abdulaziz-almatrafi",
    "category": "حلويات باردة",
    "mainIngredients": [
      "تمر",
      "بسكويت",
      "مكسرات"
    ],
    "textures": [],
    "needs": [],
    "why": "حلا تمر وبسكويت وفستق وكاجو؛ وصفة بديلة، وتوجد أرقام غير واضحة في وصف الفيديو، فالمقادير تحتاج مراجعة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "NhQfFW_vkgI",
        "kind": "video",
        "published": "08/2023",
        "uploadedAt": "2023-08-24",
        "durationSec": 465,
        "views": 914,
        "sourceNo": 257
      }
    ],
    "views": 914,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "pickle-brined-chicken-rice",
    "title": "دجاج متبل بمحلول المخلل مع الأرز",
    "creatorId": "grit-groceries",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "دجاج",
      "أرز",
      "محلول مخلل"
    ],
    "textures": [],
    "needs": [],
    "why": "دجاج متبل بمحلول المخلل ويطهى مع الأرز في قدر واحد؛ الفيديو لا يحدد مخلل الشبت، ويستخدم أفخاذًا وفلفلًا حارًا. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "z1BRFIFTBXM",
        "kind": "short",
        "published": "10/2024",
        "uploadedAt": "2024-10-24",
        "durationSec": 27,
        "views": 1013,
        "sourceNo": 258
      }
    ],
    "views": 1013,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "marry-me-beef-meatballs",
    "title": "كرات اللحم ماري مي بالكريمة والطماطم المجففة",
    "creatorId": "audrey-rogers",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "لحم مفروم",
      "طماطم مجففة",
      "كريمة"
    ],
    "textures": [],
    "needs": [],
    "why": "كرات لحم بصوص الكريمة والطماطم المجففة مع المكرونة؛ راجعي الفيديو للمقادير. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "ddPylaStMM8",
        "kind": "short",
        "published": "09/2025",
        "uploadedAt": "2025-09-13",
        "durationSec": 76,
        "views": 3100,
        "sourceNo": 259
      }
    ],
    "views": 3100,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "ninja-creami-protein-ice-cream",
    "title": "آيس كريم البروتين بالنينجا كريمي",
    "creatorId": "larie-midkiff",
    "category": "حلويات باردة",
    "mainIngredients": [
      "حليب لوز",
      "بروتين بودرة"
    ],
    "textures": [],
    "needs": [],
    "why": "آيس كريم بروتين بحليب اللوز في نينجا كريمي؛ الوصفة تتطلب تجميدًا مسبقًا. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "th_-rRrxI9E",
        "kind": "video",
        "published": "10/2023",
        "uploadedAt": "2023-10-27",
        "durationSec": 428,
        "views": 117852,
        "sourceNo": 260
      }
    ],
    "views": 117852,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "diet-coke-protein",
    "title": "الدايت كوك بالبروتين",
    "creatorId": "peppa-foodie",
    "category": "مشروبات",
    "mainIngredients": [
      "دايت كولا",
      "بروتين بودرة"
    ],
    "textures": [],
    "needs": [],
    "why": "تجربة مشروب ببروتين مصل اللبن وكولا دايت، وليست توصية صحية. المشروب الغازي قد يفور؛ لا ترجّي المزيج في وعاء مغلق. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "490oTZDHCD4",
        "kind": "short",
        "published": "06/2026",
        "uploadedAt": "2026-06-11",
        "durationSec": 71,
        "views": 81438,
        "sourceNo": 261
      }
    ],
    "views": 81438,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "iced-spanish-saffron-latte",
    "title": "سبانيش لاتيه مثلج بالزعفران",
    "creatorId": "nadas-coffee",
    "category": "مشروبات",
    "mainIngredients": [
      "قهوة",
      "حليب محلى",
      "زعفران",
      "حليب"
    ],
    "textures": [],
    "needs": [],
    "why": "لاتيه زعفران مثلج بالقهوة والحليب والحليب المحلّى؛ يذكر الوصف حليب نستلة أو حليبًا محلى، ولا يحدد المقصود به بدقة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "D78yS7LERqo",
        "kind": "short",
        "published": "12/2020",
        "uploadedAt": "2020-12-19",
        "durationSec": 42,
        "views": 11728,
        "sourceNo": 262
      }
    ],
    "views": 11728,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "date-seed-coffee",
    "title": "قهوة نوى التمر",
    "creatorId": "retro-guy",
    "category": "مشروبات",
    "mainIngredients": [
      "نوى تمر"
    ],
    "textures": [],
    "needs": [],
    "why": "الفيديو يعرض تنظيف نوى التمر وتحميصه وطحنه وتحضيره؛ نسخة بديلة بلا بهارات الملف. استخدمي معدات مناسبة للنوى الصلبة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "K4jYHTex2Mg",
        "kind": "video",
        "published": "04/2020",
        "uploadedAt": "2020-04-28",
        "durationSec": 419,
        "views": 39181,
        "sourceNo": 263
      }
    ],
    "views": 39181,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "tart-cherry-mocktail",
    "title": "موكتيل الكرز بالمغنيسيوم",
    "creatorId": "olipop",
    "category": "مشروبات",
    "mainIngredients": [
      "عصير كرز",
      "مشروب غازي",
      "مغنيسيوم"
    ],
    "textures": [],
    "needs": [],
    "why": "الفيديو يضيف مكمل مغنيسيوم ويروّج لفوائد النوم، وهي غير مثبتة هنا؛ استشيري مختصًا قبل استخدام المكمل، خاصة مع الأدوية أو مشاكل الكلى، ولا تتبعي جرعة غير موثقة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "zb0RHBtF0js",
        "kind": "video",
        "published": "02/2024",
        "uploadedAt": "2024-02-18",
        "durationSec": 65,
        "views": 17671,
        "sourceNo": 264
      }
    ],
    "views": 17671,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "halloumi-date-beet-salad",
    "title": "سلطة حلوم مشوي بالتمر والبنجر والعسل",
    "creatorId": "lets-cook-olet",
    "category": "سناكس ومقبلات",
    "mainIngredients": [
      "حلوم",
      "تمر",
      "بنجر",
      "عسل"
    ],
    "textures": [],
    "needs": [],
    "why": "سلطة حلوم مشوي وتمر وبنجر بصلصة العسل؛ تختلف عن طبق الجبنة والتمر وحده في الملف. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "V3YUbFOlKOg",
        "kind": "video",
        "published": "02/2025",
        "uploadedAt": "2025-02-22",
        "durationSec": 175,
        "views": 1449,
        "sourceNo": 265
      }
    ],
    "views": 1449,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "najdi-margoug-pumpkin",
    "title": "مرقوق نجد بالقرع والخضار",
    "creatorId": "nahla-suliman",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "لحم",
      "قرع",
      "دقيق بر"
    ],
    "textures": [],
    "needs": [],
    "why": "مرقوق نجدي بعجين البر والقرع والخضار. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "EmnMXUnmuso",
        "kind": "video",
        "published": "02/2017",
        "uploadedAt": "2017-02-13",
        "durationSec": 417,
        "views": 181283,
        "sourceNo": 266
      }
    ],
    "views": 181283,
    "viewsUpdatedAt": "2026-11-06"
  },
  {
    "slug": "chicken-chashu-yakiniku",
    "title": "تشاشو فخذ الدجاج بصوص ياكينيكو",
    "creatorId": "ryuji-buzz",
    "category": "أطباق رئيسية",
    "mainIngredients": [
      "فخذ دجاج",
      "صوص ياكينيكو"
    ],
    "textures": [],
    "needs": [],
    "why": "تشاشو فخذ الدجاج بصوص ياكينيكو جاهز؛ راجعي مكونات الصوص عند الشراء وتأكدي من نضج الدجاج بالكامل باستخدام ميزان حرارة. ترشيح فيديو؛ راجعي المصدر للمقادير والخطوات.",
    "sources": [
      {
        "ytId": "nuReAXUFLmw",
        "kind": "video",
        "published": "02/2021",
        "uploadedAt": "2021-02-10",
        "durationSec": 410,
        "views": 1138440,
        "sourceNo": 267
      }
    ],
    "views": 1138440,
    "viewsUpdatedAt": "2026-11-06"
  }
];
