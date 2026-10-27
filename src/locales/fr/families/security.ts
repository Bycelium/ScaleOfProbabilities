import type { LandmarkCopyFamily } from "../../types";

const passwordAssumptions =
  "Une occurrence est tirée uniformément parmi les 32 603 388 occurrences de l’archive de fréquences RockYou 2009 épinglée. La proposition doit correspondre exactement à la chaîne de caractères. Ce corpus historique propre à un service ne représente pas tous les mots de passe actuels. Les protections en ligne et la validation en deux étapes influent aussi sur la sécurité du compte.";
const passwordAdvice = {
  before: "Si vous utilisez ce mot de passe, remplacez-le par un ",
  relatedLabel: "mot de passe unique généré par un gestionnaire",
  after: ". Évitez les suites de clavier, les noms et les dates de naissance. Utilisez une clé d’accès lorsqu’elle est disponible et activez la validation en deux étapes lorsque vous utilisez encore un mot de passe.",
};

export const securityFR = {
  "password-123456": {
    title: "Deviner « 123456 »",
    shortTitle: "deviner « 123456 »",
    explanation: "Dans le corpus RockYou 2009, « 123456 » apparaît 290 729 fois parmi 32 603 388 occurrences de mots de passe.",
    calculation: "p = 290 729 / 32 603 388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },
  "password-qwerty": {
    title: "Deviner « qwerty »",
    shortTitle: "deviner « qwerty »",
    explanation: "Dans le corpus RockYou 2009, « qwerty » apparaît 13 456 fois parmi 32 603 388 occurrences de mots de passe.",
    calculation: "p = 13 456 / 32 603 388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },
  "password-password": {
    title: "Deviner « password »",
    shortTitle: "deviner « password »",
    explanation: "Dans le corpus RockYou 2009, « password » apparaît 59 462 fois parmi 32 603 388 occurrences de mots de passe.",
    calculation: "p = 59 462 / 32 603 388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },
  "four-digit-pin": {
    title: "Deviner un code PIN à quatre chiffres",
    shortTitle: "code PIN à quatre chiffres",
    explanation: "La probabilité qu’un essai aléatoire corresponde à un code choisi uniformément de 0000 à 9999 est de 1 sur 10 000.",
    calculation: "p = 1 / 10 000",
    assumptions: "Les 10 000 suites de quatre chiffres sont équiprobables, et le modèle porte sur un seul essai. Les appareils et les banques limitent généralement les essais répétés.",
    advice: {
      before: "Conservez les limites d’essais sur les appareils et les comptes bancaires. Pour les comptes en ligne, utilisez une clé d’accès lorsqu’elle est disponible. Sinon, utilisez un ",
      relatedLabel: "mot de passe unique généré par un gestionnaire",
      after: " et la validation en deux étapes.",
    },
  },
  "manager-password-16": {
    title: "Deviner un mot de passe de 16 caractères généré par un gestionnaire",
    shortTitle: "mot de passe généré de 16 caractères",
    explanation: "Retrouver du premier coup un mot de passe aléatoire de seize lettres et chiffres est déjà vertigineusement improbable.",
    calculation: "p = 1 / 62¹⁶ = 1 / 47 672 401 706 823 533 450 263 330 816",
    assumptions: "Chaque caractère est tiré indépendamment et uniformément parmi les lettres majuscules, les lettres minuscules et les chiffres. La probabilité porte sur un seul essai indépendant. Les réglages du gestionnaire et les protections du compte varient.",
  },
  "eff-passphrase-six": {
    title: "Deviner une phrase secrète aléatoire de six mots",
    shortTitle: "phrase secrète de six mots",
    explanation: "Six mots courants peuvent former un secret étonnamment difficile à deviner, à condition d’être choisis au hasard. Il faut retrouver chacun d’eux dans le bon ordre.",
    calculation: "p = 1 / 7 776⁶ = 1 / 221 073 919 720 733 357 899 776",
    assumptions: "Chaque mot est tiré indépendamment et uniformément parmi 7 776 mots. L’ordre compte, les mots peuvent se répéter et la probabilité porte sur un seul essai indépendant.",
  },
  "aes-128-key": {
    title: "Deviner une clé AES aléatoire de 128 bits",
    shortTitle: "clé AES de 128 bits",
    explanation: "Face à une clé AES de 128 bits générée au hasard, une unique tentative à l’aveugle a une chance infime de retrouver la clé exacte.",
    calculation: "p = 1 / 2¹²⁸ = 1 / 340 282 366 920 938 463 463 374 607 431 768 211 456",
    assumptions: "La clé AES est tirée uniformément, et la probabilité porte sur un seul essai indépendant. La protection réelle dépend aussi du logiciel et de la gestion des clés.",
  },
  "aes-256-key": {
    title: "Deviner une clé AES aléatoire de 256 bits",
    shortTitle: "clé AES de 256 bits",
    explanation: "Une clé AES de 256 bits générée au hasard rend la réussite d’une unique tentative à l’aveugle presque inconcevable.",
    calculation: "p = 1 / 2²⁵⁶ ≈ 1 / (1,158 × 10⁷⁷)",
    assumptions: "La clé AES est tirée uniformément, et la probabilité porte sur un seul essai indépendant. La protection réelle dépend aussi du logiciel et de la gestion des clés.",
  },
  "uuid-v4-pair-collision": {
    title: "Collision entre deux UUIDv4",
    shortTitle: "collision de deux UUIDv4",
    explanation: "Générez deux UUIDv4 indépendamment : voir cette paire précise produire deux valeurs identiques serait une coïncidence extraordinaire.",
    calculation: "p = 1 / 2¹²² = 1 / 5 316 911 983 139 663 491 615 228 241 121 378 304",
    assumptions: "Les deux UUIDv4 utilisent des champs aléatoires de 122 bits indépendants et uniformes issus d’un générateur fiable. Le modèle porte sur une seule paire. Dans une grande collection, le paradoxe des anniversaires compte de nombreuses paires possibles et augmente la probabilité d’au moins une collision.",
  },
  "sha256-pair-collision": {
    title: "Deux entrées distinctes partagent la même empreinte SHA-256",
    shortTitle: "collision d’une paire SHA-256",
    explanation: "Prenez deux entrées distinctes : dans le modèle SHA-256 idéal, voir cette paire précise partager une empreinte serait une coïncidence extraordinairement rare.",
    calculation: "Une paire fixée : p = 1 / 2²⁵⁶ ≈ 1 / (1,158 × 10⁷⁷)",
    assumptions: "Les deux entrées sont distinctes, et leurs empreintes SHA-256 sont modélisées comme des valeurs uniformes et indépendantes de 256 bits. Le modèle porte sur une paire précise. Une recherche parmi de nombreuses empreintes compte n(n − 1)/2 paires ; le seuil d’environ 2¹²⁸ empreintes associé au paradoxe des anniversaires décrit la collection, tandis que cette paire précise reste à 2⁻²⁵⁶.",
  },
  "exact-hash-day": {
    title: "Une empreinte Bitcoin choisie à l’avance apparaît en un jour",
    shortTitle: "empreinte Bitcoin exacte en un jour",
    explanation: "Au débit modélisé du réseau, la probabilité de produire au moins une fois en un jour une empreinte précise de 256 bits choisie à l’avance est d’environ 1 sur 1,34 × 10⁵¹.",
    calculation: "p = 1 − (1 − 2⁻²⁵⁶)ᴺ ≈ N / 2²⁵⁶ ≈ 1 sur 1,34 × 10⁵¹, avec N ≈ 8,64 × 10²⁵",
    assumptions: "Le réseau effectue N tentatives de hachage indépendantes et uniformes, à un débit arrondi de 10²¹ par seconde pendant 86 400 secondes. Le minage ordinaire accepte toute empreinte inférieure à une cible. La correspondance avec une empreinte précise choisie à l’avance est un événement beaucoup plus restreint.",
  },
  "eff-word-one": {
    title: "Deviner un mot de la liste EFF",
    shortTitle: "un mot parmi 7 776",
    explanation: "Cinq lancers de dé deviennent un mot de la liste EFF. Une tentative précise doit retrouver cet élément d’une phrase secrète plus longue.",
    calculation: "p = 1 / 6⁵ = 1 / 7 776",
    assumptions: "Cinq lancers ordonnés d’un dé équilibré à six faces sélectionnent le mot. Les 6⁵ suites sont équiprobables, et le modèle effectue un seul essai indépendant.",
  },
  "enigma-i-known-rings": {
    title: "Deviner une configuration d’Enigma I avec bagues connues",
    shortTitle: "Enigma I, bagues connues",
    explanation: "Connaître les bagues d’Enigma I laisse encore les rotors, leurs positions de départ et le tableau de connexions cacher le bon réglage parmi un nombre immense de possibilités. Une seule tentative doit retrouver la combinaison exacte.",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(5, 3) × 26³ = 158 962 555 217 826 360 000. p = 1/N",
    assumptions: "Le réflecteur, les câblages et les réglages de bague sont connus. La configuration comptée comprend trois rotors ordonnés parmi cinq, l’une des 26 positions initiales pour chaque rotor et exactement 10 câbles qui relient 20 lettres par paires. Six lettres restent débranchées. Tous les ordres mécaniquement possibles sont comptés, quelles que soient les restrictions d’exploitation historiques. La robustesse cryptographique effective dépendait aussi des méthodes d’attaque et du contexte des messages. Aucun gain de probabilité fixe n’est attribué à la Bombe sans définir l’ensemble de candidats restant après ses tests.",
  },
  "enigma-m3-known-rings": {
    title: "Deviner une configuration d’Enigma M3 avec bagues connues",
    shortTitle: "Enigma M3, bagues connues",
    explanation: "Des bagues connues laissent encore les rotors, leurs positions de départ et le tableau de connexions de l’Enigma navale M3 cacher le bon réglage parmi un nombre immense de possibilités. Une seule tentative doit retrouver la combinaison exacte.",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(8, 3) × 26³ = 890 190 309 219 827 616 000. p = 1/N",
    assumptions: "Le réflecteur, les câblages et les réglages de bague sont connus. La configuration comptée comprend trois rotors ordonnés parmi huit, l’une des 26 positions initiales pour chaque rotor et exactement 10 câbles qui relient 20 lettres par paires. Six lettres restent débranchées. Tous les ordres mécaniquement possibles sont comptés, quelles que soient les restrictions d’exploitation historiques. La robustesse cryptographique effective dépendait aussi des méthodes d’attaque et du contexte des messages. Aucun gain de probabilité fixe n’est attribué à la Bombe sans définir l’ensemble de candidats restant après ses tests.",
  },
  "enigma-m4-known-rings": {
    title: "Deviner une configuration d’Enigma M4 avec bagues connues",
    shortTitle: "Enigma M4, bagues connues",
    explanation: "L’Enigma navale M4 ajoute un quatrième rotor. Avec ses bagues connues, les rotors, leurs positions de départ et le tableau de connexions laissent encore un nombre immense de réglages possibles à une seule tentative.",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(8, 3) × 2 × 26⁴ = 46 289 896 079 431 036 032 000. p = 1/N",
    assumptions: "Le réflecteur, les câblages et les réglages de bague sont connus. La configuration comptée comprend trois rotors ordonnés parmi huit, un rotor grec Beta ou Gamma, l’une des 26 positions initiales pour chacun des quatre rotors et exactement 10 câbles qui relient 20 lettres par paires. Six lettres restent débranchées. Le réflecteur est fixé. Tous les ordres mécaniquement possibles sont comptés, quelles que soient les restrictions d’exploitation historiques. La robustesse cryptographique effective dépendait aussi des méthodes d’attaque et du contexte des messages.",
  },
  "enigma-i-two-unknown-rings": {
    title: "Deviner une configuration d’Enigma I avec deux bagues inconnues",
    shortTitle: "Enigma I avec deux bagues inconnues",
    explanation: "Laissez deux bagues de rotor d’Enigma I inconnues : ces deux réglages cachés multiplient un éventail déjà immense de possibilités pour les rotors et le tableau de connexions. Une seule tentative doit retrouver la combinaison exacte.",
    calculation: "N = 158 962 555 217 826 360 000 × 26² = 107 458 687 327 250 619 360 000. p = 1/N",
    assumptions: "La bague du rotor gauche est fixée à une référence connue, car son décalage équivalent est absorbé dans la convention de position initiale. Les bagues centrale et droite ont chacune 26 réglages. Le réflecteur et les câblages sont connus. Le reste de la configuration comptée comprend trois rotors ordonnés parmi cinq, l’une des 26 positions initiales pour chaque rotor et exactement 10 câbles qui relient 20 lettres par paires. Six lettres restent débranchées. Tous les ordres mécaniquement possibles sont comptés, quelles que soient les restrictions d’exploitation historiques. La robustesse cryptographique effective dépendait aussi des méthodes d’attaque et du contexte des messages.",
  },
  "enigma-m3-after-clues": {
    title: "Deviner une configuration d’Enigma M3 après les indices du Banburisme",
    shortTitle: "M3 après les indices du Banburisme",
    explanation: "Dans l’exemple de Banburisme de Tony Sale, les indices réduisent les ordres de rotors possibles de 336 à une vingtaine. Les positions de départ et le tableau de connexions laissent encore un champ redoutable à une unique tentative.",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × 20 × 26³ = 52 987 518 405 942 120 000. p = 1/N. Variation depuis les 336 ordres = 10 log₁₀[(890 190 309 219 827 616 000 − 1) / (52 987 518 405 942 120 000 − 1)] ≈ +12,3 dBan",
    assumptions: "Le réflecteur, les câblages et les réglages de bague sont connus. Le bon ordre est supposé rester parmi 20 ordres de rotors équiprobables. Chaque rotor possède 26 positions initiales. Exactement 10 câbles relient 20 lettres par paires, et six lettres restent débranchées. La réduction à 20 est illustrative et varie selon l’interception. La robustesse cryptographique effective dépendait aussi des méthodes d’attaque et du contexte des messages.",
  },
} satisfies LandmarkCopyFamily;
