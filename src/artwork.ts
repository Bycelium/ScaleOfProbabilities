const drawings: Record<string, string> = {
  pea: '<path d="M18 59c8-39 56-44 66-7-1 24-23 33-42 21-16-9-26 3-24-14Z" fill="var(--art)"/><circle cx="43" cy="41" r="8" fill="var(--light)"/>',
  hand: '<path d="M29 80V30c0-10 13-10 13 1v20-27c0-10 13-10 13 0v27-21c0-10 13-9 13 1v25l9-12c7-9 17 0 10 10L71 80c-8 11-31 10-42 0Z" fill="var(--art)"/>',
  cards: '<g transform="rotate(-12 50 50)"><rect x="20" y="18" width="51" height="67" rx="6" fill="#fff9e8"/><text x="28" y="45" fill="var(--art)" font-size="23" font-family="Georgia">A</text><path d="M50 48c-12-13-24 6 0 25 24-19 12-38 0-25Z" fill="var(--art)"/></g><rect x="63" y="29" width="20" height="49" rx="4" fill="#2d486e"/>',
  coin: '<circle cx="50" cy="50" r="37" fill="var(--art)"/><circle cx="50" cy="50" r="29" fill="none" stroke="var(--light)" stroke-width="3"/><text data-art-text="coinSide" x="50" y="62" text-anchor="middle" fill="#755c20" font-size="31" font-family="Georgia">H</text>',
  ocean: '<circle cx="50" cy="50" r="37" fill="var(--art)"/><path d="M23 43c10-11 21 10 32-1s19 10 25-1M22 59c11-10 22 11 33 0s18 9 25 0" fill="none" stroke="var(--light)" stroke-width="5"/>',
  beach: '<path d="M10 74c17-20 32-31 46-37 14 6 26 18 34 37" fill="var(--art)"/><circle cx="49" cy="51" r="8" fill="var(--light)"/><circle cx="32" cy="64" r="4" fill="var(--light)"/><circle cx="68" cy="62" r="5" fill="var(--light)"/>',
  dune: '<path d="M8 73c21-8 20-37 43-37s20 29 41 37" fill="var(--art)"/><path d="M11 76h78" stroke="var(--light)" stroke-width="4"/><circle cx="49" cy="49" r="5" fill="var(--light)"/>',
  bitcoin: '<circle cx="50" cy="50" r="39" fill="var(--art)"/><circle cx="50" cy="50" r="32" fill="none" stroke="var(--light)" stroke-width="2.5" opacity=".7"/><text x="50" y="64" text-anchor="middle" fill="#fff" font-size="43" font-family="Georgia" font-weight="700">₿</text>',
  "needle-hay": '<circle cx="50" cy="53" r="37" fill="var(--art)"/><path d="M18 42c18 8 46 8 64 0M14 56c21 9 51 9 72 0M20 70c17 7 43 7 60 0" fill="none" stroke="var(--light)" stroke-width="4" opacity=".75"/><path d="m24 81 57-61" stroke="#dce7e7" stroke-width="4" stroke-linecap="round"/><ellipse cx="80" cy="21" rx="5" ry="8" transform="rotate(43 80 21)" fill="none" stroke="#dce7e7" stroke-width="3"/><path d="m24 81-5 6" stroke="#dce7e7" stroke-width="2" stroke-linecap="round"/>',
  "die-six": '<rect x="18" y="18" width="64" height="64" rx="13" fill="var(--art)"/><g fill="var(--light)"><circle cx="34" cy="33" r="5"/><circle cx="66" cy="33" r="5"/><circle cx="34" cy="50" r="5"/><circle cx="66" cy="50" r="5"/><circle cx="34" cy="67" r="5"/><circle cx="66" cy="67" r="5"/></g>',
  spade: '<rect x="24" y="12" width="52" height="76" rx="7" fill="#fff9e8"/><text x="33" y="40" fill="var(--art)" font-size="24" font-family="Georgia">A</text><path d="M50 43c-25 21-8 35 0 24-2 8-7 12-7 12h14s-5-4-7-12c8 11 25-3 0-24Z" fill="var(--art)"/>',
  pin: '<rect x="20" y="25" width="60" height="55" rx="9" fill="var(--art)"/><path d="M35 25v-7c0-20 30-20 30 0v7" fill="none" stroke="var(--light)" stroke-width="7"/><text x="50" y="60" text-anchor="middle" fill="var(--light)" font-size="15" font-family="monospace">••••</text>',
  flood: '<path d="M18 63V35l32-20 32 20v28" fill="var(--art)"/><path d="M7 65c9-10 17 10 26 0s17 10 26 0 17 10 34 0M7 79c9-10 17 10 26 0s17 10 26 0 17 10 34 0" fill="none" stroke="var(--light)" stroke-width="6"/>',
  lightning: '<path d="M58 6 25 55h23L39 94l37-53H53Z" fill="var(--art)"/><path d="M16 26c5-13 21-17 31-8M72 19c11 0 17 6 20 15" fill="none" stroke="var(--light)" stroke-width="5" stroke-linecap="round"/>',
  cube: '<g stroke="#17202a" stroke-linejoin="round"><path d="m50 10 36 18-36 18-36-18Z" fill="#f5f1df" stroke-width="4"/><path d="m14 28 36 18v40L14 68Z" fill="#d84f50" stroke-width="4"/><path d="m50 46 36-18v40L50 86Z" fill="#3273bc" stroke-width="4"/><g fill="none" stroke-width="2"><path d="m26 22 36 18m-24-24 36 18M26 34l36-18M38 40l36-18M26 34v40m12-34v40M14 41.3l36 18M14 54.7l36 18M74 34v40M62 40v40M50 59.3l36-18M50 72.7l36-18"/></g></g>',
};

export const artwork = (kind: keyof typeof drawings, color: string, light = "#ffe8a0"): string =>
  `<svg viewBox="0 0 100 100" aria-hidden="true" style="--art:${color};--light:${light}">${drawings[kind]}</svg>`;

export const calendarArtwork = (count: number, color: string): string =>
  `<svg viewBox="0 0 100 100" aria-hidden="true" style="--art:${color}"><rect x="17" y="29" width="66" height="50" rx="5" fill="#fff9e8"/><path d="M17 45h66M35 21v18M65 21v18" stroke="var(--art)" stroke-width="7" stroke-linecap="round"/><text x="50" y="69" text-anchor="middle" fill="var(--art)" font-size="24" font-family="Georgia">${count}</text></svg>`;

type DiceCount = 2 | 3 | 5;
type DiceFace = 4 | 6;

const diePositions: Record<DiceCount, readonly [number, number][]> = {
  2: [[25, 50], [75, 50]],
  3: [[20, 50], [50, 50], [80, 50]],
  5: [[25, 28], [75, 28], [50, 50], [25, 72], [75, 72]],
};

