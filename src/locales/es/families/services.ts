import type { LandmarkCopyFamily } from "../../types";

const postalAssumptions = "La medida de calidad publicada sigue el calendario de días laborables postales del producto y sus reglas de día de admisión, origen y hora límite. Esta tasa anual observada no garantiza la entrega de un envío concreto.";

export const servicesES = {
  "fr-letter-green-j3-2025": {
    title: "Una Lettre verte francesa llega en un plazo de tres días laborables en 2025",
    shortTitle: "Lettre verte · 3 días",
    explanation: "ARCEP indica que 94,6 de cada 100 Lettres vertes cumplieron el plazo de tres días laborables en las mediciones del servicio postal universal francés de 2025.",
    calculation: "p ≈ 0,946 entregadas en un plazo de tres días laborables",
    assumptions: postalAssumptions,
  },
  "fr-letter-green-j5-2025": {
    title: "Una Lettre verte francesa llega en un plazo de cinco días laborables en 2025",
    shortTitle: "Lettre verte · 5 días",
    explanation: "ARCEP indica que 99,3 de cada 100 Lettres vertes cumplieron el plazo de cinco días laborables en las mediciones del servicio postal universal francés de 2025.",
    calculation: "p ≈ 0,993 entregadas en un plazo de cinco días laborables",
    assumptions: postalAssumptions,
  },
  "fr-colissimo-counter-j2-2025": {
    title: "Un Colissimo enviado en ventanilla llega en un plazo de dos días laborables en 2025",
    shortTitle: "Colissimo · 2 días",
    explanation: "ARCEP indica que 91,5 de cada 100 paquetes Colissimo enviados en ventanilla cumplieron el plazo de dos días laborables en las mediciones del servicio postal universal francés de 2025.",
    calculation: "p ≈ 0,915 entregados en un plazo de dos días laborables",
    assumptions: postalAssumptions,
  },
  "us-electricity-available-2024": {
    title: "Hay electricidad disponible en un hogar de EE. UU. en 2024",
    shortTitle: "electricidad disponible en EE. UU. · 2024",
    explanation: "Las empresas eléctricas estadounidenses que informan indicadores de fiabilidad IEEE promediaron 662,6 minutos de interrupción por cliente entre los 527 040 minutos del año bisiesto 2024.",
    calculation: "p ≈ 1 − 662,6 / (366 × 1440)",
    assumptions: "La estimación muestrea un minuto-cliente y convierte la duración media anual de interrupción indicada, incluidos los grandes sucesos. Cubre los cortes no momentáneos registrados y no garantiza disponibilidad para un hogar, una empresa eléctrica o un minuto concretos.",
  },
  "idf-electricity-available-2024": {
    title: "Hay electricidad disponible en un hogar de Île-de-France en 2024",
    shortTitle: "electricidad disponible en Île-de-France · 2024",
    explanation: "En Île-de-France, el cliente medio de baja tensión tuvo 44,7 minutos de interrupción entre los 527 040 minutos del año bisiesto 2024.",
    calculation: "p ≈ 1 − 44,7 / (366 × 1440)",
    assumptions: "La estimación muestrea un minuto-cliente de baja tensión y convierte la duración regional de interrupción indicada por todas las causas, incluidas las tormentas excepcionales. No garantiza disponibilidad para una dirección o un minuto concretos.",
  },
  "gmail-available-2013": {
    title: "Gmail está disponible en 2013",
    shortTitle: "Gmail disponible · 2013",
    explanation: "Google indicó una disponibilidad media de Gmail del 99,978 % en 2013, equivalente a unos 99 978 momentos disponibles de cada 100 000.",
    calculation: "p ≈ 0,99978 de disponibilidad anual indicada",
    assumptions: "El modelo muestrea uniformemente un momento del agregado histórico indicado por el proveedor. La red, el dispositivo, el inicio de sesión y el acceso a la cuenta de una persona, así como la disponibilidad actual de Gmail, quedan fuera de la medida. La cifra no es un compromiso vigente de nivel de servicio.",
  },
  "stripe-available-2023": {
    title: "Stripe está disponible en 2023",
    shortTitle: "Stripe disponible · 2023",
    explanation: "La carta anual de Stripe indica una disponibilidad del servicio de pagos del 99,999 % en 2023, equivalente a unos 99 999 momentos disponibles de cada 100 000.",
    calculation: "p ≈ 0,99999 de disponibilidad anual indicada",
    assumptions: "El modelo muestrea uniformemente un momento del agregado histórico indicado por el proveedor. Esto no significa que se autorice cada compra: los rechazos de tarjetas, los controles de fraude, los bancos, las redes de los clientes y la disponibilidad actual quedan fuera de la medida.",
  },
  "fr-household-television-2025": {
    title: "Un hogar de Francia tiene televisor · segundo semestre de 2025",
    shortTitle: "televisor en casa · 2025",
    explanation: "En el segundo semestre de 2025, el 89,1 % de los hogares de Francia tenía al menos un televisor, según Arcom y Médiamétrie.",
    calculation: "p ≈ 0,891 de los hogares",
    assumptions: "La unidad muestreada es un hogar. La encuesta de referencia de Médiamétrie cubre 10 000 hogares por semestre y se realizó del 19 de agosto al 22 de diciembre de 2025 para este resultado.",
  },
  "fr-person-smartphone-2025": {
    title: "Una persona de 12 años o más de la Francia metropolitana tiene un teléfono inteligente · 2025",
    shortTitle: "teléfono inteligente · 2025",
    explanation: "En junio de 2025, el 91 % de las personas de 12 años o más de la Francia metropolitana tenía un teléfono inteligente, según el Barómetro Digital de 2026.",
    calculation: "p ≈ 0,91 de las personas de 12 años o más",
    assumptions: "La unidad muestreada es una persona de 12 años o más de la Francia metropolitana. La encuesta abarcó a 4145 personas del 5 al 21 de junio de 2025. Los teléfonos inteligentes son un subconjunto de los teléfonos móviles.",
  },
  "fr-person-mobile-phone-2025": {
    title: "Una persona de 12 años o más de la Francia metropolitana tiene teléfono móvil · 2025",
    shortTitle: "teléfono móvil · 2025",
    explanation: "En junio de 2025, el 97 % de las personas de 12 años o más de la Francia metropolitana tenía un teléfono móvil, según el Barómetro Digital de 2026.",
    calculation: "p ≈ 0,97 de las personas de 12 años o más",
    assumptions: "La unidad muestreada es una persona de 12 años o más de la Francia metropolitana. La encuesta abarcó a 4145 personas del 5 al 21 de junio de 2025. Los teléfonos móviles incluyen los teléfonos inteligentes y otros terminales móviles.",
  },
} satisfies LandmarkCopyFamily;
