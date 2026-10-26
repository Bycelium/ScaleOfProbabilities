import type { LandmarkCopyFamily } from "../../types";

export const servicesEN = {
  "fr-letter-green-j3-2025": {
    title: "A France Lettre verte arrives within three working days in 2025",
    shortTitle: "Lettre verte · 3 days",
    explanation: "ARCEP reports that 94.6 of every 100 Lettres vertes met the three-working-day deadline in France’s 2025 universal postal-service measurements.",
    calculation: "p ≈ 0.946 delivered within three working days",
    assumptions: "The published service-quality measure follows the product’s postal working-day calendar, acceptance day, origin, and cutoff rules. This observed annual rate is not a delivery guarantee for an individual letter.",
  },
  "fr-letter-green-j5-2025": {
    title: "A France Lettre verte arrives within five working days in 2025",
    shortTitle: "Lettre verte · 5 days",
    explanation: "ARCEP reports that 99.3 of every 100 Lettres vertes met the five-working-day deadline in France’s 2025 universal postal-service measurements.",
    calculation: "p ≈ 0.993 delivered within five working days",
    assumptions: "The published service-quality measure follows the product’s postal working-day calendar, acceptance day, origin, and cutoff rules. This observed annual rate is not a delivery guarantee for an individual letter.",
  },
  "fr-colissimo-counter-j2-2025": {
    title: "A counter-posted Colissimo arrives within two working days in 2025",
    shortTitle: "Colissimo · 2 days",
    explanation: "ARCEP reports that 91.5 of every 100 counter-posted Colissimo parcels met the two-working-day deadline in France’s 2025 universal postal-service measurements.",
    calculation: "p ≈ 0.915 delivered within two working days",
    assumptions: "The published service-quality measure follows the product’s postal working-day calendar, acceptance day, origin, and cutoff rules. This observed annual rate is not a delivery guarantee for an individual parcel.",
  },
  "us-electricity-available-2024": {
    title: "Electricity is available at a US home in 2024",
    shortTitle: "US electricity available · 2024",
    explanation: "US utilities reporting IEEE reliability indicators averaged 662.6 minutes of interruption per customer across the 527,040 minutes of leap year 2024.",
    calculation: "p ≈ 1 − 662.6 / (366 × 1,440)",
    assumptions: "The estimate samples a customer-minute and converts the reported average annual interruption duration, including major events. It covers recorded non-momentary outages and does not promise availability for a particular home, utility, or minute.",
  },
  "idf-electricity-available-2024": {
    title: "Electricity is available at an Île-de-France home in 2024",
    shortTitle: "Île-de-France electricity available · 2024",
    explanation: "In Île-de-France, the average low-voltage customer had 44.7 minutes of interruption across the 527,040 minutes of leap year 2024.",
    calculation: "p ≈ 1 − 44.7 / (366 × 1,440)",
    assumptions: "The estimate samples a low-voltage customer-minute and converts the reported regional all-causes interruption duration, including exceptional storms. It does not promise availability for a particular address or minute.",
  },
  "gmail-available-2013": {
    title: "Gmail is available in 2013",
    shortTitle: "Gmail available · 2013",
    explanation: "Google reported 99.978% average Gmail availability in 2013, equivalent to about 99,978 available moments in every 100,000.",
    calculation: "p ≈ 0.99978 reported annual availability",
    assumptions: "The model samples a moment uniformly from the historical provider-reported aggregate. A person’s network, device, login, account access, and current Gmail availability are outside the measure. The figure is not a current service-level promise.",
  },
  "stripe-available-2023": {
    title: "Stripe is available in 2023",
    shortTitle: "Stripe available · 2023",
    explanation: "Stripe’s annual letter reports 99.999% payment-service availability in 2023, equivalent to about 99,999 available moments in every 100,000.",
    calculation: "p ≈ 0.99999 reported annual availability",
    assumptions: "The model samples a moment uniformly from the historical provider-reported aggregate. It does not mean that every purchase is authorized: card declines, fraud checks, banks, customer networks, and current availability are outside the measure.",
  },
  "fr-household-television-2025": {
    title: "A household in France has a television · second half of 2025",
    shortTitle: "television at home · 2025",
    explanation: "In the second half of 2025, 89.1% of households in France had at least one television, according to Arcom and Médiamétrie.",
    calculation: "p ≈ 0.891 of households",
    assumptions: "The sampled unit is a household. The Médiamétrie reference survey covers 10,000 households per semester and ran from 19 August to 22 December 2025 for this result.",
  },
  "fr-person-smartphone-2025": {
    title: "A person aged 12 or older in metropolitan France has a smartphone · 2025",
    shortTitle: "smartphone · 2025",
    explanation: "In June 2025, 91% of people aged 12 or older in metropolitan France had a smartphone, according to the 2026 Digital Barometer.",
    calculation: "p ≈ 0.91 of people aged 12 or older",
    assumptions: "The sampled unit is a person aged 12 or older in metropolitan France. The survey covered 4,145 people from 5 to 21 June 2025. A smartphone is a subset of mobile phones.",
  },
  "fr-person-mobile-phone-2025": {
    title: "A person aged 12 or older in metropolitan France has a mobile phone · 2025",
    shortTitle: "mobile phone · 2025",
    explanation: "In June 2025, 97% of people aged 12 or older in metropolitan France had a mobile phone, according to the 2026 Digital Barometer.",
    calculation: "p ≈ 0.97 of people aged 12 or older",
    assumptions: "The sampled unit is a person aged 12 or older in metropolitan France. The survey covered 4,145 people from 5 to 21 June 2025. Mobile phones include smartphones and other mobile handsets.",
  },
} satisfies LandmarkCopyFamily;