export const diceArtwork = (count: DiceCount, face: DiceFace, color: string, light: string): string => {
  const pips = face === 6
    ? '<circle cx="-7" cy="-9" r="2.5"/><circle cx="7" cy="-9" r="2.5"/><circle cx="-7" cy="0" r="2.5"/><circle cx="7" cy="0" r="2.5"/><circle cx="-7" cy="9" r="2.5"/><circle cx="7" cy="9" r="2.5"/>'
    : '<circle cx="-7" cy="-8" r="2.7"/><circle cx="7" cy="-8" r="2.7"/><circle cx="-7" cy="8" r="2.7"/><circle cx="7" cy="8" r="2.7"/>';
  const size = count === 5 ? 20 : count === 3 ? 25 : 31;
  const dice = diePositions[count].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(${size / 31})"><rect x="-15.5" y="-15.5" width="31" height="31" rx="4" fill="var(--art)"/><g fill="var(--light)">${pips}</g></g>`).join("");
  return `<svg class="dice-set" data-face="${face}" viewBox="0 0 100 100" aria-hidden="true" style="--art:${color};--light:${light}">${dice}</svg>`;
};

type OutcomeDieFace = 1 | 2 | 3 | 4 | 5 | 6;

const outcomePips: Record<OutcomeDieFace, string> = {
  1: '<circle cx="0" cy="0" r="2.8"/>',
  2: '<circle cx="-7" cy="-8" r="2.8"/><circle cx="7" cy="8" r="2.8"/>',
  3: '<circle cx="-7" cy="-8" r="2.8"/><circle cx="0" cy="0" r="2.8"/><circle cx="7" cy="8" r="2.8"/>',
  4: '<circle cx="-7" cy="-8" r="2.7"/><circle cx="7" cy="-8" r="2.7"/><circle cx="-7" cy="8" r="2.7"/><circle cx="7" cy="8" r="2.7"/>',
  5: '<circle cx="-7" cy="-8" r="2.5"/><circle cx="7" cy="-8" r="2.5"/><circle cx="0" cy="0" r="2.5"/><circle cx="-7" cy="8" r="2.5"/><circle cx="7" cy="8" r="2.5"/>',
  6: '<circle cx="-7" cy="-9" r="2.5"/><circle cx="7" cy="-9" r="2.5"/><circle cx="-7" cy="0" r="2.5"/><circle cx="7" cy="0" r="2.5"/><circle cx="-7" cy="9" r="2.5"/><circle cx="7" cy="9" r="2.5"/>',
};

type OutcomeDice = readonly [OutcomeDieFace, OutcomeDieFace, OutcomeDieFace]
  | readonly [OutcomeDieFace, OutcomeDieFace, OutcomeDieFace, OutcomeDieFace]
  | readonly [OutcomeDieFace, OutcomeDieFace, OutcomeDieFace, OutcomeDieFace, OutcomeDieFace];

export const diceOutcomeArtwork = (faces: OutcomeDice, color: string, light: string): string => {
  const positions = faces.length === 5 ? diePositions[5] : faces.length === 4 ? [[25, 28], [75, 28], [25, 72], [75, 72]] : diePositions[3];
  const size = faces.length === 5 ? 20 : faces.length === 4 ? 23 : 25;
  const dice = faces.map((face, index) => `<g transform="translate(${positions[index][0]} ${positions[index][1]}) scale(${size / 31})"><rect x="-15.5" y="-15.5" width="31" height="31" rx="4" fill="var(--art)"/><g fill="var(--light)">${outcomePips[face]}</g></g>`).join("");
  return `<svg class="dice-outcome" data-faces="${faces.join(",")}" viewBox="0 0 100 100" aria-hidden="true" style="--art:${color};--light:${light}">${dice}</svg>`;
};

const d20Shape = (face: string | number, color: string, light: string): string =>
  `<path d="M50 7 88 30 80 72 50 93 20 72 12 30Z" fill="${color}" stroke="${light}" stroke-width="3"/><path d="M50 7 50 30 12 30ZM50 7 88 30H50ZM12 30l16 38 22-38Zm76 0L72 68 50 30ZM20 72l30 21-22-25Zm60 0L50 93l22-25Z" fill="${light}" opacity=".16"/><path d="m50 30 22 38H28Z" fill="${light}" opacity=".24"/><g fill="none" stroke="${light}" stroke-width="1.8" opacity=".85"><path d="M50 7v23M12 30h76M12 30l16 38-8 4m68-42L72 68l8 4M28 68l22 25 22-25"/></g><text x="50" y="58" text-anchor="middle" fill="${light}" font-size="${String(face).length > 2 ? 13 : 19}" font-family="Georgia" font-weight="700">${face}</text>`;

export const polyhedralDieArtwork = (sides: 4 | 12 | 20, color: string, light: string, face: string | number = sides): string => {
  if (sides === 4) return `<svg class="polyhedral-die" data-sides="4" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 10 88 82H12Z" fill="${color}" stroke="${light}" stroke-width="3"/><path d="M50 10 50 63M12 82l38-19 38 19" fill="none" stroke="${light}" stroke-width="2"/><text x="50" y="52" text-anchor="middle" fill="${light}" font-size="24" font-family="Georgia">4</text></svg>`;
  if (sides === 12) return `<svg class="polyhedral-die" data-sides="12" viewBox="0 0 100 100" aria-hidden="true"><path d="m50 8 35 26-13 43H28L15 34Z" fill="${color}" stroke="${light}" stroke-width="3"/><path d="m50 25 20 15-8 24H38l-8-24Z M50 8v17M15 34l15 6M28 77l10-13M72 77 62 64M85 34l-15 6" fill="none" stroke="${light}" stroke-width="2"/><text x="50" y="54" text-anchor="middle" fill="${light}" font-size="18" font-family="Georgia">12</text></svg>`;
  return `<svg class="polyhedral-die" data-sides="20" viewBox="0 0 100 100" aria-hidden="true">${d20Shape(face, color, light)}</svg>`;
};

export const numberCardArtwork = (rank: number, color: string): string =>
  `<svg class="number-card" viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(-7 50 50)"><rect x="25" y="10" width="50" height="80" rx="7" fill="#fff9e8" stroke="${color}" stroke-width="3"/><text x="34" y="34" fill="${color}" font-size="19" font-family="Georgia">${rank}</text><text x="50" y="68" text-anchor="middle" fill="${color}" font-size="43" font-family="Georgia">${rank}</text></g></svg>`;

export const weekdayArtwork = (color: string): string =>
  `<svg class="weekday-calendar" viewBox="0 0 100 100" aria-hidden="true" style="--art:${color}"><rect x="10" y="20" width="80" height="64" rx="7" fill="#fff9e8"/><path d="M10 38h80M29 13v15M71 13v15" stroke="var(--art)" stroke-width="6" stroke-linecap="round"/><g fill="var(--art)" font-size="11" font-family="system-ui" font-weight="700" text-anchor="middle"><text data-art-text="weekdayMonday" x="20" y="58">M</text><text data-art-text="weekdayTuesday" x="35" y="58">T</text><text data-art-text="weekdayWednesday" x="50" y="58">W</text><text data-art-text="weekdayThursday" x="65" y="58">T</text><text data-art-text="weekdayFriday" x="80" y="58">F</text></g><text data-art-text="weekdayWeekend" x="50" y="75" text-anchor="middle" fill="#8c9b9a" font-size="9" font-family="system-ui">S S</text></svg>`;

type PokerCard = readonly [rank: string, suit: "♠" | "♥" | "♦" | "♣"];

