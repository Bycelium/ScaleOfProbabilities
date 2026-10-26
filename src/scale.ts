import { displayLandmarks, regionalLandmarkLocales, relatedLandmarkIds, type DisplayLandmark, type LandmarkDiagnostic, type Source } from "./catalogue";
import { localeChoices, locales, localizeLandmark, resolveInitialLocale, saveLocale, translateArtwork, type LocaleCode, type LocaleDefinition } from "./locales";
import { catalogueSlots } from "./catalogue/order";
import { fillTemplate } from "./locales/helpers";
import { chanceAt, formatDecibans, formatOdds, formatProbability, formatProbabilityPercent } from "./probability";

type View = { center: number };
type SceneMetrics = Readonly<{ width: number; height: number; referenceDiameter: number; centerX: number; centerY: number }>;
type TravelOptions = Readonly<{ onArrival?: () => void; initialVelocity?: number; startedAt?: number }>;
type Travel = Readonly<{
  start: number; target: number; direction: number; distance: number;
  duration: number; startedAt: number; initialSlope: number; peakSlope: number;
  onArrival?: () => void;
}>;
type DirectionalInput = { direction: number; delta: number; velocity: number; startedAt: number };
type LandmarkNode = Readonly<{
  button: HTMLButtonElement;
  image: HTMLImageElement;
  title: HTMLElement;
  item: DisplayLandmark;
  baseX: number;
  baseY: number;
  baseArtSize: number;
}>;
type RulerTickNode = Readonly<{ element: HTMLElement; mark: HTMLElement; label: HTMLElement }>;

const STORAGE_KEY = "probability-scale-view-v1";
const INTRO_STORAGE_KEY = "probability-scale-intro-seen";
const REFERENCES_STORAGE_KEY = "probability-scale-all-references";
const NEUTRAL = [134, 147, 140] as const;
const NEGATIVE = [226, 105, 112] as const;
const POSITIVE = [74, 185, 137] as const;
const SCENE_REBASE_DECIBANS = 2;
const MIN_TRAVEL_DURATION = 220;

const clamp = (value: number, minimum: number, maximum: number): number => Math.max(minimum, Math.min(maximum, value));
const trimDecimal = (value: number): string => value.toFixed(1).replace(/\.0$/, "");
const oddsFactor = (exponent: number, locale: LocaleDefinition): string => {
  const factor = 10 ** exponent;
  if (Math.abs(factor - Math.round(factor)) < 1e-10) return Math.round(factor).toLocaleString(locale.numberLocale);
  const precision = factor < 1.1 ? 2 : 1;
  if (factor < 100) return Number(factor.toFixed(precision)).toLocaleString(locale.numberLocale, { maximumFractionDigits: precision });
  return Math.round(factor).toLocaleString(locale.numberLocale);
};

const axisColor = (position: number): string => {
  const strength = clamp(Math.abs(position) / 5, 0, 1);
  const target = position < 0 ? NEGATIVE : POSITIVE;
  const channels = NEUTRAL.map((channel, index) => Math.round(channel + (target[index] - channel) * strength));
  return `rgb(${channels.join(" ")})`;
};

const initialView = (minimum: number, maximum: number): View => {
  const match = location.hash.match(/^#d=(-?\d+(?:\.\d+)?)$/);
  if (match) return { center: clamp(Number(match[1]), minimum, maximum) };
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as Partial<View> | null;
    if (stored && Number.isFinite(stored.center)) return { center: clamp(stored.center!, minimum, maximum) };
  } catch {
    // A fresh view is sufficient when storage is unavailable or malformed.
  }
  return { center: 0 };
};

const loadAllReferences = (): boolean => {
  try {
    return localStorage.getItem(REFERENCES_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const saveAllReferences = (allReferences: boolean): void => {
  try {
    localStorage.setItem(REFERENCES_STORAGE_KEY, String(allReferences));
  } catch {
    // The current selection remains usable when local storage is unavailable.
  }
};

const saveView = (view: View): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(view));
  } catch {
    // Exploration remains usable when session storage is unavailable.
  }
};

const sourceList = (sources: readonly Source[]): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  const list = document.createElement("ul");
  for (const source of sources) {
    const item = document.createElement("li");
    if (source.href) {
      const link = document.createElement("a");
      link.href = source.href;
      link.textContent = source.label;
      link.target = "_blank";
      link.rel = "noreferrer";
      item.append(link);
    } else {
      item.append(source.label);
    }
    if (source.note) item.append(` — ${source.note}`);
    list.append(item);
  }
  fragment.append(list);
  return fragment;
};

