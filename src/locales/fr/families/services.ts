import type { LandmarkCopyFamily } from "../../types";

export const servicesFR = {
  "fr-letter-green-j3-2025": {
    title: "Une Lettre verte est livrée sous trois jours ouvrables en France en 2025",
    shortTitle: "Lettre verte · 3 jours",
    explanation: "L’Arcep rapporte que 94,6 Lettres vertes sur 100 ont respecté le délai de trois jours ouvrables dans les mesures françaises du service postal universel en 2025.",
    calculation: "p ≈ 0,946 livrée sous trois jours ouvrables",
    assumptions: "La mesure publiée suit le calendrier des jours ouvrables postaux du produit ainsi que ses règles de dépôt, d’origine et d’heure limite. Ce taux annuel observé ne garantit pas le délai d’une lettre particulière.",
  },
  "fr-letter-green-j5-2025": {
    title: "Une Lettre verte est livrée sous cinq jours ouvrables en France en 2025",
    shortTitle: "Lettre verte · 5 jours",
    explanation: "L’Arcep rapporte que 99,3 Lettres vertes sur 100 ont respecté le délai de cinq jours ouvrables dans les mesures françaises du service postal universel en 2025.",
    calculation: "p ≈ 0,993 livrée sous cinq jours ouvrables",
    assumptions: "La mesure publiée suit le calendrier des jours ouvrables postaux du produit ainsi que ses règles de dépôt, d’origine et d’heure limite. Ce taux annuel observé ne garantit pas le délai d’une lettre particulière.",
  },
  "fr-colissimo-counter-j2-2025": {
    title: "Un Colissimo déposé au guichet est livré sous deux jours ouvrables en France en 2025",
    shortTitle: "Colissimo · 2 jours",
    explanation: "L’Arcep rapporte que 91,5 Colissimo sur 100 déposés au guichet ont respecté le délai de deux jours ouvrables dans les mesures françaises du service postal universel en 2025.",
    calculation: "p ≈ 0,915 livré sous deux jours ouvrables",
    assumptions: "La mesure publiée suit le calendrier des jours ouvrables postaux du produit ainsi que ses règles de dépôt, d’origine et d’heure limite. Ce taux annuel observé ne garantit pas le délai d’un colis particulier.",
  },
  "us-electricity-available-2024": {
    title: "L’électricité est disponible chez un abonné aux États-Unis en 2024",
    shortTitle: "électricité disponible aux États-Unis · 2024",
    explanation: "Les distributeurs américains publiant les indicateurs de fiabilité IEEE ont déclaré en moyenne 662,6 minutes de coupure par abonné sur les 527 040 minutes de l’année bissextile 2024.",
    calculation: "p ≈ 1 − 662,6 / (366 × 1 440)",
    assumptions: "L’estimation échantillonne une minute-client et convertit la durée annuelle moyenne des coupures déclarées, événements majeurs compris. Elle couvre les coupures enregistrées non momentanées et ne garantit rien pour un foyer, un distributeur ou une minute précise.",
  },
  "idf-electricity-available-2024": {
    title: "L’électricité est disponible chez un abonné en Île-de-France en 2024",
    shortTitle: "électricité disponible en Île-de-France · 2024",
    explanation: "En Île-de-France, un abonné basse tension a subi en moyenne 44,7 minutes de coupure sur les 527 040 minutes de l’année bissextile 2024.",
    calculation: "p ≈ 1 − 44,7 / (366 × 1 440)",
    assumptions: "L’estimation échantillonne une minute-client basse tension et convertit la durée régionale des coupures toutes causes confondues, tempêtes exceptionnelles comprises. Elle ne garantit rien pour une adresse ou une minute précise.",
  },
  "gmail-available-2013": {
    title: "Gmail est disponible en 2013",
    shortTitle: "Gmail disponible · 2013",
    explanation: "Google annonce une disponibilité moyenne de Gmail de 99,978 % en 2013, soit environ 99 978 instants disponibles sur 100 000.",
    calculation: "p ≈ 0,99978 de disponibilité annuelle déclarée",
    assumptions: "Le modèle échantillonne uniformément un instant de l’agrégat historique déclaré par le fournisseur. Le réseau, l’appareil, la connexion au compte d’une personne et la disponibilité actuelle de Gmail sont hors de la mesure. Ce chiffre n’est pas un engagement de service actuel.",
  },
  "stripe-available-2023": {
    title: "Stripe est disponible en 2023",
    shortTitle: "Stripe disponible · 2023",
    explanation: "La lettre annuelle de Stripe rapporte une disponibilité du service de paiement de 99,999 % en 2023, soit environ 99 999 instants disponibles sur 100 000.",
    calculation: "p ≈ 0,99999 de disponibilité annuelle déclarée",
    assumptions: "Le modèle échantillonne uniformément un instant de l’agrégat historique déclaré par le fournisseur. Il ne signifie pas que chaque achat est autorisé : les refus de carte, contrôles de fraude, banques, réseaux des clients et la disponibilité actuelle sont hors de la mesure.",
  },
  "fr-household-television-2025": {
    title: "Un foyer en France possède un téléviseur · second semestre 2025",
    shortTitle: "téléviseur au foyer · 2025",
    explanation: "Au second semestre 2025, 89,1 % des foyers en France possédaient au moins un téléviseur, d’après l’Arcom et Médiamétrie.",
    calculation: "p ≈ 0,891 des foyers",
    assumptions: "L’unité échantillonnée est le foyer. L’étude de référence de Médiamétrie porte sur 10 000 foyers par semestre. La vague utilisée s’est déroulée du 19 août au 22 décembre 2025.",
  },
  "fr-person-smartphone-2025": {
    title: "Une personne de 12 ans ou plus en France métropolitaine possède un smartphone · 2025",
    shortTitle: "smartphone · 2025",
    explanation: "En juin 2025, 91 % des personnes de 12 ans ou plus en France métropolitaine possédaient un smartphone, d’après le Baromètre du numérique 2026.",
    calculation: "p ≈ 0,91 des personnes de 12 ans ou plus",
    assumptions: "L’unité échantillonnée est une personne de 12 ans ou plus en France métropolitaine. L’enquête a interrogé 4 145 personnes du 5 au 21 juin 2025. Les smartphones forment une partie des téléphones mobiles.",
  },
  "fr-person-mobile-phone-2025": {
    title: "Une personne de 12 ans ou plus en France métropolitaine possède un téléphone mobile · 2025",
    shortTitle: "téléphone mobile · 2025",
    explanation: "En juin 2025, 97 % des personnes de 12 ans ou plus en France métropolitaine possédaient un téléphone mobile, d’après le Baromètre du numérique 2026.",
    calculation: "p ≈ 0,97 des personnes de 12 ans ou plus",
    assumptions: "L’unité échantillonnée est une personne de 12 ans ou plus en France métropolitaine. L’enquête a interrogé 4 145 personnes du 5 au 21 juin 2025. Les téléphones mobiles comprennent les smartphones et les autres types de mobiles.",
  },
} satisfies LandmarkCopyFamily;
