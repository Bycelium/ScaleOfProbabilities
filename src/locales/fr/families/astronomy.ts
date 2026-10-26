import type { LandmarkCopyFamily } from "../../types";

export const astronomyFR = {
  "solar-terrestrial": {
    title: "Une planète tellurique du Système solaire",
    shortTitle: "une planète tellurique",
    explanation: "Quatre des huit planètes du Système solaire sont telluriques : Mercure, Vénus, la Terre et Mars.",
    calculation: "p = 4 planètes telluriques / 8 planètes = 1/2",
    assumptions: "Chacune des huit planètes a la même probabilité d’être choisie. Les planètes naines sont exclues. La masse, la taille et la population des planètes n’interviennent pas.",
  },
  "full-moon-15-days": {
    title: "Une pleine Lune pendant un séjour de 15 jours",
    shortTitle: "pleine Lune en 15 jours",
    explanation: "Environ 51 séjours modélisés sur 100 de 15 jours comprennent l’instant de la pleine Lune lorsque leur point de départ est uniforme dans le cycle lunaire.",
    calculation: "p = 15 jours / 29,530589 jours ≈ 0,50795",
    assumptions: "La phase de départ est uniforme et le mois synodique est fixé à 29,530589 jours. Le modèle concerne l’instant astronomique de la pleine Lune. Il ignore la météo, la lumière du jour et l’horizon local.",
  },
  "solar-eclipse-year": {
    title: "Une année avec une éclipse solaire totale",
    shortTitle: "année avec éclipse solaire totale",
    explanation: "Le catalogue de la NASA recense au moins une éclipse solaire totale quelque part sur Terre dans 67 des 100 années civiles de 2001 à 2100.",
    calculation: "p = 67 années avec une éclipse de type T / 100 années",
    assumptions: "Le décompte porte sur les années civiles distinctes du catalogue de la NASA. Les entrées T et T+ comptent comme éclipses totales. Les éclipses hybrides sont exclues. La visibilité depuis un lieu précis n’est pas impliquée.",
  },
  "red-dwarf-star": {
    title: "Une naine rouge dans la Voie lactée",
    shortTitle: "une étoile naine rouge",
    explanation: "La NASA estime qu’environ 73 étoiles sur 100 dans la Voie lactée sont des naines rouges.",
    calculation: "p ≈ 0,73",
    assumptions: "Les étoiles sont échantillonnées dans la population estimée de la Voie lactée. Il ne s’agit pas d’une sélection parmi les étoiles visibles à l’œil nu, où la luminosité modifie la répartition.",
  },
  "planet-with-moon": {
    title: "Une planète du Système solaire avec une lune",
    shortTitle: "une planète avec une lune",
    explanation: "Six des huit planètes du Système solaire possèdent au moins une lune naturelle connue. Mercure et Vénus sont les deux seules qui n’en ont pas.",
    calculation: "p = 6 planètes avec des lunes / 8 planètes = 3/4",
    assumptions: "Chaque planète a la même probabilité d’être choisie. Le nombre de lunes autour de chaque planète ne modifie pas l’échantillonnage.",
  },
  "lunar-eclipse-year": {
    title: "Une année avec une éclipse lunaire partielle ou totale",
    shortTitle: "année avec éclipse lunaire",
    explanation: "Le catalogue de la NASA recense au moins une éclipse lunaire partielle ou totale quelque part sur Terre dans 79 des 100 années civiles de 2001 à 2100.",
    calculation: "p = 79 années correspondantes / 100 années",
    assumptions: "Le décompte porte sur les années civiles distinctes du catalogue de la NASA. Les éclipses partielles et totales, y compris leurs variantes suffixées, comptent. Les éclipses uniquement pénombrales sont exclues. La visibilité depuis un lieu précis n’est pas impliquée.",
  },
  "full-moon-28-days": {
    title: "Une pleine Lune pendant un séjour de 28 jours",
    shortTitle: "pleine Lune en 28 jours",
    explanation: "Environ 95 séjours modélisés sur 100 de 28 jours comprennent l’instant de la pleine Lune lorsque leur point de départ est uniforme dans le cycle lunaire.",
    calculation: "p = 28 jours / 29,530589 jours ≈ 0,94817",
    assumptions: "La phase de départ est uniforme et le mois synodique est fixé à 29,530589 jours. Le modèle concerne l’instant astronomique de la pleine Lune. Il ignore la météo, la lumière du jour et l’horizon local.",
  },
  "sun-mass": {
    title: "La part du Soleil dans la masse du Système solaire",
    shortTitle: "la part de masse du Soleil",
    explanation: "La NASA estime que le Soleil contient environ 99,85 % de la masse du Système solaire, soit 99,85 unités sur 100.",
    calculation: "p ≈ 0,9985",
    assumptions: "L’échantillonnage est proportionnel à la masse. Il ne s’agit pas d’un choix uniforme parmi le Soleil, les planètes, les lunes et les petits corps. Le pourcentage publié est arrondi.",
  },
  "solar-eclipse-local-year": {
    title: "Une éclipse totale de Soleil chez soi dans l’année",
    shortTitle: "éclipse totale chez soi · un an",
    explanation: "Pour un lieu fixe représentatif, l’estimation à long terme compte en moyenne une année avec une éclipse totale de Soleil au-dessus du lieu pour 374 années sans éclipse totale. La NASA indique un intervalle moyen d’environ 375 ans entre deux éclipses totales au même endroit.",
    calculation: "p ≈ 1/375 à partir de l’intervalle de retour moyen à long terme",
    assumptions: "Il s’agit d’une approximation annuelle fondée sur la fréquence pour un lieu fixe représentatif. Les intervalles et les fréquences locales réelles varient. Les nuages sont hors de l’événement. L’estimation ne prédit rien pour une ville ou une année précises.",
  },
} satisfies LandmarkCopyFamily;