export const pokerArtwork = (cards: readonly PokerCard[], color: string): string => {
  const width = 17;
  const gap = 2;
  const totalWidth = cards.length * width + (cards.length - 1) * gap;
  const start = (100 - totalWidth) / 2;
  const cardArt = cards.map(([rank, suit], index) => {
    const x = start + index * (width + gap);
    const ink = suit === "♥" || suit === "♦" ? "#c84f58" : "#233746";
    return `<g transform="translate(${x} 23)"><rect width="${width}" height="49" rx="3" fill="#fffaf0" stroke="${color}" stroke-width="1.5"/><text x="${width / 2}" y="20" text-anchor="middle" fill="${ink}" font-size="9" font-family="Georgia">${rank}</text><text x="${width / 2}" y="38" text-anchor="middle" fill="${ink}" font-size="10" font-family="Georgia">${suit}</text></g>`;
  }).join("");
  return `<svg class="poker-hand" viewBox="0 0 100 100" aria-hidden="true">${cardArt}<path d="M24 82h52" stroke="${color}" stroke-width="5" stroke-linecap="round"/></svg>`;
};

export const cloverArtwork = (color: string): string => {
  const leaflet = '<path data-clover-leaf d="M50 52C42 45 31 44 27 35c-4-9 3-17 12-14 7 2 10 8 11 14 1-6 4-12 11-14 9-3 16 5 12 14-4 9-15 10-23 17Z"/>';
  return `<svg class="clover-art" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 51c2 17 8 27 21 37" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/><g fill="${color}" stroke="#bde8a7" stroke-width="1.5">${[0, 90, 180, 270].map(angle => `<g transform="rotate(${angle} 50 52)">${leaflet}</g>`).join("")}</g><circle cx="50" cy="52" r="5" fill="#bde8a7"/></svg>`;
};

export const rouletteArtwork = (winningPockets: number, color: string): string => {
  const wedges = Array.from({ length: 37 }, (_, index) => {
    const start = (-90 + index * 360 / 37) * Math.PI / 180;
    const end = (-90 + (index + 1) * 360 / 37) * Math.PI / 180;
    const startX = 45 + 31 * Math.cos(start);
    const startY = 45 + 31 * Math.sin(start);
    const endX = 45 + 31 * Math.cos(end);
    const endY = 45 + 31 * Math.sin(end);
    const fill = index === 0 ? "#29714f" : index % 2 === 0 ? "#202a31" : "#a33b46";
    return `<path d="M45 45L${startX.toFixed(2)} ${startY.toFixed(2)}A31 31 0 0 1 ${endX.toFixed(2)} ${endY.toFixed(2)}Z" fill="${fill}" stroke="#ead9aa" stroke-width=".45"/>`;
  }).join("");
  return `<svg class="roulette-art" data-winning-pockets="${winningPockets}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="45" cy="45" r="37" fill="#efe7cf" stroke="#ba9e62" stroke-width="3"/><g>${wedges}</g><circle cx="45" cy="45" r="17" fill="#d9b96b" stroke="#fff1c7" stroke-width="3"/><circle cx="64" cy="19" r="4" fill="#fff" stroke="#8da0a0" stroke-width="1.5"/><circle cx="74" cy="73" r="20" fill="${color}" stroke="#f7e9bd" stroke-width="4"/><circle cx="74" cy="73" r="13" fill="none" stroke="#f7e9bd" stroke-width="2" stroke-dasharray="3 3"/><text x="74" y="79" text-anchor="middle" fill="#fff" font-size="16" font-family="system-ui" font-weight="800">${winningPockets}</text></svg>`;
};

export const blackjackArtwork = (color: string): string =>
  `<svg class="blackjack-art" viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(-10 39 51)"><rect x="18" y="12" width="43" height="70" rx="6" fill="#fff9e8" stroke="${color}" stroke-width="3"/><text x="28" y="37" fill="#273746" font-size="22" font-family="Georgia">A</text><text x="39" y="66" text-anchor="middle" fill="#273746" font-size="23" font-family="Georgia">♠</text></g><g transform="rotate(9 61 52)"><rect x="41" y="17" width="43" height="70" rx="6" fill="#fff9e8" stroke="${color}" stroke-width="3"/><text x="51" y="42" fill="#c84f58" font-size="22" font-family="Georgia">K</text><text x="63" y="70" text-anchor="middle" fill="#c84f58" font-size="23" font-family="Georgia">♥</text></g></svg>`;

export const passwordArtwork = (label: string, kind: "guess" | "manager" | "words", color: string): string => {
  if (kind === "manager") {
    return `<svg class="password-art" data-kind="manager" viewBox="0 0 100 100" aria-hidden="true" style="--art:${color}"><rect x="13" y="24" width="74" height="58" rx="10" fill="var(--art)"/><path d="M35 24v-5c0-20 30-20 30 0v5" fill="none" stroke="#dcebe6" stroke-width="7"/><text x="50" y="58" text-anchor="middle" fill="#fff9e8" font-size="18" font-family="monospace" font-weight="700">${label}</text><path d="m72 52 2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5Z" fill="#f6cf70"/></svg>`;
  }
  if (kind === "words") {
    const rows = [31, 40, 49, 58, 67, 76].map((y, index) => `<path d="M31 ${y}h${index % 2 === 0 ? 42 : 34}"/>`).join("");
    return `<svg class="password-art" data-kind="words" viewBox="0 0 100 100" aria-hidden="true" style="--art:${color}"><rect x="18" y="16" width="70" height="72" rx="8" fill="#f7f2e4" stroke="var(--art)" stroke-width="5"/><g fill="none" stroke="var(--art)" stroke-width="4" stroke-linecap="round">${rows}</g><rect x="5" y="56" width="31" height="31" rx="6" fill="var(--art)"/><g fill="#fff9e8"><circle cx="14" cy="65" r="2.5"/><circle cx="27" cy="65" r="2.5"/><circle cx="20.5" cy="71.5" r="2.5"/><circle cx="14" cy="78" r="2.5"/><circle cx="27" cy="78" r="2.5"/></g><text data-art-text="sixWords" x="52" y="27" text-anchor="middle" fill="var(--art)" font-size="10" font-family="monospace" font-weight="700">${label} WORDS</text></svg>`;
  }
  const keys = [18, 32, 46, 60, 74].map(x => `<rect x="${x}" y="34" width="9" height="8" rx="2"/>`).join("");
  const fontSize = label.length > 6 ? 11 : 13;
  return `<svg class="password-art" data-kind="guess" viewBox="0 0 100 100" aria-hidden="true" style="--art:${color}"><rect x="8" y="24" width="84" height="56" rx="9" fill="var(--art)"/><g fill="#dcebe6">${keys}<rect x="18" y="49" width="64" height="21" rx="4"/></g><text x="50" y="64" text-anchor="middle" fill="#18303a" font-size="${fontSize}" font-family="monospace" font-weight="700">${label}</text></svg>`;
};

