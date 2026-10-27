import { displayLandmarks, regionalLandmarkLocales, relatedLandmarkIds, type DisplayLandmark, type LandmarkDiagnostic, type Source } from "./catalogue";
import { localeChoices, locales, localizeLandmark, resolveInitialLocale, saveLocale, translateArtwork, type LocaleCode, type LocaleDefinition } from "./locales";
import { fillTemplate } from "./locales/helpers";
import { chanceAt, formatDecibans, formatOdds, formatProbability, formatProbabilityPercent } from "./probability";
import { createPreferencesMenu } from "./preferences-menu";
import { createAnalytics, type Analytics } from "./analytics";
import { getAnalyticsConfig } from "./analytics-config";
import { familyRailDefinitions, isFamilyRailLandmark, landmarkAngle, landmarkArtFactor, suppressedTitleIds, type LayoutBox, type TitleCandidate } from "./scene-layout";

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
  titleSuppressed: boolean;
}>;
type RulerTickNode = Readonly<{ element: HTMLElement; mark: HTMLElement; label: HTMLElement }>;

const STORAGE_KEY = "probability-scale-view-v1";
const INTRO_STORAGE_KEY = "probability-scale-intro-seen";
const REFERENCES_STORAGE_KEY = "probability-scale-all-references";
const NEUTRAL = [134, 147, 140] as const;
const NEGATIVE = [226, 105, 112] as const;
const POSITIVE = [74, 185, 137] as const;
const SCENE_REBASE_DECIBANS = 2;
const COMPACT_SCENE_REBASE_DECIBANS = 5;
const MIN_TRAVEL_DURATION = 220;
const DEFAULT_CURRENT_STACK_HEIGHT = 84;

export type ScaleDependencies = Readonly<{
  analytics?: Analytics;
}>;

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
const sceneRebaseDecibans = (width: number): number => width <= 640 ? COMPACT_SCENE_REBASE_DECIBANS : SCENE_REBASE_DECIBANS;

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

