import { artwork, calendarArtwork, weekdayArtwork } from "../../artwork";
import { lowerRatio, lower, upper, oneIn, exact } from "../helpers";
import type { LandmarkModel } from "../types";

const birthdayMatchChance = (people: number) => {
  let allDifferentTail = 1;
  for (let index = 1; index < people; index += 1) allDifferentTail *= (365 - index) / 365;
  return upper(allDifferentTail);
};

export const basicsModels = [
  { id: "coin-heads", chance: lowerRatio(1, 2), size: 98, art: artwork("coin", "#d9a534"), sourceIds: ["fair-coin-model"], classification: exact },
  { id: "month-31-days", chance: lowerRatio(7, 12), size: 82, art: calendarArtwork(31, "#4d9e9b"), sourceIds: ["uniform-calendar-month-model"], classification: exact },
  { id: "weekday", chance: lowerRatio(5, 7), size: 82, art: weekdayArtwork("#4b8b91"), sourceIds: ["uniform-seven-day-calendar-model"], classification: exact },
  { id: "ocean-point", chance: upper(0.29), size: 104, art: artwork("ocean", "#287aab", "#9be5ef"), sourceIds: ["noaa-ocean-service"], classification: "Estimate" },
  { id: "annual-flood", chance: lower(0.01), size: 91, art: artwork("flood", "#286f9b", "#9be5ef"), sourceIds: ["usgs-floods-and-recurrence-intervals"], classification: "Defined model" },
  { id: "birthday-50", chance: birthdayMatchChance(50), size: 88, art: calendarArtwork(50, "#4b9f98"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
  { id: "lightning-year", chance: oneIn(1222000), size: 91, art: artwork("lightning", "#eec64d", "#8ec5d2"), sourceIds: ["us-national-weather-service-lightning-odds"], classification: "Historical estimate" },
  { id: "birthday-10", chance: birthdayMatchChance(10), size: 88, art: calendarArtwork(10, "#72c9ba"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
  { id: "birthday-20", chance: birthdayMatchChance(20), size: 88, art: calendarArtwork(20, "#64bdb0"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
  { id: "birthday-30", chance: birthdayMatchChance(30), size: 88, art: calendarArtwork(30, "#59b1a7"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
  { id: "birthday-40", chance: birthdayMatchChance(40), size: 88, art: calendarArtwork(40, "#52a7a0"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
  { id: "birthday-60", chance: birthdayMatchChance(60), size: 88, art: calendarArtwork(60, "#448f8a"), sourceIds: ["uniform-365-day-birthday-model"], classification: exact },
] satisfies readonly LandmarkModel[];