export const wordSelectionArtwork = (color: string): string => {
  const dice = [1, 2, 3, 4, 5].map((value, index) => {
    const x = 10 + index * 17;
    return `<g transform="translate(${x} 66)"><rect width="14" height="14" rx="2.5" fill="${color}"/><text x="7" y="10.5" text-anchor="middle" fill="#fff9e8" font-size="8" font-family="system-ui" font-weight="700">${value}</text></g>`;
  }).join("");
  return `<svg class="word-selection-art" viewBox="0 0 100 100" aria-hidden="true"><rect x="22" y="10" width="62" height="50" rx="6" fill="#f7f2e4" stroke="${color}" stroke-width="4"/><g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"><path d="M32 25h40M32 35h34M32 45h38"/></g>${dice}<text data-art-text="wordList" x="50" y="93" text-anchor="middle" fill="#dcebe6" font-size="10" font-family="system-ui">7,776 words</text></svg>`;
};

export const cryptographicKeyArtwork = (bits: 128 | 256, color: string): string =>
  `<svg class="crypto-key-art" data-bits="${bits}" viewBox="0 0 100 100" aria-hidden="true" style="--art:${color}"><circle cx="31" cy="49" r="20" fill="none" stroke="var(--art)" stroke-width="10"/><path d="M49 49h41M71 49v13M82 49v9" fill="none" stroke="var(--art)" stroke-width="10" stroke-linecap="round"/><circle cx="31" cy="49" r="5" fill="#f6cf70"/><rect x="25" y="76" width="50" height="17" rx="8.5" fill="#172f3d"/><text x="50" y="88" text-anchor="middle" fill="#dcebe6" font-size="12" font-family="monospace" font-weight="700">AES-${bits}</text></svg>`;

type LotteryCountry = "france" | "united-kingdom" | "united-states" | "euromillions";
type LotteryEvent = "jackpot" | "prize" | "loss";

const flagArtwork: Record<LotteryCountry, string> = {
  france: '<g class="ticket-flag"><rect x="18" y="26" width="30" height="19" rx="2" fill="#fff"/><path d="M18 26h10v19H18Z" fill="#2753a1"/><path d="M38 26h10v19H38Z" fill="#e34f55"/></g>',
  "united-kingdom": '<g class="ticket-flag"><rect x="18" y="26" width="30" height="19" rx="2" fill="#254b91"/><path d="m18 27 30 17m0-17L18 44" stroke="#fff" stroke-width="5"/><path d="m18 27 30 17m0-17L18 44" stroke="#e34f55" stroke-width="2"/><path d="M33 26v19M18 35.5h30" stroke="#fff" stroke-width="6"/><path d="M33 26v19M18 35.5h30" stroke="#d83d4a" stroke-width="3"/></g>',
  "united-states": '<g class="ticket-flag"><rect x="18" y="26" width="30" height="19" rx="2" fill="#fff"/><path d="M18 26h30v3H18Zm0 6h30v3H18Zm0 6h30v3H18Zm0 6h30v1H18Z" fill="#d84b54"/><path d="M18 26h14v10H18Z" fill="#315a9f"/><g fill="#fff"><circle cx="21" cy="29" r="1"/><circle cx="25" cy="32" r="1"/><circle cx="29" cy="29" r="1"/></g></g>',
  euromillions: '<g class="ticket-flag european"><rect x="18" y="26" width="30" height="19" rx="2" fill="#244ca0"/><g fill="#f2ce45"><circle cx="33" cy="29" r="1"/><circle cx="36.25" cy="29.9" r="1"/><circle cx="38.6" cy="32.25" r="1"/><circle cx="39.5" cy="35.5" r="1"/><circle cx="38.6" cy="38.75" r="1"/><circle cx="36.25" cy="41.1" r="1"/><circle cx="33" cy="42" r="1"/><circle cx="29.75" cy="41.1" r="1"/><circle cx="27.4" cy="38.75" r="1"/><circle cx="26.5" cy="35.5" r="1"/><circle cx="27.4" cy="32.25" r="1"/><circle cx="29.75" cy="29.9" r="1"/></g></g>',
};

const thumb = '<g class="ticket-event" fill="#58ae83"><path d="M66 44h5l5-13c2-5 8-3 7 2l-2 9h6c5 0 7 4 5 8l-6 14c-1 3-4 5-8 5H66Z"/><rect x="58" y="44" width="7" height="25" rx="2"/></g>';
const eventArtwork: Record<LotteryEvent, string> = {
  jackpot: '<text class="ticket-jackpot" x="50" y="68" text-anchor="middle" fill="#a66d13" font-size="20" font-family="Georgia, serif" font-weight="700">Jackpot!</text>',
  prize: thumb,
  loss: `<g transform="rotate(180 75 50)">${thumb.replaceAll("#58ae83", "#d56f68")}</g>`,
};

export const lotteryArtwork = (country: LotteryCountry, event: LotteryEvent, color: string, light: string): string =>
  `<svg class="lottery-ticket" data-country="${country}" data-event="${event}" viewBox="0 0 100 100" aria-hidden="true" style="--art:${color};--light:${light}"><path d="M10 20h80v14a8 8 0 0 0 0 16v14a8 8 0 0 0 0 16H10V66a8 8 0 0 0 0-16V36a8 8 0 0 0 0-16Z" fill="var(--light)" stroke="var(--art)" stroke-width="4"/>${event === "jackpot" ? '<path d="M18 50h64" stroke="var(--art)" stroke-width="2" stroke-dasharray="4 4" opacity=".45"/>' : '<path d="M52 24v52" stroke="var(--art)" stroke-width="2" stroke-dasharray="4 4" opacity=".45"/>'}${flagArtwork[country]}${eventArtwork[event]}${event === "jackpot" ? "" : '<path d="M18 55h27M18 62h21M18 69h24" stroke="var(--art)" stroke-width="3" stroke-linecap="round"/>'}</svg>`;

export const atomArtwork = (label: string, color: string, light: string, labelColor = "#18303a"): string =>
  `<svg viewBox="0 0 100 100" aria-hidden="true" style="--art:${color};--light:${light}"><g fill="none" stroke="var(--art)" stroke-width="4"><ellipse cx="50" cy="50" rx="39" ry="15"/><ellipse cx="50" cy="50" rx="39" ry="15" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="39" ry="15" transform="rotate(120 50 50)"/></g><circle cx="50" cy="50" r="16" fill="var(--light)"/><text x="50" y="55" text-anchor="middle" fill="${labelColor}" font-size="14" font-family="system-ui">${label}</text></svg>`;

export const moleculeArtwork = (formula: string, color: string, light: string, atoms = 2): string => {
  const circles = atoms === 3
    ? '<circle cx="27" cy="50" r="20" fill="var(--light)"/><circle cx="50" cy="50" r="23" fill="var(--art)"/><circle cx="73" cy="50" r="20" fill="var(--light)"/>'
    : '<circle cx="39" cy="50" r="24" fill="var(--art)"/><circle cx="65" cy="50" r="24" fill="var(--light)"/>';
  return `<svg viewBox="0 0 100 100" aria-hidden="true" style="--art:${color};--light:${light}">${circles}<text x="50" y="94" text-anchor="middle" fill="#e9f4f0" font-size="15" font-family="system-ui">${formula}</text></svg>`;
};