export function createScale(root: HTMLElement, dependencies: ScaleDependencies = {}): () => void {
  let locale = resolveInitialLocale();
  const analyticsConfig = dependencies.analytics ? null : getAnalyticsConfig();
  const analytics = dependencies.analytics ?? createAnalytics(analyticsConfig, locale.code);
  let analyticsLocale = locale.code;
  const privacyAvailable = analytics.available;
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
  let privacyRestoreFocus: HTMLElement | undefined;
  let suppressLandmarkClick = false;
  let lastPersistedCenter = view.center;

  root.innerHTML = `<div class="atlas"><div data-page-content>
    <header class="explorer-tools"><button class="return-zero" data-return-zero hidden>${locale.ui.returnZero}</button><div class="language-picker"><button type="button" class="language-toggle" data-preferences-toggle="toolbar" aria-label="${locale.ui.language}" aria-haspopup="dialog" aria-expanded="false"><span aria-hidden="true">🌐</span></button></div><button class="read-scale" data-open-intro>${locale.ui.about}</button></header>
    <section class="scale" tabindex="0" aria-label="${locale.ui.scaleAria}">
      <div class="ruler" data-ruler></div><canvas class="depth-rings" data-depth-rings aria-hidden="true"></canvas><i class="current-depth-ring" data-current-depth-ring aria-hidden="true"></i><svg class="family-rails" data-family-rails aria-hidden="true" focusable="false"></svg><div class="depth-scene" data-depth-scene><div class="landmarks" data-landmarks></div></div><div class="hyperspace" data-hyperspace aria-hidden="true"><i style="--angle:8deg;--delay:-.1s"></i><i style="--angle:48deg;--delay:-.45s"></i><i style="--angle:92deg;--delay:-.25s"></i><i style="--angle:137deg;--delay:-.6s"></i><i style="--angle:181deg;--delay:-.32s"></i><i style="--angle:224deg;--delay:-.05s"></i><i style="--angle:274deg;--delay:-.5s"></i><i style="--angle:318deg;--delay:-.2s"></i></div><p class="gap-caption" data-gap-caption aria-live="polite" hidden></p>
    </section>
  </div>
  <dialog class="scale-intro" data-scale-intro aria-modal="true" aria-labelledby="scale-intro-heading">
    <div class="intro-preferences"><button type="button" data-preferences-toggle="intro" aria-haspopup="dialog" aria-expanded="false"><span aria-hidden="true">🌐</span><span data-current-language>${locale.nativeName}</span><span aria-hidden="true">⌄</span></button></div>
    <h1 id="scale-intro-heading" tabindex="-1" data-intro-title>${locale.ui.title}</h1>
    <div class="intro-scroll">
      <p data-intro-probability>${locale.ui.probabilityExplanation}</p>
      <p data-intro-odds>${locale.ui.oddsExplanation}</p>
      <details class="math-disclosure"><summary data-probability-to-odds>${locale.ui.probabilityToOdds}</summary><p class="equation" data-odds-equation aria-label="${locale.ui.oddsEquationAria}"><var>o</var> = <var>p</var> / (1 − <var>p</var>)</p><p data-probability-definition>${locale.ui.probabilityDefinition}</p></details>
      <p><span data-intro-decibans>${locale.ui.decibansExplanation}</span> <a href="https://languagelog.ldc.upenn.edu/myl/Good1979.pdf#page=3" target="_blank" rel="noreferrer">I. J. Good (1979)</a></p>
      <details class="math-disclosure"><summary data-odds-to-decibans>${locale.ui.oddsToDecibans}</summary><p class="equation" data-decibans-equation aria-label="${locale.ui.decibansEquationAria}"><var>d</var> = 10 log<sub>10</sub>(<var>o</var>)</p></details>
      <div class="intro-directions"><svg viewBox="0 0 260 180" aria-hidden="true"><path class="intro-rope" d="M128.5 4h3l-1.5 131Z"/><g class="intro-rings"><circle cx="130" cy="135" r="142"/><circle cx="130" cy="135" r="80"/><circle cx="130" cy="135" r="45"/><circle cx="130" cy="135" r="25"/><circle cx="130" cy="135" r="14"/><circle cx="130" cy="135" r="8"/></g><g class="intro-ticks"><path d="M124 55h12M125 90h10M126 110h8"/></g><path class="intro-outward" d="m130 76V30m0 0-5 7m5-7 5 7"/><path class="intro-inward" d="m130 104v24m0 0-5-7m5 7 5-7"/></svg><p><span class="rarer" data-intro-direction-rarer>${locale.ui.introDirectionRarer}</span><span class="likely" data-intro-direction-likely>${locale.ui.introDirectionLikely}</span></p></div>
      <h2 data-how-to-use>${locale.ui.howToUse}</h2>
      <p data-intro-navigation>${locale.ui.introNavigation}</p>
    </div>
    <footer class="intro-actions"><div data-intro-consent${privacyAvailable ? "" : " hidden"}><p><span data-intro-consent-description>${locale.ui.privacy.participationDescription}</span> <button type="button" class="intro-privacy-link" data-open-privacy data-privacy-from-description>${locale.ui.privacy.more}</button></p><div class="intro-consent" role="group" aria-label="${locale.ui.privacy.participationLabel}"><button type="button" data-consent-choice="accepted">${locale.ui.privacy.participate}</button><button type="button" data-consent-choice="declined">${locale.ui.privacy.doNotParticipate}</button></div></div><div class="intro-primary-actions"><button type="button" data-open-privacy data-privacy-from-intro>${locale.ui.privacy.review}</button><button data-dismiss-intro${privacyAvailable && analytics.getConsent() === "unknown" ? " disabled" : ""}>${locale.ui.explore}</button></div><p class="intro-credit"><span data-credit-prefix>${locale.ui.creditPrefix}</span> <a href="https://www.htwins.net/scale2/" data-credit-title>${locale.ui.creditTitle}</a>, <span data-credit-by>${locale.ui.creditBy}</span></p></footer>
  </dialog>
  <dialog class="privacy-dialog" data-privacy-dialog aria-modal="true" aria-labelledby="privacy-heading"><button type="button" data-close-privacy aria-label="${locale.ui.privacy.close}">×</button><h2 id="privacy-heading" tabindex="-1" data-privacy-title>${locale.ui.privacy.title}</h2><p class="privacy-status"><strong data-privacy-dialog-status-label>${locale.ui.privacy.statusLabel}</strong> <span data-privacy-dialog-status></span></p><section aria-labelledby="privacy-analytics-heading"><h3 id="privacy-analytics-heading" data-privacy-analytics-heading>${locale.ui.privacy.analyticsHeading}</h3><p data-privacy-analytics-description>${locale.ui.privacy.analyticsDescription}</p><div class="privacy-actions" data-privacy-actions><button type="button" data-consent-choice="accepted">${locale.ui.privacy.allow}</button></div><p data-privacy-identifier-note>${locale.ui.privacy.identifierNote}</p><p data-privacy-sample-note>${locale.ui.privacy.sampleNote}</p><p data-privacy-retention-note>${locale.ui.privacy.retentionNote}</p><p data-privacy-choice-description>${locale.ui.privacy.choiceDescription}</p></section><section aria-labelledby="privacy-controller-heading"><h3 id="privacy-controller-heading" data-privacy-controller-heading>${locale.ui.privacy.controllerHeading}</h3><p data-privacy-controller-description>${locale.ui.privacy.controllerDescription}</p><p><a data-privacy-registry href="https://annuaire-entreprises.data.gouv.fr/entreprise/bycelium-919837187" target="_blank" rel="noreferrer">${locale.ui.privacy.registry}</a></p><p><span data-privacy-rights-contact>${locale.ui.privacy.rightsContact}</span> <a href="mailto:gdpr@bycelium.com">gdpr@bycelium.com</a><br><span data-privacy-general-contact>${locale.ui.privacy.generalContact}</span> <a href="mailto:contact@bycelium.com">contact@bycelium.com</a></p></section><section aria-labelledby="privacy-providers-heading"><h3 id="privacy-providers-heading" data-privacy-providers-heading>${locale.ui.privacy.providersHeading}</h3><p data-privacy-providers-description>${locale.ui.privacy.providersDescription}</p><p><a data-privacy-provider-policy href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">${locale.ui.privacy.providerPrivacy}</a> · <a data-privacy-provider-dpa href="https://vercel.com/legal/dpa" target="_blank" rel="noreferrer">${locale.ui.privacy.providerDpa}</a></p><p data-privacy-technical-logs>${locale.ui.privacy.technicalLogs}</p></section><section aria-labelledby="privacy-rights-heading"><h3 id="privacy-rights-heading" data-privacy-rights-heading>${locale.ui.privacy.rightsHeading}</h3><p data-privacy-rights-description>${locale.ui.privacy.rightsDescription}</p><p><a data-privacy-cnil href="https://www.cnil.fr/en/contact-us" target="_blank" rel="noreferrer">${locale.ui.privacy.cnil}</a></p></section><section aria-labelledby="privacy-local-heading"><h3 id="privacy-local-heading" data-privacy-local-heading>${locale.ui.privacy.localHeading}</h3><p data-privacy-local-description>${locale.ui.privacy.localDescription}</p></section></dialog>
  <dialog data-detail-panel aria-labelledby="detail-heading"><button data-close-detail aria-label="${locale.ui.closeDetails}">×</button><div data-detail-content><div data-detail-art></div><p class="eyebrow" data-detail-kind></p><h2 id="detail-heading" data-detail-title></h2><p data-detail-explanation></p><section class="detail-related" data-detail-related hidden><h3 data-explore-on-scale>${locale.ui.exploreOnScale}</h3><div data-detail-related-links></div></section><dl><div><dt data-calculation-label>${locale.ui.calculation}</dt><dd data-detail-calculation></dd></div><div data-detail-diagnostic-section hidden><dt data-diagnostic-label></dt><dd data-detail-diagnostic hidden></dd></div><div><dt data-assumptions-label>${locale.ui.assumptions}</dt><dd data-detail-assumptions></dd></div><div data-detail-advice-section hidden><dt data-advice-label>${locale.ui.securityAdvice}</dt><dd data-detail-advice></dd></div><div><dt data-sources-label>${locale.ui.sources}</dt><dd data-detail-sources></dd></div></dl></div></dialog></div>`;

  const page = root.querySelector<HTMLElement>("[data-page-content]")!;
  const scale = root.querySelector<HTMLElement>(".scale")!;
  const ruler = root.querySelector<HTMLElement>("[data-ruler]")!;
  const depthScene = root.querySelector<HTMLElement>("[data-depth-scene]")!;
  const familyRails = root.querySelector<SVGSVGElement>("[data-family-rails]")!;
  const layer = root.querySelector<HTMLElement>("[data-landmarks]")!;
  const familyRailNodes = new Map(familyRailDefinitions.map(family => {
    const rail = document.createElementNS("http://www.w3.org/2000/svg", family.path);
    rail.dataset.familyRail = family.id;
    familyRails.append(rail);
    return [family.id, rail];
  }));
  const rings = root.querySelector<HTMLCanvasElement>("[data-depth-rings]")!;
  const ringContext = rings.getContext("2d")!;
  const currentDepthRing = root.querySelector<HTMLElement>("[data-current-depth-ring]")!;
  const dialog = root.querySelector<HTMLDialogElement>("[data-detail-panel]")!;
  const introDialog = root.querySelector<HTMLDialogElement>("[data-scale-intro]")!;
  const introButton = root.querySelector<HTMLButtonElement>("[data-open-intro]")!;
  const toolbarPreferencesToggle = root.querySelector<HTMLButtonElement>('[data-preferences-toggle="toolbar"]')!;
  const introPreferences = introDialog.querySelector<HTMLElement>(".intro-preferences")!;
  const introPreferencesToggle = introPreferences.querySelector<HTMLButtonElement>('[data-preferences-toggle="intro"]')!;
  const privacyDialog = root.querySelector<HTMLDialogElement>("[data-privacy-dialog]")!;
  const introConsent = root.querySelector<HTMLElement>("[data-intro-consent]")!;
  const introChoiceGroup = introConsent.querySelector<HTMLElement>(".intro-consent")!;
  const introChoiceButtons = [...introConsent.querySelectorAll<HTMLButtonElement>("[data-consent-choice]")];
  const dismissIntroButton = introDialog.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!;
  const returnButton = root.querySelector<HTMLButtonElement>("[data-return-zero]")!;
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

  ruler.innerHTML = `<div class="depth-gauge"><div class="depth-readout-group" data-center-marker><div class="depth-readout" data-depth-readout><span class="probability"><small class="readout-label" data-probability-label></small> <span data-probability-value></span></span></div><span class="current-depth-marker" data-current-depth-marker><i></i><span class="current-readout-stack" data-current-readout-stack><span class="odds"><small class="readout-label" data-odds-label></small> <span data-odds-value></span></span><strong></strong></span></span></div><i class="depth-spoke" data-depth-spoke></i></div>`;
  const depthGauge = ruler.querySelector<HTMLElement>(".depth-gauge")!;
  const centerMarker = ruler.querySelector<HTMLElement>("[data-center-marker]")!;
  const depthReadout = ruler.querySelector<HTMLElement>("[data-depth-readout]")!;
  const probabilityLabel = ruler.querySelector<HTMLElement>("[data-probability-label]")!;
  const probabilityValue = ruler.querySelector<HTMLElement>("[data-probability-value]")!;
  const oddsLabel = ruler.querySelector<HTMLElement>("[data-odds-label]")!;
  const oddsValue = ruler.querySelector<HTMLElement>("[data-odds-value]")!;
  const currentReadoutStack = ruler.querySelector<HTMLElement>("[data-current-readout-stack]")!;
  const depthSpoke = ruler.querySelector<HTMLElement>("[data-depth-spoke]")!;
  const currentDepthMarker = ruler.querySelector<HTMLElement>("[data-current-depth-marker]")!;
  const currentDepthValue = currentDepthMarker.querySelector<HTMLElement>("strong")!;
  const eventMarker = document.createElement("span");
  eventMarker.className = "spoke-event-marker";
  eventMarker.dataset.eventMarker = "";
  eventMarker.innerHTML = "<i></i><small></small>";
  const eventMarkerLabel = eventMarker.querySelector<HTMLElement>("small")!;
  let rulerLocale: LocaleCode | undefined;
  let currentReadoutStackHeight = DEFAULT_CURRENT_STACK_HEIGHT;
  let currentReadoutStackBottomClearance = 6;
  let currentReadoutStackHeightDirty = true;
  let metrics: SceneMetrics | undefined;
  let sceneOrigin: Readonly<{ center: number; metrics: SceneMetrics }> | undefined;
  let sceneBounds: readonly [number, number] = [0, 0];

  const setText = (element: HTMLElement, value: string): void => {
    if (element.textContent !== value) element.textContent = value;
  };
  const setStyle = (element: HTMLElement | SVGElement, property: string, value: string): void => {
    if (element.style.getPropertyValue(property) !== value) element.style.setProperty(property, value);
  };
  const measureCurrentReadoutStack = (): void => {
    currentReadoutStackHeight = currentReadoutStack.offsetHeight || DEFAULT_CURRENT_STACK_HEIGHT;
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (Number.isFinite(rootFontSize)) currentReadoutStackBottomClearance = rootFontSize * .35;
    currentReadoutStackHeightDirty = false;
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
    const value = chanceAt(view.center);
    if (rulerLocale !== locale.code) {
      setText(probabilityLabel, locale.ui.probabilityLabel);
      setText(oddsLabel, locale.ui.oddsLabel);
      rulerLocale = locale.code;
      currentReadoutStackHeightDirty = true;
    }
    setText(probabilityValue, formatProbabilityPercent(value, locale.code));
    setText(oddsValue, formatOdds(view.center, locale.code));
    const extreme = Math.abs(view.center) >= 40;
    depthReadout.classList.toggle("extreme", extreme);
    setStyle(depthReadout, "top", `${currentY}px`);
    setStyle(depthReadout, "--axis-color", axisColor(view.center));
    setStyle(centerMarker, "--axis-color", axisColor(view.center));
    const fade = clamp((Math.abs(view.center) - 20) / 20, 0, 1);
    setStyle(depthReadout, "--readout-opacity", String(1 - .4 * fade));
    setStyle(currentReadoutStack, "--readout-opacity", String(.68 + .32 * fade));
    setStyle(currentDepthMarker, "left", `${centerX}px`);
    setStyle(currentDepthMarker, "top", `${currentY}px`);
    setStyle(currentDepthMarker, "--axis-color", axisColor(view.center));
    setText(currentDepthValue, formatDecibans(view.center, locale.code));
    if (currentReadoutStackHeightDirty) measureCurrentReadoutStack();
    const stackBottom = currentY - currentReadoutStackBottomClearance;
    const stackTop = stackBottom - currentReadoutStackHeight;
    const overlapsCurrentStack = (y: number, halfHeight: number): boolean => y + halfHeight >= stackTop && y - halfHeight <= stackBottom;
    for (const position of visibleTickDepths(referenceDiameter, Math.hypot(width, height), bounds)) {
      const rounded = Number(position.toFixed(8));
      const normalized = Math.abs(rounded) < 1e-8 ? 0 : rounded;
      const isMajor = Math.abs(normalized / major - Math.round(normalized / major)) < 1e-8;
      const y = projectedY(normalized);
      if (y < 0 || y > height) continue;
      const depthFactor = 10 ** ((normalized - view.center) / 10);
      const markVisible = 12 * depthFactor >= 0.5 && (isMajor || Math.abs(y - lastMarkY) >= 4 * depthFactor);
      const labelHalfHeight = 6 * depthFactor;
      const labelVisible = depthFactor >= 0.55 && Math.abs(y - lastLabelY) >= 12 * depthFactor && Math.abs(y - currentY) >= 12 && !overlapsCurrentStack(y, labelHalfHeight);
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
    const activeY = active ? projectedY(active.position) : 0;
    const activeFactor = active ? 10 ** ((active.position - view.center) / 10) : 0;
    const eventVisible = active && activeFactor >= 0.55 && activeY >= 0 && activeY <= height && Math.abs(activeY - currentY) >= 12 && !overlapsCurrentStack(activeY, 6 * activeFactor);
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
    const minimumZoom = 10 ** (-sceneRebaseDecibans(width) / 10);
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

  const rebuildScene = (nextMetrics: SceneMetrics, visibleCatalogue: readonly DisplayLandmark[], measureTitles: boolean): void => {
    const { width, height, referenceDiameter, centerX, centerY } = nextMetrics;
    familyRails.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const compactArtScale = width <= 640 ? 0.76 : 1;
    const originCenter = view.center;
    const maximumSceneZoom = 10 ** (sceneRebaseDecibans(width) / 10);
    const projected = visibleCatalogue.flatMap(item => {
      const depth = item.position - originCenter;
      const zoomFactor = 10 ** (depth / 10);
      const ringDiameter = referenceDiameter * zoomFactor;
      const radius = ringDiameter / 2;
      const angle = landmarkAngle(item.id);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const artSize = item.size * landmarkArtFactor(item.id) * zoomFactor * compactArtScale;
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
      const previous = landmarkNodes.get(item.id);
      const existing = previous ?? makeLandmark(item);
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
      setStyle(button, "--size", `${item.size * landmarkArtFactor(item.id) * compactArtScale}px`);
      setStyle(button, "--depth-scale", String(zoomFactor));
      button.dataset.ringSize = `${ringDiameter}px`;
      button.dataset.depthScale = String(zoomFactor);
      button.tabIndex = 0;
      setStyle(button, "pointer-events", "none");
      setStyle(button, "z-index", String(Math.max(1, Math.min(99, Math.round(zoomFactor * 10)))));
      landmarkNodes.set(item.id, {
        ...existing,
        baseX: x,
        baseY: y,
        baseArtSize: artSize,
        titleSuppressed: previous?.titleSuppressed ?? false,
      });
    }
    const projectedById = new Map(projected.map(item => [item.item.id, item]));
    for (const family of familyRailDefinitions) {
      const rail = familyRailNodes.get(family.id)!;
      const members = family.members.flatMap(id => {
        const member = projectedById.get(id);
        return member ? [member] : [];
      }).sort((first, second) => first.ringDiameter - second.ringDiameter);
      rail.toggleAttribute("hidden", members.length < 2);
      if (members.length < 2) continue;
      if (family.path === "line") {
        const [first, last] = [members[0], members.at(-1)!];
        rail.setAttribute("x1", String(first.x));
        rail.setAttribute("y1", String(first.y));
        rail.setAttribute("x2", String(last.x));
        rail.setAttribute("y2", String(last.y));
      } else {
        rail.setAttribute("points", members.map(member => `${member.x},${member.y}`).join(" "));
      }
    }
    if (!measureTitles) {
      sceneOrigin = { center: originCenter, metrics: nextMetrics };
      return;
    }
    const sceneNodes = [...landmarkNodes.values()];
    const readableNodes = sceneNodes.filter(node => node.baseArtSize >= 32 * landmarkArtFactor(node.item.id)
      && (width > 640 || Math.abs(node.item.position - view.center) <= 1.7));
    for (const node of readableNodes) {
      node.button.hidden = false;
      node.title.hidden = false;
    }
    const artBoxes = new Map(sceneNodes.map(node => [node.item.id, {
      left: node.baseX - node.baseArtSize / 2,
      right: node.baseX + node.baseArtSize / 2,
      top: node.baseY - node.baseArtSize / 2,
      bottom: node.baseY + node.baseArtSize / 2,
    } satisfies LayoutBox]));
    const outsideScene: readonly LayoutBox[] = [
      { left: -Infinity, right: 4, top: -Infinity, bottom: Infinity },
      { left: width - 4, right: Infinity, top: -Infinity, bottom: Infinity },
      { left: -Infinity, right: Infinity, top: -Infinity, bottom: 4 },
      { left: -Infinity, right: Infinity, top: height - 4, bottom: Infinity },
    ];
    const currentMarkerY = centerY - referenceDiameter / 2;
    const readoutBox: LayoutBox = {
      left: Math.max(0, centerX - (width <= 640 ? width / 2 : 230)),
      right: Math.min(width, centerX + (width <= 640 ? width / 2 : 260)),
      top: Math.max(0, currentMarkerY - (width <= 640 ? 100 : 86)),
      bottom: currentMarkerY + 12,
    };
    const titleMeasurements = readableNodes.map(node => ({
      node,
      width: node.title.offsetWidth,
      height: node.title.offsetHeight,
    }));
    const titleLayouts = titleMeasurements.map(({ node, width: titleWidth, height: titleHeight }) => {
      const naturalLeft = node.baseX - titleWidth / 2;
      const naturalTop = node.baseY + node.baseArtSize / 2;
      const obstructions = [
        ...outsideScene,
        readoutBox,
        ...[...artBoxes].filter(([id]) => id !== node.item.id).map(([, box]) => box),
      ];
      const makeCandidate = (left: number, top: number): TitleCandidate => ({
        id: node.item.id,
        priority: Math.abs(node.item.position - view.center),
        title: { left, right: left + titleWidth, top, bottom: top + titleHeight },
        obstructions,
      });
      const candidates = isFamilyRailLandmark(node.item.id) ? (() => {
        const clampLeft = (left: number): number => Math.min(Math.max(left, 8), width - titleWidth - 8);
        const centeredLeft = clampLeft(naturalLeft);
        const besideArtLeft = clampLeft(node.baseX - node.baseArtSize / 2 - titleWidth - 6);
        return [
          makeCandidate(centeredLeft, naturalTop),
          makeCandidate(besideArtLeft, naturalTop),
          makeCandidate(besideArtLeft, node.baseY - titleHeight / 2),
          makeCandidate(besideArtLeft, node.baseY - node.baseArtSize / 2 - titleHeight - 6),
          makeCandidate(centeredLeft, naturalTop + titleHeight + 4),
          makeCandidate(besideArtLeft, naturalTop + titleHeight + 4),
        ];
      })() : [makeCandidate(naturalLeft, naturalTop)];
      const candidate = candidates.find(option => suppressedTitleIds([option]).size === 0) ?? candidates[0];
      return { node, candidate, naturalLeft, naturalTop };
    });
    for (const { node, candidate, naturalLeft, naturalTop } of titleLayouts) {
      setStyle(node.title, "--title-x", `${candidate.title.left - naturalLeft}px`);
      setStyle(node.title, "--title-y", `${candidate.title.top - naturalTop}px`);
    }
    const titleCandidates = titleLayouts.map(({ candidate }) => candidate);
    const suppressedTitles = suppressedTitleIds(titleCandidates);
    for (const [id, node] of landmarkNodes) landmarkNodes.set(id, { ...node, titleSuppressed: suppressedTitles.has(node.item.id) });
    sceneOrigin = { center: originCenter, metrics: nextMetrics };
  };

  const updateSceneProjection = (nextMetrics: SceneMetrics): void => {
    if (!sceneOrigin || sceneOrigin.metrics !== nextMetrics || Math.abs(view.center - sceneOrigin.center) >= sceneRebaseDecibans(nextMetrics.width)) {
      const visibleCatalogue = availableLandmarks();
      sceneBounds = [Math.min(...visibleCatalogue.map(item => item.position)), Math.max(...visibleCatalogue.map(item => item.position))];
      rebuildScene(nextMetrics, visibleCatalogue, travel === undefined);
    }
    const sceneZoom = 10 ** ((sceneOrigin!.center - view.center) / 10);
    const inverseZoom = 1 / sceneZoom;
    const sceneTransform = `scale(${sceneZoom})`;
    setStyle(familyRails, "transform", sceneTransform);
    setStyle(depthScene, "transform", sceneTransform);
    const sceneZoomText = String(sceneZoom);
    if (depthScene.dataset.sceneZoom !== sceneZoomText) depthScene.dataset.sceneZoom = sceneZoomText;
    const { width, height, centerX, centerY, referenceDiameter } = nextMetrics;
    const updateTitles = travel === undefined;
    for (const { button, title, item, baseX, baseY, baseArtSize, titleSuppressed } of landmarkNodes.values()) {
      const artSize = baseArtSize * sceneZoom;
      const x = centerX + (baseX - centerX) * sceneZoom;
      const y = centerY + (baseY - centerY) * sceneZoom;
      const visible = artSize >= 0.5 && x + artSize / 2 >= 0 && x - artSize / 2 <= width && y + artSize / 2 >= 0 && y - artSize / 2 <= height;
      if (button.hidden === visible) button.hidden = !visible;
      if (!updateTitles) continue;
      const revealSuppressedTitle = active?.id === item.id;
      const readable = visible && artSize >= 32 * landmarkArtFactor(item.id) && (width > 640 || Math.abs(item.position - view.center) <= 1.7)
        && (!titleSuppressed || revealSuppressedTitle);
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
    analytics.openExample(item.id);
  };

  const closeDetails = (returnFocus = true): void => {
    const wasOpen = dialog.open;
    dialog.removeAttribute("open");
    selected = undefined;
    if (active && !landmarkIsAvailable(active)) active = undefined;
    sceneOrigin = undefined;
    render();
    if (wasOpen) analytics.closeExample();
    if (!returnFocus) return;
    if (restoreFocus?.isConnected && !restoreFocus.hidden) restoreFocus.focus();
    else scale.focus();
  };

  const closeButton = dialog.querySelector<HTMLButtonElement>("[data-close-detail]")!;
  const preferencesMenu = createPreferencesMenu({
    root,
    localeChoices,
    locale,
    allReferences,
    onLocaleChange: selectLocale,
    onAllReferencesChange: setAllReferences,
  });
  toolbarPreferencesToggle.setAttribute("aria-controls", preferencesMenu.element.id);
  introPreferencesToggle.setAttribute("aria-controls", preferencesMenu.element.id);
  const openToolbarPreferences = (): void => preferencesMenu.open({ anchor: toolbarPreferencesToggle, parent: root, placement: "toolbar" });
  const openIntroPreferences = (): void => preferencesMenu.open({ anchor: introPreferencesToggle, parent: introPreferences, placement: "intro" });
  toolbarPreferencesToggle.addEventListener("click", openToolbarPreferences);
  introPreferencesToggle.addEventListener("click", openIntroPreferences);
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
    if (event.key !== "Escape" || event.defaultPrevented || !dialog.open) return;
    event.preventDefault();
    closeDetails();
  };
  root.addEventListener("keydown", onRootKeydown);

  const consentStatus = (): string => {
    if (!privacyAvailable) return locale.ui.privacy.statusUnavailable;
    const consent = analytics.getConsent();
    if (consent === "accepted") return locale.ui.privacy.statusAccepted;
    if (consent === "declined") return locale.ui.privacy.statusDeclined;
    return locale.ui.privacy.statusUnknown;
  };
  const renderPrivacyState = (): void => {
    const consent = analytics.getConsent();
    const status = consentStatus();
    const privacyAction = privacyDialog.querySelector<HTMLButtonElement>("[data-consent-choice]")!;
    root.querySelector<HTMLElement>("[data-privacy-dialog-status]")!.textContent = status;
    root.querySelector<HTMLElement>("[data-privacy-actions]")!.hidden = !privacyAvailable;
    introConsent.hidden = !privacyAvailable;
    dismissIntroButton.disabled = privacyAvailable && consent === "unknown";
    const focusedChoice = introChoiceButtons.find(choice => document.activeElement === choice);
    if (consent === "unknown") {
      introChoiceGroup.hidden = false;
      introChoiceGroup.classList.remove("single-choice");
      introChoiceButtons[0]!.hidden = false;
      introChoiceButtons[0]!.textContent = locale.ui.privacy.participate;
      introChoiceButtons[1]!.hidden = false;
      introChoiceButtons[1]!.textContent = locale.ui.privacy.doNotParticipate;
    } else if (consent === "declined") {
      introChoiceGroup.hidden = false;
      introChoiceGroup.classList.add("single-choice");
      introChoiceButtons[0]!.hidden = false;
      introChoiceButtons[0]!.textContent = locale.ui.privacy.allow;
      introChoiceButtons[1]!.hidden = true;
    } else {
      introChoiceGroup.hidden = true;
      introChoiceGroup.classList.remove("single-choice");
    }
    if (focusedChoice && introDialog.open && (consent === "accepted" || focusedChoice.hidden)) dismissIntroButton.focus();
    const withdraw = consent === "accepted";
    privacyAction.dataset.consentChoice = withdraw ? "declined" : "accepted";
    privacyAction.textContent = withdraw ? locale.ui.privacy.withdraw : locale.ui.privacy.allow;
  };
  const syncExampleVisibility = (): void => {
    analytics.setExampleVisible(dialog.open && !introDialog.open && !privacyDialog.open);
  };
  const showIntro = (captureRestore = true): void => {
    preferencesMenu.close(false);
    if (captureRestore) {
      /* v8 ignore next -- document.activeElement is always an HTMLElement in supported browser documents. */
      introRestoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    }
    page.inert = true;
    try { introDialog.showModal(); } catch { introDialog.setAttribute("open", ""); }
    syncExampleVisibility();
    introDialog.querySelector<HTMLElement>("h1")!.focus();
  };
  const hideIntro = (remember = true, restore = true, clearRestore = true, allowUnanswered = false): void => {
    if (!allowUnanswered && privacyAvailable && analytics.getConsent() === "unknown") {
      introConsent.querySelector<HTMLButtonElement>("[data-consent-choice]")!.focus();
      return;
    }
    preferencesMenu.close(false);
    try { introDialog.close(); } catch { introDialog.removeAttribute("open"); }
    page.inert = false;
    if (remember) {
      try { sessionStorage.setItem(INTRO_STORAGE_KEY, "true"); } catch { /* The guide can reopen without storage. */ }
    }
    if (restore) introRestoreFocus?.focus();
    if (clearRestore) introRestoreFocus = undefined;
    syncExampleVisibility();
  };
  const closeIntro = (): void => hideIntro();
  const trapModalFocus = (event: KeyboardEvent, modal: HTMLDialogElement): void => {
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll<HTMLElement>('button:not([disabled]), summary, a[href], input:not([disabled]), select:not([disabled])')]
      .filter(element => !element.closest("[hidden]") && !(element instanceof HTMLInputElement && element.type === "radio" && !element.checked));
    const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
      : (currentIndex + 1) % focusable.length;
    event.preventDefault();
    focusable[nextIndex]?.focus();
  };
  const onIntroKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeIntro();
      return;
    }
    trapModalFocus(event, introDialog);
  };
  const onIntroCancel = (event: Event): void => {
    event.preventDefault();
    if (preferencesMenu.isOpen()) {
      preferencesMenu.close();
      return;
    }
    closeIntro();
  };
  const reopenIntro = (): void => {
    preferencesMenu.close(false);
    introRestoreFocus = introButton;
    showIntro(false);
  };
  const openPrivacy = (opener: HTMLElement): void => {
    privacyRestoreFocus = opener;
    hideIntro(false, false, false, true);
    page.inert = true;
    try { privacyDialog.showModal(); } catch { privacyDialog.setAttribute("open", ""); }
    syncExampleVisibility();
    privacyDialog.querySelector<HTMLElement>("[data-privacy-title]")!.focus();
  };
  const closePrivacy = (): void => {
    try { privacyDialog.close(); } catch { privacyDialog.removeAttribute("open"); }
    showIntro(false);
    privacyRestoreFocus!.focus();
    privacyRestoreFocus = undefined;
  };
  const onPrivacyKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePrivacy();
      return;
    }
    trapModalFocus(event, privacyDialog);
  };
  const onPrivacyCancel = (event: Event): void => {
    event.preventDefault();
    closePrivacy();
  };
  const onPrivacyClick = (event: Event): void => {
    const target = event.target as Element;
    const choice = target.closest<HTMLButtonElement>("[data-consent-choice]");
    if (choice) {
      analytics.setConsent(choice.dataset.consentChoice === "accepted" ? "accepted" : "declined");
      renderPrivacyState();
      return;
    }
    const opener = target.closest<HTMLElement>("[data-open-privacy]");
    if (opener) openPrivacy(opener);
  };
  introButton.addEventListener("click", reopenIntro);
  introDialog.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.addEventListener("click", closeIntro);
  introDialog.addEventListener("keydown", onIntroKeydown);
  introDialog.addEventListener("cancel", onIntroCancel);
  privacyDialog.querySelector<HTMLButtonElement>("[data-close-privacy]")!.addEventListener("click", closePrivacy);
  privacyDialog.addEventListener("keydown", onPrivacyKeydown);
  privacyDialog.addEventListener("cancel", onPrivacyCancel);
  root.addEventListener("click", onPrivacyClick);
  const onConsentChange = (): void => {
    renderPrivacyState();
    if (privacyAvailable && analytics.getConsent() === "unknown" && !introDialog.open && !privacyDialog.open) showIntro();
  };
  const unsubscribeConsent = analytics.subscribe(onConsentChange);

  const applyLocale = (): void => {
    if (analyticsLocale !== locale.code) {
      analytics.setLocale(locale.code);
      analyticsLocale = locale.code;
    }
    document.documentElement.lang = locale.code;
    document.title = locale.ui.title;
    introButton.textContent = locale.ui.about;
    returnButton.textContent = locale.ui.returnZero;
    scale.setAttribute("aria-label", locale.ui.scaleAria);
    toolbarPreferencesToggle.setAttribute("aria-label", locale.ui.language);
    introPreferencesToggle.setAttribute("aria-label", `${locale.ui.language}: ${locale.nativeName}`);
    introPreferencesToggle.querySelector<HTMLElement>("[data-current-language]")!.textContent = locale.nativeName;
    preferencesMenu.update(locale, allReferences);
    introDialog.querySelector<HTMLElement>("[data-intro-title]")!.textContent = locale.ui.title;
    introDialog.querySelector<HTMLElement>("[data-how-to-use]")!.textContent = locale.ui.howToUse;
    introDialog.querySelector<HTMLElement>("[data-intro-navigation]")!.textContent = locale.ui.introNavigation;
    introDialog.querySelector<HTMLElement>("[data-privacy-from-intro]")!.textContent = locale.ui.privacy.review;
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
    dismissIntroButton.textContent = locale.ui.explore;
    introConsent.querySelector<HTMLElement>("[role=group]")!.setAttribute("aria-label", locale.ui.privacy.participationLabel);
    introConsent.querySelector<HTMLElement>("[data-intro-consent-description]")!.textContent = locale.ui.privacy.participationDescription;
    introConsent.querySelector<HTMLButtonElement>("[data-privacy-from-description]")!.textContent = locale.ui.privacy.more;
    introChoiceButtons[0]!.textContent = locale.ui.privacy.participate;
    introChoiceButtons[1]!.textContent = locale.ui.privacy.doNotParticipate;
    privacyDialog.querySelector<HTMLButtonElement>("[data-close-privacy]")!.setAttribute("aria-label", locale.ui.privacy.close);
    privacyDialog.querySelector<HTMLElement>("[data-privacy-title]")!.textContent = locale.ui.privacy.title;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-dialog-status-label]")!.textContent = locale.ui.privacy.statusLabel;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-controller-heading]")!.textContent = locale.ui.privacy.controllerHeading;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-controller-description]")!.textContent = locale.ui.privacy.controllerDescription;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-registry]")!.textContent = locale.ui.privacy.registry;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-rights-contact]")!.textContent = locale.ui.privacy.rightsContact;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-general-contact]")!.textContent = locale.ui.privacy.generalContact;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-analytics-heading]")!.textContent = locale.ui.privacy.analyticsHeading;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-analytics-description]")!.textContent = locale.ui.privacy.analyticsDescription;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-identifier-note]")!.textContent = locale.ui.privacy.identifierNote;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-sample-note]")!.textContent = locale.ui.privacy.sampleNote;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-retention-note]")!.textContent = locale.ui.privacy.retentionNote;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-choice-description]")!.textContent = locale.ui.privacy.choiceDescription;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-providers-heading]")!.textContent = locale.ui.privacy.providersHeading;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-providers-description]")!.textContent = locale.ui.privacy.providersDescription;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-provider-policy]")!.textContent = locale.ui.privacy.providerPrivacy;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-provider-dpa]")!.textContent = locale.ui.privacy.providerDpa;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-technical-logs]")!.textContent = locale.ui.privacy.technicalLogs;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-rights-heading]")!.textContent = locale.ui.privacy.rightsHeading;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-rights-description]")!.textContent = locale.ui.privacy.rightsDescription;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-cnil]")!.textContent = locale.ui.privacy.cnil;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-local-heading]")!.textContent = locale.ui.privacy.localHeading;
    privacyDialog.querySelector<HTMLElement>("[data-privacy-local-description]")!.textContent = locale.ui.privacy.localDescription;
    closeButton.setAttribute("aria-label", locale.ui.closeDetails);
    dialog.querySelector<HTMLElement>("[data-explore-on-scale]")!.textContent = locale.ui.exploreOnScale;
    dialog.querySelector<HTMLElement>("[data-calculation-label]")!.textContent = locale.ui.calculation;
    dialog.querySelector<HTMLElement>("[data-assumptions-label]")!.textContent = locale.ui.assumptions;
    dialog.querySelector<HTMLElement>("[data-advice-label]")!.textContent = locale.ui.securityAdvice;
    dialog.querySelector<HTMLElement>("[data-sources-label]")!.textContent = locale.ui.sources;
    sceneOrigin = undefined;
    render();
    if (selected && dialog.open) populateDetails(selected);
    renderPrivacyState();
  };

  function selectLocale(code: LocaleCode): void {
    locale = locales[code];
    saveLocale(locale);
    applyLocale();
  }

  function setAllReferences(checked: boolean): void {
    cancelTravel();
    allReferences = checked;
    saveAllReferences(allReferences);
    preferencesMenu.update(locale, allReferences);
    if (active && !landmarkIsAvailable(active)) active = selected;
    sceneOrigin = undefined;
    render();
    if (selected && dialog.open) populateDetails(selected);
  }

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
    if (direction === 0 || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || introDialog.open || privacyDialog.open) return;
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
    const interruptedTravel = travelFrame !== undefined || travel !== undefined || pendingInput !== undefined;
    cancelTravel();
    if (interruptedTravel) {
      sceneOrigin = undefined;
      render();
    }
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
    currentReadoutStackHeightDirty = true;
    render();
  };
  const persistOnPageHide = (): void => persistView();
  const persistWhenHidden = (): void => {
    if (document.visibilityState === "hidden") persistView();
  };
  const readoutResizeObserver = new ResizeObserver(entries => {
    const height = entries[0]?.borderBoxSize[0]?.blockSize ?? entries[0]?.contentRect.height ?? 0;
    if (height > 0 && height !== currentReadoutStackHeight) {
      currentReadoutStackHeight = height;
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (Number.isFinite(rootFontSize)) currentReadoutStackBottomClearance = rootFontSize * .35;
      render();
    }
  });
  readoutResizeObserver.observe(currentReadoutStack);
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(scale);
  window.addEventListener("pagehide", persistOnPageHide);
  document.addEventListener("visibilitychange", persistWhenHidden);
  applyLocale();
  try {
    if (sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true" || (privacyAvailable && analytics.getConsent() === "unknown")) showIntro();
  } catch {
    showIntro();
  }

  return () => {
    resizeObserver.disconnect();
    readoutResizeObserver.disconnect();
    closeButton.removeEventListener("click", onCloseDetails);
    dialog.removeEventListener("keydown", onDialogKeydown);
    root.removeEventListener("keydown", onRootKeydown);
    introButton.removeEventListener("click", reopenIntro);
    introDialog.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.removeEventListener("click", closeIntro);
    introDialog.removeEventListener("keydown", onIntroKeydown);
    introDialog.removeEventListener("cancel", onIntroCancel);
    toolbarPreferencesToggle.removeEventListener("click", openToolbarPreferences);
    introPreferencesToggle.removeEventListener("click", openIntroPreferences);
    preferencesMenu.destroy();
    privacyDialog.querySelector<HTMLButtonElement>("[data-close-privacy]")!.removeEventListener("click", closePrivacy);
    privacyDialog.removeEventListener("keydown", onPrivacyKeydown);
    privacyDialog.removeEventListener("cancel", onPrivacyCancel);
    root.removeEventListener("click", onPrivacyClick);
    scale.removeEventListener("wheel", onWheel);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("pagehide", persistOnPageHide);
    document.removeEventListener("visibilitychange", persistWhenHidden);
    if (travelFrame !== undefined) cancelTravel();
    else persistView();
    unsubscribeConsent();
    analytics.dispose();
    pointers.clear();
  };
}
