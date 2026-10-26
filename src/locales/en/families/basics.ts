import type { LandmarkCopyFamily } from "../../types";

export const basicsEN = {
  "coin-heads": {
    title: "A chosen side of a fair coin",
    shortTitle: "heads or tails",
    explanation: "One of the coin’s two equally likely outcomes matches the side chosen in advance: heads or tails.",
    calculation: "p = 1 chosen side / 2 sides = 1/2",
    assumptions: "The coin has equal chances of heads and tails, and it does not land on its edge.",
  },
  "birthday-23": {
    title: "A shared birthday in a room of 23",
    shortTitle: "a shared birthday",
    explanation: "A modelled group of 23 is slightly more likely to contain a shared birthday than to have 23 different birthdays. Every possible pair counts, rather than only people matching your birthday.",
    calculation: "p = 1 − ∏ₖ₌₀²² (365 − k) / 365",
    assumptions: "Birthdays are independent and equally spread over 365 dates. Leap days are ignored.",
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
    explanation: "About 71 of every 100 uniformly chosen points on Earth fall on ocean water, matching the ocean’s estimated share of the planet’s surface.",
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
    explanation: "About 97 in 100 modelled groups of 50 contain at least one shared birthday. The calculation subtracts the chance that all 50 dates differ.",
    calculation: "p = 1 − ∏ₖ₌₀⁴⁹ (365 − k) / 365 ≈ 0.97037358",
    assumptions: "Birthdays are independent and equally spread over 365 dates. Leap days are ignored.",
  },
  "birthday-70": {
    title: "A shared birthday in a room of 70",
    shortTitle: "shared birthday among 70",
    explanation: "About 1,189 modelled groups of 70 contain a shared birthday for every group with 70 different birthdays. The calculation subtracts the small chance that all dates differ.",
    calculation: "p ≈ 0.999159576 from 1 minus the chance that all 70 birthdays differ",
    assumptions: "Birthdays are independent and equally spread over 365 dates. Leap days are ignored.",
  },
  "birthday-79": {
    title: "A shared birthday in a room of 79",
    shortTitle: "shared birthday among 79",
    explanation: "About 9,146 modelled groups of 79 contain a shared birthday for every group with 79 different birthdays. The calculation subtracts the tiny chance that all dates differ.",
    calculation: "p ≈ 0.999890668 from 1 minus the chance that all 79 birthdays differ",
    assumptions: "Birthdays are independent and equally spread over 365 dates. Leap days are ignored.",
  },
  "lightning-year": {
    title: "Lightning strike in a year (US estimate)",
    shortTitle: "annual US lightning strike",
    explanation: "The historical estimate is about one person struck in a year per 1,222,000 US residents. It divides the annual average number of people struck by the population.",
    calculation: "p ≈ 1 / 1,222,000 from annual strikes divided by population",
    assumptions: "The estimate uses 2009–2018 strike averages and the 2019 US population. A person’s location, work, and time outdoors can change their risk greatly.",
  },
} satisfies LandmarkCopyFamily;
