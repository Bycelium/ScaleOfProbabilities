import { electricityArtwork, equipmentArtwork, gmailArtwork, postalArtwork, stripeArtwork } from "../../artwork";
import { lower, upper } from "../helpers";
import type { LandmarkModel } from "../types";

export const servicesModels = [
  { id: "fr-letter-green-j3-2025", chance: lower(0.946), size: 92, art: postalArtwork("letter", "postalThreeDays", "#55a06d"), sourceIds: ["arcep-postal"], classification: "Historical estimate" },
  { id: "fr-letter-green-j5-2025", chance: lower(0.993), size: 92, art: postalArtwork("letter", "postalFiveDays", "#478f67"), sourceIds: ["arcep-postal"], classification: "Historical estimate" },
  { id: "fr-colissimo-counter-j2-2025", chance: lower(0.915), size: 94, art: postalArtwork("parcel", "postalTwoDays", "#a56b4e"), sourceIds: ["arcep-postal"], classification: "Historical estimate" },
  { id: "us-electricity-available-2024", chance: upper(662.6 / (366 * 1440)), size: 94, art: electricityArtwork("us", "#4b8d85"), sourceIds: ["eia-reliability-table", "eia-reliability-article"], classification: "Historical estimate" },
  { id: "idf-electricity-available-2024", chance: upper(44.7 / (366 * 1440)), size: 94, art: electricityArtwork("fr", "#4b8d85"), sourceIds: ["idf-electricity"], classification: "Historical estimate" },
  { id: "gmail-available-2013", chance: upper(0.00022), size: 92, art: gmailArtwork(), sourceIds: ["gmail-availability"], classification: "Historical estimate" },
  { id: "stripe-available-2023", chance: upper(0.00001), size: 94, art: stripeArtwork(), sourceIds: ["stripe-availability"], classification: "Historical estimate" },
  { id: "fr-household-television-2025", chance: lower(0.891), size: 92, art: equipmentArtwork("television"), sourceIds: ["arcom-equipment"], classification: "Historical estimate" },
  { id: "fr-person-smartphone-2025", chance: lower(0.91), size: 88, art: equipmentArtwork("smartphone"), sourceIds: ["arcep-digital-barometer"], classification: "Historical estimate" },
  { id: "fr-person-mobile-phone-2025", chance: lower(0.97), size: 88, art: equipmentArtwork("mobile"), sourceIds: ["arcep-digital-barometer"], classification: "Historical estimate" },
] satisfies readonly LandmarkModel[];
