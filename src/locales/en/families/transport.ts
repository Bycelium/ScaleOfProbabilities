import type { LandmarkCopyFamily } from "../../types";

export const transportEN = {
  "commercial-flight-no-accident-2025": {
    title: "A commercial flight without an IATA-defined accident in 2025",
    shortTitle: "commercial flight without an accident · 2025",
    explanation: "The 2025 report recorded 51 IATA-defined accidents across 38.7 million flights. Using its rounded rate, about 758,000 flights had no such accident for every flight that did.",
    calculation: "p ≈ 1 − 1.32 / 1,000,000",
    assumptions: "The model samples one flight from the covered commercial passenger and cargo jet and turboprop operations. Accidents include events such as tail strikes, landing-gear damage, and runway excursions, as well as more severe events. This is a per-flight historical estimate, not passenger fatality risk or a forecast.",
  },
  "commercial-flight-accident-2025": {
    title: "An IATA-defined accident on a commercial flight in 2025",
    shortTitle: "commercial flight accident · 2025",
    explanation: "The 2025 report recorded 51 IATA-defined accidents across 38.7 million flights, or about one for every 758,000 flights at the published rounded rate.",
    calculation: "p ≈ 1.32 / 1,000,000",
    assumptions: "The model samples one flight from the covered commercial passenger and cargo jet and turboprop operations. Accidents include tail strikes, landing-gear damage, and runway excursions, as well as more severe events. This is a per-flight historical estimate, not passenger fatality risk or a forecast.",
  },
  "gb-injury-collision-20km": {
    title: "A reported injury collision over a 20 km car trip",
    shortTitle: "injury collision · 20 km",
    explanation: "At Great Britain’s 2025 national rate, the model predicts roughly one 20 km trip where the car is involved in a police-reported injury collision for every 166,000 trips without one. The rate is 484 car involvements per billion vehicle miles.",
    calculation: "λ = 484 / (1,000,000,000 × 1.609344) per km; p = 1 − e^(−λ × 20) ≈ 6.0149 × 10⁻⁶",
    assumptions: "This defined model applies a constant-distance Poisson rate to one 20 km car trip. The national aggregate excludes property-only and unreported collisions. It describes vehicle involvement, not the chance that an occupant is injured or killed. The chosen distance is illustrative. Road, traffic, driver, and weather conditions vary.",
  },
  "gb-no-injury-collision-20km": {
    title: "No reported injury collision over a 20 km car trip",
    shortTitle: "20 km without injury collision",
    explanation: "For each 20 km trip where a car is involved in a police-reported injury collision in Great Britain, the model predicts roughly 166,000 trips without one. It uses the 2025 national rate of 484 car involvements per billion vehicle miles.",
    calculation: "λ = 484 / (1,000,000,000 × 1.609344) per km; p = e^(−λ × 20) ≈ 0.9999939851",
    assumptions: "This defined model applies a constant-distance Poisson rate to one 20 km car trip. The national aggregate excludes property-only and unreported collisions. It describes vehicle involvement, not every kind of incident or mechanical problem. The chosen distance is illustrative. Road, traffic, driver, and weather conditions vary.",
  },
  "gb-injury-collision-500km": {
    title: "A reported injury collision over a 500 km car trip",
    shortTitle: "injury collision · 500 km",
    explanation: "At Great Britain’s 2025 national rate, the model predicts roughly one 500 km trip where the car is involved in a police-reported injury collision for every 6,650 trips without one. The rate is 484 car involvements per billion vehicle miles.",
    calculation: "λ = 484 / (1,000,000,000 × 1.609344) per km; p = 1 − e^(−λ × 500) ≈ 1.5036 × 10⁻⁴",
    assumptions: "This defined model applies a constant-distance Poisson rate to one 500 km car trip. The national aggregate excludes property-only and unreported collisions. It describes vehicle involvement, not the chance that an occupant is injured or killed. The chosen distance is illustrative. Long-trip conditions can differ from the national average.",
  },
  "gb-no-injury-collision-500km": {
    title: "No reported injury collision over a 500 km car trip",
    shortTitle: "500 km without injury collision",
    explanation: "For each 500 km trip where a car is involved in a police-reported injury collision in Great Britain, the model predicts roughly 6,650 trips without one. It uses the 2025 national rate of 484 car involvements per billion vehicle miles.",
    calculation: "λ = 484 / (1,000,000,000 × 1.609344) per km; p = e^(−λ × 500) ≈ 0.9998496395",
    assumptions: "This defined model applies a constant-distance Poisson rate to one 500 km car trip. The national aggregate excludes property-only and unreported collisions. It describes vehicle involvement, not every kind of incident or mechanical problem. The chosen distance is illustrative. Long-trip conditions can differ from the national average.",
  },
  "uk-recent-car-breakdown-2021": {
    title: "A breakdown or non-start within a year for a recent car",
    shortTitle: "breakdown within a year · recent car",
    explanation: "In the 2021 Which? UK Car Survey, 4.9% of cars aged up to four years had at least one breakdown or non-start during the preceding 12 months, about one in 20 cars in that age group.",
    calculation: "p ≈ 0.049 with at least one breakdown or non-start",
    assumptions: "This retrospective survey result covers UK cars aged 0–4 years in 2021. The whole survey included 48,034 respondents reporting on 56,853 cars. The published article does not give the age group’s separate sample size. The annual result is not a per-trip rate and does not describe all car ages or current reliability.",
  },
  "uk-recent-car-no-breakdown-2021": {
    title: "A year without a breakdown or non-start for a recent car",
    shortTitle: "a year without breakdown · recent car",
    explanation: "In the 2021 Which? UK Car Survey, 95.1% of cars aged up to four years had no breakdown or non-start during the preceding 12 months, about 19 without one for every car that had one.",
    calculation: "p ≈ 1 − 0.049 = 0.951 without a breakdown or non-start",
    assumptions: "This retrospective survey result covers UK cars aged 0–4 years in 2021. The whole survey included 48,034 respondents reporting on 56,853 cars. The published article does not give the age group’s separate sample size. The annual result is not a per-trip rate and does not describe all car ages or current reliability.",
  },
} satisfies LandmarkCopyFamily;