export const solarSystemArtwork = (kind: "terrestrial" | "moon" | "sun-mass", color: string): string => {
  if (kind === "terrestrial") return `<svg class="solar-system-art" data-kind="terrestrial" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="10" fill="#f4c65d"/><g fill="none" stroke="#a9c5d0" stroke-width="1.5"><circle cx="50" cy="50" r="18"/><circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="38"/></g><g fill="${color}"><circle cx="68" cy="50" r="4"/><circle cx="31" cy="30" r="5"/><circle cx="24" cy="72" r="5"/><circle cx="83" cy="69" r="4"/></g></svg>`;
  if (kind === "moon") return `<svg class="solar-system-art" data-kind="moon" viewBox="0 0 100 100" aria-hidden="true"><circle cx="45" cy="53" r="28" fill="${color}"/><path d="M18 53a27 27 0 0 0 54 0" fill="none" stroke="#8bd2de" stroke-width="3"/><circle cx="77" cy="31" r="9" fill="#e7e3d1"/><path d="M67 35c-17 12-18 31-5 43" fill="none" stroke="#a9c5d0" stroke-width="2"/></svg>`;
  return `<svg class="solar-system-art" data-kind="sun-mass" viewBox="0 0 100 100" aria-hidden="true"><g stroke="#f4c65d" stroke-width="4" stroke-linecap="round"><path d="M50 5v11M50 84v11M5 50h11M84 50h11M18 18l8 8M74 74l8 8M82 18l-8 8M26 74l-8 8"/></g><circle cx="50" cy="50" r="31" fill="${color}"/><circle cx="73" cy="68" r="3" fill="#8cb6c7"/><circle cx="82" cy="70" r="1.8" fill="#9b8cad"/></svg>`;
};

export const moonStayArtwork = (days: 15 | 28, color: string): string =>
  `<svg class="moon-stay-art" data-days="${days}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="36" cy="38" r="24" fill="#eee8d5"/><path d="M27 23c15 2 23 15 18 29 11-5 17-18 12-29-6-13-22-18-35-11 2 4 3 7 5 11Z" fill="${color}" opacity=".38"/><rect x="42" y="45" width="43" height="38" rx="5" fill="#fff9e8" stroke="${color}" stroke-width="4"/><path d="M42 57h43M53 40v10M74 40v10" stroke="${color}" stroke-width="4" stroke-linecap="round"/><text x="64" y="77" text-anchor="middle" fill="${color}" font-size="19" font-family="Georgia">${days}</text></svg>`;

const solarEclipseScene = (moonColor: string): string => `<g class="solar-eclipse-discs"><g stroke="#f5c74e" stroke-width="4" stroke-linecap="round"><path d="M45 8v9M45 79v9M5 48h9M76 48h9M17 20l7 7M66 69l7 7M73 20l-7 7M24 69l-7 7"/></g><circle cx="45" cy="48" r="27" fill="#f5c74e"/><circle cx="58" cy="42" r="26" fill="${moonColor}" stroke="#53616a" stroke-width="2"/><path d="M43 22c8-5 17-6 25-2" fill="none" stroke="#7a8991" stroke-width="2" stroke-linecap="round" opacity=".65"/></g>`;

export const eclipseArtwork = (kind: "solar" | "lunar", color: string): string => kind === "solar"
  ? `<svg class="eclipse-art" data-kind="solar" viewBox="0 0 100 100" aria-hidden="true">${solarEclipseScene(color)}</svg>`
  : `<svg class="eclipse-art" data-kind="lunar" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="34" fill="#b9c5cc"/><path d="M22 30c36-10 57 11 52 43-9 9-22 14-35 10-24-7-31-36-17-53Z" fill="${color}"/><circle cx="40" cy="42" r="5" fill="#d99a75" opacity=".35"/><circle cx="59" cy="63" r="7" fill="#d99a75" opacity=".28"/></svg>`;

export const scrabbleArtwork = (kind: "consonant" | "vowel-rack", color: string): string => {
  const tile = (x: number, y: number, letter: string) => `<g transform="translate(${x} ${y})"><rect width="25" height="29" rx="3" fill="#f3d8a1" stroke="${color}" stroke-width="2"/><text x="12.5" y="21" text-anchor="middle" fill="#493b2a" font-size="18" font-family="Georgia" font-weight="700">${letter}</text></g>`;
  if (kind === "consonant") return `<svg class="scrabble-art" data-kind="consonant" viewBox="0 0 100 100" aria-hidden="true"><path d="M19 30c2-15 60-15 62 0l8 55H11Z" fill="${color}"/><path d="M28 31c7 8 37 8 44 0" fill="none" stroke="#ead9bd" stroke-width="4"/>${tile(37, 43, "R")}</svg>`;
  return `<svg class="scrabble-art" data-kind="vowel-rack" viewBox="0 0 100 100" aria-hidden="true"><path d="M8 79h84" stroke="${color}" stroke-width="8" stroke-linecap="round"/>${tile(8, 42, "A")}${tile(33, 42, "E")}${tile(58, 42, "Y")}</svg>`;
};

export const glacierArtwork = (color: string): string =>
  `<svg class="glacier-art" viewBox="0 0 100 100" aria-hidden="true"><path d="M12 70 34 31l12 18 16-34 27 55Z" fill="#d9f2f2" stroke="${color}" stroke-width="3" stroke-linejoin="round"/><path d="M8 76c11-8 20 8 31 0s20 8 31 0 15 5 24 0" fill="none" stroke="#65b7cd" stroke-width="6" stroke-linecap="round"/><path d="m62 15-7 47 19 8" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/></svg>`;

export const redDwarfArtwork = (color: string): string =>
  `<svg class="red-dwarf-art" viewBox="0 0 100 100" aria-hidden="true"><g stroke="${color}" stroke-width="4" stroke-linecap="round"><path d="M50 13v13M50 74v13M13 50h13M74 50h13M24 24l9 9M67 67l9 9M76 24l-9 9M33 67l-9 9"/></g><circle cx="50" cy="50" r="23" fill="${color}"/><circle cx="43" cy="43" r="7" fill="#ffc19b" opacity=".45"/></svg>`;

export const doubleYolkArtwork = (color: string): string =>
  `<svg class="double-yolk-art" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 10c17 0 34 30 34 51 0 19-15 29-34 29S16 80 16 61c0-21 17-51 34-51Z" fill="#fff9e8" stroke="${color}" stroke-width="4"/><circle cx="39" cy="59" r="13" fill="#f3ba35"/><circle cx="63" cy="57" r="13" fill="#eaa72c"/></svg>`;

