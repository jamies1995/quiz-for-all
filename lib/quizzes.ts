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
      { imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGWegd9JtmLfLNovCNvct8eEQgB87YpOcGQ2gf_7WyqLZj6aRMpcfMfWus8hNfjC4wCsBDdAyeJ6so0rFdUBNmQDa8xUtRQZ9ySWAcdQJNxZFf06PPwPNLp-eYmSSlYvbZmebqy=s1360-w1360-h1020",                                       name: "Christ the Redeemer" },
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
  {
    id: "fruits",
    name: "Fruits",
    description: "Can you name the fruit from the photo? 23 fruits in the pool, 20 shown each round.",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Garden_strawberry_%28Fragaria_%C3%97_ananassa%29_single2.jpg/330px-Garden_strawberry_%28Fragaria_%C3%97_ananassa%29_single2.jpg",
    category: "Food",
    questionsPerRound: 20,
    poolQuestion: "What fruit is this?",
    imagePool: [
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Pink_lady_and_cross_section.jpg/330px-Pink_lady_and_cross_section.jpg",                                                                                                        name: "Apple" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bananavarieties.jpg/330px-Bananavarieties.jpg",                                                                                                                                  name: "Banana" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Oranges_-_whole-halved-segment.jpg/330px-Oranges_-_whole-halved-segment.jpg",                                                                                                    name: "Orange" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Garden_strawberry_%28Fragaria_%C3%97_ananassa%29_single2.jpg/330px-Garden_strawberry_%28Fragaria_%C3%97_ananassa%29_single2.jpg",                                                name: "Strawberry" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg/330px-Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg",                                                name: "Watermelon" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/%E0%B4%95%E0%B5%88%E0%B4%A4%E0%B4%9A%E0%B5%8D%E0%B4%9A%E0%B4%95%E0%B5%8D%E0%B4%95.jpg/330px-%E0%B4%95%E0%B5%88%E0%B4%A4%E0%B4%9A%E0%B5%8D%E0%B4%9A%E0%B4%95%E0%B5%8D%E0%B4%95.jpg", name: "Pineapple" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mangos_-_single_and_halved.jpg/330px-Mangos_-_single_and_halved.jpg",                                                                                                            name: "Mango" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Grapes%2C_Rostov-on-Don%2C_Russia.jpg/330px-Grapes%2C_Rostov-on-Don%2C_Russia.jpg",                                                                                             name: "Grapes" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/P1030323.JPG/330px-P1030323.JPG",                                                                                                                                                name: "Lemon" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Starr-140117-3997-Citrus_latifolia-Tahitian_fruit_and_leaves-Hawea_Pl_Olinda-Maui_%2824612312943%29.jpg/330px-Starr-140117-3997-Citrus_latifolia-Tahitian_fruit_and_leaves-Hawea_Pl_Olinda-Maui_%2824612312943%29.jpg", name: "Lime" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Peaches.jpg",                                                                                                                                                                          name: "Peach" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pears.jpg/330px-Pears.jpg",                                                                                                                                                      name: "Pear" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/Kiwifruit_cross_section.jpg",                                                                                                                                                        name: "Kiwi" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Cherry_season_%2848216568227%29.jpg/330px-Cherry_season_%2848216568227%29.jpg",                                                                                                   name: "Cherry" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Blueberries.jpg/330px-Blueberries.jpg",                                                                                                                                          name: "Blueberry" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Raspberry_-_halved_%28Rubus_idaeus%29.jpg/330px-Raspberry_-_halved_%28Rubus_idaeus%29.jpg",                                                                                       name: "Raspberry" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Coconut_on_white_background.jpg",                                                                                                                                                      name: "Coconut" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Persea_americana_fruit_2.JPG/330px-Persea_americana_fruit_2.JPG",                                                                                                                name: "Avocado" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Pomegranate_on_white.jpg",                                                                                                                                                             name: "Pomegranate" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Pitaya_cross_section_ed2.jpg/330px-Pitaya_cross_section_ed2.jpg",                                                                                                                name: "Dragon Fruit" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Figs.jpg",                                                                                                                                                                             name: "Fig" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Papaya_cross_section_BNC.jpg",                                                                                                                                                         name: "Papaya" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Litchi_chinensis_fruits.JPG/330px-Litchi_chinensis_fruits.JPG",                                                                                                                  name: "Lychee" },
    ],
    questions: [],
  },
  {
    id: "vegetables",
    name: "Vegetables",
    description: "Can you name the vegetable from the photo? All 20 shown every round.",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg/330px-Vegetable-Carrot-Bundle-wStalks.jpg",
    category: "Food",
    questionsPerRound: 20,
    poolQuestion: "What vegetable is this?",
    imagePool: [
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg/330px-Vegetable-Carrot-Bundle-wStalks.jpg",       name: "Carrot" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Broccoli_and_cross_section_edit.jpg/330px-Broccoli_and_cross_section_edit.jpg",        name: "Broccoli" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/330px-Tomato_je.jpg",                                                    name: "Tomato" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/VegCorn.jpg/330px-VegCorn.jpg",                                                        name: "Sweetcorn" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mixed_onions.jpg/330px-Mixed_onions.jpg",                                              name: "Onion" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/330px-Patates.jpg",                                                        name: "Potato" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ipomoea_batatas_006.JPG/330px-Ipomoea_batatas_006.JPG",                                name: "Sweet Potato" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/FrenchMarketPumpkinsB.jpg/330px-FrenchMarketPumpkinsB.jpg",                            name: "Pumpkin" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Chou-fleur_02.jpg/330px-Chou-fleur_02.jpg",                                            name: "Cauliflower" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Solanum_melongena_24_08_2012_%281%29.JPG/330px-Solanum_melongena_24_08_2012_%281%29.JPG", name: "Aubergine" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/CSA-Striped-Zucchini.jpg/330px-CSA-Striped-Zucchini.jpg",                              name: "Courgette" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Asparagus_bundle.jpg",                                                                       name: "Asparagus" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Cabbage_and_cross_section_on_white.jpg/330px-Cabbage_and_cross_section_on_white.jpg",  name: "Cabbage" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Celery_1.jpg/330px-Celery_1.jpg",                                                      name: "Celery" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Peas_in_pods_-_Studio.jpg/330px-Peas_in_pods_-_Studio.jpg",                            name: "Peas" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Red_capsicum_and_cross_section.jpg",                                                         name: "Red Pepper" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ARS_cucumber.jpg/330px-ARS_cucumber.jpg",                                              name: "Cucumber" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Detroitdarkredbeets.png/330px-Detroitdarkredbeets.png",                                 name: "Beetroot" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Leek_on_white_background_-_0947.jpg/330px-Leek_on_white_background_-_0947.jpg",        name: "Leek" },
      { imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Artichoke_J1.jpg/330px-Artichoke_J1.jpg",                                              name: "Artichoke" },
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
