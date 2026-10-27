import type { LandmarkCopyFamily } from "../../types";

const birthdayAssumptions = "Birthdays are independent and equally spread over 365 dates. Leap days are ignored.";

export const basicsEN = {
  "coin-heads": {
    title: "A chosen side of a fair coin",
    shortTitle: "heads or tails",
    explanation: "Call heads or tails before a fair coin lands: your chosen side wins half the time.",
    calculation: "p = 1 chosen side / 2 sides = 1/2",
    assumptions: "The coin has equal chances of heads and tails, and it does not land on its edge.",
  },
  "birthday-10": {
    title: "A shared birthday in a room of 10",
    shortTitle: "shared birthday among 10",
    explanation: "Even around a table of just 10 people, about 12 in 100 modelled groups contain a shared birthday.",
    calculation: "p = 1 − ∏ₖ₌₀⁹ (365 − k) / 365 ≈ 0.11694818",
    assumptions: birthdayAssumptions,
  },
  "birthday-20": {
    title: "A shared birthday in a room of 20",
    shortTitle: "shared birthday among 20",
    explanation: "Bring 20 people together and about 41 in 100 modelled groups contain a shared birthday.",
    calculation: "p = 1 − ∏ₖ₌₀¹⁹ (365 − k) / 365 ≈ 0.41143838",
    assumptions: birthdayAssumptions,
  },
  "birthday-30": {
    title: "A shared birthday in a room of 30",
    shortTitle: "shared birthday among 30",
    explanation: "In a room of 30 people, a shared birthday is already more likely than not: it appears in about 71 in 100 modelled groups.",
    calculation: "p = 1 − ∏ₖ₌₀²⁹ (365 − k) / 365 ≈ 0.70631624",
    assumptions: birthdayAssumptions,
  },
  "birthday-40": {
    title: "A shared birthday in a room of 40",
    shortTitle: "shared birthday among 40",
    explanation: "With 40 people in the room, about 89 in 100 modelled groups contain a shared birthday.",
    calculation: "p = 1 − ∏ₖ₌₀³⁹ (365 − k) / 365 ≈ 0.89123181",
    assumptions: birthdayAssumptions,
  },
  "month-31-days": {
    title: "A chosen month has 31 days",
    shortTitle: "31-day month",
    explanation: "Seven of the twelve months have 31 days. Four have 30 days, and February has 28 or 29.",
    calculation: "p = 7 months / 12 months = 7/12",
    assumptions: "Each of the twelve named months is equally likely to be chosen. Leap years do not change which months have 31 days.",
  },
  "weekday": {
    title: "A chosen day is Monday through Friday",
    shortTitle: "Monday–Friday",
    explanation: "Five of the seven days run from Monday through Friday. The other two are Saturday and Sunday.",
    calculation: "p = 5 named days / 7 named days = 5/7",
    assumptions: "This is a uniform calendar category. No employment or personal schedule is modelled.",
  },
  "ocean-point": {
    title: "A random point falls in the ocean",
    shortTitle: "an ocean point",
    explanation: "Drop an imaginary pin uniformly on Earth: about 71 times in 100, it lands in ocean water.",
    calculation: "p ≈ 0.71 from the reported ocean-covered surface area",
    assumptions: "The reported 71% ocean coverage is used as a surface-area estimate.",
  },
  "annual-flood": {
    title: "Exceed a 1% annual flood threshold",
    shortTitle: "1% annual flood",
    explanation: "At the defined location, the threshold has one modelled annual exceedance for every 99 years without one, on average. The 1% annual chance does not promise one flood every 100 years.",
    calculation: "p = 0.01 for the defined location, threshold, and year",
    assumptions: "The threshold belongs to a particular location. Homes and waterways at other locations have different risks.",
  },
  "birthday-50": {
    title: "A shared birthday in a room of 50",
    shortTitle: "shared birthday among 50",
    explanation: "Gather 50 people and only about three modelled groups in 100 avoid a shared birthday.",
    calculation: "p = 1 − ∏ₖ₌₀⁴⁹ (365 − k) / 365 ≈ 0.97037358",
    assumptions: birthdayAssumptions,
  },
  "birthday-60": {
    title: "A shared birthday in a room of 60",
    shortTitle: "shared birthday among 60",
    explanation: "Among 60 people, more than 99 in 100 modelled groups contain a shared birthday.",
    calculation: "p = 1 − ∏ₖ₌₀⁵⁹ (365 − k) / 365 ≈ 0.99412266",
    assumptions: birthdayAssumptions,
  },
  "lightning-year": {
    title: "Lightning strike in a year (US estimate)",
    shortTitle: "annual US lightning strike",
    explanation: "Across the historical US estimate, about one person per 1,222,000 residents is struck by lightning in a year.",
    calculation: "p ≈ 1 / 1,222,000 from annual strikes divided by population",
    assumptions: "The estimate uses 2009–2018 strike averages and the 2019 US population. A person’s location, work, and time outdoors can change their risk greatly.",
  },
} satisfies LandmarkCopyFamily;