export const weatherArtwork = (kind: "hilo-rain" | "brest-rain" | "phoenix-sun", color: string): string => {
  if (kind === "hilo-rain") return `<svg class="weather-art" data-kind="hilo-rain" viewBox="0 0 100 100" aria-hidden="true"><path d="M22 49c-14-15 4-32 18-24 7-18 37-12 36 8 18 0 19 27 1 28H26c-8 0-12-6-12-12 0-5 3-9 8-10" fill="${color}"/><g stroke="#76c4df" stroke-width="5" stroke-linecap="round"><path d="m31 68-5 12M52 68l-5 12M73 68l-5 12"/></g><path d="M17 91c14-11 26-10 38 0 11-9 21-9 31 0" fill="none" stroke="#5e9b69" stroke-width="5" stroke-linecap="round"/></svg>`;
  if (kind === "brest-rain") return `<svg class="weather-art" data-kind="brest-rain" viewBox="0 0 100 100" aria-hidden="true"><path d="M18 43c-10-12 3-26 15-20 6-15 31-10 31 7 14 0 16 22 1 23H21c-7 0-10-5-10-10 0-4 3-8 7-9" fill="${color}"/><g stroke="#73bcd6" stroke-width="4" stroke-linecap="round"><path d="m25 60-5 11M43 60l-5 11M61 60l-5 11"/></g><g transform="translate(57 58)"><rect width="36" height="28" rx="2" fill="#fff" stroke="#222" stroke-width="2"/><path d="M0 4h36M0 12h36M0 20h36" stroke="#222" stroke-width="4"/><rect width="13" height="16" fill="#fff" stroke="#222" stroke-width="2"/><path d="m3 4 7 8M10 4l-7 8" stroke="#222" stroke-width="1.5"/></g></svg>`;
  return `<svg class="weather-art" data-kind="phoenix-sun" viewBox="0 0 100 100" aria-hidden="true"><g stroke="#f3bd45" stroke-width="4" stroke-linecap="round"><path d="M70 7v10M70 51v10M42 34h10M88 34h8M50 14l7 7M83 47l7 7M90 14l-7 7"/></g><circle cx="70" cy="34" r="16" fill="#f3bd45"/><path d="M28 87V40c0-10 13-10 13 0v12h8V39c0-7 10-7 10 0v21c0 7-5 11-12 11h-6v16" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};

export const localEclipseArtwork = (color: string): string =>
  `<svg class="eclipse-art" data-kind="solar-local" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(-5 -7) scale(.78)">${solarEclipseScene(color)}</g><circle cx="73" cy="72" r="20" fill="#4389a6" stroke="#dcefe8" stroke-width="3"/><path d="M58 70c8-10 16-7 28-12M62 82c8-4 16-2 24 3" fill="none" stroke="#73b873" stroke-width="6" stroke-linecap="round"/><path d="M73 50c-8 0-14 6-14 14 0 11 14 25 14 25s14-14 14-25c0-8-6-14-14-14Zm0 8a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" fill="#d85d57" stroke="#fff" stroke-width="1.5"/></svg>`;

export const sportArtwork = (kind: "basketball" | "tennis" | "football", color: string): string => {
  if (kind === "basketball") return `<svg class="sport-art" data-kind="basketball" viewBox="0 0 100 100" aria-hidden="true"><rect x="66" y="15" width="8" height="72" rx="3" fill="#d8e0df"/><rect x="49" y="18" width="28" height="28" rx="3" fill="#eef2eb" stroke="${color}" stroke-width="3"/><ellipse cx="50" cy="52" rx="22" ry="7" fill="none" stroke="#d95f42" stroke-width="5"/><path d="M34 55 40 78M45 58l2 22M56 58l-2 22M66 55 60 78M39 66h22" fill="none" stroke="#d8e0df" stroke-width="2"/><circle cx="26" cy="40" r="16" fill="${color}"/><path d="M10 40h32M26 24c-8 10-8 22 0 32M26 24c8 10 8 22 0 32" fill="none" stroke="#623b28" stroke-width="2"/></svg>`;
  if (kind === "tennis") return `<svg class="sport-art" data-kind="tennis" viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(-35 45 46)"><ellipse cx="43" cy="37" rx="23" ry="30" fill="none" stroke="${color}" stroke-width="7"/><g stroke="${color}" stroke-width="1.5" opacity=".7"><path d="M27 21h32M23 31h40M21 41h44M25 51h36M33 12v50M43 7v60M53 12v50"/></g><path d="M43 67v25" stroke="${color}" stroke-width="8" stroke-linecap="round"/></g><circle cx="77" cy="28" r="10" fill="#d8e94f"/><path d="M70 22c7 4 10 8 13 14" fill="none" stroke="#fff" stroke-width="2"/></svg>`;
  return `<svg class="sport-art" data-kind="football" viewBox="0 0 100 100" aria-hidden="true"><path d="M12 77V23h76v54M12 43h76M34 23v54M66 23v54" fill="none" stroke="#dce8e4" stroke-width="4" opacity=".8"/><circle cx="49" cy="61" r="24" fill="#f8f6e9" stroke="${color}" stroke-width="3"/><path d="m49 45 10 8-4 12H43l-4-12Zm-10 8-11-4m15 16-7 10m19-10 7 10m-3-22 11-4M49 45V35" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round"/></svg>`;
};

type PostalArtText = "postalTwoDays" | "postalThreeDays" | "postalFiveDays";

export const postalArtwork = (kind: "letter" | "parcel", artText: PostalArtText, color: string): string => {
  const flag = '<g transform="translate(70 13)"><rect width="22" height="15" rx="2" fill="#fff"/><path d="M0 0h7.4v15H0Z" fill="#2854a1"/><path d="M14.7 0H22v15h-7.3Z" fill="#dc4b55"/></g>';
  const item = kind === "letter"
    ? `<rect x="10" y="24" width="72" height="48" rx="6" fill="#fff9e8" stroke="${color}" stroke-width="4"/><path d="m12 28 34 26 34-26" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round"/>`
    : `<path d="M15 31 50 14l35 17v45L50 91 15 76Z" fill="${color}" stroke="#f3e8ce" stroke-width="3" stroke-linejoin="round"/><path d="m15 31 35 18 35-18M50 49v42M32 22l36 18" fill="none" stroke="#f3e8ce" stroke-width="3" opacity=".8"/>`;
  return `<svg class="postal-art" data-kind="${kind}" viewBox="0 0 100 100" aria-hidden="true">${item}${flag}<rect x="23" y="70" width="54" height="19" rx="9.5" fill="#173241"/><text data-art-text="${artText}" x="50" y="83" text-anchor="middle" fill="#fff9e8" font-size="11" font-family="system-ui" font-weight="700"></text></svg>`;
};

export const electricityArtwork = (region: "us" | "fr", color: string): string => {
  const flag = region === "fr"
    ? '<g transform="translate(65 16)"><rect width="27" height="18" rx="2" fill="#fff"/><path d="M0 0h9v18H0Z" fill="#2854a1"/><path d="M18 0h9v18h-9Z" fill="#dc4b55"/></g>'
    : '<g transform="translate(65 16)"><rect width="27" height="18" rx="2" fill="#fff"/><path d="M0 0h27v3H0Zm0 6h27v3H0Zm0 6h27v3H0Z" fill="#d64b55"/><rect width="12" height="9" fill="#315b9f"/></g>';
  return `<svg class="electricity-art" data-region="${region}" viewBox="0 0 100 100" aria-hidden="true"><path d="M32 13c-18 7-24 31-10 45 5 5 9 9 10 17h31c1-8 5-12 10-17 14-14 8-38-10-45-9-4-22-4-31 0Z" fill="#f4c857" stroke="${color}" stroke-width="4"/><path d="M35 76h25M38 84h19" stroke="#dce8e4" stroke-width="6" stroke-linecap="round"/><path d="m47 26-9 20h12l-6 17 18-25H51l7-12Z" fill="${color}"/>${flag}</svg>`;
};

export const gmailArtwork = (): string =>
  '<svg class="gmail-art" viewBox="0 0 100 100" aria-hidden="true"><rect x="10" y="22" width="80" height="58" rx="8" fill="#fff"/><path d="M14 76V29l36 27 36-27v47" fill="none" stroke="#d95048" stroke-width="10" stroke-linejoin="round"/><path d="m14 29 36 27 36-27" fill="none" stroke="#b33d36" stroke-width="4"/></svg>';

export const stripeArtwork = (): string =>
  '<svg class="stripe-art" viewBox="0 0 100 100" aria-hidden="true"><rect x="9" y="20" width="82" height="58" rx="10" fill="#635bff"/><rect x="18" y="30" width="64" height="9" rx="3" fill="#c9c6ff"/><rect x="18" y="51" width="26" height="16" rx="4" fill="#fff"/><circle cx="71" cy="59" r="8" fill="#7ee2c8"/><text x="50" y="94" text-anchor="middle" fill="#dce8e4" font-size="13" font-family="system-ui" font-weight="700">STRIPE</text></svg>';

export const pokemonCardArtwork = (rarity: "double" | "illustration" | "special"): string => {
  const border = rarity === "special" ? "#d6a53a" : rarity === "illustration" ? "#5d94ba" : "#9f64ae";
  const cardFace = rarity === "special"
    ? '<path d="M41 28h38v48H41Z" fill="#44375f"/><circle cx="60" cy="48" r="12" fill="#e8ad48"/><path d="m45 70 11-13 8 6 11-15" fill="none" stroke="#f8e1a0" stroke-width="4"/><path d="m47 34 4 3m17-4 4 3m-25 25 4 3m17-4 4 3" stroke="#fff6c9" stroke-width="2"/>'
    : rarity === "illustration"
      ? '<path d="M41 28h38v48H41Z" fill="#94c9dc"/><circle cx="67" cy="40" r="7" fill="#f3c557"/><path d="m42 63 12-13 9 8 15-18v35H42Z" fill="#4d8d70"/><path d="M45 69h29" stroke="#d9f0df" stroke-width="3"/>'
      : '<path d="M41 28h38v48H41Z" fill="#f4f0df"/><circle cx="60" cy="46" r="12" fill="#d95656"/><path d="M48 46h24" stroke="#243746" stroke-width="3"/><circle cx="60" cy="46" r="4" fill="#fff" stroke="#243746" stroke-width="2"/><text x="60" y="70" text-anchor="middle" fill="#654678" font-size="11" font-family="Georgia" font-weight="700">ex</text>';
  return `<svg class="pokemon-card-art" data-rarity="${rarity}" viewBox="0 0 100 100" aria-hidden="true"><path d="M15 15h43l9 70H24Z" fill="#425b91" stroke="#dce8e4" stroke-width="3" stroke-linejoin="round"/><path d="M20 24h37M23 70h39" stroke="#e9d359" stroke-width="4"/><circle cx="39" cy="47" r="13" fill="#f7f4e9" stroke="#172936" stroke-width="3"/><path d="M26 47h26" stroke="#172936" stroke-width="3"/><path d="M39 34a13 13 0 0 1 13 13H26a13 13 0 0 1 13-13Z" fill="#d95656"/><circle cx="39" cy="47" r="4" fill="#fff" stroke="#172936" stroke-width="2"/><g transform="rotate(7 60 52)"><rect x="37" y="23" width="46" height="58" rx="4" fill="#fff" stroke="${border}" stroke-width="5"/>${cardFace}</g></svg>`;
};

export const equipmentArtwork = (kind: "television" | "smartphone" | "mobile"): string => {
  const flag = '<g transform="translate(69 10)"><path d="M0 0h24v16H0Z" fill="#fff"/><path d="M0 0h8v16H0Z" fill="#3158a3"/><path d="M16 0h8v16h-8Z" fill="#dc4e58"/></g>';
  const device = kind === "television"
    ? '<rect x="12" y="23" width="73" height="49" rx="6" fill="#243746" stroke="#dce8e4" stroke-width="4"/><rect x="20" y="31" width="57" height="33" rx="2" fill="#6fb0c4"/><path d="m39 73-7 13m29-13 7 13M27 87h46" stroke="#dce8e4" stroke-width="5" stroke-linecap="round"/>'
    : kind === "smartphone"
      ? '<rect x="25" y="11" width="48" height="80" rx="9" fill="#263b4b" stroke="#dce8e4" stroke-width="4"/><rect x="31" y="23" width="36" height="53" rx="3" fill="#70b3c5"/><circle cx="49" cy="83" r="3" fill="#dce8e4"/><path d="M40 17h18" stroke="#dce8e4" stroke-width="3" stroke-linecap="round"/>'
      : '<rect x="25" y="9" width="50" height="83" rx="8" fill="#31556c" stroke="#dce8e4" stroke-width="4"/><rect x="32" y="19" width="36" height="25" rx="3" fill="#a8d0c4"/><g fill="#e8ede7"><circle cx="37" cy="55" r="4"/><circle cx="50" cy="55" r="4"/><circle cx="63" cy="55" r="4"/><circle cx="37" cy="68" r="4"/><circle cx="50" cy="68" r="4"/><circle cx="63" cy="68" r="4"/><circle cx="37" cy="81" r="4"/><circle cx="50" cy="81" r="4"/><circle cx="63" cy="81" r="4"/></g>';
  return `<svg class="equipment-art" data-kind="${kind}" viewBox="0 0 100 100" aria-hidden="true">${device}${flag}</svg>`;
};

export const flightArtwork = (kind: "safe" | "accident", color: string): string => {
  const warning = kind === "accident"
    ? '<g transform="translate(67 61)"><path d="m14 0 14 25H0Z" fill="#edb84d" stroke="#fff2c4" stroke-width="2" stroke-linejoin="round"/><path d="M14 7v9m0 4v1" stroke="#3e3428" stroke-width="3" stroke-linecap="round"/></g>'
    : '<path d="m70 68 7 7 14-18" fill="none" stroke="#70c79e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
  return `<svg class="flight-art" data-kind="${kind}" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 5c5 0 7 8 7 19v13l31 19v9L57 55v18l12 9v8L50 84 31 90v-8l12-9V55L12 65v-9l31-19V24c0-11 2-19 7-19Z" fill="${color}" stroke="#dce8e4" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 12v63" stroke="#b9d5dd" stroke-width="2" opacity=".7"/>${warning}</svg>`;
};

export const carArtwork = (kind: "road-safe" | "collision" | "breakdown" | "no-breakdown", color: string): string => {
  const flag = '<g transform="translate(70 11)"><rect width="24" height="16" rx="2" fill="#234987"/><path d="M0 2 21 16h3v-2L3 0H0Zm24 0L3 16H0v-2L21 0h3Z" fill="#fff"/><path d="M0 3 19 16h4L4 0H0Zm24 3L9 16H4L24 2Z" fill="#c94c57"/><path d="M10 0h5v16h-5zM0 6h24v4H0z" fill="#fff"/><path d="M11 0h3v16h-3zM0 7h24v2H0z" fill="#c94c57"/></g>';
  const road = '<path d="M8 83h84" stroke="#71818a" stroke-width="6" stroke-linecap="round"/><path d="M18 83h16m14 0h16m14 0h8" stroke="#d7cf9b" stroke-width="2" stroke-linecap="round"/>';
  const raisedHood = kind === "breakdown" ? '<path d="m17 57 12-20 21 18" fill="#415f70" stroke="#dce8e4" stroke-width="3" stroke-linejoin="round"/>' : "";
  const car = `<path d="M17 59h10l11-17h29l12 17h7c5 0 8 4 8 9v8H7v-9c0-5 4-8 10-8Z" fill="${color}" stroke="#dce8e4" stroke-width="3" stroke-linejoin="round"/><path d="m40 45-8 14h40l-8-14Z" fill="#89b8c7" opacity=".8"/><circle cx="27" cy="76" r="9" fill="#25323a" stroke="#dce8e4" stroke-width="3"/><circle cx="75" cy="76" r="9" fill="#25323a" stroke="#dce8e4" stroke-width="3"/>${raisedHood}`;
  const marker = kind === "collision"
    ? '<g transform="translate(3 7)"><path d="m15 0 15 27H0Z" fill="#edb84d" stroke="#fff2c4" stroke-width="2" stroke-linejoin="round"/><path d="M15 8v9m0 4v1" stroke="#3e3428" stroke-width="3" stroke-linecap="round"/></g>'
    : kind === "breakdown"
      ? '<g transform="translate(64 8) rotate(-38 13 13)"><path d="M5 2a9 9 0 0 0 8 12L25 26l5-5-12-12A9 9 0 0 0 6 1l6 6-5 5Z" fill="#e2b85b" stroke="#fff0bd" stroke-width="2" stroke-linejoin="round"/></g>'
      : '<path d="m70 31 7 7 14-18" fill="none" stroke="#70c79e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
  return `<svg class="car-art" data-kind="${kind}" viewBox="0 0 100 100" aria-hidden="true">${road}${car}${marker}${flag}</svg>`;
};

export const covidTestArtwork = (result: "prior" | "positive" | "negative", color: string): string => {
  if (result === "prior") return `<svg class="covid-test-art" data-result="prior" viewBox="0 0 100 100" aria-hidden="true"><circle cx="47" cy="31" r="15" fill="${color}"/><path d="M20 86c2-25 12-38 27-38s25 13 27 38" fill="${color}"/><g fill="#d56a68" stroke="#ffd9d5" stroke-width="1.5"><circle cx="78" cy="27" r="10"/><path d="M78 12v6m0 18v6M63 27h6m18 0h6m-4-11-5 5m-12 12-5 5m22 0-5-5M72 21l-5-5"/></g><text x="79" y="31" text-anchor="middle" fill="#fff" font-size="10" font-family="system-ui" font-weight="800">?</text></svg>`;
  const testLine = result === "positive" ? '<rect x="60" y="39" width="5" height="25" rx="2" fill="#d34f62"/>' : "";
  return `<svg class="covid-test-art" data-result="${result}" viewBox="0 0 100 100" aria-hidden="true"><rect x="13" y="25" width="74" height="51" rx="9" fill="#f4f1e8" stroke="${color}" stroke-width="4"/><circle cx="29" cy="50" r="9" fill="#d7ddd8" stroke="#80928d" stroke-width="2"/><rect x="48" y="34" width="27" height="33" rx="3" fill="#fff" stroke="#b9c3bf" stroke-width="2"/><rect x="68" y="39" width="5" height="25" rx="2" fill="#546f78"/>${testLine}<text x="62" y="87" text-anchor="middle" fill="${color}" font-size="13" font-family="system-ui" font-weight="800">${result === "positive" ? "+" : "−"}</text></svg>`;
};

export const d20AdvantageArtwork = (color: string, light: string): string =>
  `<svg class="d20-advantage-art" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(1 20) scale(.7)">${d20Shape(2, color, light)}</g><g transform="translate(31 -3) scale(.78)">${d20Shape(20, color, light)}</g><path d="m67 78 8 8 16-20" fill="none" stroke="#65c697" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const dnaCopyArtwork = (kind: "correct" | "mutation", color: string): string => {
  const marker = kind === "mutation"
    ? '<circle cx="50" cy="50" r="10" fill="#d95d68" stroke="#ffe1df" stroke-width="3"/><text x="50" y="55" text-anchor="middle" fill="#fff" font-size="14" font-family="system-ui" font-weight="800">G</text>'
    : '<circle cx="50" cy="50" r="9" fill="#f3c655" stroke="#fff4c7" stroke-width="3"/><path d="m46 50 3 3 6-7" fill="none" stroke="#234b43" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
  return `<svg class="dna-copy-art" data-kind="${kind}" viewBox="0 0 100 100" aria-hidden="true"><path d="M27 7c47 19 47 67 0 86" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/><path d="M73 7C26 26 26 74 73 93" fill="none" stroke="#d66d76" stroke-width="7" stroke-linecap="round"/><g stroke="#dce8e4" stroke-width="3.5" stroke-linecap="round"><path d="m35 16 30 10M28 31l44 13M27 56l45 13M35 75l30 10"/></g>${marker}</svg>`;
};

export const enigmaArtwork = (model: "I" | "M3" | "M4", unknownRings = false, survivingOrders?: 20): string => {
  const rotorCount = model === "M4" ? 4 : 3;
  const rotorStart = rotorCount === 4 ? 27 : 32;
  const rotors = Array.from({ length: rotorCount }, (_, index) => {
    const x = rotorStart + index * 15;
    const unknown = unknownRings && index > 0;
    return `<g transform="translate(${x} 25)"><rect width="12" height="25" rx="2" fill="#d6c6a5" stroke="#312d28" stroke-width="2"/><circle cx="6" cy="12.5" r="4" fill="#5d665e"/><text x="6" y="16" text-anchor="middle" fill="#f3ead8" font-size="9" font-family="system-ui" font-weight="700">${unknown ? "?" : index + 1}</text></g>`;
  }).join("");
  const keys = [[25, 62], [38, 58], [51, 62], [64, 58], [77, 62], [31, 74], [45, 70], [59, 74], [72, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join("");
  const orderBadge = survivingOrders
    ? `<g transform="translate(71 7)"><rect width="22" height="17" rx="8.5" fill="#d9aa55" stroke="#fff0c8" stroke-width="1.5"/><text x="11" y="12" text-anchor="middle" fill="#20251f" font-size="10" font-family="system-ui" font-weight="800">${survivingOrders}</text></g>`
    : "";
  return `<svg class="enigma-art" data-model="${model}" viewBox="0 0 100 100" aria-hidden="true"><path d="M13 20h74l7 70H6Z" fill="#44443d" stroke="#b39361" stroke-width="3" stroke-linejoin="round"/><rect x="19" y="17" width="62" height="39" rx="3" fill="#232724" stroke="#b39361" stroke-width="2"/>${rotors}<g fill="#ddd2b8" stroke="#181b19" stroke-width="1.5">${keys}</g><path d="M18 83h64" stroke="#b39361" stroke-width="3" stroke-dasharray="3 4"/><text x="50" y="96" text-anchor="middle" fill="#e4dbc9" font-size="10" font-family="system-ui" font-weight="700">ENIGMA ${model}</text>${orderBadge}</svg>`;
};
