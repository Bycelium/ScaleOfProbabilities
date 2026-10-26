import type { LandmarkCopyFamily } from "../../types";

export const astronomyEN = {
  "solar-terrestrial": {
    title: "A terrestrial Solar System planet",
    shortTitle: "a terrestrial planet",
    explanation: "Four of the eight Solar System planets are terrestrial: Mercury, Venus, Earth, and Mars.",
    calculation: "p = 4 terrestrial planets / 8 planets = 1/2",
    assumptions: "Each of the eight planets is equally likely to be chosen. Dwarf planets are excluded, and planets are not weighted by mass, size, or population.",
  },
  "full-moon-15-days": {
    title: "A full Moon during a 15-day stay",
    shortTitle: "full Moon in 15 days",
    explanation: "About 51 in 100 modelled 15-day stays include the instant of a full Moon when their start points are uniform across the lunar cycle.",
    calculation: "p = 15 days / 29.530589 days ≈ 0.50795",
    assumptions: "The start phase is uniform and the synodic month is held constant at 29.530589 days. The model concerns the astronomical full-Moon instant and ignores weather, daylight, and the local horizon.",
  },
  "solar-eclipse-year": {
    title: "A year with a total solar eclipse",
    shortTitle: "year with a total solar eclipse",
    explanation: "NASA’s catalogue records at least one total solar eclipse somewhere on Earth in 67 of the 100 calendar years from 2001 through 2100.",
    calculation: "p = 67 years with a type T eclipse / 100 years",
    assumptions: "The count uses distinct calendar years in NASA’s catalogue. Type T and T+ entries count as total eclipses. Hybrid eclipses are excluded, and visibility from any particular location is not implied.",
  },
  "red-dwarf-star": {
    title: "A red dwarf in the Milky Way",
    shortTitle: "a red dwarf star",
    explanation: "NASA estimates that about 73 in every 100 stars in the Milky Way are red dwarfs.",
    calculation: "p ≈ 0.73",
    assumptions: "Stars are sampled from the estimated Milky Way population. This is not a selection from stars visible to the unaided eye, where brightness changes the mix.",
  },
  "planet-with-moon": {
    title: "A Solar System planet with a moon",
    shortTitle: "a planet with a moon",
    explanation: "Six of the eight Solar System planets have at least one known natural moon. Mercury and Venus are the two without moons.",
    calculation: "p = 6 planets with moons / 8 planets = 3/4",
    assumptions: "Each planet is equally likely to be chosen. The number of moons around each planet does not affect the sampling.",
  },
  "lunar-eclipse-year": {
    title: "A year with a partial or total lunar eclipse",
    shortTitle: "year with a lunar eclipse",
    explanation: "NASA’s catalogue records at least one partial or total lunar eclipse somewhere on Earth in 79 of the 100 calendar years from 2001 through 2100.",
    calculation: "p = 79 qualifying years / 100 years",
    assumptions: "The count uses distinct calendar years in NASA’s catalogue. Partial and total eclipse types, including suffix variants, count. Penumbral-only eclipses are excluded, and visibility from any particular location is not implied.",
  },
  "full-moon-28-days": {
    title: "A full Moon during a 28-day stay",
    shortTitle: "full Moon in 28 days",
    explanation: "About 95 in 100 modelled 28-day stays include the instant of a full Moon when their start points are uniform across the lunar cycle.",
    calculation: "p = 28 days / 29.530589 days ≈ 0.94817",
    assumptions: "The start phase is uniform and the synodic month is held constant at 29.530589 days. The model concerns the astronomical full-Moon instant and ignores weather, daylight, and the local horizon.",
  },
  "sun-mass": {
    title: "The Sun’s share of Solar System mass",
    shortTitle: "the Sun’s share of mass",
    explanation: "NASA estimates that the Sun contains about 99.85% of the Solar System’s mass, or 99.85 units out of every 100.",
    calculation: "p ≈ 0.9985",
    assumptions: "Sampling is proportional to mass. It is not a uniform choice among the Sun, planets, moons, and smaller bodies. The published percentage is rounded.",
  },
  "solar-eclipse-local-year": {
    title: "A total solar eclipse where you live within a year",
    shortTitle: "total eclipse where you live · year",
    explanation: "At a representative fixed place, the long-run estimate averages one year with a total solar eclipse overhead for every 374 years without one. NASA gives a mean interval of about 375 years between total eclipses at one place.",
    calculation: "p ≈ 1/375 from the long-run mean return interval",
    assumptions: "This is a frequency-based annual approximation for a representative fixed place. Real intervals and local rates vary. Clouds are outside the event, and the estimate is not a forecast for a named city or year.",
  },
} satisfies LandmarkCopyFamily;
