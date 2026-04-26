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
      imageUrl: `https://flagcdn.com/w320/${entry.countryCode}.png`,
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
    thumbnailUrl: "https://flagcdn.com/w320/eu.png",
    category: "Geography",
    questionsPerRound: 20,
    flagPool: europeFlagPool,
    questions: [],
  },
  {
    id: "african-flags",
    name: "African Flags",
    description: "Test your knowledge of Africa's 54 nations. 20 random flags each round.",
    thumbnailUrl: "https://flagcdn.com/w320/za.png",
    category: "Geography",
    questionsPerRound: 20,
    flagPool: africaFlagPool,
    questions: [],
  },
  {
    id: "asian-flags",
    name: "Asian Flags",
    description: "Can you identify the flags of Asia's 48 nations? 20 random flags each round.",
    thumbnailUrl: "https://flagcdn.com/w320/jp.png",
    category: "Geography",
    questionsPerRound: 20,
    flagPool: asiaFlagPool,
    questions: [],
  },
  {
    id: "americas-flags",
    name: "Americas Flags",
    description: "Flags of North, Central, South America and the Caribbean — 35 nations, 20 random flags per round.",
    thumbnailUrl: "https://flagcdn.com/w320/us.png",
    category: "Geography",
    questionsPerRound: 20,
    flagPool: americasFlagPool,
    questions: [],
  },
  {
    id: "oceania-flags",
    name: "Oceania Flags",
    description: "All 14 sovereign nations of Oceania and the Pacific — can you name them all?",
    thumbnailUrl: "https://flagcdn.com/w320/au.png",
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
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/330px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    category: "Geography",
    questionsPerRound: 20,
    poolQuestion: "Which landmark is this?",
    imagePool: [
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/330px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",                                                                                                            name: "Eiffel Tower" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Elizabeth_Tower%2C_June_2022.jpg/330px-Elizabeth_Tower%2C_June_2022.jpg",                                                                                                                                         name: "Big Ben" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/330px-Colosseo_2020.jpg",                                                                                                                                                                       name: "Colosseum" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Front_view_of_Statue_of_Liberty_%28cropped%29.jpg/330px-Front_view_of_Statue_of_Liberty_%28cropped%29.jpg",                                                                                                       name: "Statue of Liberty" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/330px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg",                                                                                                           name: "Great Wall of China" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/330px-Taj_Mahal_%28Edited%29.jpeg",                                                                                                                                                  name: "Taj Mahal" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Machu_Picchu%2C_2023_%28012%29.jpg/330px-Machu_Picchu%2C_2023_%28012%29.jpg",                                                                                                                                    name: "Machu Picchu" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/330px-Sydney_Australia._%2821339175489%29.jpg",                                                                                                                           name: "Sydney Opera House" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/330px-Christ_the_Redeemer_-_Cristo_Redentor.jpg",                                                                                                                      name: "Christ the Redeemer" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/%CE%A3%CE%B1%CE%B3%CF%81%CE%AC%CE%B4%CE%B1_%CE%A6%CE%B1%CE%BC%CE%AF%CE%BB%CE%B9%CE%B1_2941.jpg/330px-%CE%A3%CE%B1%CE%B3%CF%81%CE%AC%CE%B4%CE%B1_%CE%A6%CE%B1%CE%BC%CE%AF%CE%BB%CE%B9%CE%B1_2941.jpg",          name: "Sagrada Família" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Treasury_petra_crop.jpeg/330px-Treasury_petra_crop.jpeg",                                                                                                                                                        name: "Petra" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Stonehenge2007_07_30.jpg/330px-Stonehenge2007_07_30.jpg",                                                                                                                                                        name: "Stonehenge" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/330px-The_Parthenon_in_Athens.jpg",                                                                                                                                                  name: "Parthenon" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Angkor_Wat_W-Seite.jpg/330px-Angkor_Wat_W-Seite.jpg",                                                                                                                                                           name: "Angkor Wat" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/View_of_Mount_Fuji_from_%C5%8Cwakudani_20211202.jpg/330px-View_of_Mount_Fuji_from_%C5%8Cwakudani_20211202.jpg",                                                                                                   name: "Mount Fuji" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Italy_-_Pisa_-_Leaning_Tower.jpg/330px-Italy_-_Pisa_-_Leaning_Tower.jpg",                                                                                                                                       name: "Leaning Tower of Pisa" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Golden_Gate_Bridge_as_seen_from_Battery_East.jpg/330px-Golden_Gate_Bridge_as_seen_from_Battery_East.jpg",                                                                                                        name: "Golden Gate Bridge" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/330px-Brandenburger_Tor_abends.jpg",                                                                                                                                                name: "Brandenburg Gate" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg/330px-Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg",                                                                                                               name: "Pyramids of Giza" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hagia_Sophia_%28228968325%29.jpeg/330px-Hagia_Sophia_%28228968325%29.jpeg",                                                                                                                                      name: "Hagia Sophia" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/330px-Chichen_Itza_3.jpg",                                                                                                                                                                   name: "Chichen Itza" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Tower_Bridge_at_Dawn.jpg/330px-Tower_Bridge_at_Dawn.jpg",                                                                                                                                                        name: "Tower Bridge" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/3Falls_Niagara.jpg/330px-3Falls_Niagara.jpg",                                                                                                                                                                    name: "Niagara Falls" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Schloss_Neuschwanstein_2013.jpg/330px-Schloss_Neuschwanstein_2013.jpg",                                                                                                                                          name: "Neuschwanstein Castle" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Mont-Saint-Michel_vu_du_ciel.jpg/330px-Mont-Saint-Michel_vu_du_ciel.jpg",                                                                                                                                        name: "Mont Saint-Michel" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Easter_Island_5.jpg/330px-Easter_Island_5.jpg",                                                                                                                                                                  name: "Easter Island" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/The_Forbidden_City_-_View_from_Coal_Hill.jpg/330px-The_Forbidden_City_-_View_from_Coal_Hill.jpg",                                                                                                                name: "Forbidden City" },
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
