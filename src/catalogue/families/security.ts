import { artwork, cryptographicKeyArtwork, enigmaArtwork, passwordArtwork, uuidArtwork, wordSelectionArtwork } from "../../artwork";
import { lowerRatio, oneIn, exact } from "../helpers";
import type { LandmarkModel } from "../types";

export const securityModels = [
  { id: "password-123456", chance: lowerRatio(290729, 32603388), size: 88, art: passwordArtwork("123456", "guess", "#b8616d"), advice: { relatedId: "manager-password-16" }, sourceIds: ["rockyou-frequency", "nist-password", "ncsc-passkey"], classification: "Historical estimate" },
  { id: "password-qwerty", chance: lowerRatio(13456, 32603388), size: 88, art: passwordArtwork("qwerty", "guess", "#9c647e"), advice: { relatedId: "manager-password-16" }, sourceIds: ["rockyou-frequency", "password-pattern-study", "nist-password", "ncsc-passkey"], classification: "Historical estimate" },
  { id: "password-password", chance: lowerRatio(59462, 32603388), size: 88, art: passwordArtwork("password", "guess", "#765f8f"), advice: { relatedId: "manager-password-16" }, sourceIds: ["rockyou-frequency", "nist-password", "ncsc-passkey"], classification: "Historical estimate" },
  { id: "four-digit-pin", chance: oneIn(10000), size: 82, art: artwork("pin", "#4c7990"), advice: { relatedId: "manager-password-16" }, sourceIds: ["uniform-four-digit-model", "nist-password"], classification: exact },
  { id: "manager-password-16", chance: oneIn(62 ** 16), size: 92, art: passwordArtwork("16", "manager", "#527c91"), sourceIds: ["nist-password", "ncsc-passkey", "eff-password-advice"], classification: exact },
  { id: "eff-passphrase-six", chance: oneIn(7776 ** 6), size: 92, art: passwordArtwork("6", "words", "#607f9a"), sourceIds: ["eff-dice", "eff-wordlist", "eff-password-advice"], classification: exact },
  { id: "aes-128-key", chance: oneIn(2 ** 128), size: 92, art: cryptographicKeyArtwork(128, "#4d86a5"), sourceIds: ["nist-fips-197-aes"], classification: exact },
  { id: "aes-256-key", chance: oneIn(2 ** 256), size: 94, art: cryptographicKeyArtwork(256, "#596eaa"), sourceIds: ["nist-fips-197-aes"], classification: exact },
  { id: "uuid-v4-pair-collision", chance: oneIn(2 ** 122), size: 94, art: uuidArtwork("#527f91"), sourceIds: ["rfc-9562-uuidv4"], classification: exact },
  { id: "exact-hash-day", chance: oneIn(1.340186218024493e51), size: 98, art: artwork("bitcoin", "#f7931a", "#ffd59a"), sourceIds: ["kryptex-network-hash-rate", "bitcoin-developer-guide-proof-of-work"], classification: "Defined model" },
  { id: "eff-word-one", chance: oneIn(7776), size: 90, art: wordSelectionArtwork("#5f829c"), sourceIds: ["eff-dice", "eff-wordlist"], classification: exact },
  { id: "enigma-i-known-rings", chance: oneIn(158962555217826360000), size: 96, art: enigmaArtwork("I"), sourceIds: ["enigma-working", "enigma-i", "national-museum-computing-bombe", "turing-welchman"], classification: "Defined model" },
  { id: "enigma-m3-known-rings", chance: oneIn(890190309219827616000), size: 96, art: enigmaArtwork("M3"), sourceIds: ["enigma-working", "enigma-m3", "national-museum-computing-bombe", "turing-welchman", "tony-sale-banburismus"], classification: "Defined model" },
  { id: "enigma-m4-known-rings", chance: oneIn(46289896079431036032000), size: 98, art: enigmaArtwork("M4"), sourceIds: ["enigma-working", "enigma-m4", "national-museum-computing-bombe"], classification: "Defined model" },
  { id: "enigma-i-two-unknown-rings", chance: oneIn(107458687327250619360000), size: 98, art: enigmaArtwork("I", true), sourceIds: ["enigma-working", "enigma-i"], classification: "Defined model" },
  { id: "enigma-m3-after-clues", chance: oneIn(52987518405942120000), size: 96, art: enigmaArtwork("M3", false, 20), sourceIds: ["enigma-working", "enigma-m3", "tony-sale-banburismus", "national-museum-computing-bombe"], classification: "Defined model" },
] satisfies readonly LandmarkModel[];
