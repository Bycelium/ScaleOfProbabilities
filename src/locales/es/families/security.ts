import type { LandmarkCopyFamily } from "../../types";

const passwordAssumptions =
  "Se toma uniformemente una aparición de contraseña entre las 32 603 388 apariciones del archivo fijado de frecuencias de RockYou 2009. El intento debe coincidir exactamente con la cadena. Este corpus histórico y específico de un servicio no representa todas las contraseñas actuales. Las protecciones en línea y la verificación en dos pasos también afectan a la seguridad de la cuenta.";
const passwordAdvice = {
  before: "Si usas esta contraseña, sustitúyela por una ",
  relatedLabel: "contraseña única generada por un gestor de contraseñas",
  after: ". Evita patrones conocidos, como secuencias de teclado, nombres y fechas de nacimiento. Usa una llave de acceso cuando esté disponible y activa la verificación en dos pasos cuando sigan usándose contraseñas.",
};

export const securityES = {
  "password-123456": {
    title: "Adivinar «123456»",
    shortTitle: "adivinar «123456»",
    explanation: "En el corpus RockYou 2009, «123456» aparece 290 729 veces entre 32 603 388 apariciones de contraseñas.",
    calculation: "p = 290 729 / 32 603 388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },
  "password-qwerty": {
    title: "Adivinar «qwerty»",
    shortTitle: "adivinar «qwerty»",
    explanation: "En el corpus RockYou 2009, «qwerty» aparece 13 456 veces entre 32 603 388 apariciones de contraseñas.",
    calculation: "p = 13 456 / 32 603 388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },
  "password-password": {
    title: "Adivinar «password»",
    shortTitle: "adivinar «password»",
    explanation: "En el corpus RockYou 2009, «password» aparece 59 462 veces entre 32 603 388 apariciones de contraseñas.",
    calculation: "p = 59 462 / 32 603 388",
    assumptions: passwordAssumptions,
    advice: passwordAdvice,
  },
  "four-digit-pin": {
    title: "Adivinar un PIN de cuatro cifras",
    shortTitle: "PIN de cuatro cifras",
    explanation: "La probabilidad de que un intento al azar coincida con un PIN elegido uniformemente entre 0000 y 9999 es de 1 entre 10 000.",
    calculation: "p = 1 / 10 000",
    assumptions: "Las 10 000 cadenas de cuatro cifras son igualmente probables y el modelo cubre un intento. Los sistemas de PIN de dispositivos y bancos suelen limitar los intentos repetidos.",
    advice: {
      before: "Mantén activados los límites de intentos en dispositivos y cuentas bancarias. Para las cuentas en línea, usa una llave de acceso cuando esté disponible. En los demás casos, usa una ",
      relatedLabel: "contraseña única generada por un gestor de contraseñas",
      after: " y la verificación en dos pasos.",
    },
  },
  "manager-password-16": {
    title: "Adivinar una contraseña de 16 caracteres generada por un gestor",
    shortTitle: "contraseña generada de 16 caracteres",
    explanation: "Acertar a la primera una contraseña aleatoria de dieciséis letras y cifras ya es vertiginosamente improbable.",
    calculation: "p = 1 / 62¹⁶ = 1 / 47 672 401 706 823 533 450 263 330 816",
    assumptions: "Cada carácter se elige de forma independiente y uniforme entre letras mayúsculas, letras minúsculas y dígitos. La probabilidad cubre un intento independiente. La configuración del gestor de contraseñas y las protecciones de la cuenta varían.",
  },
  "eff-passphrase-six": {
    title: "Adivinar una frase de contraseña aleatoria de seis palabras",
    shortTitle: "frase de contraseña de seis palabras",
    explanation: "Seis palabras corrientes pueden formar un secreto sorprendentemente difícil de adivinar cuando se eligen al azar. Un intento debe acertarlas todas en el orden correcto.",
    calculation: "p = 1 / 7776⁶ = 1 / 221 073 919 720 733 357 899 776",
    assumptions: "Cada palabra se elige de forma independiente y uniforme entre 7776 palabras. El orden importa, las palabras pueden repetirse y la probabilidad cubre un intento independiente.",
  },
  "aes-128-key": {
    title: "Adivinar una clave AES aleatoria de 128 bits",
    shortTitle: "clave AES de 128 bits",
    explanation: "Ante una clave AES de 128 bits generada al azar, un único intento a ciegas tiene una posibilidad ínfima de encontrar la clave exacta.",
    calculation: "p = 1 / 2¹²⁸ = 1 / 340 282 366 920 938 463 463 374 607 431 768 211 456",
    assumptions: "La clave AES se genera uniformemente y la probabilidad cubre un intento de clave independiente. La protección práctica de los datos también depende del software y de la gestión de claves.",
  },
  "aes-256-key": {
    title: "Adivinar una clave AES aleatoria de 256 bits",
    shortTitle: "clave AES de 256 bits",
    explanation: "Una clave AES de 256 bits generada al azar hace casi inconcebible que un único intento a ciegas encuentre la clave exacta.",
    calculation: "p = 1 / 2²⁵⁶ ≈ 1 / (1,158 × 10⁷⁷)",
    assumptions: "La clave AES se genera uniformemente y la probabilidad cubre un intento de clave independiente. La protección práctica de los datos también depende del software y de la gestión de claves.",
  },
  "uuid-v4-pair-collision": {
    title: "Dos valores UUIDv4 coinciden",
    shortTitle: "colisión de dos UUIDv4",
    explanation: "Genera dos UUIDv4 de forma independiente: que este par concreto produzca dos valores idénticos sería una coincidencia extraordinaria.",
    calculation: "p = 1 / 2¹²² = 1 / 5 316 911 983 139 663 491 615 228 241 121 378 304",
    assumptions: "Ambos UUIDv4 usan campos aleatorios de 122 bits independientes y uniformes producidos por un generador fiable. El modelo cubre un solo par. En una colección grande, el efecto cumpleaños cuenta muchos pares posibles y aumenta la probabilidad de al menos una colisión.",
  },
  "sha256-pair-collision": {
    title: "Dos entradas distintas comparten un hash SHA-256",
    shortTitle: "colisión de un par SHA-256",
    explanation: "Toma dos entradas distintas: en el modelo SHA-256 ideal, que este par concreto comparta un resumen sería una coincidencia extraordinariamente rara.",
    calculation: "Un par fijado: p = 1 / 2²⁵⁶ ≈ 1 / (1,158 × 10⁷⁷)",
    assumptions: "Las dos entradas son distintas y sus resúmenes SHA-256 se modelizan como valores independientes y uniformes de 256 bits. El modelo cubre un par específico. Una búsqueda entre muchos hashes cuenta n(n − 1)/2 pares; su escala de cumpleaños de unos 2¹²⁸ hashes describe la colección, mientras que este par específico permanece en 2⁻²⁵⁶.",
  },
  "exact-hash-day": {
    title: "Un hash de Bitcoin preseleccionado aparece en un día",
    shortTitle: "hash exacto de Bitcoin en un día",
    explanation: "A la tasa de red modelizada, la probabilidad de producir al menos una vez durante un día un hash específico de 256 bits elegido de antemano es de aproximadamente 1 entre 1,34 × 10⁵¹.",
    calculation: "p = 1 − (1 − 2⁻²⁵⁶)ᴺ ≈ N / 2²⁵⁶ ≈ 1 entre 1,34 × 10⁵¹, donde N ≈ 8,64 × 10²⁵",
    assumptions: "La red realiza N intentos de hash independientes y uniformes a una tasa redondeada de 10²¹ por segundo durante 86 400 segundos. La minería ordinaria acepta cualquier hash por debajo de un umbral objetivo. Coincidir con un hash preseleccionado es un suceso mucho más limitado.",
  },
  "eff-word-one": {
    title: "Adivinar una palabra de la lista de la EFF",
    shortTitle: "una palabra entre 7776",
    explanation: "Cinco tiradas de dado se convierten en una palabra de la lista EFF. Un intento exacto debe encontrar ese componente de una frase de contraseña más larga.",
    calculation: "p = 1 / 6⁵ = 1 / 7776",
    assumptions: "Cinco tiradas ordenadas de un dado equilibrado de seis caras seleccionan la palabra. Las 6⁵ secuencias son igualmente probables y el modelo realiza un intento independiente de adivinar la palabra.",
  },
  "enigma-i-known-rings": {
    title: "Adivinar una configuración de Enigma I con los anillos conocidos",
    shortTitle: "Enigma I, anillos conocidos",
    explanation: "Conocer los anillos de Enigma I todavía deja que los rotores, sus posiciones iniciales y el clavijero oculten el ajuste correcto entre una inmensidad de posibilidades. Un único intento debe encontrar la combinación exacta.",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(5, 3) × 26³ = 158 962 555 217 826 360 000. p = 1/N",
    assumptions: "Se conocen el reflector, el cableado y los ajustes de los anillos. La configuración contada contiene tres rotores ordenados de entre cinco, una de 26 posiciones iniciales para cada rotor y exactamente 10 cables del panel que emparejan 20 letras. Seis letras quedan sin conectar. Se cuentan todos los órdenes de rotores mecánicamente posibles, con independencia de las restricciones operativas históricas. La fortaleza criptográfica efectiva también dependía de los métodos de ataque y del contexto del mensaje. No se asigna una ganancia de probabilidad fija a la Bombe sin definir el conjunto de candidatos que dejan sus pruebas.",
  },
  "enigma-m3-known-rings": {
    title: "Adivinar una configuración de Enigma M3 con los anillos conocidos",
    shortTitle: "Enigma M3, anillos conocidos",
    explanation: "Los anillos conocidos todavía dejan que los rotores, sus posiciones iniciales y el clavijero de la Enigma M3 naval oculten el ajuste correcto entre una inmensidad de posibilidades. Un único intento debe encontrar la combinación exacta.",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(8, 3) × 26³ = 890 190 309 219 827 616 000. p = 1/N",
    assumptions: "Se conocen el reflector, el cableado y los ajustes de los anillos. La configuración contada contiene tres rotores ordenados de entre ocho, una de 26 posiciones iniciales para cada rotor y exactamente 10 cables del panel que emparejan 20 letras. Seis letras quedan sin conectar. Se cuentan todos los órdenes de rotores mecánicamente posibles, con independencia de las restricciones operativas históricas. La fortaleza criptográfica efectiva también dependía de los métodos de ataque y del contexto del mensaje. No se asigna una ganancia de probabilidad fija a la Bombe sin definir el conjunto de candidatos que dejan sus pruebas.",
  },
  "enigma-m4-known-rings": {
    title: "Adivinar una configuración de Enigma M4 con los anillos conocidos",
    shortTitle: "Enigma M4, anillos conocidos",
    explanation: "La Enigma M4 naval añade un cuarto rotor. Con los anillos conocidos, los rotores, sus posiciones iniciales y el clavijero todavía dejan una inmensidad de ajustes posibles para un único intento.",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × P(8, 3) × 2 × 26⁴ = 46 289 896 079 431 036 032 000. p = 1/N",
    assumptions: "Se conocen el reflector, el cableado y los ajustes de los anillos. La configuración contada contiene tres rotores ordenados de entre ocho, un rotor griego Beta o Gamma, una de 26 posiciones iniciales para cada uno de los cuatro rotores y exactamente 10 cables del panel que emparejan 20 letras. Seis letras quedan sin conectar. El reflector es fijo. Se cuentan todos los órdenes de rotores mecánicamente posibles, con independencia de las restricciones operativas históricas. La fortaleza criptográfica efectiva también dependía de los métodos de ataque y del contexto del mensaje.",
  },
  "enigma-i-two-unknown-rings": {
    title: "Adivinar una configuración de Enigma I con dos anillos desconocidos",
    shortTitle: "Enigma I con dos anillos desconocidos",
    explanation: "Deja sin conocer dos anillos de rotor de Enigma I y esos dos ajustes ocultos multiplican un campo ya inmenso de posibilidades para los rotores y el clavijero. Un único intento debe encontrar la combinación exacta.",
    calculation: "N = 158 962 555 217 826 360 000 × 26² = 107 458 687 327 250 619 360 000. p = 1/N",
    assumptions: "El anillo del rotor izquierdo se fija en una referencia conocida porque su desplazamiento equivalente queda absorbido por la convención de la posición inicial. Los anillos central y derecho tienen 26 ajustes cada uno. Se conocen el reflector y el cableado. El resto de la configuración contada contiene tres rotores ordenados de entre cinco, una de 26 posiciones iniciales para cada rotor y exactamente 10 cables del panel que emparejan 20 letras. Seis letras quedan sin conectar. Se cuentan todos los órdenes de rotores mecánicamente posibles, con independencia de las restricciones operativas históricas. La fortaleza criptográfica efectiva también dependía de los métodos de ataque y del contexto del mensaje.",
  },
  "enigma-m3-after-clues": {
    title: "Adivinar una configuración de Enigma M3 tras las pistas de Banburismus",
    shortTitle: "M3 tras las pistas de Banburismus",
    explanation: "En el ejemplo de Banburismus de Tony Sale, las pistas reducen los órdenes de rotores posibles de 336 a unos 20. Las posiciones iniciales y el clavijero todavía dejan un campo formidable para un único intento.",
    calculation: "N = [26! / (6! × 10! × 2¹⁰)] × 20 × 26³ = 52 987 518 405 942 120 000. p = 1/N. Desplazamiento respecto a los 336 órdenes = 10 log₁₀[(890 190 309 219 827 616 000 − 1) / (52 987 518 405 942 120 000 − 1)] ≈ +12,3 dBan",
    assumptions: "Se conocen el reflector, el cableado y los ajustes de los anillos. Se supone que el orden correcto permanece entre 20 órdenes de rotores igualmente probables. Cada rotor tiene 26 posiciones iniciales posibles. Exactamente 10 cables del panel emparejan 20 letras y dejan seis sin conectar. La reducción a 20 es ilustrativa y varía según la interceptación. La fortaleza criptográfica efectiva también dependía de los métodos de ataque y del contexto del mensaje.",
  },
} satisfies LandmarkCopyFamily;
