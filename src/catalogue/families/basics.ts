import { artwork, calendarArtwork, weekdayArtwork } from "../../artwork";
import { lowerRatio, lower, upper, oneIn, exact } from "../helpers";
import type { LandmarkModel } from "../types";

export const basicsModels = [
  { id: "coin-heads", chance: lowerRatio(1, 2), size: 98, art: artwork("coin", "#d9a534"), sourceIds: ["fair-coin-model"], classification: exact, opening: true },
  { id: "birthday-23", chance: upper(0.49270276567601456), size: 88, art: calendarArtwork(23, "#41a9a2"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact, opening: true },
  { id: "month-31-days", chance: lowerRatio(7, 12), size: 82, art: calendarArtwork(31, "#4d9e9b"), sourceIds: ["uniform-calendar-month-model"], classification: exact, opening: true },
  { id: "weekday", chance: lowerRatio(5, 7), size: 82, art: weekdayArtwork("#4b8b91"), sourceIds: ["uniform-seven-day-calendar-model"], classification: exact, opening: true },
  { id: "ocean-point", chance: upper(0.29), size: 104, art: artwork("ocean", "#287aab", "#9be5ef"), sourceIds: ["noaa-ocean-service"], classification: "Estimate", opening: true },
  { id: "annual-flood", chance: lower(0.01), size: 91, art: artwork("flood", "#286f9b", "#9be5ef"), sourceIds: ["usgs-floods-and-recurrence-intervals"], classification: "Defined model" },
  { id: "birthday-50", chance: upper(0.0296264204220116), size: 84, art: calendarArtwork(50, "#5cb6a9"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
  { id: "birthday-70", chance: upper(0.000840424034), size: 86, art: calendarArtwork(70, "#57a69c"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
  { id: "birthday-79", chance: upper(0.000109332), size: 88, art: calendarArtwork(79, "#478f8a"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
  { id: "lightning-year", chance: oneIn(1222000), size: 91, art: artwork("lightning", "#eec64d", "#8ec5d2"), sourceIds: ["us-national-weather-service-lightning-odds"], classification: "Historical estimate" },
] satisfies readonly LandmarkModel[];
