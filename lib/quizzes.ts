export interface Question {
  id: string;
  imageUrl: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface FlagEntry {
  countryCode: string; // lowercase ISO 3166-1 alpha-2
  countryName: string;
}

export interface ImageEntry {
  imageUrl: string;
  name: string;
}

export interface Quiz {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  /** If set, questions are drawn randomly from flagPool/imagePool each round */
  questionsPerRound?: number;
  flagPool?: FlagEntry[];
  imagePool?: ImageEntry[];
  poolQuestion?: string; // question text used when building from imagePool
  questions: Question[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildFlagQuestions(pool: FlagEntry[], count: number): Question[] {
  const selected = shuffle(pool).slice(0, count);

  return selected.map((entry) => {
    const wrongPool = pool.filter((e) => e.countryCode !== entry.countryCode);
    const wrongs = shuffle(wrongPool).slice(0, 3).map((e) => e.countryName);
    const options = shuffle([entry.countryName, ...wrongs]);
    return {
      id: entry.countryCode,
      imageUrl: `/quizzes/flags/${entry.countryCode}.png`,
      question: "Which country does this flag belong to?",
      options,
      correctAnswerIndex: options.indexOf(entry.countryName),
    };
  });
}

export function buildImageQuestions(
  pool: ImageEntry[],
  count: number,
  question: string
): Question[] {
  const selected = shuffle(pool).slice(0, count);

  return selected.map((entry) => {
    const wrongPool = pool.filter((e) => e.imageUrl !== entry.imageUrl);
    const wrongs = shuffle(wrongPool).slice(0, 3).map((e) => e.name);
    const options = shuffle([entry.name, ...wrongs]);
    return {
      id: entry.imageUrl,
      imageUrl: entry.imageUrl,
      question,
      options,
      correctAnswerIndex: options.indexOf(entry.name),
    };
  });
}

export function getQuestionsPerRound(quiz: Quiz): number {
  return quiz.questionsPerRound ?? quiz.questions.length;
}

// ─── Quiz registry ────────────────────────────────────────────────────────────

const europeFlagPool: FlagEntry[] = [
  { countryCode: "al", countryName: "Albania" },
  { countryCode: "ad", countryName: "Andorra" },
  { countryCode: "at", countryName: "Austria" },
  { countryCode: "by", countryName: "Belarus" },
  { countryCode: "be", countryName: "Belgium" },
  { countryCode: "ba", countryName: "Bosnia and Herzegovina" },
  { countryCode: "bg", countryName: "Bulgaria" },
  { countryCode: "hr", countryName: "Croatia" },
  { countryCode: "cy", countryName: "Cyprus" },
  { countryCode: "cz", countryName: "Czech Republic" },
  { countryCode: "dk", countryName: "Denmark" },
  { countryCode: "ee", countryName: "Estonia" },
  { countryCode: "fi", countryName: "Finland" },
  { countryCode: "fr", countryName: "France" },
  { countryCode: "de", countryName: "Germany" },
  { countryCode: "gr", countryName: "Greece" },
  { countryCode: "hu", countryName: "Hungary" },
  { countryCode: "is", countryName: "Iceland" },
  { countryCode: "ie", countryName: "Ireland" },
  { countryCode: "it", countryName: "Italy" },
  { countryCode: "xk", countryName: "Kosovo" },
  { countryCode: "lv", countryName: "Latvia" },
  { countryCode: "li", countryName: "Liechtenstein" },
  { countryCode: "lt", countryName: "Lithuania" },
  { countryCode: "lu", countryName: "Luxembourg" },
  { countryCode: "mt", countryName: "Malta" },
  { countryCode: "md", countryName: "Moldova" },
  { countryCode: "mc", countryName: "Monaco" },
  { countryCode: "me", countryName: "Montenegro" },
  { countryCode: "nl", countryName: "Netherlands" },
  { countryCode: "mk", countryName: "North Macedonia" },
  { countryCode: "no", countryName: "Norway" },
  { countryCode: "pl", countryName: "Poland" },
  { countryCode: "pt", countryName: "Portugal" },
  { countryCode: "ro", countryName: "Romania" },
  { countryCode: "ru", countryName: "Russia" },
  { countryCode: "sm", countryName: "San Marino" },
  { countryCode: "rs", countryName: "Serbia" },
  { countryCode: "sk", countryName: "Slovakia" },
  { countryCode: "si", countryName: "Slovenia" },
  { countryCode: "es", countryName: "Spain" },
  { countryCode: "se", countryName: "Sweden" },
  { countryCode: "ch", countryName: "Switzerland" },
  { countryCode: "ua", countryName: "Ukraine" },
  { countryCode: "gb", countryName: "United Kingdom" },
  { countryCode: "va", countryName: "Vatican City" },
];

const africaFlagPool: FlagEntry[] = [
  { countryCode: "dz", countryName: "Algeria" },
  { countryCode: "ao", countryName: "Angola" },
  { countryCode: "bj", countryName: "Benin" },
  { countryCode: "bw", countryName: "Botswana" },
  { countryCode: "bf", countryName: "Burkina Faso" },
  { countryCode: "bi", countryName: "Burundi" },
  { countryCode: "cv", countryName: "Cabo Verde" },
  { countryCode: "cm", countryName: "Cameroon" },
  { countryCode: "cf", countryName: "Central African Republic" },
  { countryCode: "td", countryName: "Chad" },
  { countryCode: "km", countryName: "Comoros" },
  { countryCode: "cg", countryName: "Congo" },
  { countryCode: "cd", countryName: "DR Congo" },
  { countryCode: "dj", countryName: "Djibouti" },
  { countryCode: "eg", countryName: "Egypt" },
  { countryCode: "gq", countryName: "Equatorial Guinea" },
  { countryCode: "er", countryName: "Eritrea" },
  { countryCode: "sz", countryName: "Eswatini" },
  { countryCode: "et", countryName: "Ethiopia" },
  { countryCode: "ga", countryName: "Gabon" },
  { countryCode: "gm", countryName: "Gambia" },
  { countryCode: "gh", countryName: "Ghana" },
  { countryCode: "gn", countryName: "Guinea" },
  { countryCode: "gw", countryName: "Guinea-Bissau" },
  { countryCode: "ci", countryName: "Ivory Coast" },
  { countryCode: "ke", countryName: "Kenya" },
  { countryCode: "ls", countryName: "Lesotho" },
  { countryCode: "lr", countryName: "Liberia" },
  { countryCode: "ly", countryName: "Libya" },
  { countryCode: "mg", countryName: "Madagascar" },
  { countryCode: "mw", countryName: "Malawi" },
  { countryCode: "ml", countryName: "Mali" },
  { countryCode: "mr", countryName: "Mauritania" },
  { countryCode: "mu", countryName: "Mauritius" },
  { countryCode: "ma", countryName: "Morocco" },
  { countryCode: "mz", countryName: "Mozambique" },
  { countryCode: "na", countryName: "Namibia" },
  { countryCode: "ne", countryName: "Niger" },
  { countryCode: "ng", countryName: "Nigeria" },
  { countryCode: "rw", countryName: "Rwanda" },
  { countryCode: "st", countryName: "São Tomé and Príncipe" },
  { countryCode: "sn", countryName: "Senegal" },
  { countryCode: "sc", countryName: "Seychelles" },
  { countryCode: "sl", countryName: "Sierra Leone" },
  { countryCode: "so", countryName: "Somalia" },
  { countryCode: "za", countryName: "South Africa" },
  { countryCode: "ss", countryName: "South Sudan" },
  { countryCode: "sd", countryName: "Sudan" },
  { countryCode: "tz", countryName: "Tanzania" },
  { countryCode: "tg", countryName: "Togo" },
  { countryCode: "tn", countryName: "Tunisia" },
  { countryCode: "ug", countryName: "Uganda" },
  { countryCode: "zm", countryName: "Zambia" },
  { countryCode: "zw", countryName: "Zimbabwe" },
];

const asiaFlagPool: FlagEntry[] = [
  { countryCode: "af", countryName: "Afghanistan" },
  { countryCode: "am", countryName: "Armenia" },
  { countryCode: "az", countryName: "Azerbaijan" },
  { countryCode: "bh", countryName: "Bahrain" },
  { countryCode: "bd", countryName: "Bangladesh" },
  { countryCode: "bt", countryName: "Bhutan" },
  { countryCode: "bn", countryName: "Brunei" },
  { countryCode: "kh", countryName: "Cambodia" },
  { countryCode: "cn", countryName: "China" },
  { countryCode: "ge", countryName: "Georgia" },
  { countryCode: "in", countryName: "India" },
  { countryCode: "id", countryName: "Indonesia" },
  { countryCode: "ir", countryName: "Iran" },
  { countryCode: "iq", countryName: "Iraq" },
  { countryCode: "il", countryName: "Israel" },
  { countryCode: "jp", countryName: "Japan" },
  { countryCode: "jo", countryName: "Jordan" },
  { countryCode: "kz", countryName: "Kazakhstan" },
  { countryCode: "kw", countryName: "Kuwait" },
  { countryCode: "kg", countryName: "Kyrgyzstan" },
  { countryCode: "la", countryName: "Laos" },
  { countryCode: "lb", countryName: "Lebanon" },
  { countryCode: "my", countryName: "Malaysia" },
  { countryCode: "mv", countryName: "Maldives" },
  { countryCode: "mn", countryName: "Mongolia" },
  { countryCode: "mm", countryName: "Myanmar" },
  { countryCode: "np", countryName: "Nepal" },
  { countryCode: "kp", countryName: "North Korea" },
  { countryCode: "om", countryName: "Oman" },
  { countryCode: "pk", countryName: "Pakistan" },
  { countryCode: "ps", countryName: "Palestine" },
  { countryCode: "ph", countryName: "Philippines" },
  { countryCode: "qa", countryName: "Qatar" },
  { countryCode: "sa", countryName: "Saudi Arabia" },
  { countryCode: "sg", countryName: "Singapore" },
  { countryCode: "kr", countryName: "South Korea" },
  { countryCode: "lk", countryName: "Sri Lanka" },
  { countryCode: "sy", countryName: "Syria" },
  { countryCode: "tw", countryName: "Taiwan" },
  { countryCode: "tj", countryName: "Tajikistan" },
  { countryCode: "th", countryName: "Thailand" },
  { countryCode: "tl", countryName: "Timor-Leste" },
  { countryCode: "tr", countryName: "Turkey" },
  { countryCode: "tm", countryName: "Turkmenistan" },
  { countryCode: "ae", countryName: "United Arab Emirates" },
  { countryCode: "uz", countryName: "Uzbekistan" },
  { countryCode: "vn", countryName: "Vietnam" },
  { countryCode: "ye", countryName: "Yemen" },
];

const americasFlagPool: FlagEntry[] = [
  { countryCode: "ag", countryName: "Antigua and Barbuda" },
  { countryCode: "ar", countryName: "Argentina" },
  { countryCode: "bs", countryName: "Bahamas" },
  { countryCode: "bb", countryName: "Barbados" },
  { countryCode: "bz", countryName: "Belize" },
  { countryCode: "bo", countryName: "Bolivia" },
  { countryCode: "br", countryName: "Brazil" },
  { countryCode: "ca", countryName: "Canada" },
  { countryCode: "cl", countryName: "Chile" },
  { countryCode: "co", countryName: "Colombia" },
  { countryCode: "cr", countryName: "Costa Rica" },
  { countryCode: "cu", countryName: "Cuba" },
  { countryCode: "dm", countryName: "Dominica" },
  { countryCode: "do", countryName: "Dominican Republic" },
  { countryCode: "ec", countryName: "Ecuador" },
  { countryCode: "sv", countryName: "El Salvador" },
  { countryCode: "gd", countryName: "Grenada" },
  { countryCode: "gt", countryName: "Guatemala" },
  { countryCode: "gy", countryName: "Guyana" },
  { countryCode: "ht", countryName: "Haiti" },
  { countryCode: "hn", countryName: "Honduras" },
  { countryCode: "jm", countryName: "Jamaica" },
  { countryCode: "mx", countryName: "Mexico" },
  { countryCode: "ni", countryName: "Nicaragua" },
  { countryCode: "pa", countryName: "Panama" },
  { countryCode: "py", countryName: "Paraguay" },
  { countryCode: "pe", countryName: "Peru" },
  { countryCode: "kn", countryName: "Saint Kitts and Nevis" },
  { countryCode: "lc", countryName: "Saint Lucia" },
  { countryCode: "vc", countryName: "Saint Vincent and the Grenadines" },
  { countryCode: "sr", countryName: "Suriname" },
  { countryCode: "tt", countryName: "Trinidad and Tobago" },
  { countryCode: "us", countryName: "United States" },
  { countryCode: "uy", countryName: "Uruguay" },
  { countryCode: "ve", countryName: "Venezuela" },
];

const oceaniaFlagPool: FlagEntry[] = [
  { countryCode: "au", countryName: "Australia" },
  { countryCode: "fj", countryName: "Fiji" },
  { countryCode: "ki", countryName: "Kiribati" },
  { countryCode: "mh", countryName: "Marshall Islands" },
  { countryCode: "fm", countryName: "Micronesia" },
  { countryCode: "nr", countryName: "Nauru" },
  { countryCode: "nz", countryName: "New Zealand" },
  { countryCode: "pw", countryName: "Palau" },
  { countryCode: "pg", countryName: "Papua New Guinea" },
  { countryCode: "ws", countryName: "Samoa" },
  { countryCode: "sb", countryName: "Solomon Islands" },
  { countryCode: "to", countryName: "Tonga" },
  { countryCode: "tv", countryName: "Tuvalu" },
  { countryCode: "vu", countryName: "Vanuatu" },
];

export const quizzes: Quiz[] = [
  {
    id: "european-flags",
    name: "European Flags",
    description: "Can you identify the flags of Europe's 46 nations? 20 random flags each round.",
    thumbnailUrl: "/quizzes/flags/eu.png",
    category: "Geography",
    questionsPerRound: 20,
    flagPool: europeFlagPool,
    questions: [],
  },
  {
    id: "african-flags",
    name: "African Flags",
    description: "Test your knowledge of Africa's 54 nations. 20 random flags each round.",
    thumbnailUrl: "/quizzes/flags/za.png",
    category: "Geography",
    questionsPerRound: 20,
    flagPool: africaFlagPool,
    questions: [],
  },
  {
    id: "asian-flags",
    name: "Asian Flags",
    description: "Can you identify the flags of Asia's 48 nations? 20 random flags each round.",
    thumbnailUrl: "/quizzes/flags/jp.png",
    category: "Geography",
    questionsPerRound: 20,
    flagPool: asiaFlagPool,
    questions: [],
  },
  {
    id: "americas-flags",
    name: "Americas Flags",
    description: "Flags of North, Central, South America and the Caribbean — 35 nations, 20 random flags per round.",
    thumbnailUrl: "/quizzes/flags/us.png",
    category: "Geography",
    questionsPerRound: 20,
    flagPool: americasFlagPool,
    questions: [],
  },
  {
    id: "oceania-flags",
    name: "Oceania Flags",
    description: "All 14 sovereign nations of Oceania and the Pacific — can you name them all?",
    thumbnailUrl: "/quizzes/flags/au.png",
    category: "Geography",
    questionsPerRound: 14,
    flagPool: oceaniaFlagPool,
    questions: [],
  },
  {
    id: "dog-breeds",
    name: "Dog Breeds",
    description: "Can you identify the breed from the photo? 20 dogs, all different breeds.",
    thumbnailUrl: "/quizzes/dog-breeds/golden-retriever.jpeg",
    category: "Animals",
    questionsPerRound: 20,
    poolQuestion: "What breed is this dog?",
    imagePool: [
      { imageUrl: "/quizzes/dog-breeds/basset-hound.jpeg",                    name: "Basset Hound" },
      { imageUrl: "/quizzes/dog-breeds/beagle.jpeg",                          name: "Beagle" },
      { imageUrl: "/quizzes/dog-breeds/border-collie.jpeg",                   name: "Border Collie" },
      { imageUrl: "/quizzes/dog-breeds/border-terrier.jpeg",                  name: "Border Terrier" },
      { imageUrl: "/quizzes/dog-breeds/bulldog.jpeg",                         name: "Bulldog" },
      { imageUrl: "/quizzes/dog-breeds/cavalier-king-charles-spaniel.jpeg",   name: "Cavalier King Charles Spaniel" },
      { imageUrl: "/quizzes/dog-breeds/chihuahua.jpeg",                       name: "Chihuahua" },
      { imageUrl: "/quizzes/dog-breeds/chow-chow.jpeg",                       name: "Chow Chow" },
      { imageUrl: "/quizzes/dog-breeds/cocker-spaniel.jpg",                   name: "Cocker Spaniel" },
      { imageUrl: "/quizzes/dog-breeds/german-shepherd.jpeg",                 name: "German Shepherd" },
      { imageUrl: "/quizzes/dog-breeds/golden-retriever.jpeg",                name: "Golden Retriever" },
      { imageUrl: "/quizzes/dog-breeds/great-dane.jpeg",                      name: "Great Dane" },
      { imageUrl: "/quizzes/dog-breeds/labrador.jpg",                         name: "Labrador" },
      { imageUrl: "/quizzes/dog-breeds/maltese.jpeg",                         name: "Maltese" },
      { imageUrl: "/quizzes/dog-breeds/pomeranian.jpeg",                      name: "Pomeranian" },
      { imageUrl: "/quizzes/dog-breeds/poodle.jpeg",                          name: "Poodle" },
      { imageUrl: "/quizzes/dog-breeds/pug.jpg",                              name: "Pug" },
      { imageUrl: "/quizzes/dog-breeds/rottweiler.jpg",                       name: "Rottweiler" },
      { imageUrl: "/quizzes/dog-breeds/sausage-dog.jpg",                      name: "Sausage Dog" },
      { imageUrl: "/quizzes/dog-breeds/st-bernard.jpeg",                      name: "St. Bernard" },
    ],
    questions: [],
  },
  {
    id: "world-landmarks",
    name: "World Landmarks",
    description: "How many of the world's most iconic landmarks can you identify? 20 random landmarks each round.",
    thumbnailUrl: "/quizzes/world-landmarks/eiffel-tower.jpg",
    category: "Geography",
    questionsPerRound: 20,
    poolQuestion: "Which landmark is this?",
    imagePool: [
      { imageUrl: "/quizzes/world-landmarks/eiffel-tower.jpg",                                                                                                            name: "Eiffel Tower" },
      { imageUrl: "/quizzes/world-landmarks/big-ben.jpg",                                                                                                                                         name: "Big Ben" },
      { imageUrl: "/quizzes/world-landmarks/colosseum.jpg",                                                                                                                                                                       name: "Colosseum" },
      { imageUrl: "/quizzes/world-landmarks/statue-of-liberty.jpg",                                                                                                       name: "Statue of Liberty" },
      { imageUrl: "/quizzes/world-landmarks/great-wall-of-china.jpg",                                                                                                           name: "Great Wall of China" },
      { imageUrl: "/quizzes/world-landmarks/taj-mahal.jpg",                                                                                                                                                  name: "Taj Mahal" },
      { imageUrl: "/quizzes/world-landmarks/machu-picchu.jpg",                                                                                                                                    name: "Machu Picchu" },
      { imageUrl: "/quizzes/world-landmarks/sydney-opera-house.jpg",                                                                                                                           name: "Sydney Opera House" },
      { imageUrl: "/quizzes/world-landmarks/christ-the-redeemer.jpg",                                                                                                                                                                                         name: "Christ the Redeemer" },
      { imageUrl: "/quizzes/world-landmarks/sagrada-familia.jpg",          name: "Sagrada Família" },
      { imageUrl: "/quizzes/world-landmarks/petra.jpg",                                                                                                                                                        name: "Petra" },
      { imageUrl: "/quizzes/world-landmarks/stonehenge.jpg",                                                                                                                                                        name: "Stonehenge" },
      { imageUrl: "/quizzes/world-landmarks/parthenon.jpg",                                                                                                                                                  name: "Parthenon" },
      { imageUrl: "/quizzes/world-landmarks/angkor-wat.jpg",                                                                                                                                                           name: "Angkor Wat" },
      { imageUrl: "/quizzes/world-landmarks/mount-fuji.jpg",                                                                                                   name: "Mount Fuji" },
      { imageUrl: "/quizzes/world-landmarks/leaning-tower-of-pisa.jpg",                                                                                                                                       name: "Leaning Tower of Pisa" },
      { imageUrl: "/quizzes/world-landmarks/golden-gate-bridge.jpg",                                                                                                        name: "Golden Gate Bridge" },
      { imageUrl: "/quizzes/world-landmarks/brandenburg-gate.jpg",                                                                                                                                                name: "Brandenburg Gate" },
      { imageUrl: "/quizzes/world-landmarks/pyramids-of-giza.jpg",                                                                                                               name: "Pyramids of Giza" },
      { imageUrl: "/quizzes/world-landmarks/hagia-sophia.jpg",                                                                                                                                      name: "Hagia Sophia" },
      { imageUrl: "/quizzes/world-landmarks/chichen-itza.jpg",                                                                                                                                                                   name: "Chichen Itza" },
      { imageUrl: "/quizzes/world-landmarks/tower-bridge.jpg",                                                                                                                                                        name: "Tower Bridge" },
      { imageUrl: "/quizzes/world-landmarks/niagara-falls.jpg",                                                                                                                                                                    name: "Niagara Falls" },
      { imageUrl: "/quizzes/world-landmarks/neuschwanstein-castle.jpg",                                                                                                                                          name: "Neuschwanstein Castle" },
      { imageUrl: "/quizzes/world-landmarks/mont-saint-michel.jpg",                                                                                                                                        name: "Mont Saint-Michel" },
      { imageUrl: "/quizzes/world-landmarks/easter-island.jpg",                                                                                                                                                                  name: "Easter Island" },
      { imageUrl: "/quizzes/world-landmarks/forbidden-city.jpg",                                                                                                                name: "Forbidden City" },
    ],
    questions: [],
  },
  {
    id: "fruits",
    name: "Fruits",
    description: "Can you name the fruit from the photo? 23 fruits in the pool, 20 shown each round.",
    thumbnailUrl: "/quizzes/fruits/strawberry.jpg",
    category: "Food",
    questionsPerRound: 20,
    poolQuestion: "What fruit is this?",
    imagePool: [
      { imageUrl: "/quizzes/fruits/apple.jpg",                                                                                                        name: "Apple" },
      { imageUrl: "/quizzes/fruits/banana.jpg",                                                                                                                                  name: "Banana" },
      { imageUrl: "/quizzes/fruits/orange.jpg",                                                                                                    name: "Orange" },
      { imageUrl: "/quizzes/fruits/strawberry.jpg",                                                name: "Strawberry" },
      { imageUrl: "/quizzes/fruits/watermelon.jpg",                                                name: "Watermelon" },
      { imageUrl: "/quizzes/fruits/pineapple.jpg", name: "Pineapple" },
      { imageUrl: "/quizzes/fruits/mango.jpg",                                                                                                            name: "Mango" },
      { imageUrl: "/quizzes/fruits/grapes.jpg",                                                                                             name: "Grapes" },
      { imageUrl: "/quizzes/fruits/lemon.jpg",                                                                                                                                                name: "Lemon" },
      { imageUrl: "/quizzes/fruits/lime.jpg", name: "Lime" },
      { imageUrl: "/quizzes/fruits/peach.jpg",                                                                                                                                                                          name: "Peach" },
      { imageUrl: "/quizzes/fruits/pear.jpg",                                                                                                                                                      name: "Pear" },
      { imageUrl: "/quizzes/fruits/kiwi.jpg",                                                                                                                                                        name: "Kiwi" },
      { imageUrl: "/quizzes/fruits/cherry.jpg",                                                                                                   name: "Cherry" },
      { imageUrl: "/quizzes/fruits/blueberry.jpg",                                                                                                                                          name: "Blueberry" },
      { imageUrl: "/quizzes/fruits/raspberry.jpg",                                                                                       name: "Raspberry" },
      { imageUrl: "/quizzes/fruits/coconut.jpg",                                                                                                                                                      name: "Coconut" },
      { imageUrl: "/quizzes/fruits/avocado.jpg",                                                                                                                name: "Avocado" },
      { imageUrl: "/quizzes/fruits/pomegranate.jpg",                                                                                                                                                             name: "Pomegranate" },
      { imageUrl: "/quizzes/fruits/dragon-fruit.jpg",                                                                                                                name: "Dragon Fruit" },
      { imageUrl: "/quizzes/fruits/fig.jpg",                                                                                                                                                                             name: "Fig" },
      { imageUrl: "/quizzes/fruits/papaya.jpg",                                                                                                                                                         name: "Papaya" },
      { imageUrl: "/quizzes/fruits/lychee.jpg",                                                                                                                  name: "Lychee" },
    ],
    questions: [],
  },
  {
    id: "vegetables",
    name: "Vegetables",
    description: "Can you name the vegetable from the photo? All 20 shown every round.",
    thumbnailUrl: "/quizzes/vegetables/carrot.jpg",
    category: "Food",
    questionsPerRound: 20,
    poolQuestion: "What vegetable is this?",
    imagePool: [
      { imageUrl: "/quizzes/vegetables/carrot.jpg",       name: "Carrot" },
      { imageUrl: "/quizzes/vegetables/broccoli.jpg",        name: "Broccoli" },
      { imageUrl: "/quizzes/vegetables/tomato.jpg",                                                    name: "Tomato" },
      { imageUrl: "/quizzes/vegetables/sweetcorn.jpg",                                                        name: "Sweetcorn" },
      { imageUrl: "/quizzes/vegetables/onion.jpg",                                              name: "Onion" },
      { imageUrl: "/quizzes/vegetables/potato.jpg",                                                        name: "Potato" },
      { imageUrl: "/quizzes/vegetables/sweet-potato.jpg",                                name: "Sweet Potato" },
      { imageUrl: "/quizzes/vegetables/pumpkin.jpg",                            name: "Pumpkin" },
      { imageUrl: "/quizzes/vegetables/cauliflower.jpg",                                            name: "Cauliflower" },
      { imageUrl: "/quizzes/vegetables/aubergine.jpg", name: "Aubergine" },
      { imageUrl: "/quizzes/vegetables/courgette.jpg",                              name: "Courgette" },
      { imageUrl: "/quizzes/vegetables/asparagus.jpg",                                                                       name: "Asparagus" },
      { imageUrl: "/quizzes/vegetables/cabbage.jpg",  name: "Cabbage" },
      { imageUrl: "/quizzes/vegetables/celery.jpg",                                                      name: "Celery" },
      { imageUrl: "/quizzes/vegetables/peas.jpg",                            name: "Peas" },
      { imageUrl: "/quizzes/vegetables/red-pepper.jpg",                                                         name: "Red Pepper" },
      { imageUrl: "/quizzes/vegetables/cucumber.jpg",                                              name: "Cucumber" },
      { imageUrl: "/quizzes/vegetables/beetroot.png",                                 name: "Beetroot" },
      { imageUrl: "/quizzes/vegetables/leek.jpg",        name: "Leek" },
      { imageUrl: "/quizzes/vegetables/artichoke.jpg",                                              name: "Artichoke" },
    ],
    questions: [],
  },
];

export function getQuiz(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id);
}

export function getAllQuizzes(): Quiz[] {
  return quizzes;
}
