import type { LandmarkCopyFamily } from "../../types";

export const weather_sportsFR = {
  "rain-hilo": {
    title: "Un jour de pluie à Hilo, à Hawaï",
    shortTitle: "pluie à Hilo",
    explanation: "La normale NOAA de 1991 à 2020 relève au moins 0,01 pouce de précipitations pendant 273 jours d’une année représentative de 365 jours à Hilo.",
    calculation: "p ≈ 273 jours avec précipitations / 365 jours = 0,74795",
    assumptions: "La station est l’aéroport international de Hilo, à Hawaï. Un jour avec précipitations enregistre au moins 0,01 pouce, soit 0,254 mm. Une brève averse suffit. Cela ne signifie pas qu’il pleut toute la journée et ce modèle n’est pas une prévision.",
  },
  "sunshine-phoenix": {
    title: "Un instant de jour est ensoleillé à Phoenix",
    shortTitle: "ensoleillement à Phoenix",
    explanation: "La NOAA rapporte un ensoleillement au sol pendant 85 % du temps de jour possible à Phoenix, de janvier 1965 à décembre 1983.",
    calculation: "p ≈ 0,85 de l’ensoleillement possible pendant le jour",
    assumptions: "Cette statistique historique mesure la durée d’ensoleillement en proportion du temps de jour possible. Elle ne signifie pas que 85 % des jours civils sont entièrement ensoleillés et ne constitue pas une prévision.",
  },
  "nba-free-throw-2023-24": {
    title: "Un lancer franc NBA est réussi en 2023-2024",
    shortTitle: "lancer franc NBA réussi",
    explanation: "Les joueurs ont réussi 78,4 lancers francs sur 100 pendant la saison régulière NBA 2023-2024 achevée.",
    calculation: "p ≈ 0,784 de réussite aux lancers francs dans la ligue",
    assumptions: "Les tentatives de tous les joueurs sont regroupées sur la saison régulière achevée. Le tirage porte sur une tentative et non sur un joueur. Il ne prédit pas un prochain lancer.",
  },
  "mensik-first-serve-miami-2025": {
    title: "Jakub Mensik réussit une première balle à Miami en 2025",
    shortTitle: "première balle de Mensik réussie",
    explanation: "Jakub Mensik a placé 68,6 % de ses premières balles dans le bon carré de service sur six matchs au tournoi de Miami 2025.",
    calculation: "p ≈ 0,686 de premières balles réussies",
    assumptions: "La statistique couvre les six matchs achevés de Mensik au tournoi de Miami 2025. Elle mesure si la première balle est bonne et non s’il gagne le point. Elle ne prédit pas un autre match.",
  },
  "premier-league-penalty-2023-24": {
    title: "Un penalty de Premier League est marqué en 2023-2024",
    shortTitle: "penalty de Premier League marqué",
    explanation: "La Premier League rapporte que 90 % des penalties en cours de match ont été transformés pendant la saison 2023-2024 achevée.",
    calculation: "p ≈ 0,90 de penalties transformés",
    assumptions: "Cette statistique historique couvre les penalties en cours de match pendant la saison 2023-2024. La ligue ne comporte pas de séances de tirs au but. Le taux saisonnier arrondi ne prédit pas le prochain penalty d’un joueur.",
  },
  "rain-brest-december": {
    title: "De la pluie à Brest en décembre",
    shortTitle: "pluie en décembre à Brest",
    explanation: "La normale Météo-France de 1991 à 2020 relève au moins 1 mm de précipitations pendant 17,8 des 31 jours de décembre à Brest-Guipavas.",
    calculation: "p ≈ 17,8 jours avec précipitations / 31 jours de décembre = 0,57419",
    assumptions: "Cette estimation climatique concerne la station de Brest-Guipavas et non toute la Bretagne. Un jour compte après au moins 1 mm de précipitations mesurées. Cela n’implique pas qu’il pleuve toute la journée et ne constitue pas une prévision.",
  },
} satisfies LandmarkCopyFamily;