export function createScale(root: HTMLElement): () => void {
  let locale = resolveInitialLocale();
  let allReferences = loadAllReferences();
  const initiallyAvailable = displayLandmarks.filter(item => {
    const regionalLocales = regionalLandmarkLocales[item.id];
    return allReferences || !regionalLocales || regionalLocales.includes(locale.code);
  });
  let view = initialView(Math.min(...initiallyAvailable.map(item => item.position)), Math.max(...initiallyAvailable.map(item => item.position)));
  let selected: DisplayLandmark | undefined;
  let active: DisplayLandmark | undefined;
  let restoreFocus: HTMLElement | undefined;
  let dragY: number | undefined;
  let touchOriginY: number | undefined;
  let travelFrame: number | undefined;
  let travel: Travel | undefined;
  let pendingInput: DirectionalInput | undefined;
  let travelDirection = 0;
  let travelVelocity = 0;
  let lastTravelInputAt: number | undefined;
  let travelToRelated: (target: DisplayLandmark) => void;
  let travelToLandmark: (target: DisplayLandmark) => void;
  const pointers = new Map<number, { x: number; y: number }>();
  let pinchStart: { distance: number } | undefined;
  let introRestoreFocus: HTMLElement | undefined;
  let suppressLandmarkClick = false;
  let lastPersistedCenter = view.center;

  const languageChoices = (context: "intro" | "menu"): string => localeChoices.map(choice => `<button type="button" data-locale-choice="${choice.code}" data-locale-context="${context}" aria-pressed="${choice.code === locale.code}">${choice.nativeName}</button>`).join("");

  root.innerHTML = `<div class="atlas"><div data-page-content>
    <header class="explorer-tools"><button class="return-zero" data-return-zero hidden>${locale.ui.returnZero}</button><button class="reference-toggle" data-all-references aria-label="${locale.ui.allReferences}" aria-describedby="all-references-help" aria-pressed="${allReferences}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/><path d="M9 3v15m6-12v15" fill="none" stroke="currentColor" stroke-width="1.8"/></svg><span class="toolbar-tooltip" id="all-references-help" data-all-references-help role="tooltip">${locale.ui.allReferencesHelp}</span></button><div class="language-picker" data-language-picker><button class="language-toggle" data-language-toggle aria-label="${locale.ui.language}" aria-expanded="false">🌐</button><div class="language-menu" data-language-menu role="group" aria-label="${locale.ui.language}" hidden>${languageChoices("menu")}</div></div><button class="read-scale" data-open-intro>${locale.ui.about}</button></header>
    <section class="scale" tabindex="0" aria-label="${locale.ui.scaleAria}">
      <div class="ruler" data-ruler></div><canvas class="depth-rings" data-depth-rings aria-hidden="true"></canvas><i class="current-depth-ring" data-current-depth-ring aria-hidden="true"></i><div class="depth-scene" data-depth-scene><div class="landmarks" data-landmarks></div></div><div class="hyperspace" data-hyperspace aria-hidden="true"><i style="--angle:8deg;--delay:-.1s"></i><i style="--angle:48deg;--delay:-.45s"></i><i style="--angle:92deg;--delay:-.25s"></i><i style="--angle:137deg;--delay:-.6s"></i><i style="--angle:181deg;--delay:-.32s"></i><i style="--angle:224deg;--delay:-.05s"></i><i style="--angle:274deg;--delay:-.5s"></i><i style="--angle:318deg;--delay:-.2s"></i></div><p class="gap-caption" data-gap-caption aria-live="polite" hidden></p>
    </section>
  </div>
  <dialog class="scale-intro" data-scale-intro aria-modal="true" aria-labelledby="scale-intro-heading">
    <div class="intro-language" role="group" aria-label="${locale.ui.language}" data-intro-language>${languageChoices("intro")}</div>
    <h1 id="scale-intro-heading" tabindex="-1" data-intro-title>${locale.ui.title}</h1>
    <div class="intro-scroll">
      <div class="intro-directions"><svg viewBox="0 0 260 180" aria-hidden="true"><path class="intro-rope" d="M128.5 4h3l-1.5 131Z"/><g class="intro-rings"><circle cx="130" cy="135" r="142"/><circle cx="130" cy="135" r="80"/><circle cx="130" cy="135" r="45"/><circle cx="130" cy="135" r="25"/><circle cx="130" cy="135" r="14"/><circle cx="130" cy="135" r="8"/></g><g class="intro-ticks"><path d="M124 55h12m-5 35h10m-9 20h8"/></g><path class="intro-outward" d="m130 76V30m0 0-5 7m5-7 5 7"/><path class="intro-inward" d="m130 104v24m0 0-5-7m5 7 5-7"/></svg><p><span class="rarer" data-intro-direction-rarer>${locale.ui.introDirectionRarer}</span><span class="likely" data-intro-direction-likely>${locale.ui.introDirectionLikely}</span></p></div>
      <p data-intro-probability>${locale.ui.probabilityExplanation}</p>
      <p data-intro-odds>${locale.ui.oddsExplanation}</p>
      <details class="math-disclosure"><summary data-probability-to-odds>${locale.ui.probabilityToOdds}</summary><p class="equation" data-odds-equation aria-label="${locale.ui.oddsEquationAria}"><var>o</var> = <var>p</var> / (1 − <var>p</var>)</p><p data-probability-definition>${locale.ui.probabilityDefinition}</p></details>
      <p><span data-intro-decibans>${locale.ui.decibansExplanation}</span> <a href="https://languagelog.ldc.upenn.edu/myl/Good1979.pdf#page=3" target="_blank" rel="noreferrer">I. J. Good (1979)</a></p>
      <details class="math-disclosure"><summary data-odds-to-decibans>${locale.ui.oddsToDecibans}</summary><p class="equation" data-decibans-equation aria-label="${locale.ui.decibansEquationAria}"><var>d</var> = 10 log<sub>10</sub>(<var>o</var>)</p></details>
      <h2 data-how-to-use>${locale.ui.howToUse}</h2>
      <p data-intro-navigation>${locale.ui.introNavigation}</p>
    </div>
    <footer class="intro-actions"><button data-dismiss-intro>${locale.ui.explore}</button><p class="intro-credit"><span data-credit-prefix>${locale.ui.creditPrefix}</span> <a href="https://www.htwins.net/scale2/" data-credit-title>${locale.ui.creditTitle}</a>, <span data-credit-by>${locale.ui.creditBy}</span></p></footer>
  </dialog>
  <dialog data-detail-panel aria-labelledby="detail-heading"><button data-close-detail aria-label="${locale.ui.closeDetails}">×</button><div data-detail-content><div data-detail-art></div><p class="eyebrow" data-detail-kind></p><h2 id="detail-heading" data-detail-title></h2><p data-detail-explanation></p><section class="detail-related" data-detail-related hidden><h3 data-explore-on-scale>${locale.ui.exploreOnScale}</h3><div data-detail-related-links></div></section><dl><div><dt data-calculation-label>${locale.ui.calculation}</dt><dd data-detail-calculation></dd></div><div data-detail-diagnostic-section hidden><dt data-diagnostic-label></dt><dd data-detail-diagnostic hidden></dd></div><div><dt data-assumptions-label>${locale.ui.assumptions}</dt><dd data-detail-assumptions></dd></div><div data-detail-advice-section hidden><dt data-advice-label>${locale.ui.securityAdvice}</dt><dd data-detail-advice></dd></div><div><dt data-sources-label>${locale.ui.sources}</dt><dd data-detail-sources></dd></div></dl></div></dialog></div>`;

  const page = root.querySelector<HTMLElement>("[data-page-content]")!;
  const scale = root.querySelector<HTMLElement>(".scale")!;
  const ruler = root.querySelector<HTMLElement>("[data-ruler]")!;
  const depthScene = root.querySelector<HTMLElement>("[data-depth-scene]")!;
  const layer = root.querySelector<HTMLElement>("[data-landmarks]")!;
  const rings = root.querySelector<HTMLCanvasElement>("[data-depth-rings]")!;
  const ringContext = rings.getContext("2d")!;
  const currentDepthRing = root.querySelector<HTMLElement>("[data-current-depth-ring]")!;
  const dialog = root.querySelector<HTMLDialogElement>("[data-detail-panel]")!;
  const introDialog = root.querySelector<HTMLDialogElement>("[data-scale-intro]")!;
  const introButton = root.querySelector<HTMLButtonElement>("[data-open-intro]")!;
  const languageToggle = root.querySelector<HTMLButtonElement>("[data-language-toggle]")!;
  const languageMenu = root.querySelector<HTMLElement>("[data-language-menu]")!;
  const languagePicker = root.querySelector<HTMLElement>("[data-language-picker]")!;
  const returnButton = root.querySelector<HTMLButtonElement>("[data-return-zero]")!;
  const allReferencesToggle = root.querySelector<HTMLButtonElement>("[data-all-references]")!;
  const gapCaption = root.querySelector<HTMLElement>("[data-gap-caption]")!;
  const hyperspace = root.querySelector<HTMLElement>("[data-hyperspace]")!;
  const landmarkNodes = new Map<string, LandmarkNode>();
  const rulerTickNodes = new Map<number, RulerTickNode>();
  const artworkImageSources = new Map<string, string>();
  const landmarksById = new Map<string, DisplayLandmark>(displayLandmarks.map(item => [item.id, item]));
  const localized = (item: DisplayLandmark): DisplayLandmark => localizeLandmark(item, locale);
  const landmarkIsAvailable = (item: DisplayLandmark): boolean => {
    if (selected?.id === item.id && dialog.open) return true;
    const regionalLocales = regionalLandmarkLocales[item.id];
    return allReferences || !regionalLocales || regionalLocales.includes(locale.code);
  };
  const availableLandmarks = (): readonly DisplayLandmark[] => displayLandmarks.filter(landmarkIsAvailable);
  const catalogueBounds = (): readonly [number, number] => {
    const available = availableLandmarks();
    return [Math.min(...available.map(item => item.position)), Math.max(...available.map(item => item.position))];
  };
  const clampToCatalogue = (position: number): number => {
    const [minimum, maximum] = catalogueBounds();
    return clamp(position, minimum, maximum);
  };
  const landmarkAngleOverrides: Readonly<Record<string, number>> = {
    "die-d4-highest": 2 * Math.PI / 3,
    "weekday": 135 * Math.PI / 180,
    "ocean-point": 55 * Math.PI / 180,
    "solar-eclipse-year": 220 * Math.PI / 180,
    "frozen-freshwater": -10 * Math.PI / 180,
    "four-dice-any-match": 115 * Math.PI / 180,
    "mensik-first-serve-miami-2025": 30 * Math.PI / 180,
    "rain-brest-december": 75 * Math.PI / 180,
    "d20-avoid-natural-one-advantage": 135 * Math.PI / 180,
    "pokemon-destined-rivals-double-rare": 138 * Math.PI / 180,
    "pokemon-destined-rivals-illustration-rare": 100 * Math.PI / 180,
    "pokemon-destined-rivals-special-illustration-rare": 220 * Math.PI / 180,
    "roulette-two-dozens-columns": 12 * Math.PI / 180,
    "roulette-even-money": 300 * Math.PI / 180,
    "roulette-dozen-column": 300 * Math.PI / 180,
    "roulette-six-line": 280 * Math.PI / 180,
    "roulette-corner": 252 * Math.PI / 180,
    "roulette-street": 320 * Math.PI / 180,
    "roulette-split": 292 * Math.PI / 180,
    "roulette-straight-up": 330 * Math.PI / 180,
    "blackjack-natural-six-deck": 155 * Math.PI / 180,
    "four-leaf-clover": 35 * Math.PI / 180,
    "uk-recent-car-breakdown-2021": 90 * Math.PI / 180,
    "fr-person-smartphone-2025": 45 * Math.PI / 180,
    "rubik-state": 5 * Math.PI / 6,
    "enigma-m3-known-rings": Math.PI / 5,
    "enigma-m3-after-clues": Math.PI / 5,
    "enigma-i-known-rings": 7 * Math.PI / 6,
    "enigma-i-two-unknown-rings": 7 * Math.PI / 6,
    "enigma-m4-known-rings": 11 * Math.PI / 6,
    "sahara-grain": Math.PI / 2,
  };
  const landmarkAngles = new Map(displayLandmarks.map(item => [
    item.id,
    landmarkAngleOverrides[item.id] ?? -Math.PI / 4 + (((catalogueSlots[item.id] * 137.508) % 360) / 360) * (3 * Math.PI / 2),
  ]));
  const compactTitleOffsets: Readonly<Record<string, Readonly<{ x: number; y: number }>>> = {
    "weekday": { x: 20, y: 0 },
    "ocean-point": { x: 0, y: 28 },
    "frozen-freshwater": { x: -16, y: 0 },
    "red-dwarf-star": { x: -22, y: 0 },
    "mensik-first-serve-miami-2025": { x: -12, y: 0 },
    "rain-hilo": { x: -45, y: 12 },
    "pokemon-destined-rivals-double-rare": { x: 30, y: 0 },
  };

  const artworkImageSource = (item: DisplayLandmark): string => {
    const key = `${locale.code}:${item.id}`;
    const cached = artworkImageSources.get(key);
    if (cached) return cached;
    const template = document.createElement("template");
    template.innerHTML = item.art.trim();
    translateArtwork(template.content, locale);
    const svg = template.content.querySelector("svg")!;
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.outerHTML)}`;
    artworkImageSources.set(key, source);
    return source;
  };

  ruler.innerHTML = `<div class="depth-gauge"><div class="depth-readout" data-depth-readout data-center-marker><span class="probability"><small class="readout-label" data-probability-label></small> <span data-probability-value></span></span><span class="odds"><small class="readout-label" data-odds-label></small> <span data-odds-value></span></span><span class="visually-hidden" data-readout-decibans></span></div><i class="depth-spoke" data-depth-spoke></i><span class="current-depth-marker" data-current-depth-marker><i></i><strong></strong></span></div>`;
  const depthGauge = ruler.querySelector<HTMLElement>(".depth-gauge")!;
  const depthReadout = ruler.querySelector<HTMLElement>("[data-depth-readout]")!;
  const probabilityLabel = ruler.querySelector<HTMLElement>("[data-probability-label]")!;
  const probabilityValue = ruler.querySelector<HTMLElement>("[data-probability-value]")!;
  const oddsLabel = ruler.querySelector<HTMLElement>("[data-odds-label]")!;
  const oddsValue = ruler.querySelector<HTMLElement>("[data-odds-value]")!;
  const readoutDecibans = ruler.querySelector<HTMLElement>("[data-readout-decibans]")!;
  const depthSpoke = ruler.querySelector<HTMLElement>("[data-depth-spoke]")!;
  const currentDepthMarker = ruler.querySelector<HTMLElement>("[data-current-depth-marker]")!;
  const currentDepthValue = currentDepthMarker.querySelector<HTMLElement>("strong")!;
  const eventMarker = document.createElement("span");
  eventMarker.className = "spoke-event-marker";
  eventMarker.dataset.eventMarker = "";
  eventMarker.innerHTML = "<i></i><small></small>";
  const eventMarkerLabel = eventMarker.querySelector<HTMLElement>("small")!;
  let rulerLocale: LocaleCode | undefined;
  let metrics: SceneMetrics | undefined;
  let sceneOrigin: Readonly<{ center: number; metrics: SceneMetrics }> | undefined;
  let sceneBounds: readonly [number, number] = [0, 0];

  const setText = (element: HTMLElement, value: string): void => {
    if (element.textContent !== value) element.textContent = value;
  };
  const setStyle = (element: HTMLElement, property: string, value: string): void => {
    if (element.style.getPropertyValue(property) !== value) element.style.setProperty(property, value);
  };

  const sceneMetrics = (): SceneMetrics => {
    if (metrics) return metrics;
    const width = Math.max(scale.clientWidth, 320);
    const height = Math.max(layer.clientHeight, scale.clientHeight, 320);
    const diameter = Math.min(width, height);
    const referenceDiameter = diameter * 0.78;
    metrics = { width, height, referenceDiameter, centerX: width / 2, centerY: height / 2 };
    return metrics;
  };

  const visibleTickDepths = (referenceDiameter: number, maximumRingDiameter: number, bounds: readonly [number, number]): number[] => {
    const [minimum, maximum] = bounds;
    const first = Math.ceil(Math.max(minimum, view.center + 10 * Math.log10(0.75 / referenceDiameter)));
    const last = Math.floor(Math.min(maximum, view.center + 10 * Math.log10(maximumRingDiameter / referenceDiameter)));
    return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);
  };

  const renderRuler = ({ width, height, referenceDiameter, centerX, centerY }: SceneMetrics, bounds: readonly [number, number]): void => {
    const major = 5;
    const projectedY = (position: number): number => centerY - referenceDiameter / 2 * 10 ** ((position - view.center) / 10);
    const visibleTicks = new Set<number>();
    let lastLabelY = -Infinity;
    let lastMarkY = -Infinity;
    const currentY = projectedY(view.center);
    const currentLabelY = currentY - 20;
    for (const position of visibleTickDepths(referenceDiameter, Math.hypot(width, height), bounds)) {
      const rounded = Number(position.toFixed(8));
      const normalized = Math.abs(rounded) < 1e-8 ? 0 : rounded;
      const isMajor = Math.abs(normalized / major - Math.round(normalized / major)) < 1e-8;
      const y = projectedY(normalized);
      if (y < 0 || y > height) continue;
      const depthFactor = 10 ** ((normalized - view.center) / 10);
      const markVisible = 12 * depthFactor >= 0.5 && (isMajor || Math.abs(y - lastMarkY) >= 4 * depthFactor);
      const labelVisible = depthFactor >= 0.55 && Math.abs(y - lastLabelY) >= 12 * depthFactor && Math.abs(y - currentY) >= 12 && Math.abs(y - currentLabelY) >= 24;
      if (markVisible) lastMarkY = y;
      if (labelVisible) lastLabelY = y;
      visibleTicks.add(normalized);
      let tick = rulerTickNodes.get(normalized);
      if (!tick) {
        const element = document.createElement("span");
        element.dataset.tick = String(normalized);
        element.innerHTML = "<i></i><small></small>";
        tick = { element, mark: element.querySelector<HTMLElement>("i")!, label: element.querySelector<HTMLElement>("small")! };
        rulerTickNodes.set(normalized, tick);
      }
      const { element, mark, label } = tick;
      const className = `spoke-tick${isMajor ? " major" : ""}`;
      if (element.className !== className) element.className = className;
      setStyle(element, "left", `${centerX}px`);
      setStyle(element, "top", `${y}px`);
      setStyle(element, "--axis-color", axisColor(normalized));
      setStyle(element, "--depth-factor", String(depthFactor));
      setStyle(element, "opacity", String(Math.min(1, depthFactor)));
      if (mark.hidden === markVisible) mark.hidden = !markVisible;
      if (label.hidden === labelVisible) label.hidden = !labelVisible;
      if (element.dataset.locale !== locale.code) {
        setText(label, formatDecibans(normalized, locale.code));
        element.dataset.locale = locale.code;
      }
      if (element.parentElement !== depthGauge) depthGauge.append(element);
    }
    for (const [position, tick] of rulerTickNodes) {
      if (!visibleTicks.has(position)) tick.element.remove();
    }
    setStyle(currentDepthMarker, "left", `${centerX}px`);
    setStyle(currentDepthMarker, "top", `${currentY}px`);
    setStyle(currentDepthMarker, "--axis-color", axisColor(view.center));
    setText(currentDepthValue, formatDecibans(view.center, locale.code));
    const activeY = active ? projectedY(active.position) : 0;
    const activeFactor = active ? 10 ** ((active.position - view.center) / 10) : 0;
    const eventVisible = active && activeFactor >= 0.55 && activeY >= 0 && activeY <= height && Math.abs(activeY - currentY) >= 12 && Math.abs(activeY - currentLabelY) >= 24;
    if (eventVisible) {
      setStyle(eventMarker, "left", `${centerX}px`);
      setStyle(eventMarker, "top", `${activeY}px`);
      setStyle(eventMarker, "--depth-factor", String(activeFactor));
      setStyle(eventMarker, "opacity", String(Math.min(1, activeFactor)));
      setText(eventMarkerLabel, formatDecibans(active!.position, locale.code));
      if (eventMarker.parentElement !== depthGauge) depthGauge.append(eventMarker);
    } else {
      eventMarker.remove();
    }
    const value = chanceAt(view.center);
    if (rulerLocale !== locale.code) {
      setText(probabilityLabel, locale.ui.probabilityLabel);
      setText(oddsLabel, locale.ui.oddsLabel);
      rulerLocale = locale.code;
    }
    setText(probabilityValue, formatProbabilityPercent(value, locale.code));
    setText(oddsValue, formatOdds(view.center, locale.code));
    setText(readoutDecibans, formatDecibans(view.center, locale.code));
    depthReadout.classList.toggle("extreme", Math.abs(view.center) >= 100);
    setStyle(depthReadout, "top", `${currentY}px`);
    setStyle(depthReadout, "--axis-color", axisColor(view.center));
    const ropeTopWidth = 3 * centerY / (referenceDiameter / 2);
    setStyle(depthSpoke, "left", `${centerX}px`);
    setStyle(depthSpoke, "top", "0px");
    setStyle(depthSpoke, "height", `${centerY}px`);
    setStyle(depthSpoke, "width", `${ropeTopWidth}px`);
    const depth = String(view.center);
    if (scale.dataset.depth !== depth) scale.dataset.depth = depth;
  };

  const makeLandmark = (item: DisplayLandmark): Pick<LandmarkNode, "button" | "image" | "title" | "item"> => {
    const button = document.createElement("button");
    button.className = "landmark";
    button.dataset.landmark = item.id;
    button.innerHTML = '<span class="art"><img alt="" draggable="false"></span><span class="landmark-title"></span>';
    const showMarker = () => { active = item; render(); };
    button.addEventListener("mouseenter", showMarker);
    button.addEventListener("focus", showMarker);
    button.addEventListener("mouseleave", () => {
      if (document.activeElement !== button && selected?.id !== item.id) {
        active = selected;
        render();
      }
    });
    button.addEventListener("click", event => {
      if (suppressLandmarkClick) {
        event.preventDefault();
        return;
      }
      travelToLandmark(item);
    });
    layer.append(button);
    return {
      button,
      image: button.querySelector<HTMLImageElement>("img")!,
      title: button.querySelector<HTMLElement>(".landmark-title")!,
      item,
    };
  };

  const sceneIntersectsAtSomeZoom = (baseX: number, baseY: number, baseSize: number, { width, height, centerX, centerY }: SceneMetrics): boolean => {
    const minimumZoom = 10 ** (-SCENE_REBASE_DECIBANS / 10);
    const maximumZoom = 1 / minimumZoom;
    const horizontal = [minimumZoom, maximumZoom].flatMap(zoom => {
      const x = centerX + (baseX - centerX) * zoom;
      const half = baseSize * zoom / 2;
      return [x - half, x + half];
    });
    const vertical = [minimumZoom, maximumZoom].flatMap(zoom => {
      const y = centerY + (baseY - centerY) * zoom;
      const half = baseSize * zoom / 2;
      return [y - half, y + half];
    });
    return Math.max(...horizontal) >= 0 && Math.min(...horizontal) <= width
      && Math.max(...vertical) >= 0 && Math.min(...vertical) <= height;
  };

  const rebuildScene = (nextMetrics: SceneMetrics, visibleCatalogue: readonly DisplayLandmark[]): void => {
    const { width, referenceDiameter, centerX, centerY } = nextMetrics;
    const compactArtScale = width <= 640 ? 0.76 : 1;
    const originCenter = view.center;
    const maximumSceneZoom = 10 ** (SCENE_REBASE_DECIBANS / 10);
    const projected = visibleCatalogue.flatMap(item => {
      const depth = item.position - originCenter;
      const zoomFactor = 10 ** (depth / 10);
      const ringDiameter = referenceDiameter * zoomFactor;
      const radius = ringDiameter / 2;
      const angle = landmarkAngles.get(item.id)!;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const artSize = item.size * zoomFactor * compactArtScale;
      if (artSize * maximumSceneZoom < 0.5 || !sceneIntersectsAtSomeZoom(x, y, artSize, nextMetrics)) return [];
      return [{ item, zoomFactor, ringDiameter, x, y, artSize }];
    });
    const projectedIds = new Set<string>(projected.map(({ item }) => item.id));
    for (const [id, node] of landmarkNodes) {
      if (!projectedIds.has(id)) {
        node.button.remove();
        landmarkNodes.delete(id);
      }
    }
    for (const { item, zoomFactor, ringDiameter, x, y, artSize } of projected) {
      const existing = landmarkNodes.get(item.id) ?? makeLandmark(item);
      const { button, image, title } = existing;
      if (button.dataset.locale !== locale.code) {
        const translated = localized(item);
        setText(title, translated.shortTitle);
        button.setAttribute("aria-label", `${translated.title}, ${formatProbability(item.chance, locale.code)}, ${formatDecibans(item.position, locale.code)}`);
        image.src = artworkImageSource(item);
        button.dataset.locale = locale.code;
      }
      setStyle(button, "left", `${x}px`);
      setStyle(button, "top", `${y - artSize / 2}px`);
      setStyle(button, "--size", `${item.size * compactArtScale}px`);
      setStyle(button, "--depth-scale", String(zoomFactor));
      button.dataset.ringSize = `${ringDiameter}px`;
      button.dataset.depthScale = String(zoomFactor);
      button.tabIndex = 0;
      setStyle(button, "pointer-events", "none");
      setStyle(button, "z-index", String(Math.max(1, Math.min(99, Math.round(zoomFactor * 10)))));
      const titleOffset = width <= 640 ? compactTitleOffsets[item.id] : undefined;
      setStyle(title, "--title-x", `${titleOffset?.x ?? 0}px`);
      setStyle(title, "--title-y", `${titleOffset?.y ?? 0}px`);
      landmarkNodes.set(item.id, { ...existing, baseX: x, baseY: y, baseArtSize: artSize });
    }
    sceneOrigin = { center: originCenter, metrics: nextMetrics };
  };

  const updateSceneProjection = (nextMetrics: SceneMetrics): void => {
    if (!sceneOrigin || sceneOrigin.metrics !== nextMetrics || Math.abs(view.center - sceneOrigin.center) >= SCENE_REBASE_DECIBANS) {
      const visibleCatalogue = availableLandmarks();
      sceneBounds = [Math.min(...visibleCatalogue.map(item => item.position)), Math.max(...visibleCatalogue.map(item => item.position))];
      rebuildScene(nextMetrics, visibleCatalogue);
    }
    const sceneZoom = 10 ** ((sceneOrigin!.center - view.center) / 10);
    const inverseZoom = 1 / sceneZoom;
    setStyle(depthScene, "transform", `scale(${sceneZoom})`);
    const sceneZoomText = String(sceneZoom);
    if (depthScene.dataset.sceneZoom !== sceneZoomText) depthScene.dataset.sceneZoom = sceneZoomText;
    const { width, height, centerX, centerY, referenceDiameter } = nextMetrics;
    for (const { button, title, item, baseX, baseY, baseArtSize } of landmarkNodes.values()) {
      const artSize = baseArtSize * sceneZoom;
      const x = centerX + (baseX - centerX) * sceneZoom;
      const y = centerY + (baseY - centerY) * sceneZoom;
      const visible = artSize >= 0.5 && x + artSize / 2 >= 0 && x - artSize / 2 <= width && y + artSize / 2 >= 0 && y - artSize / 2 <= height;
      if (button.hidden === visible) button.hidden = !visible;
      const readable = visible && artSize >= 32 && (width > 640 || Math.abs(item.position - view.center) <= 1.7);
      if (title.hidden === readable) title.hidden = !readable;
      if (readable) setStyle(title, "transform", `scale(${inverseZoom}) translate(var(--title-x), var(--title-y))`);
      const receded = String(!readable);
      if (button.dataset.receded !== receded) button.dataset.receded = receded;
    }
    setStyle(currentDepthRing, "width", `${referenceDiameter}px`);
    setStyle(currentDepthRing, "height", `${referenceDiameter}px`);
    setStyle(currentDepthRing, "--ring-color", axisColor(view.center));
  };

  const drawGuideBatch = (positions: readonly number[], alpha: number, { width, height, referenceDiameter, centerX, centerY }: SceneMetrics): void => {
    const maximumRadius = Math.hypot(width, height) / 2;
    ringContext.globalAlpha = alpha;
    ringContext.beginPath();
    for (const position of positions) {
      const radius = referenceDiameter / 2 * 10 ** ((position - view.center) / 10);
      if (radius < 0.375 || radius > maximumRadius || Math.abs(position - view.center) < 1e-8) continue;
      ringContext.moveTo(centerX + radius, centerY);
      ringContext.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    }
    ringContext.stroke();
  };

  const renderGuideRings = (nextMetrics: SceneMetrics): void => {
    const { width, height, referenceDiameter } = nextMetrics;
    const pixelRatio = window.devicePixelRatio;
    const backingWidth = Math.ceil(width * pixelRatio);
    const backingHeight = Math.ceil(height * pixelRatio);
    if (rings.width !== backingWidth) rings.width = backingWidth;
    if (rings.height !== backingHeight) rings.height = backingHeight;
    setStyle(rings, "width", `${width}px`);
    setStyle(rings, "height", `${height}px`);
    ringContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ringContext.clearRect(0, 0, width, height);
    ringContext.strokeStyle = "rgb(126 142 145)";
    ringContext.lineWidth = 1;
    const ticks = visibleTickDepths(referenceDiameter, Math.hypot(width, height), sceneBounds);
    drawGuideBatch(ticks.filter(position => position % 5 !== 0), 0.11, nextMetrics);
    drawGuideBatch(ticks.filter(position => position % 5 === 0), 0.2, nextMetrics);
  };

  const render = (): void => {
    const nextMetrics = sceneMetrics();
    updateSceneProjection(nextMetrics);
    renderGuideRings(nextMetrics);
    renderRuler(nextMetrics, sceneBounds);
    const returnHidden = Math.abs(view.center) <= 0.1;
    if (returnButton.hidden !== returnHidden) returnButton.hidden = returnHidden;
  };

  const persistView = (): void => {
    if (view.center === lastPersistedCenter) return;
    saveView(view);
    lastPersistedCenter = view.center;
  };

  const moveTo = (center: number, persist = true): void => {
    view.center = clampToCatalogue(center);
    render();
    if (persist) persistView();
  };

  const nearestLandmark = (position = view.center): DisplayLandmark => availableLandmarks().reduce((best, item) => (
    Math.abs(item.position - position) < Math.abs(best.position - position) ? item : best
  ));

  const showDialog = (): void => {
    dialog.setAttribute("open", "");
  };

  const renderDiagnostic = (diagnostic?: LandmarkDiagnostic): void => {
    const section = dialog.querySelector<HTMLElement>("[data-detail-diagnostic-section]")!;
    const heading = dialog.querySelector<HTMLElement>("[data-diagnostic-label]")!;
    const content = dialog.querySelector<HTMLElement>("[data-detail-diagnostic]")!;
    section.hidden = !diagnostic;
    content.hidden = !diagnostic;
    content.replaceChildren();
    if (!diagnostic) return;

    heading.textContent = locale.ui.diagnostic.heading;
    const model = diagnostic.model;
    const count = (value: number): string => value.toLocaleString(locale.numberLocale);
    const caption = document.createElement("p");
    caption.className = "diagnostic-caption";
    caption.textContent = locale.ui.diagnostic.expectedResults.replace("{population}", count(model.population));

    const table = document.createElement("table");
    table.className = "diagnostic-table";
    const header = table.createTHead().insertRow();
    header.append(document.createElement("th"));
    for (const label of [locale.ui.diagnostic.infectionPresent, locale.ui.diagnostic.infectionAbsent]) {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = label;
      header.append(cell);
    }
    const body = table.createTBody();
    const addRow = (result: "positive" | "negative", label: string, values: readonly [number, string, number, string]): void => {
      const row = body.insertRow();
      row.dataset.diagnosticRow = result;
      row.classList.toggle("selected", diagnostic.selected === result);
      const rowLabel = document.createElement("th");
      rowLabel.scope = "row";
      rowLabel.textContent = label;
      row.append(rowLabel);
      for (let index = 0; index < values.length; index += 2) {
        const cell = row.insertCell();
        const strong = document.createElement("strong");
        strong.textContent = count(values[index] as number);
        cell.append(strong, ` ${values[index + 1]}`);
      }
    };
    addRow("positive", locale.ui.diagnostic.positiveResult, [model.truePositive, locale.ui.diagnostic.truePositive, model.falsePositive, locale.ui.diagnostic.falsePositive]);
    addRow("negative", locale.ui.diagnostic.negativeResult, [model.falseNegative, locale.ui.diagnostic.falseNegative, model.trueNegative, locale.ui.diagnostic.trueNegative]);

    const evidenceHeading = document.createElement("p");
    evidenceHeading.className = "diagnostic-evidence-heading";
    evidenceHeading.textContent = locale.ui.diagnostic.evidence;
    const localizedNumber = (value: number, maximumFractionDigits: number): string => value.toLocaleString(locale.numberLocale, { maximumFractionDigits });
    const sensitivity = localizedNumber(model.sensitivity, 3);
    const specificity = localizedNumber(model.specificity, 3);
    const positiveRatio = localizedNumber(model.positiveLikelihoodRatio, 1);
    const negativeDivisor = 1 / model.negativeLikelihoodRatio;
    const negativeRatio = localizedNumber(model.negativeLikelihoodRatio, 3);
    const positiveEvidence = document.createElement("p");
    positiveEvidence.className = "diagnostic-evidence";
    positiveEvidence.textContent = fillTemplate(locale.ui.diagnostic.positiveEvidence, { factor: positiveRatio, shift: formatDecibans(model.positiveShift, locale.code) });
    const positiveFormula = document.createElement("p");
    positiveFormula.className = "diagnostic-formula";
    positiveFormula.textContent = fillTemplate(locale.ui.diagnostic.positiveFormula, { sensitivity, specificity, ratio: positiveRatio });
    const negativeEvidence = document.createElement("p");
    negativeEvidence.className = "diagnostic-evidence";
    negativeEvidence.textContent = fillTemplate(locale.ui.diagnostic.negativeEvidence, { divisor: localizedNumber(negativeDivisor, 1), shift: formatDecibans(model.negativeShift, locale.code) });
    const negativeFormula = document.createElement("p");
    negativeFormula.className = "diagnostic-formula";
    negativeFormula.textContent = fillTemplate(locale.ui.diagnostic.negativeFormula, { sensitivity, specificity, ratio: negativeRatio });
    content.append(caption, table, evidenceHeading, positiveEvidence, positiveFormula, negativeEvidence, negativeFormula);
  };

  const populateDetails = (item: DisplayLandmark): void => {
    const translated = localized(item);
    const detailArt = dialog.querySelector<HTMLElement>("[data-detail-art]")!;
    detailArt.innerHTML = item.art;
    translateArtwork(detailArt, locale);
    const kind = dialog.querySelector<HTMLElement>("[data-detail-kind]")!;
    kind.hidden = item.classification === undefined;
    kind.textContent = item.classification ? locale.ui.classification[item.classification] : "";
    dialog.querySelector<HTMLElement>("[data-detail-title]")!.textContent = translated.title;
    dialog.querySelector<HTMLElement>("[data-detail-explanation]")!.textContent = translated.explanation;
    dialog.querySelector<HTMLElement>("[data-detail-calculation]")!.textContent = translated.calculation;
    renderDiagnostic(item.diagnostic);
    dialog.querySelector<HTMLElement>("[data-detail-assumptions]")!.textContent = translated.assumptions;
    const sources = dialog.querySelector<HTMLElement>("[data-detail-sources]")!;
    sources.replaceChildren(sourceList(translated.sources));
    const adviceSection = dialog.querySelector<HTMLElement>("[data-detail-advice-section]")!;
    const advice = dialog.querySelector<HTMLElement>("[data-detail-advice]")!;
    advice.replaceChildren();
    adviceSection.hidden = !translated.advice;
    if (translated.advice) {
      const target = landmarksById.get(translated.advice.relatedId)!;
      const link = document.createElement("button");
      link.className = "inline-related-landmark";
      link.dataset.adviceRelated = target.id;
      link.textContent = translated.advice.relatedLabel;
      link.addEventListener("click", () => travelToRelated(target));
      advice.append(translated.advice.before, link, translated.advice.after);
    }
    const relatedSection = dialog.querySelector<HTMLElement>("[data-detail-related]")!;
    const relatedLinks = dialog.querySelector<HTMLElement>("[data-detail-related-links]")!;
    const related = (relatedLandmarkIds[item.id] ?? []).map(id => landmarksById.get(id)!).filter(landmarkIsAvailable);
    const buttons = related.map(target => {
      const translatedTarget = localized(target);
      const difference = target.position - item.position;
      const button = document.createElement("button");
      button.className = "related-landmark";
      button.dataset.relatedLandmark = target.id;
      const formattedDifference = formatDecibans(difference, locale.code);
      const direction = difference > 0 ? "right" : difference < 0 ? "left" : "neutral";
      const arrow = direction === "right" ? "⟶" : direction === "left" ? "⟵" : "↔";
      const action = `<span class="related-gain" data-related-gain data-direction="${direction}" style="--gain-color:${axisColor(difference)}"><strong>${formattedDifference}</strong><span aria-hidden="true">${arrow}</span></span>`;
      button.innerHTML = `<span class="related-art" aria-hidden="true">${target.art}</span><span data-related-title></span>${action}`;
      button.querySelector<HTMLElement>("[data-related-title]")!.textContent = translatedTarget.title;
      button.setAttribute("aria-label", `${translatedTarget.title}, ${locale.ui.difference} ${formattedDifference}`);
      translateArtwork(button, locale);
      button.addEventListener("click", () => travelToRelated(target));
      return button;
    });
    relatedLinks.replaceChildren(...buttons);
    relatedSection.hidden = buttons.length === 0;
  };

  const openDetails = (item: DisplayLandmark): void => {
    cancelTravel();
    selected = item;
    active = item;
    restoreFocus = document.activeElement as HTMLElement;
    populateDetails(item);
    showDialog();
    sceneOrigin = undefined;
    render();
    dialog.querySelector<HTMLButtonElement>("[data-close-detail]")!.focus();
  };

  const closeDetails = (returnFocus = true): void => {
    dialog.removeAttribute("open");
    selected = undefined;
    if (active && !landmarkIsAvailable(active)) active = undefined;
    sceneOrigin = undefined;
    render();
    if (!returnFocus) return;
    if (restoreFocus?.isConnected && !restoreFocus.hidden) restoreFocus.focus();
    else scale.focus();
  };

  const closeButton = dialog.querySelector<HTMLButtonElement>("[data-close-detail]")!;
  const onCloseDetails = (): void => closeDetails();
  closeButton.addEventListener("click", onCloseDetails);
  const onDialogKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetails();
    }
  };
  dialog.addEventListener("keydown", onDialogKeydown);
  const onRootKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || !dialog.open) return;
    event.preventDefault();
    closeDetails();
  };
  root.addEventListener("keydown", onRootKeydown);

  const closeIntro = (): void => {
    try { introDialog.close(); } catch { introDialog.removeAttribute("open"); }
    page.inert = false;
    try { sessionStorage.setItem(INTRO_STORAGE_KEY, "true"); } catch { /* The guide can reopen without storage. */ }
    introRestoreFocus?.focus();
    introRestoreFocus = undefined;
  };
  const openIntro = (): void => {
    /* v8 ignore next -- document.activeElement is always an HTMLElement in supported browser documents. */
    introRestoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    page.inert = true;
    try { introDialog.showModal(); } catch { introDialog.setAttribute("open", ""); }
    introDialog.querySelector<HTMLElement>("h1")!.focus();
  };
  const onIntroKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeIntro();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...introDialog.querySelectorAll<HTMLElement>('button, summary, a[href], input:not([disabled])')]
      .filter(element => !element.closest("[hidden]"));
    const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
      : (currentIndex + 1) % focusable.length;
    event.preventDefault();
    focusable[nextIndex]?.focus();
  };
  const reopenIntro = (): void => {
    if (dialog.open) closeDetails(false);
    introRestoreFocus = introButton;
    page.inert = true;
    try { introDialog.showModal(); } catch { introDialog.setAttribute("open", ""); }
    introDialog.querySelector<HTMLElement>("h1")!.focus();
  };
  introButton.addEventListener("click", reopenIntro);
  introDialog.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.addEventListener("click", closeIntro);
  introDialog.addEventListener("keydown", onIntroKeydown);

  const applyLocale = (): void => {
    document.documentElement.lang = locale.code;
    document.title = locale.ui.title;
    introButton.textContent = locale.ui.about;
    returnButton.textContent = locale.ui.returnZero;
    scale.setAttribute("aria-label", locale.ui.scaleAria);
    languageToggle.setAttribute("aria-label", locale.ui.language);
    languageMenu.setAttribute("aria-label", locale.ui.language);
    introDialog.querySelector<HTMLElement>("[data-intro-language]")!.setAttribute("aria-label", locale.ui.language);
    introDialog.querySelector<HTMLElement>("[data-intro-title]")!.textContent = locale.ui.title;
    introDialog.querySelector<HTMLElement>("[data-how-to-use]")!.textContent = locale.ui.howToUse;
    introDialog.querySelector<HTMLElement>("[data-intro-navigation]")!.textContent = locale.ui.introNavigation;
    allReferencesToggle.setAttribute("aria-label", locale.ui.allReferences);
    allReferencesToggle.setAttribute("aria-pressed", String(allReferences));
    root.querySelector<HTMLElement>("[data-all-references-help]")!.textContent = locale.ui.allReferencesHelp;
    introDialog.querySelector<HTMLElement>("[data-intro-direction-rarer]")!.textContent = locale.ui.introDirectionRarer;
    introDialog.querySelector<HTMLElement>("[data-intro-direction-likely]")!.textContent = locale.ui.introDirectionLikely;
    introDialog.querySelector<HTMLElement>("[data-intro-probability]")!.innerHTML = locale.ui.probabilityExplanation;
    introDialog.querySelector<HTMLElement>("[data-intro-odds]")!.innerHTML = locale.ui.oddsExplanation;
    introDialog.querySelector<HTMLElement>("[data-probability-to-odds]")!.textContent = locale.ui.probabilityToOdds;
    introDialog.querySelector<HTMLElement>("[data-odds-equation]")!.setAttribute("aria-label", locale.ui.oddsEquationAria);
    introDialog.querySelector<HTMLElement>("[data-probability-definition]")!.innerHTML = locale.ui.probabilityDefinition;
    introDialog.querySelector<HTMLElement>("[data-intro-decibans]")!.innerHTML = locale.ui.decibansExplanation;
    introDialog.querySelector<HTMLElement>("[data-odds-to-decibans]")!.textContent = locale.ui.oddsToDecibans;
    introDialog.querySelector<HTMLElement>("[data-decibans-equation]")!.setAttribute("aria-label", locale.ui.decibansEquationAria);
    introDialog.querySelector<HTMLElement>("[data-credit-prefix]")!.textContent = locale.ui.creditPrefix;
    introDialog.querySelector<HTMLElement>("[data-credit-title]")!.textContent = locale.ui.creditTitle;
    introDialog.querySelector<HTMLElement>("[data-credit-by]")!.textContent = locale.ui.creditBy;
    introDialog.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.textContent = locale.ui.explore;
    closeButton.setAttribute("aria-label", locale.ui.closeDetails);
    dialog.querySelector<HTMLElement>("[data-explore-on-scale]")!.textContent = locale.ui.exploreOnScale;
    dialog.querySelector<HTMLElement>("[data-calculation-label]")!.textContent = locale.ui.calculation;
    dialog.querySelector<HTMLElement>("[data-assumptions-label]")!.textContent = locale.ui.assumptions;
    dialog.querySelector<HTMLElement>("[data-advice-label]")!.textContent = locale.ui.securityAdvice;
    dialog.querySelector<HTMLElement>("[data-sources-label]")!.textContent = locale.ui.sources;
    for (const choice of root.querySelectorAll<HTMLButtonElement>("[data-locale-choice]")) choice.setAttribute("aria-pressed", String(choice.dataset.localeChoice === locale.code));
    sceneOrigin = undefined;
    render();
    if (selected && dialog.open) populateDetails(selected);
  };

  const onLanguageToggle = (): void => {
    languageMenu.hidden = !languageMenu.hidden;
    languageToggle.setAttribute("aria-expanded", String(!languageMenu.hidden));
    if (!languageMenu.hidden) languageMenu.querySelector<HTMLButtonElement>(`[data-locale-choice="${locale.code}"]`)?.focus();
  };
  const closeLanguageMenu = (restoreFocus = false): void => {
    if (languageMenu.hidden) return;
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) languageToggle.focus();
  };
  const onLanguagePickerKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || languageMenu.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    closeLanguageMenu(true);
  };
  const onRootClick = (event: Event): void => {
    const choice = (event.target as Element).closest<HTMLButtonElement>("[data-locale-choice]");
    if (!choice) {
      if (!(event.target as Element).closest("[data-language-picker]")) closeLanguageMenu();
      return;
    }
    locale = locales[choice.dataset.localeChoice as LocaleCode];
    saveLocale(locale);
    const menuChoice = choice.dataset.localeContext === "menu";
    closeLanguageMenu();
    applyLocale();
    if (menuChoice) languageToggle.focus();
  };
  languageToggle.addEventListener("click", onLanguageToggle);
  languagePicker.addEventListener("keydown", onLanguagePickerKeydown);
  root.addEventListener("click", onRootClick);

  const onAllReferencesToggle = (): void => {
    cancelTravel();
    allReferences = !allReferences;
    saveAllReferences(allReferences);
    allReferencesToggle.setAttribute("aria-pressed", String(allReferences));
    if (active && !landmarkIsAvailable(active)) active = selected;
    sceneOrigin = undefined;
    render();
  };
  allReferencesToggle.addEventListener("click", onAllReferencesToggle);

  const clearTravelPresentation = (): void => {
    gapCaption.hidden = true;
    delete scale.dataset.fastForward;
    setStyle(hyperspace, "--hyperspace-opacity", "0");
  };

  const cancelTravel = (): void => {
    if (travelFrame !== undefined) cancelAnimationFrame(travelFrame);
    travelFrame = undefined;
    travel = undefined;
    pendingInput = undefined;
    travelDirection = 0;
    travelVelocity = 0;
    clearTravelPresentation();
    persistView();
  };

  const nextLandmarkPosition = (direction: number, position: number): number | undefined => {
    const candidates = availableLandmarks()
      .map(item => item.position)
      .filter(candidate => direction > 0 ? candidate > position + 1e-9 : candidate < position - 1e-9)
      .sort((first, second) => direction > 0 ? first - second : second - first);
    return candidates[0];
  };

  const rememberTravelVelocity = (delta: number, timestamp: number): number => {
    const elapsedSinceLastInput = lastTravelInputAt === undefined ? undefined : timestamp - lastTravelInputAt;
    const elapsed = elapsedSinceLastInput !== undefined && elapsedSinceLastInput <= 80
      ? clamp(elapsedSinceLastInput, 8, 80)
      : 16;
    const velocity = delta / (elapsed / 1000);
    lastTravelInputAt = timestamp;
    return velocity;
  };

  const finishTravel = (target: number, onArrival?: () => void): void => {
    travel = undefined;
    travelDirection = 0;
    travelVelocity = 0;
    clearTravelPresentation();
    if (!onArrival) active = nearestLandmark(target);
    sceneOrigin = undefined;
    moveTo(target);
    onArrival?.();
  };

  const slopeAt = (initialSlope: number, progress: number): number => 3 * (initialSlope - 2) * progress ** 2 + 2 * (3 - 2 * initialSlope) * progress + initialSlope;

  const travelAt = ({ start, target, distance, duration, startedAt, initialSlope }: Travel, timestamp: number) => {
    const progress = clamp((timestamp - startedAt) / duration, 0, 1);
    const eased = (initialSlope - 2) * progress ** 3 + (3 - 2 * initialSlope) * progress ** 2 + initialSlope * progress;
    const slope = slopeAt(initialSlope, progress);
    return { progress, position: start + (target - start) * eased, slope, speed: distance / (duration / 1000) * Math.max(0, slope) };
  };

  const animateTravel = (timestamp: number): void => {
    travelFrame = undefined;
    if (pendingInput) {
      const { direction, delta, velocity, startedAt } = pendingInput;
      pendingInput = undefined;
      if (travel) {
        const previous = travelAt(travel, startedAt);
        view.center = previous.position;
        travelVelocity = travel.direction * previous.speed;
      }
      const carriedSpeed = direction === travelDirection ? Math.abs(travelVelocity) : 0;
      // Input requests motion; only the frame controller changes the displayed depth.
      // Preserve enough forward distance to brake the actual carried speed smoothly.
      const initialSpeed = travel && direction === travelDirection
        ? carriedSpeed
        : Math.min(Math.abs(velocity), Math.max(8, Math.abs(delta) * 2000 / MIN_TRAVEL_DURATION));
      const distance = Math.max(Math.abs(delta), carriedSpeed * MIN_TRAVEL_DURATION / 3000);
      const intended = clampToCatalogue(view.center + direction * distance);
      const target = nextLandmarkPosition(direction, intended) ?? intended;
      startTravel(target, direction, { initialVelocity: initialSpeed, startedAt }, true);
    }
    if (!travel) return;
    const { target, direction, distance, peakSlope, onArrival } = travel;
    const { progress, position, slope, speed } = travelAt(travel, timestamp);
    travelVelocity = direction * speed;
    const speedAmplitude = clamp((speed - 18) / 42, 0, 1);
    const nearPeak = clamp((slope / peakSlope - 0.55) / 0.35, 0, 1);
    const substantialJourney = clamp((distance - 5) / 15, 0, 1);
    setStyle(hyperspace, "--hyperspace-opacity", (substantialJourney * speedAmplitude * nearPeak).toFixed(3));
    view.center = position;
    if (progress < 1) {
      render();
      travelFrame = requestAnimationFrame(animateTravel);
    } else {
      finishTravel(target, onArrival);
    }
  };

  const startTravel = (target: number, direction: number, { onArrival, initialVelocity = 0, startedAt = performance.now() }: TravelOptions = {}, retargeting = false): void => {
    if (!retargeting) cancelTravel();
    if (dialog.open) closeDetails(false);
    restoreFocus = undefined;
    const start = view.center;
    const distance = Math.abs(target - start);
    const naturalDuration = clamp(140 + Math.sqrt(distance) * 180, MIN_TRAVEL_DURATION, 3800);
    const initialSpeed = Math.abs(initialVelocity);
    const duration = initialSpeed > 0
      ? Math.max(MIN_TRAVEL_DURATION, Math.min(naturalDuration, 3 * distance / initialSpeed * 1000))
      : naturalDuration;
    if (distance < 0.001 || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      finishTravel(target, onArrival);
      return;
    }
    travelDirection = direction;
    const fastForward = direction > 0 ? "outward" : "inward";
    if (scale.dataset.fastForward !== fastForward) scale.dataset.fastForward = fastForward;
    const exponent = distance / 10;
    const factor = exponent <= 6
      ? oddsFactor(exponent, locale)
      : `10<sup>${trimDecimal(exponent).replace(".", locale.decimalSeparator)}</sup>`;
    const caption = `<span>${formatDecibans(target - start, locale.code)}</span> · ${locale.ui.oddsWord} ${direction > 0 ? "×" : "÷"}<span>${factor}</span>`;
    if (gapCaption.innerHTML !== caption) gapCaption.innerHTML = caption;
    gapCaption.hidden = false;
    const initialSlope = clamp(initialSpeed * (duration / 1000) / distance, 0, 3);
    const peakSlope = Math.max(...Array.from({ length: 33 }, (_, index) => slopeAt(initialSlope, index / 32)));
    travel = { start, target, direction, distance, duration, startedAt, initialSlope, peakSlope, onArrival };
    if (!retargeting) travelFrame = requestAnimationFrame(animateTravel);
  };

  const travelInDirection = (direction: number, directDelta: number, inputVelocity: number): void => {
    if (dialog.open) closeDetails(false);
    restoreFocus = undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const intended = clampToCatalogue(view.center + directDelta);
      startTravel(nextLandmarkPosition(direction, intended) ?? intended, direction);
      return;
    }
    const previous = pendingInput;
    pendingInput = {
      direction,
      delta: previous?.direction === direction ? previous.delta + directDelta : directDelta,
      velocity: inputVelocity,
      startedAt: previous?.direction === direction ? previous.startedAt : performance.now(),
    };
    if (travelFrame === undefined) travelFrame = requestAnimationFrame(animateTravel);
  };

  const returnToZero = (): void => {
    lastTravelInputAt = undefined;
    const restoreScaleFocus = document.activeElement === returnButton;
    const direction = Math.sign(-view.center);
    startTravel(0, direction, { onArrival: () => {
      if (restoreScaleFocus) scale.focus();
    } });
  };
  returnButton.addEventListener("click", returnToZero);

  const moveThroughTouchGap = (delta: number, rebase: () => void): void => {
    const direction = Math.sign(delta);
    if (direction === 0) return;
    const velocity = rememberTravelVelocity(delta, performance.now());
    rebase();
    travelInDirection(direction, delta, velocity);
  };

  travelToRelated = (target: DisplayLandmark): void => {
    lastTravelInputAt = undefined;
    scale.focus();
    const direction = Math.sign(target.position - view.center);
    startTravel(target.position, direction, { onArrival: () => openDetails(target) });
  };

  travelToLandmark = (target: DisplayLandmark): void => {
    lastTravelInputAt = undefined;
    active = target;
    render();
    const direction = Math.sign(target.position - view.center);
    startTravel(target.position, direction, { onArrival: () => openDetails(target) });
  };

  const onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (delta === 0) return;
    const direction = Math.sign(delta);
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? sceneMetrics().height : 1;
    const depthDelta = clamp(delta * unit * 0.01, -1.2, 1.2);
    const velocity = rememberTravelVelocity(depthDelta, performance.now());
    travelInDirection(direction, depthDelta, velocity);
  };
  scale.addEventListener("wheel", onWheel, { passive: false });

  const onKeydown = (event: KeyboardEvent): void => {
    if (!root.isConnected) return;
    const direction = event.key === "ArrowRight" || event.key === "ArrowUp"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowDown"
        ? -1
        : 0;
    if (direction === 0 || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || introDialog.open || !languageMenu.hidden) return;
    const target = event.target;
    const navigatesScene = target === document.body
      || target === document.documentElement
      || target === scale
      || (target instanceof Element && target.closest(".landmark") !== null);
    if (!navigatesScene) return;
    event.preventDefault();
    lastTravelInputAt = undefined;
    travelInDirection(direction, direction, 16);
  };
  document.addEventListener("keydown", onKeydown);

  scale.addEventListener("pointerdown", event => {
    cancelTravel();
    lastTravelInputAt = undefined;
    if (dialog.open) closeDetails(false);
    if (pointers.size === 0) {
      suppressLandmarkClick = false;
    }
    if (event.pointerType === "mouse") return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY || 0 });
    dragY = event.clientY;
    touchOriginY = event.clientY;
    /* v8 ignore next -- pointer capture is an optional browser API; gesture behavior is tested with and without landmark targets. */
    if (!(event.target as Element).closest?.(".landmark")) scale.setPointerCapture?.(event.pointerId);
    if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      pinchStart = {
        distance: Math.max(Math.hypot(second.x - first.x, second.y - first.y), 1),
      };
      dragY = undefined;
      touchOriginY = undefined;
      suppressLandmarkClick = true;
      /* v8 ignore next -- pointer capture is an optional browser API. */
      scale.setPointerCapture?.(event.pointerId);
    }
  });
  scale.addEventListener("pointermove", event => {
    if (!pointers.has(event.pointerId)) return;
    /* v8 ignore next -- synthetic pointer events may omit clientY; browsers provide the numeric coordinate. */
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY || 0 });
    if (pointers.size >= 2 && pinchStart) {
      const [first, second] = [...pointers.values()];
      const distance = Math.max(Math.hypot(second.x - first.x, second.y - first.y), 1);
      const delta = -30 * Math.log10(distance / pinchStart.distance);
      moveThroughTouchGap(delta, () => {
        pinchStart = { distance };
      });
      return;
    }
    /* v8 ignore next -- dragY is absent only while the preceding active-pinch branch owns the tracked pointer. */
    if (dragY === undefined) return;
    if (!suppressLandmarkClick && Math.abs(event.clientY - touchOriginY!) <= 8) return;
    const delta = suppressLandmarkClick ? event.clientY - dragY : event.clientY - touchOriginY!;
    suppressLandmarkClick = true;
    /* v8 ignore next -- pointer capture is an optional browser API. */
    scale.setPointerCapture?.(event.pointerId);
    moveThroughTouchGap(delta * 0.025, () => {
      dragY = event.clientY;
    });
  });
  const endPointer = (event: PointerEvent): void => {
    const wasTracking = pointers.delete(event.pointerId);
    if (!wasTracking) return;
    pinchStart = undefined;
    if (pointers.size === 1) {
      dragY = [...pointers.values()][0].y;
      touchOriginY = dragY;
      return;
    }
    dragY = undefined;
    touchOriginY = undefined;
  };
  scale.addEventListener("pointerup", endPointer);
  scale.addEventListener("pointercancel", endPointer);

  const onResize = (): void => {
    metrics = undefined;
    sceneOrigin = undefined;
    render();
  };
  const persistOnPageHide = (): void => persistView();
  const persistWhenHidden = (): void => {
    if (document.visibilityState === "hidden") persistView();
  };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(scale);
  window.addEventListener("pagehide", persistOnPageHide);
  document.addEventListener("visibilitychange", persistWhenHidden);
  applyLocale();
  try {
    if (sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true") openIntro();
  } catch {
    openIntro();
  }

  return () => {
    resizeObserver.disconnect();
    closeButton.removeEventListener("click", onCloseDetails);
    dialog.removeEventListener("keydown", onDialogKeydown);
    root.removeEventListener("keydown", onRootKeydown);
    introButton.removeEventListener("click", reopenIntro);
    introDialog.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.removeEventListener("click", closeIntro);
    introDialog.removeEventListener("keydown", onIntroKeydown);
    languageToggle.removeEventListener("click", onLanguageToggle);
    languagePicker.removeEventListener("keydown", onLanguagePickerKeydown);
    root.removeEventListener("click", onRootClick);
    allReferencesToggle.removeEventListener("click", onAllReferencesToggle);
    scale.removeEventListener("wheel", onWheel);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("pagehide", persistOnPageHide);
    document.removeEventListener("visibilitychange", persistWhenHidden);
    if (travelFrame !== undefined) cancelTravel();
    else persistView();
    pointers.clear();
  };
}
