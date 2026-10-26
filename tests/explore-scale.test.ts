import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { catalogueOrder, displayLandmarks, landmarkModels, relatedLandmarkIds, sourceReferences } from "../src/catalogue";
import { localeChoices } from "../src/locales";
import { createScale } from "../src/scale";

class TestResizeObserver {
  static instances: TestResizeObserver[] = [];
  constructor(private readonly callback: ResizeObserverCallback) {
    TestResizeObserver.instances.push(this);
  }
  observe(): void {}
  disconnect(): void {}
  fire(): void {
    this.callback([], this as unknown as ResizeObserver);
  }
}

class TestFrameClock {
  private timestamp = 0;
  private nextFrameId = 1;
  private readonly callbacks = new Map<number, FrameRequestCallback>();
  readonly cancelled: number[] = [];

  constructor() {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      const frameId = this.nextFrameId;
      this.nextFrameId += 1;
      this.callbacks.set(frameId, callback);
      return frameId;
    });
    vi.stubGlobal("cancelAnimationFrame", (frameId: number) => {
      this.cancelled.push(frameId);
      this.callbacks.delete(frameId);
    });
    vi.spyOn(performance, "now").mockImplementation(() => this.timestamp);
  }

  elapseTo(timestamp: number): void {
    this.timestamp = timestamp;
  }

  advanceTo(timestamp: number): void {
    this.elapseTo(timestamp);
    const callbacks = [...this.callbacks.values()];
    this.callbacks.clear();
    for (const callback of callbacks) callback(timestamp);
  }

  get pendingFrames(): number {
    return this.callbacks.size;
  }
}

type DrawnCircle = Readonly<{ x: number; y: number; radius: number; width: number; alpha: number }>;

class RecordingCanvasContext {
  readonly circles: DrawnCircle[] = [];
  transform: readonly number[] = [];
  lineWidth = 1;
  globalAlpha = 1;
  strokeStyle = "";
  private path: { x: number; y: number; radius: number }[] = [];

  setTransform(...values: number[]): void { this.transform = values; }
  clearRect(): void { this.circles.length = 0; }
  beginPath(): void { this.path = []; }
  moveTo(): void {}
  arc(x: number, y: number, radius: number): void { this.path.push({ x, y, radius }); }
  stroke(): void {
    this.circles.push(...this.path.map(circle => ({ ...circle, width: this.lineWidth, alpha: this.globalAlpha })));
  }
}

let guideContext: RecordingCanvasContext;

const drawnGuideAt = (position: number): DrawnCircle | undefined => {
  const center = Number(document.querySelector<HTMLElement>(".scale")!.dataset.depth);
  const diameter = Number.parseFloat(document.querySelector<HTMLElement>("[data-current-depth-ring]")!.style.width);
  const radius = diameter / 2 * 10 ** ((position - center) / 10);
  return guideContext.circles.find(circle => Math.abs(circle.radius - radius) < 1e-8);
};

let scaleWidth = 1200;

const render = (width = 1200, introSeen = true, allReferences = true) => {
  scaleWidth = width;
  document.body.innerHTML = '<main id="app"></main>';
  if (introSeen) sessionStorage.setItem("probability-scale-intro-seen", "true");
  try {
    if (allReferences) localStorage.setItem("probability-scale-all-references", "true");
  } catch {
    // Individual storage-fallback scenarios install an unavailable Storage implementation.
  }
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() { return this.classList.contains("scale") ? scaleWidth : 0; },
  });
  const dispose = createScale(document.querySelector<HTMLElement>("#app")!);
  return { dispose };
};

const sceneArtwork = (id: string): Document => {
  const source = document.querySelector<HTMLImageElement>(`[data-landmark="${id}"] .art img`)!.getAttribute("src")!;
  return new DOMParser().parseFromString(decodeURIComponent(source.slice(source.indexOf(",") + 1)), "image/svg+xml");
};

describe("public probability exploration", () => {
  beforeEach(() => {
    TestResizeObserver.instances = [];
    vi.stubGlobal("ResizeObserver", TestResizeObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    guideContext = new RecordingCanvasContext();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(guideContext as unknown as CanvasRenderingContext2D);
    history.replaceState(null, "", "/");
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("opens on a restrained radial scene with a −5 to +5 dBan ruler", () => {
    render();

    expect(document.querySelector("h1")?.textContent).toBe("The Scale of Probability");
    const currentRingDiameter = Number.parseFloat(document.querySelector<HTMLElement>("[data-current-depth-ring]")!.style.width);
    for (const landmark of document.querySelectorAll<HTMLElement>("[data-landmark]")) {
      const item = displayLandmarks.find(candidate => candidate.id === landmark.dataset.landmark)!;
      expect(Number(landmark.dataset.depthScale)).toBeCloseTo(10 ** (item.position / 10), 10);
      expect(Number.parseFloat(landmark.dataset.ringSize!) / currentRingDiameter).toBeCloseTo(10 ** (item.position / 10), 10);
    }
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("0 dBan");
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("50%");
    expect(document.querySelector("[data-center-marker] .probability")?.textContent).toBe("Probability: 50%");
    expect(document.querySelector("[data-center-marker] .odds")?.textContent).toBe("Odds: 1 to 1");
    expect(document.querySelector('[data-tick="-5"]')?.textContent).toContain("−5 dBan");
    expect(document.querySelector('[data-tick="-4"] small')?.textContent).toBe("−4 dBan");
    expect(document.querySelectorAll(".spoke-tick small:not([hidden])").length).toBeGreaterThanOrEqual(2);
    expect(document.querySelector("[data-ruler]")?.textContent?.match(/50%/g)).toHaveLength(1);
    expect(document.querySelector('[data-landmark="coin-heads"] small')).toBeNull();
    expect(document.querySelector('[data-landmark="coin-heads"] .landmark-title')?.textContent).toBe("heads or tails");
    expect(document.querySelector('[data-landmark="coin-heads"]')?.getAttribute("aria-label")).toContain("A chosen side of a fair coin");
    expect(document.querySelector("[data-detail-probability]")).toBeNull();
    expect(document.querySelector("[data-reset]")).toBeNull();
    expect(document.querySelector("[data-jump]")).toBeNull();
    expect(document.querySelector("[data-zoom-in], [data-zoom-out]")).toBeNull();
    expect(document.querySelector<HTMLButtonElement>("[data-return-zero]")?.hidden).toBe(true);
    expect(document.querySelector("[data-stem-for]")).toBeNull();
    const coinRing = document.querySelector<HTMLElement>("[data-current-depth-ring]")!;
    expect(coinRing).not.toBeNull();
    expect(guideContext.circles.length).toBeGreaterThan(10);
    expect(guideContext.circles.filter(circle => circle.alpha === 0.2).length).toBeGreaterThanOrEqual(2);
    expect(document.querySelector<HTMLElement>('[data-landmark="coin-heads"]')?.dataset.ringSize).toBe(coinRing.style.width);
    expect(document.querySelector<HTMLElement>("[data-current-depth-marker]")?.style.getPropertyValue("--axis-color")).toBe("rgb(134 147 140)");

    const coin = document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!;
    coin.dispatchEvent(new MouseEvent("mouseenter"));
    expect(document.querySelector("[data-event-marker]")).toBeNull();
    coin.dispatchEvent(new MouseEvent("mouseleave"));
    expect(document.querySelector("[data-event-marker]")).toBeNull();
    coin.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(Number(document.querySelector<HTMLElement>(".scale")?.dataset.depth)).toBeGreaterThan(0);
    const ordinaryScaleKey = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
    document.querySelector<HTMLElement>(".scale")!.dispatchEvent(ordinaryScaleKey);
    expect(ordinaryScaleKey.defaultPrevented).toBe(false);

    const pair = document.querySelector<HTMLButtonElement>('[data-landmark="holdem-one-pair"]')!;
    pair.click();
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("best five of seven cards");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).not.toMatch(/Deal|count success/);
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("58,627,800");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("Two private cards and five community cards");
    expect(document.querySelector("[data-detail-sources]")?.textContent).toContain("Brian Alspach");
    document.querySelector<HTMLButtonElement>("[data-close-detail]")!.click();
    expect(document.querySelector('[data-landmark="one-pair"]')).toBeNull();
  });

  it("maps the depth gauge onto one vertical spoke through the concentric rings", () => {
    render();

    const spoke = document.querySelector<HTMLElement>("[data-depth-spoke]")!;
    const readout = document.querySelector<HTMLElement>("[data-depth-readout]")!;
    const current = document.querySelector<HTMLElement>("[data-current-depth-marker]")!;
    const tick = document.querySelector<HTMLElement>('[data-tick="-1"]')!;
    const tickRing = drawnGuideAt(-1)!;
    expect(spoke).not.toBeNull();
    expect(readout.querySelector(".probability")?.textContent).toBe("Probability: 50%");
    expect(readout.querySelector(".odds")?.textContent).toBe("Odds: 1 to 1");
    expect(current.textContent).toContain("0 dBan");
    expect(Number.parseFloat(tick.style.left)).toBe(600);
    expect(Number.parseFloat(tick.style.top)).toBeCloseTo(160 - tickRing.radius, 8);
    expect(document.querySelector<HTMLElement>("[data-ruler]")?.style.getPropertyValue("--axis-gradient")).toBe("");

    const coin = document.querySelector<HTMLElement>('[data-landmark="coin-heads"]')!;
    expect(Number.parseFloat(coin.style.top) + 40).toBeGreaterThan(272);
  });

  it("draws gray guide circles only for integral dBan ticks with pixel-sharp strokes throughout travel", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.stubGlobal("devicePixelRatio", 2);
    render();
    const guides = document.querySelector<HTMLCanvasElement>("canvas[data-depth-rings]");
    expect(guides).not.toBeNull();
    expect([guides!.width, guides!.height]).toEqual([2400, 640]);
    expect(guideContext.transform).toEqual([2, 0, 0, 2, 0, 0]);
    const referenceDiameter = Number.parseFloat(document.querySelector<HTMLElement>("[data-current-depth-ring]")!.style.width);
    const scale = document.querySelector<HTMLElement>(".scale")!;
    for (const timestamp of [0, 32, 96, 4000]) {
      if (timestamp === 0) scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 20, cancelable: true }));
      else clock.advanceTo(timestamp);
      const center = Number(scale.dataset.depth);
      const expectedRadius = referenceDiameter / 2 * 10 ** ((-1 - center) / 10);
      expect(guideContext.circles.some(circle => Math.abs(circle.radius - expectedRadius) < 1e-8)).toBe(true);
      expect(guideContext.circles.every(circle => circle.width === 1 && circle.x === 600 && circle.y === 160)).toBe(true);
      for (const circle of guideContext.circles) {
        const position = center + 10 * Math.log10(circle.radius / (referenceDiameter / 2));
        const tick = Math.round(position);
        expect(position).toBeCloseTo(tick, 8);
        expect(circle.alpha).toBe(tick % 5 === 0 ? 0.2 : 0.11);
      }
      expect(guideContext.circles.some(circle => Math.abs(circle.radius - referenceDiameter / 2) < 1e-8)).toBe(false);
    }
  });

  it("zooms the radial scene through one common transform between bounded geometry snapshots", () => {
    vi.useFakeTimers();
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render();

    const scene = document.querySelector<HTMLElement>("[data-depth-scene]")!;
    const coin = document.querySelector<HTMLElement>('[data-landmark="coin-heads"]')!;
    const initialLeft = coin.style.left;
    const initialTop = coin.style.top;
    const initialScale = Number(coin.dataset.depthScale);
    const scale = document.querySelector<HTMLElement>(".scale")!;

    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true }));
    clock.advanceTo(16);
    const movedCenter = Number(scale.dataset.depth);
    const sceneZoom = Number(scene.dataset.sceneZoom);

    expect(movedCenter).toBeGreaterThan(0);
    expect(movedCenter).toBeLessThan(0.2);
    expect(sceneZoom).toBeCloseTo(10 ** (-movedCenter / 10), 10);
    expect(drawnGuideAt(-1)).toBeDefined();
    expect(initialScale * sceneZoom).toBeCloseTo(10 ** (-movedCenter / 10), 10);
    expect([coin.style.left, coin.style.top]).toEqual([initialLeft, initialTop]);

    clock.advanceTo(30);
    expect(Number(scene.dataset.sceneZoom)).not.toBe(sceneZoom);

    clock.advanceTo(4000);
    expect(scene.style.transform).toBe("scale(1)");
  });

  it("persists an in-flight view at lifecycle boundaries instead of every animation frame", () => {
    vi.useFakeTimers();
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    history.replaceState(null, "", "#d=100");
    render();
    const writes = vi.spyOn(Storage.prototype, "setItem");
    const scale = document.querySelector<HTMLElement>(".scale")!;

    document.querySelector<HTMLButtonElement>("[data-return-zero]")!.click();
    writes.mockClear();
    clock.advanceTo(30);
    expect(writes.mock.calls.filter(([key]) => key === "probability-scale-view-v1")).toHaveLength(0);

    document.dispatchEvent(new Event("visibilitychange"));
    expect(writes.mock.calls.filter(([key]) => key === "probability-scale-view-v1")).toHaveLength(0);
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(writes.mock.calls.filter(([key]) => key === "probability-scale-view-v1")).toHaveLength(1);
    clock.advanceTo(60);
    window.dispatchEvent(new PageTransitionEvent("pagehide"));
    const viewWrites = writes.mock.calls.filter(([key]) => key === "probability-scale-view-v1");
    expect(viewWrites).toHaveLength(2);
    expect(JSON.parse(String(viewWrites[1]![1])).center).toBeCloseTo(Number(scale.dataset.depth), 10);
  });

  it("reprojects the scene when its measured width changes", () => {
    render(1200);
    const coin = document.querySelector<HTMLElement>('[data-landmark="coin-heads"]')!;
    const initialLeft = coin.style.left;

    scaleWidth = 800;
    TestResizeObserver.instances.at(-1)!.fire();

    expect(coin.style.left).not.toBe(initialLeft);
    expect(Number.parseFloat(coin.style.left)).toBeCloseTo(Number.parseFloat(initialLeft) - 200, 8);
  });

  it("keeps subpixel landmark art keyboard accessible down to its geometric visibility threshold", () => {
    history.replaceState(null, "", "#d=20");
    render();

    const coin = document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!;
    expect(coin).not.toBeNull();
    expect(80 * Number(coin.dataset.depthScale)).toBeCloseTo(0.8, 10);
    expect(coin.hidden).toBe(false);
    expect(coin.tabIndex).toBe(0);
    expect(coin.getAttribute("aria-label")).toContain("A chosen side of a fair coin");
  });

  it("introduces the scale once and reopens the guide from the header", () => {
    render(1200, false);

    const intro = document.querySelector<HTMLDialogElement>("[data-scale-intro]")!;
    expect(intro.open).toBe(true);
    expect(intro.textContent).toContain("Probability ranges from 0 for an impossible event to 1 for a certain event");
    expect(intro.textContent).toContain("75% gives odds of 3 to 1");
    expect(intro.textContent).toContain("introduced by Alan Turing");
    expect(intro.textContent).toContain("Each additional 10 dBan multiplies the odds by ten");
    expect(intro.querySelector("[data-how-to-use]")?.textContent).toBe("How to use");
    expect(intro.querySelector("[data-odds-to-decibans]")!.compareDocumentPosition(intro.querySelector("[data-how-to-use]")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect([...intro.querySelectorAll("details summary")].map(summary => summary.textContent)).toEqual(["See the formula: probability → odds", "See the formula: odds → decibans"]);
    expect(intro.querySelector('[aria-label="Odds equals probability divided by one minus probability"]')?.textContent).toContain("o = p / (1 − p)");
    expect(intro.querySelector('[aria-label="Decibans equals ten times the base ten logarithm of odds"]')?.textContent).toContain("d = 10 log10(o)");
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    intro.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    const firstFocusable = document.activeElement;
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).not.toBe(firstFocusable);
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(firstFocusable);
    const summaries = intro.querySelectorAll<HTMLElement>("summary");
    summaries[1].focus();
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(intro.querySelector('a[href*="Good1979"]'));
    const introLanguage = intro.querySelector<HTMLButtonElement>('[data-locale-choice="fr"]')!;
    introLanguage.focus();
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(summaries[0]);
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(introLanguage);
    const ordinary = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
    intro.dispatchEvent(ordinary);
    expect(ordinary.defaultPrevented).toBe(false);
    document.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.click();
    expect(intro.open).toBe(false);
    expect(sessionStorage.getItem("probability-scale-intro-seen")).toBe("true");

    const reopen = document.querySelector<HTMLButtonElement>("[data-open-intro]")!;
    expect(reopen.textContent).toBe("About");
    reopen.click();
    expect(intro.open).toBe(true);
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(intro.open).toBe(false);
    expect(document.activeElement).toBe(reopen);
    document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    reopen.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
  });

  it("uses browser French on first visit and offers both languages in About", () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["fr-FR"]);
    render(390, false);

    expect(document.documentElement.lang).toBe("fr");
    expect(document.title).toBe("L’échelle des probabilités");
    const intro = document.querySelector<HTMLDialogElement>("[data-scale-intro]")!;
    expect(intro.textContent).toContain("La cote compare la probabilité");
    expect(intro.textContent).toContain("75 % correspond à une cote de 3 pour 1");
    expect(intro.querySelector("[data-how-to-use]")?.textContent).toBe("Comment utiliser l’échelle");
    expect(document.querySelector('[data-landmark="coin-heads"] .landmark-title')?.textContent).toBe("pile ou face");
    document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!.click();
    expect(document.querySelector("[data-detail-kind]")?.textContent).toBe("Modèle exact");
    expect([...intro.querySelectorAll("[data-locale-choice]")].map(button => button.textContent)).toEqual(["English", "Français"]);
  });

  it("uses the first supported browser preference and lets a saved choice override it", () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["en-GB", "fr-FR"]);
    const first = render();
    expect(document.documentElement.lang).toBe("en");
    first.dispose();

    localStorage.setItem("probability-scale-locale", "fr");
    render();
    expect(document.documentElement.lang).toBe("fr");
  });

  it("filters regional references by language and persists the all-references choice", () => {
    history.replaceState(null, "", "#d=4.7");
    const rendered = render(1200, true, false);
    const scale = document.querySelector<HTMLElement>(".scale")!;

    expect(document.querySelector('[data-landmark="rain-hilo"]')).not.toBeNull();
    expect(document.querySelector('[data-landmark="sunshine-phoenix"]')).not.toBeNull();
    expect(document.querySelector('[data-landmark="rain-brest-december"]')).toBeNull();
    expect(document.querySelector('[data-landmark="france-loto-main-prize"]')).toBeNull();
    expect(document.querySelector('[data-landmark="solar-eclipse-year"]')).not.toBeNull();

    const hilo = document.querySelector<HTMLButtonElement>('[data-landmark="rain-hilo"]')!;
    hilo.dispatchEvent(new MouseEvent("mouseenter"));
    hilo.dispatchEvent(new MouseEvent("mouseleave"));
    hilo.focus();
    hilo.click();
    const commonLandmark = document.querySelector<HTMLButtonElement>('[data-landmark="solar-eclipse-year"]')!;
    commonLandmark.dispatchEvent(new MouseEvent("mouseenter"));
    commonLandmark.dispatchEvent(new MouseEvent("mouseleave"));
    expect(document.querySelector('[data-related-landmark="sunshine-phoenix"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="rain-brest-december"]')).toBeNull();
    const selectedDepth = scale.dataset.depth;
    document.querySelector<HTMLButtonElement>("[data-language-toggle]")!.click();
    document.querySelector<HTMLButtonElement>('[data-locale-choice="fr"][data-locale-context="menu"]')!.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("Hilo");
    expect(document.querySelector('[data-landmark="rain-hilo"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="rain-brest-december"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="sunshine-phoenix"]')).toBeNull();
    expect(scale.dataset.depth).toBe(selectedDepth);

    document.querySelector<HTMLButtonElement>("[data-close-detail]")!.click();
    expect(document.activeElement).toBe(scale);
    expect(document.querySelector('[data-landmark="rain-hilo"]')).toBeNull();
    expect(document.querySelector('[data-landmark="rain-brest-december"]')).not.toBeNull();
    expect(document.querySelector('[data-landmark="france-loto-main-prize"]')).not.toBeNull();

    const all = document.querySelector<HTMLButtonElement>("[data-all-references]")!;
    expect(all.getAttribute("aria-pressed")).toBe("false");
    expect(all.getAttribute("aria-label")).toBe("Toutes les références");
    expect(all.querySelector("[data-all-references-help]")?.textContent).toBe("Afficher aussi les exemples propres à d’autres pays.");
    all.click();
    expect(all.getAttribute("aria-pressed")).toBe("true");
    expect(localStorage.getItem("probability-scale-all-references")).toBe("true");
    expect(scale.dataset.depth).toBe(selectedDepth);
    expect(document.querySelector('[data-landmark="rain-hilo"]')).not.toBeNull();
    expect(document.querySelector('[data-landmark="rain-brest-december"]')).not.toBeNull();

    document.querySelector<HTMLButtonElement>('[data-landmark="rain-hilo"]')!.dispatchEvent(new MouseEvent("mouseenter"));
    all.click();
    expect(document.querySelector('[data-landmark="rain-hilo"]')).toBeNull();
    all.click();

    rendered.dispose();
    document.body.innerHTML = '<main id="app"></main>';
    createScale(document.querySelector<HTMLElement>("#app")!);
    expect(document.querySelector<HTMLButtonElement>("[data-all-references]")?.getAttribute("aria-pressed")).toBe("true");
    expect(document.querySelector('[data-landmark="rain-hilo"]')).not.toBeNull();
    expect(document.querySelector('[data-landmark="rain-brest-december"]')).not.toBeNull();
  });

  it("cancels a filtered reference journey at its current depth", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render(1200, true, true);
    const scale = document.querySelector<HTMLElement>(".scale")!;
    document.querySelector<HTMLButtonElement>('[data-landmark="rain-brest-december"]')!.click();
    clock.advanceTo(16);
    const depth = scale.dataset.depth;

    document.querySelector<HTMLButtonElement>("[data-all-references]")!.click();

    expect(scale.dataset.depth).toBe(depth);
    expect(document.querySelector('[data-landmark="rain-brest-december"]')).toBeNull();
    clock.advanceTo(4000);
    expect(scale.dataset.depth).toBe(depth);
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
  });

  it("falls back after unsupported browser preferences and reads navigator language when needed", () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["de-DE", "es-ES"]);
    localStorage.setItem("probability-scale-locale", "constructor");
    const unsupported = render();
    expect(document.documentElement.lang).toBe("en");
    unsupported.dispose();

    localStorage.clear();
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue([]);
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("fr-CA");
    render();
    expect(document.documentElement.lang).toBe("fr");
  });

  it("provides complete copy for every registered locale", () => {
    const orderedIds = [...catalogueOrder];
    const modelIds = landmarkModels.map(item => item.id);
    expect(displayLandmarks.map(item => item.id)).toEqual(orderedIds);
    expect(new Set(modelIds).size).toBe(orderedIds.length);
    expect(new Set(modelIds)).toEqual(new Set(orderedIds));
    for (const locale of localeChoices) {
      expect(new Set(Object.keys(locale.landmarks))).toEqual(new Set(orderedIds));
      expect(new Set(Object.keys(locale.sources))).toEqual(new Set(Object.keys(sourceReferences)));
      for (const model of landmarkModels.filter(item => item.advice)) {
        expect(locale.landmarks[model.id].advice).toBeDefined();
      }
    }
    expect(new Set(landmarkModels.flatMap(item => item.sourceIds))).toEqual(new Set(Object.keys(sourceReferences)));
  });

  it("switches language without losing the current depth or open details", () => {
    history.replaceState(null, "", "#d=-4.8");
    render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    document.querySelector<HTMLButtonElement>('[data-landmark="die-d4-highest"]')!.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    const depth = scale.dataset.depth;

    document.querySelector<HTMLButtonElement>("[data-language-toggle]")!.click();
    expect(document.querySelector<HTMLElement>("[data-language-menu]")?.hidden).toBe(false);
    document.querySelector<HTMLElement>("[data-language-picker]")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(document.querySelector<HTMLElement>("[data-language-menu]")?.hidden).toBe(false);
    document.querySelector<HTMLElement>("[data-language-picker]")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(document.querySelector<HTMLElement>("[data-language-menu]")?.hidden).toBe(true);
    expect(document.activeElement).toBe(document.querySelector("[data-language-toggle]"));
    document.querySelector<HTMLButtonElement>("[data-language-toggle]")!.click();
    document.querySelector<HTMLButtonElement>('[data-language-menu] [data-locale-choice="fr"]')!.click();

    expect(scale.dataset.depth).toBe(depth);
    expect(document.documentElement.lang).toBe("fr");
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("Un quatre avec un d4 équilibré");
    expect(document.querySelector("[data-center-marker] .probability")?.textContent).toBe("Probabilité : 25 %");
    expect(document.querySelector("[data-current-depth-marker]")?.textContent).toContain("−4,8 dBan");
    expect(document.querySelector("[data-center-marker] .probability")?.textContent).toContain("Probabilité :");
    expect(document.querySelector("[data-center-marker] .odds")?.textContent).toContain("Cote :");
    expect(sceneArtwork("coin-heads").querySelector('[data-art-text="coinSide"]')?.textContent).toBe("P");
    expect(document.querySelector("[data-all-references-help]")?.textContent).toBe("Afficher aussi les exemples propres à d’autres pays.");
    expect(document.querySelector("[data-intro-direction-rarer]")?.textContent).toBe("Plus rare / vers le centre");
    expect(document.querySelector("[data-intro-direction-likely]")?.textContent).toBe("Plus probable / vers l’extérieur");
    expect(localStorage.getItem("probability-scale-locale")).toBe("fr");
    document.querySelector<HTMLButtonElement>("[data-language-toggle]")!.click();
    document.querySelector<HTMLButtonElement>('[data-language-menu] [data-locale-choice="en"]')!.click();
    expect(sceneArtwork("coin-heads").querySelector('[data-art-text="coinSide"]')?.textContent).toBe("H");
    expect(document.querySelector("[data-intro-direction-rarer]")?.textContent).toBe("Rarer / toward the center");
    document.querySelector<HTMLButtonElement>("[data-language-toggle]")!.click();
    document.querySelector<HTMLButtonElement>('[data-language-menu] [data-locale-choice="fr"]')!.click();
    expect(sceneArtwork("coin-heads").querySelector('[data-art-text="coinSide"]')?.textContent).toBe("P");
    document.querySelector<HTMLButtonElement>("[data-language-toggle]")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);

    document.body.innerHTML = '<main id="app"></main>';
    render();
    expect(document.documentElement.lang).toBe("fr");
    expect(document.querySelector<HTMLButtonElement>("[data-open-intro]")?.textContent).toBe("À propos");
  });

  it("localizes text embedded in nearby illustrations", () => {
    localStorage.setItem("probability-scale-locale", "fr");
    for (const [depth, id, artKey, expected] of [
      ["0", "coin-heads", "coinSide", "P"],
      ["4", "weekday", "weekdayMonday", "L"],
      ["-233.4", "eff-passphrase-six", "sixWords", "6 MOTS"],
      ["-38.9", "eff-word-one", "wordList", "7 776 mots"],
    ] as const) {
      history.replaceState(null, "", `#d=${depth}`);
      const rendered = render();
      expect(sceneArtwork(id).querySelector(`[data-art-text="${artKey}"]`)?.textContent).toBe(expected);
      rendered.dispose();
    }
  });

  it("travels through radial probability depth by wheel, diagonal pinch, touch swipe, and arrows", () => {
    const clock = new TestFrameClock();
    render();
    const scale = document.querySelector<HTMLElement>(".scale")!;

    const dive = new WheelEvent("wheel", { deltaY: -120, bubbles: true, cancelable: true });
    scale.dispatchEvent(dive);
    clock.advanceTo(8);
    expect(dive.defaultPrevented).toBe(true);
    expect(Number(scale.dataset.depth)).toBeLessThan(0);
    scale.dispatchEvent(new WheelEvent("wheel", { deltaX: 30, bubbles: true, cancelable: true }));
    clock.advanceTo(16);
    const afterWheel = Number(scale.dataset.depth);

    const pointer = (type: string, pointerId: number, clientX: number, clientY: number, pointerType = "touch") => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { clientX: { value: clientX }, clientY: { value: clientY }, pointerId: { value: pointerId }, pointerType: { value: pointerType } });
      return event;
    };
    const beforeMouseDrag = Number(scale.dataset.depth);
    scale.dispatchEvent(pointer("pointerdown", 9, 500, 300, "mouse"));
    scale.dispatchEvent(pointer("pointermove", 9, 500, 220, "mouse"));
    scale.dispatchEvent(pointer("pointerup", 9, 500, 220, "mouse"));
    clock.advanceTo(24);
    expect(Number(scale.dataset.depth)).toBe(beforeMouseDrag);
    scale.dispatchEvent(pointer("pointerdown", 1, 400, 400));
    scale.dispatchEvent(pointer("pointerdown", 2, 600, 600));
    const beforeStationaryPinch = Number(scale.dataset.depth);
    scale.dispatchEvent(pointer("pointermove", 2, 600, 600));
    expect(clock.pendingFrames).toBe(0);
    expect(Number(scale.dataset.depth)).toBe(beforeStationaryPinch);
    scale.dispatchEvent(pointer("pointermove", 2, 800, 800));
    clock.advanceTo(32);
    expect(Number(scale.dataset.depth)).toBeLessThan(afterWheel);
    scale.dispatchEvent(pointer("pointerup", 2, 800, 800));
    scale.dispatchEvent(pointer("pointerup", 1, 400, 400));
    scale.dispatchEvent(pointer("pointerup", 99, 0, 0));
    const afterPinch = Number(scale.dataset.depth);
    scale.dispatchEvent(pointer("pointermove", 2, 900, 900));
    clock.advanceTo(40);
    expect(Number(scale.dataset.depth)).toBe(afterPinch);

    scale.dispatchEvent(pointer("pointerdown", 3, 500, 300));
    scale.dispatchEvent(pointer("pointermove", 3, 500, 260));
    clock.advanceTo(48);
    expect(Number(scale.dataset.depth)).toBeLessThan(afterPinch);
    scale.dispatchEvent(pointer("pointermove", 3, 500, 250));
    clock.advanceTo(56);
    scale.dispatchEvent(pointer("pointerup", 3, 500, 250));
    scale.dispatchEvent(pointer("pointerdown", 5, 0, 0));
    scale.dispatchEvent(pointer("pointerup", 5, 0, 0));
    const beforeArrow = Number(scale.dataset.depth);
    scale.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(Number(scale.dataset.depth)).toBeGreaterThan(beforeArrow);
  });

  it("uses all four arrow keys from the scene or a landmark without hijacking controls", () => {
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    render();
    const depth = () => Number(document.querySelector<HTMLElement>(".scale")!.dataset.depth);
    const press = (target: EventTarget, key: string, options: KeyboardEventInit = {}) => {
      target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...options }));
    };

    press(document.body, "ArrowUp");
    expect(depth()).toBeGreaterThan(0);
    const afterUp = depth();
    press(document.body, "ArrowDown");
    expect(depth()).toBeLessThan(afterUp);

    const coin = document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!;
    coin.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")!.open).toBe(true);
    coin.focus();
    press(coin, "ArrowLeft");
    expect(depth()).toBeLessThan(0);
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")!.open).toBe(false);
    press(coin, "ArrowRight");
    expect(depth()).toBeGreaterThan(-1);

    const allReferences = document.querySelector<HTMLButtonElement>("[data-all-references]")!;
    allReferences.focus();
    const beforeControl = depth();
    press(allReferences, "ArrowUp");
    expect(depth()).toBeCloseTo(beforeControl);

    const languageArrow = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
    document.querySelector<HTMLButtonElement>("[data-language-toggle]")!.dispatchEvent(languageArrow);
    expect(languageArrow.defaultPrevented).toBe(false);
    expect(depth()).toBeCloseTo(beforeControl);

    press(document.body, "ArrowRight", { ctrlKey: true });
    expect(depth()).toBeCloseTo(beforeControl);
    const handled = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
    handled.preventDefault();
    document.body.dispatchEvent(handled);
    expect(depth()).toBeCloseTo(beforeControl);
  });

  it("uses click-only details and illustrated family travel near the explanation", () => {
    vi.useFakeTimers();
    render();
    const pair = document.querySelector<HTMLButtonElement>('[data-landmark="holdem-one-pair"]')!;
    pair.dispatchEvent(new MouseEvent("mouseenter"));
    vi.advanceTimersByTime(500);
    expect(document.querySelector("[data-landmark-preview]")).toBeNull();

    pair.click();
    const family = document.querySelector<HTMLElement>("[data-detail-related]")!;
    expect(family.hidden).toBe(false);
    expect(family.querySelector("h3")?.textContent).toBe("Explore on the scale");
    const related = family.querySelector<HTMLButtonElement>('[data-related-landmark="holdem-two-pair"]')!;
    expect(related.querySelector("svg")).not.toBeNull();
    expect(related.textContent).toContain("Texas Hold’em: exactly two pair");
    const sources = document.querySelector<HTMLElement>("[data-detail-sources]")!;
    expect(family.compareDocumentPosition(sources) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    document.querySelector<HTMLButtonElement>('[data-landmark="die-six"]')!.click();
    const moreLikely = document.querySelector<HTMLButtonElement>('[data-related-landmark="die-d4-highest"]')!;
    expect(moreLikely.querySelector('[data-related-gain][data-direction="right"]')?.textContent).toContain("+2.2 dBan");
    expect(moreLikely.getAttribute("aria-label")).toContain("difference +2.2 dBan");
    const equalDepth = document.querySelector<HTMLButtonElement>('[data-related-landmark="two-dice-any-double"]')!;
    expect(equalDepth.querySelector('[data-related-gain][data-direction="neutral"]')?.textContent).toContain("0 dBan");
    moreLikely.click();
    document.querySelector<HTMLButtonElement>('[data-landmark="die-d4-highest"]')!.click();
    expect(document.querySelector('[data-related-landmark="die-six"] [data-related-gain][data-direction="left"]')?.textContent).toContain("−2.2 dBan");
  });

  it("keeps a tiny rendered icon selectable through touch jitter", () => {
    render();
    const target = document.querySelector<HTMLButtonElement>('[data-landmark="die-d4-highest"]')!;
    expect(target.querySelector<HTMLElement>(".landmark-title")?.hidden).toBe(true);
    expect(target.style.pointerEvents).toBe("none");
    expect(target.querySelector("img")?.src).toMatch(/^data:image\/svg\+xml/);
    const pointer = (type: string, clientY: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { clientX: { value: 180 }, clientY: { value: clientY }, pointerId: { value: 12 }, pointerType: { value: "touch" } });
      return event;
    };
    target.dispatchEvent(pointer("pointerdown", 300));
    target.dispatchEvent(pointer("pointermove", 306));
    target.dispatchEvent(pointer("pointerup", 306));
    target.click();
    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("A four on a fair d4");
  });

  it("travels to a tapped illustration before opening details and dismisses outside", () => {
    vi.useFakeTimers();
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const pair = document.querySelector<HTMLButtonElement>('[data-landmark="holdem-one-pair"]')!;
    const pointer = (type: string, clientY = 400) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { clientX: { value: 640 }, clientY: { value: clientY }, pointerId: { value: 7 } });
      return event;
    };

    pair.dispatchEvent(pointer("pointerdown"));
    pair.dispatchEvent(pointer("pointerup"));
    pair.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    expect(document.querySelector("[data-gap-caption]")?.textContent).toMatch(/−1\.1 dBan · odds ÷1\.3/);
    clock.advanceTo(4000);
    const dialog = document.querySelector<HTMLDialogElement>("[data-detail-panel]")!;
    expect(dialog.open).toBe(true);
    expect(Number(scale.dataset.depth)).toBeCloseTo(-1.1, 1);
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("one pair");

    const next = document.querySelector<HTMLButtonElement>('[data-landmark="ace-in-five-cards"]')!;
    next.dispatchEvent(pointer("pointerdown"));
    next.dispatchEvent(pointer("pointerup"));
    next.click();
    expect(dialog.open).toBe(false);
    clock.advanceTo(8000);
    expect(dialog.open).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("At least one ace in five cards");

    scale.dispatchEvent(pointer("pointerdown"));
    expect(dialog.open).toBe(false);

    next.dispatchEvent(pointer("pointerdown"));
    const drag = pointer("pointermove", 350);
    scale.dispatchEvent(drag);
    next.dispatchEvent(pointer("pointerup"));
    next.click();
    expect(dialog.open).toBe(false);
    scale.dispatchEvent(new Event("pointermove", { bubbles: true }));
  });

  it("accelerates before braking gently toward a selected landmark", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const target = displayLandmarks.find(item => item.id === "holdem-one-pair")!;
    document.querySelector<HTMLButtonElement>('[data-landmark="holdem-one-pair"]')!.click();

    const positions: number[] = [];
    for (const timestamp of [0, 65, 130, 195, 260, 330]) {
      clock.advanceTo(timestamp);
      positions.push(Number(scale.dataset.depth));
    }
    const increments = positions.slice(1).map((position, index) => Math.abs(position - positions[index]));
    expect(increments[0]).toBeLessThan(increments[1]);
    expect(increments[1]).toBeLessThan(increments[2]);
    expect(increments[2]).toBeGreaterThan(increments[3]);
    expect(increments[3]).toBeGreaterThan(increments[4]);
    expect(Number(scale.dataset.depth)).toBeCloseTo(target.position, 10);
  });

  it("coalesces a desktop wheel burst into one frame without restarting or persisting each event", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const writes = vi.spyOn(Storage.prototype, "setItem");

    for (let index = 0; index < 8; index += 1) {
      scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 12, cancelable: true }));
    }
    expect(Number(scale.dataset.depth)).toBe(0);
    expect(clock.pendingFrames).toBe(1);
    expect(clock.cancelled).toHaveLength(0);
    expect(writes.mock.calls.filter(([key]) => key === "probability-scale-view-v1")).toHaveLength(0);

    clock.advanceTo(16);
    const afterFirstFrame = Number(scale.dataset.depth);
    expect(afterFirstFrame).toBeGreaterThan(0);
    expect(clock.pendingFrames).toBe(1);
    expect(clock.cancelled).toHaveLength(0);

    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 12, cancelable: true }));
    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: -12, cancelable: true }));
    clock.advanceTo(32);
    expect(Number(scale.dataset.depth)).toBeLessThan(afterFirstFrame);
  });

  it("spreads a dense wheel arrival across several frames with progressively smaller final steps", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const target = displayLandmarks.filter(item => item.position > 1.044).sort((first, second) => first.position - second.position)[0].position;
    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    const positions: number[] = [];
    for (const timestamp of [16, 48, 80, 112, 144, 176, 208]) {
      clock.advanceTo(timestamp);
      positions.push(Number(scale.dataset.depth));
    }
    expect(positions[3]).toBeLessThan(target);
    const increments = positions.slice(1).map((position, index) => position - positions[index]);
    expect(increments.every(increment => increment > 0)).toBe(true);
    expect(increments[3]).toBeGreaterThan(increments[4]);
    expect(increments[4]).toBeGreaterThan(increments[5]);
    clock.advanceTo(1000);
    expect(Number(scale.dataset.depth)).toBeCloseTo(target, 10);
  });

  it("normalizes Firefox line and page wheels to the same travel as pixel input", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const positions: number[] = [];
    for (const [deltaMode, deltaY] of [[WheelEvent.DOM_DELTA_PIXEL, 48], [WheelEvent.DOM_DELTA_LINE, 3], [WheelEvent.DOM_DELTA_PAGE, 0.15]]) {
      sessionStorage.clear();
      const clock = new TestFrameClock();
      const scaleView = render();
      const scale = document.querySelector<HTMLElement>(".scale")!;
      scale.dispatchEvent(new WheelEvent("wheel", { deltaMode, deltaY, cancelable: true }));
      clock.advanceTo(16);
      positions.push(Number(scale.dataset.depth));
      scaleView.dispose();
    }
    expect(positions[0]).toBeGreaterThan(0);
    expect(positions[1]).toBeCloseTo(positions[0], 10);
    expect(positions[2]).toBeCloseTo(positions[0], 10);
  });

  it("keeps elapsed motion when another wheel event arrives just before the next frame", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    clock.advanceTo(16);
    const first = Number(scale.dataset.depth);
    clock.elapseTo(31);
    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    clock.advanceTo(32);
    expect(Number(scale.dataset.depth) - first).toBeGreaterThan(first * 0.7);
    expect(clock.cancelled).toHaveLength(0);
  });

  it("carries dense wheel momentum through repeated input and reverses from the current position", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render();
    const scale = document.querySelector<HTMLElement>(".scale")!;

    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    expect(Number(scale.dataset.depth)).toBe(0);
    clock.advanceTo(16);
    const afterFirstFrame = Number(scale.dataset.depth);
    expect(afterFirstFrame).toBeGreaterThan(0);

    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    expect(Number(scale.dataset.depth)).toBe(afterFirstFrame);
    clock.advanceTo(32);
    expect(Number(scale.dataset.depth)).toBeGreaterThan(afterFirstFrame);

    const beforeReverse = Number(scale.dataset.depth);
    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: -104.4, cancelable: true }));
    expect(Number(scale.dataset.depth)).toBe(beforeReverse);
    const expectedTarget = displayLandmarks
      .filter(item => item.position < beforeReverse - 1.044 - 1e-9)
      .sort((first, second) => second.position - first.position)[0].position;
    clock.advanceTo(48);
    expect(Number(scale.dataset.depth)).toBeLessThan(beforeReverse);
    expect(Number(scale.dataset.depth)).toBeGreaterThan(expectedTarget);
    clock.advanceTo(1000);
    expect(Number(scale.dataset.depth)).toBeCloseTo(expectedTarget, 10);

    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    const afterIdleInput = Number(scale.dataset.depth);
    clock.advanceTo(1016);
    expect(Number(scale.dataset.depth)).toBeGreaterThan(afterIdleInput);
  });

  it("uses the latest pinch direction while leaving a touch tap at rest", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    history.replaceState(null, "", "#d=0.02");
    render(390);
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const pointer = (type: string, pointerId: number, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { clientX: { value: clientX }, clientY: { value: 300 }, pointerId: { value: pointerId }, pointerType: { value: "touch" } });
      return event;
    };

    scale.dispatchEvent(pointer("pointerdown", 1, 200));
    scale.dispatchEvent(pointer("pointerup", 1, 200));
    expect(Number(scale.dataset.depth)).toBeCloseTo(0.02, 10);
    expect(clock.pendingFrames).toBe(0);

    scale.dispatchEvent(pointer("pointerdown", 2, 100));
    scale.dispatchEvent(pointer("pointerdown", 3, 300));
    scale.dispatchEvent(pointer("pointermove", 3, 299));
    clock.advanceTo(4);
    const afterFirstPinch = Number(scale.dataset.depth);
    scale.dispatchEvent(pointer("pointermove", 3, 298));
    clock.advanceTo(8);
    expect(Number(scale.dataset.depth)).toBeGreaterThan(afterFirstPinch);

    scale.dispatchEvent(pointer("pointermove", 3, 302));
    const afterReverseInput = Number(scale.dataset.depth);
    const expectedTarget = displayLandmarks
      .filter(item => item.position < afterReverseInput - 30 * Math.log10(202 / 198) - 1e-9)
      .sort((first, second) => second.position - first.position)[0].position;
    clock.advanceTo(1000);
    expect(Number(scale.dataset.depth)).toBeCloseTo(expectedTarget, 10);
  });

  it("adds five familiar exact outcomes across the positive opening range", () => {
    render();

    const nearbyPositions: Readonly<Record<string, string>> = {
      "four-dice-any-six": "+0.3 dBan",
      "month-31-days": "+1.5 dBan",
      "three-dice-sum-ten": "+2.2 dBan",
    };
    for (const [id, position] of Object.entries(nearbyPositions)) {
      const landmark = document.querySelector<HTMLButtonElement>(`[data-landmark="${id}"]`)!;
      expect(landmark.getAttribute("aria-label")).toContain(position);
    }

    document.querySelector<HTMLButtonElement>('[data-landmark="four-dice-any-six"]')!.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("671 / 1296");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("four fair six-sided dice");
    expect(document.querySelector('[data-related-landmark="three-dice-sum-ten"]')).not.toBeNull();
    document.querySelector<HTMLButtonElement>("[data-close-detail]")!.click();

    document.querySelector<HTMLButtonElement>('[data-landmark="month-31-days"]')!.click();
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("Seven of the twelve months");
    document.querySelector<HTMLButtonElement>("[data-close-detail]")!.click();

    history.replaceState(null, "", "#d=3.7");
    render();
    expect(document.querySelector('[data-landmark="numbered-card"]')?.getAttribute("aria-label")).toContain("+3.5 dBan");
    expect(document.querySelector('[data-landmark="weekday"]')?.getAttribute("aria-label")).toContain("+4 dBan");
    document.querySelector<HTMLButtonElement>('[data-landmark="numbered-card"]')!.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("36 / 52 = 9/13");
    document.querySelector<HTMLButtonElement>("[data-close-detail]")!.click();

    document.querySelector<HTMLButtonElement>('[data-landmark="weekday"]')!.click();
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("calendar category");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("No employment or personal schedule");
  });

  it("opens nonmodal details and returns focus on Escape", () => {
    history.replaceState(null, "", "#d=4");
    render();
    const landmark = document.querySelector<HTMLButtonElement>('[data-landmark="ocean-point"]')!;
    landmark.focus();
    landmark.click();

    const dialog = document.querySelector<HTMLDialogElement>("[data-detail-panel]")!;
    expect(dialog.open).toBe(true);
    expect(document.querySelector<HTMLElement>("[data-page-content]")?.inert).not.toBe(true);
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("0.71");
    const ordinaryKey = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
    dialog.dispatchEvent(ordinaryKey);
    expect(ordinaryKey.defaultPrevented).toBe(false);

    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(dialog.open).toBe(false);
    expect(document.activeElement).toBe(landmark);
    document.querySelector<HTMLElement>(".scale")!.focus();
    landmark.dispatchEvent(new MouseEvent("mouseleave"));
    expect(document.querySelector("[data-current-depth-marker]")?.textContent).toContain("+3.9 dBan");
    for (let step = 0; step < 10; step += 1) {
      document.querySelector<HTMLElement>(".scale")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    }
    expect(document.querySelector("[data-event-marker]")).toBeNull();
  });

  it("travels continuously from details to a related chance and reveals it on arrival", () => {
    vi.useFakeTimers();
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const rendered = render();

    document.querySelector<HTMLButtonElement>('[data-landmark="holdem-one-pair"]')!.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    clock.advanceTo(4000);
    const relation = document.querySelector<HTMLButtonElement>('[data-related-landmark="holdem-two-pair"]')!;
    expect(relation.querySelector("[data-related-title]")?.textContent).toBe("Texas Hold’em: exactly two pair");
    relation.focus();
    relation.click();

    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    expect(document.querySelector("[data-gap-caption]")?.textContent).toMatch(/−.+ dBan · odds ÷/);
    expect(document.activeElement).toBe(document.querySelector(".scale"));
    clock.advanceTo(8000);
    expect(document.activeElement).toBe(document.querySelector("[data-close-detail]"));
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("−5.1 dBan");
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(true);
    expect(document.querySelector("[data-landmark-preview]")).toBeNull();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("exactly two pair");
    expect(document.querySelector('[data-related-landmark="holdem-one-pair"]')).not.toBeNull();
    document.querySelector<HTMLButtonElement>('[data-related-landmark="holdem-three-kind"]')!.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(false);
    document.querySelector<HTMLElement>(".scale")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(false);
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    clock.advanceTo(8500);
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    rendered.dispose();

    history.replaceState(null, "", "#d=0");
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const reduced = render();
    document.querySelector<HTMLButtonElement>('[data-landmark="holdem-one-pair"]')!.click();
    document.querySelector<HTMLButtonElement>('[data-related-landmark="holdem-two-pair"]')!.click();
    expect(document.activeElement).toBe(document.querySelector("[data-close-detail]"));
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("exactly two pair");
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(true);
    reduced.dispose();

    history.replaceState(null, "", "#d=-6.989700043360188");
    const tied = render();
    document.querySelector<HTMLButtonElement>('[data-landmark="two-dice-any-double"]')!.click();
    document.querySelector<HTMLButtonElement>('[data-related-landmark="die-six"]')!.click();
    expect(document.activeElement).toBe(document.querySelector("[data-close-detail]"));
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("A six on one fair die");
    expect(document.querySelectorAll("[data-landmark-preview]")).toHaveLength(0);
    tied.dispose();
  });

  it("keeps every declared and advice relation reciprocal and valid", () => {
    const ids = new Set<string>(displayLandmarks.map(item => item.id));
    for (const [source, targets] of Object.entries(relatedLandmarkIds)) {
      expect(ids.has(source)).toBe(true);
      expect(new Set(targets).size).toBe(targets.length);
      for (const target of targets) {
        expect(target).not.toBe(source);
        expect(ids.has(target)).toBe(true);
        expect(relatedLandmarkIds[target]).toContain(source);
      }
    }
  });

  it("includes the new astronomy, nature, game, and food models as explorable landmarks", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const newIds = [
      "solar-terrestrial",
      "full-moon-15-days",
      "french-scrabble-consonant",
      "solar-eclipse-year",
      "frozen-freshwater",
      "four-dice-any-match",
      "red-dwarf-star",
      "planet-with-moon",
      "lunar-eclipse-year",
      "yahtzee-any-match",
      "full-moon-28-days",
      "french-scrabble-vowel-rack",
      "sun-mass",
      "double-yolk-young-hens",
    ];

    expect(newIds.every(id => byId.has(id))).toBe(true);
    expect(byId.get("solar-terrestrial")?.position).toBeCloseTo(0, 10);
    expect(byId.get("four-dice-any-match")?.position).toBeCloseTo(10 * Math.log10(13 / 5), 10);
    expect(byId.get("french-scrabble-vowel-rack")?.position).toBeGreaterThan(18);
    expect(relatedLandmarkIds["four-dice-any-match"]).toContain("yahtzee-any-match");
    expect(relatedLandmarkIds["full-moon-15-days"]).toContain("full-moon-28-days");
  });

  it("includes sourced weather and completed-season sports estimates", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const estimateIds = [
      "rain-hilo",
      "sunshine-phoenix",
      "nba-free-throw-2023-24",
      "mensik-first-serve-miami-2025",
      "premier-league-penalty-2023-24",
    ];

    expect(estimateIds.every(id => byId.has(id))).toBe(true);
    expect(byId.get("rain-hilo")?.position).toBeCloseTo(10 * Math.log10(273 / 92), 10);
    expect(byId.get("nba-free-throw-2023-24")?.classification).toBe("Historical estimate");
    expect(relatedLandmarkIds["rain-hilo"]).toContain("sunshine-phoenix");
    expect(relatedLandmarkIds["nba-free-throw-2023-24"]).toContain("premier-league-penalty-2023-24");
  });

  it("compares dated everyday reliability and an exact d20 advantage", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const reliabilityIds = [
      "fr-letter-green-j3-2025",
      "fr-letter-green-j5-2025",
      "fr-colissimo-counter-j2-2025",
      "us-electricity-available-2024",
      "idf-electricity-available-2024",
      "gmail-available-2013",
      "stripe-available-2023",
      "commercial-flight-no-accident-2025",
      "commercial-flight-accident-2025",
      "d20-avoid-natural-one-advantage",
      "dna-nucleotide-copied-correctly",
      "human-denovo-snv",
    ];
    expect(reliabilityIds.every(id => byId.has(id))).toBe(true);
    expect(byId.get("us-electricity-available-2024")?.position).toBeCloseTo(10 * Math.log10((366 * 1440 - 662.6) / 662.6), 10);
    expect(byId.get("commercial-flight-no-accident-2025")?.position).toBeCloseTo(10 * Math.log10((1_000_000 - 1.32) / 1.32), 10);
    expect(byId.get("commercial-flight-accident-2025")?.position).toBeCloseTo(-10 * Math.log10((1_000_000 - 1.32) / 1.32), 10);
    expect(relatedLandmarkIds["commercial-flight-no-accident-2025"]).toContain("commercial-flight-accident-2025");
    expect(byId.get("human-denovo-snv")?.position).toBeCloseTo(10 * Math.log10(1.29e-8 / (1 - 1.29e-8)), 10);
    expect(relatedLandmarkIds["human-denovo-snv"]).toContain("dna-nucleotide-copied-correctly");

    localStorage.setItem("probability-scale-locale", "fr");
    history.replaceState(null, "", `#d=${byId.get("fr-letter-green-j3-2025")!.position}`);
    const french = render(1200, true, false);
    expect(sceneArtwork("fr-letter-green-j3-2025").querySelector('[data-art-text="postalThreeDays"]')?.textContent).toBe("3 jours");
    french.dispose();

    history.replaceState(null, "", `#d=${byId.get("idf-electricity-available-2024")!.position}`);
    const frenchPower = render(1200, true, false);
    expect(document.querySelector('[data-landmark="idf-electricity-available-2024"]')).not.toBeNull();
    expect(document.querySelector('[data-landmark="us-electricity-available-2024"]')).toBeNull();
    expect(document.querySelector('[data-landmark="gmail-available-2013"]')).not.toBeNull();
    frenchPower.dispose();

    localStorage.setItem("probability-scale-locale", "en");
    history.replaceState(null, "", `#d=${byId.get("us-electricity-available-2024")!.position}`);
    const englishPower = render(1200, true, false);
    expect(document.querySelector('[data-landmark="fr-letter-green-j3-2025"]')).toBeNull();
    expect(document.querySelector('[data-landmark="us-electricity-available-2024"]')).not.toBeNull();
    expect(document.querySelector('[data-landmark="idf-electricity-available-2024"]')).toBeNull();
    englishPower.dispose();

    history.replaceState(null, "", `#d=${byId.get("d20-avoid-natural-one-advantage")!.position}`);
    render(1200, true, false);
    const advantage = document.querySelector<HTMLButtonElement>('[data-landmark="d20-avoid-natural-one-advantage"]')!;
    advantage.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("399/400");
    expect(document.querySelector('[data-related-landmark="die-d20-no-critical-failure"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="die-d20-highest"]')).not.toBeNull();
    expect(relatedLandmarkIds["dna-nucleotide-copied-correctly"]).toContain("green-pea");
  });

  it("separates distance-modelled road collisions from annual breakdown reports", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const ratePerKm = 484 / (1_000_000_000 * 1.609344);
    const collision20 = -Math.expm1(-ratePerKm * 20);
    const collision500 = -Math.expm1(-ratePerKm * 500);
    expect(byId.get("gb-injury-collision-20km")?.position).toBeCloseTo(10 * Math.log10(collision20 / (1 - collision20)), 10);
    expect(byId.get("gb-no-injury-collision-20km")?.position).toBeCloseTo(-byId.get("gb-injury-collision-20km")!.position, 10);
    expect(byId.get("gb-injury-collision-500km")?.position).toBeCloseTo(10 * Math.log10(collision500 / (1 - collision500)), 10);
    expect(byId.get("gb-no-injury-collision-500km")?.position).toBeCloseTo(-byId.get("gb-injury-collision-500km")!.position, 10);
    expect(byId.get("uk-recent-car-breakdown-2021")?.position).toBeCloseTo(10 * Math.log10(.049 / .951), 10);
    expect(byId.get("uk-recent-car-no-breakdown-2021")?.position).toBeCloseTo(-byId.get("uk-recent-car-breakdown-2021")!.position, 10);
    expect(relatedLandmarkIds["gb-injury-collision-20km"]).toEqual(expect.arrayContaining(["gb-no-injury-collision-20km", "gb-injury-collision-500km"]));
    expect(relatedLandmarkIds["uk-recent-car-breakdown-2021"]).toContain("uk-recent-car-no-breakdown-2021");
  });

  it("compares observed Pokémon Destined Rivals rarity pulls from one booster", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const doubleRare = byId.get("pokemon-destined-rivals-double-rare");
    const illustrationRare = byId.get("pokemon-destined-rivals-illustration-rare");
    const specialIllustrationRare = byId.get("pokemon-destined-rivals-special-illustration-rare");

    expect(doubleRare?.position).toBeCloseTo(10 * Math.log10(0.1983 / 0.8017), 10);
    expect(illustrationRare?.position).toBeCloseTo(10 * Math.log10(0.0829 / 0.9171), 10);
    expect(specialIllustrationRare?.position).toBeCloseTo(10 * Math.log10(0.0106 / 0.9894), 10);
    expect(relatedLandmarkIds["pokemon-destined-rivals-illustration-rare"]).toEqual(expect.arrayContaining([
      "pokemon-destined-rivals-double-rare",
      "pokemon-destined-rivals-special-illustration-rare",
    ]));
    expect([...byId].some(([id]) => id.startsWith("overwatch-loot-box-"))).toBe(false);

    history.replaceState(null, "", `#d=${illustrationRare!.position}`);
    render(1200, true, false);
    document.querySelector<HTMLButtonElement>('[data-landmark="pokemon-destined-rivals-illustration-rare"]')!.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("0.0829");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("95% confidence interval");
    expect(document.querySelector('[data-related-landmark="pokemon-destined-rivals-double-rare"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="pokemon-destined-rivals-special-illustration-rare"]')).not.toBeNull();

    localStorage.setItem("probability-scale-locale", "fr");
    history.replaceState(null, "", `#d=${specialIllustrationRare!.position}`);
    render(1200, true, false);
    document.querySelector<HTMLButtonElement>('[data-landmark="pokemon-destined-rivals-special-illustration-rare"]')!.click();
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("Illustration rare spéciale");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("plus de 8 000");
  });

  it("distinguishes French household television and personal mobile equipment estimates", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const television = byId.get("fr-household-television-2025");
    const smartphone = byId.get("fr-person-smartphone-2025");
    const mobile = byId.get("fr-person-mobile-phone-2025");

    expect(television?.position).toBeCloseTo(10 * Math.log10(0.891 / 0.109), 10);
    expect(smartphone?.position).toBeCloseTo(10 * Math.log10(0.91 / 0.09), 10);
    expect(mobile?.position).toBeCloseTo(10 * Math.log10(0.97 / 0.03), 10);
    expect(relatedLandmarkIds["fr-person-smartphone-2025"]).toEqual(expect.arrayContaining([
      "fr-household-television-2025",
      "fr-person-mobile-phone-2025",
    ]));

    localStorage.setItem("probability-scale-locale", "fr");
    history.replaceState(null, "", `#d=${smartphone!.position}`);
    const french = render(1200, true, false);
    expect(document.querySelector('[data-landmark="fr-household-television-2025"]')).not.toBeNull();
    document.querySelector<HTMLButtonElement>('[data-landmark="fr-person-smartphone-2025"]')!.click();
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("12 ans ou plus");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("France métropolitaine");
    french.dispose();

    localStorage.setItem("probability-scale-locale", "en");
    history.replaceState(null, "", `#d=${smartphone!.position}`);
    render(1200, true, false);
    expect(document.querySelector('[data-landmark="fr-person-smartphone-2025"]')).toBeNull();
  });

  it("explores Bayesian test updates from one explicit prevalence", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const covidPrior = byId.get("covid-scenario-prior")!;
    const covidPositive = byId.get("covid-scenario-positive")!;
    const covidNegative = byId.get("covid-scenario-negative")!;
    expect(covidPrior.position).toBeCloseTo(-22.9885307641, 9);
    expect(covidPositive.position - covidPrior.position).toBeCloseTo(19.8974636563, 9);
    expect(covidNegative.position - covidPrior.position).toBeCloseTo(-3.80386043276, 9);
    expect(relatedLandmarkIds["covid-scenario-prior"]).toEqual(expect.arrayContaining(["covid-scenario-positive", "covid-scenario-negative"]));
    expect(relatedLandmarkIds["covid-scenario-positive"]).toEqual(["covid-scenario-prior"]);

    history.replaceState(null, "", `#d=${covidPositive.position}`);
    render();
    document.querySelector<HTMLButtonElement>('[data-landmark="covid-scenario-positive"]')!.click();
    expect(document.querySelector<HTMLElement>("[data-detail-kind]")?.hidden).toBe(true);
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("0.586");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("Suppose 500 people out of 100,000 are infected, or 0.5%.");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("The other 597 are the false positives.");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("0.5% prevalence");
    expect(document.querySelector('[data-related-landmark="covid-scenario-prior"]')).not.toBeNull();
    const evidence = document.querySelector<HTMLElement>("[data-detail-diagnostic]")!;
    expect(evidence.hidden).toBe(false);
    expect(evidence.textContent).toContain("100,000");
    expect(evidence.textContent).toContain("293 true positives");
    expect(evidence.textContent).toContain("597 false positives");
    expect(evidence.textContent).toContain("A positive result multiplies the odds of infection by 97.7, or +19.9 dBan.");
    expect(evidence.textContent).toContain("LR+ = sensitivity / (1 − specificity) = 0.586 / (1 − 0.994) = 97.7");
    expect(evidence.textContent).toContain("+19.9 dBan");
    expect(evidence.querySelector('[data-diagnostic-row="positive"]')?.classList).toContain("selected");

    localStorage.setItem("probability-scale-locale", "fr");
    history.replaceState(null, "", `#d=${covidNegative.position}`);
    render();
    document.querySelector<HTMLButtonElement>('[data-landmark="covid-scenario-negative"]')!.click();
    expect(document.querySelector<HTMLElement>("[data-detail-kind]")?.hidden).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("test antigénique rapide négatif");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("Supposons que 500 personnes sur 100 000 soient infectées, soit 0,5 %.");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("prévalence hypothétique");
    expect(document.querySelector("[data-detail-diagnostic]")?.textContent).toContain("207 faux négatifs");
    expect(document.querySelector("[data-detail-diagnostic]")?.textContent).toContain("Un résultat négatif divise la cote d’infection par 2,4, soit −3,8 dBan.");
    expect(document.querySelector("[data-detail-diagnostic]")?.textContent).toContain("LR− = (1 − sensibilité) / spécificité = (1 − 0,586) / 0,994 = 0,416");
    expect(document.querySelector('[data-diagnostic-row="negative"]')?.classList).toContain("selected");
  });

  it("compares a four-leaf clover, French roulette bets, and a six-deck natural blackjack", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const roulette = [
      ["roulette-straight-up", 1],
      ["roulette-split", 2],
      ["roulette-street", 3],
      ["roulette-corner", 4],
      ["roulette-six-line", 6],
      ["roulette-dozen-column", 12],
      ["roulette-even-money", 18],
      ["roulette-two-dozens-columns", 24],
    ] as const;

    for (const [id, winningPockets] of roulette) {
      const item = byId.get(id)!;
      expect(item.position).toBeCloseTo(10 * Math.log10(winningPockets / (37 - winningPockets)), 10);
      expect(item.explanation).toContain("average loss");
    }
    expect(byId.get("roulette-straight-up")?.explanation).toContain("average loss is €2.70 per €100 bet");
    expect(byId.get("roulette-straight-up")?.explanation).toContain("the €100 stake is lost");
    expect(byId.get("roulette-even-money")?.explanation).toContain("average loss is €1.35 per €100 bet");
    expect(byId.get("roulette-even-money")?.explanation).toContain("Zero returns €50");
    expect(byId.get("roulette-two-dozens-columns")?.position).toBeGreaterThan(0);

    const clover = byId.get("four-leaf-clover")!;
    expect(clover.position).toBeCloseTo(-10 * Math.log10(5076), 10);
    expect(clover.classification).toBe("Estimate");
    expect(clover.explanation).toContain("four leaflets");
    expect(clover.assumptions).toContain("three- or four-leaf white clovers");
    expect(relatedLandmarkIds[clover.id]).toEqual(expect.arrayContaining(["green-pea", "double-yolk-young-hens"]));

    const blackjack = byId.get("blackjack-natural-six-deck")!;
    expect(blackjack.position).toBeCloseTo(-13.022722899191814, 10);
    expect(blackjack.explanation).toContain("ace and a ten, jack, queen, or king");
    expect(blackjack.assumptions).toContain("does not mean winning against the dealer");
    expect(relatedLandmarkIds[blackjack.id]).toContain("any-ace");

    localStorage.setItem("probability-scale-locale", "fr");
    history.replaceState(null, "", `#d=${byId.get("roulette-even-money")!.position}`);
    render();
    document.querySelector<HTMLButtonElement>('[data-landmark="roulette-even-money"]')!.click();
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("rouge");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("chances simples équivalentes");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("mise est rendue");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("perte moyenne");
    expect(document.querySelector('[data-related-landmark="roulette-dozen-column"]')).not.toBeNull();
  });

  it("shows Enigma configuration differences on reciprocal family travel", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    const removedIds = ["banburismus-rotor-order-336", "banburismus-rotor-order-20", "banburismus-alignment-3-to-2", "banburismus-alignment-5-to-1", "banburismus-alignment-15-to-1", "banburismus-alignment-100-to-1"];

    expect(removedIds.every(id => !byId.has(id))).toBe(true);
    expect(byId.get("enigma-i-known-rings")?.position).toBeCloseTo(-202.01294835154118, 10);
    expect(byId.get("enigma-i-two-unknown-rings")?.position).toBeLessThan(-230);
    expect(byId.get("enigma-m3-after-clues")?.position).toBeCloseTo(-197.24173580434455, 10);
    expect(byId.get("enigma-m3-after-clues")!.position - byId.get("enigma-m3-known-rings")!.position).toBeCloseTo(12.2530928173, 10);

    history.replaceState(null, "", `#d=${byId.get("enigma-m3-known-rings")!.position}`);
    const english = render();
    document.querySelector<HTMLButtonElement>('[data-landmark="enigma-m3-known-rings"]')!.click();
    const gain = document.querySelector<HTMLButtonElement>('[data-related-landmark="enigma-m3-after-clues"]')!;
    expect(gain.textContent).toContain("+12.3 dBan");
    expect(gain.querySelector('[data-related-gain][data-direction="right"]')).not.toBeNull();
    expect(gain.getAttribute("aria-label")).toContain("+12.3 dBan");
    gain.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    expect(Number(document.querySelector<HTMLElement>(".scale")?.dataset.depth)).toBeCloseTo(byId.get("enigma-m3-after-clues")!.position, 10);
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("after Banburismus clues");
    const reverseGain = document.querySelector('[data-related-landmark="enigma-m3-known-rings"]')!;
    expect(reverseGain.textContent).toContain("−12.3 dBan");
    expect(reverseGain.querySelector('[data-related-gain][data-direction="left"]')).not.toBeNull();
    english.dispose();

    localStorage.setItem("probability-scale-locale", "fr");
    history.replaceState(null, "", `#d=${byId.get("enigma-i-two-unknown-rings")!.position}`);
    render();
    document.querySelector<HTMLButtonElement>('[data-landmark="enigma-i-two-unknown-rings"]')!.click();
    const ringGain = document.querySelector('[data-related-landmark="enigma-i-known-rings"]');
    expect(ringGain?.textContent).toContain("bagues connues");
    expect(ringGain?.textContent).toContain("+28,3 dBan");
  });

  it("distinguishes a local eclipse estimate and a December rain normal", () => {
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));

    expect(byId.get("solar-eclipse-local-year")?.position).toBeCloseTo(10 * Math.log10(1 / 374), 10);
    expect(byId.get("solar-eclipse-local-year")?.classification).toBe("Estimate");
    expect(byId.get("rain-brest-december")?.position).toBeCloseTo(10 * Math.log10(17.8 / 13.2), 10);
    expect(relatedLandmarkIds["solar-eclipse-local-year"]).toContain("solar-eclipse-year");
    expect(relatedLandmarkIds["rain-brest-december"]).toContain("rain-hilo");
  });

  it("shows an extreme tail in its derivation without moving the viewport", () => {
    history.replaceState(null, "", "#d=-239");
    render();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("−239 dBan");
    expect(document.querySelector("[data-center-marker] .probability")?.textContent).toBe("Probability: 1.26 × 10⁻²²%");
    document.querySelector<HTMLButtonElement>('[data-landmark="sahara-grain"]')!.click();

    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("1 in 7.98 × 10²³");
    expect(document.querySelector("[data-detail-panel]")?.textContent).not.toMatch(/Infinity|100%/);
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("−239 dBan");
    expect(document.querySelector("[data-depth-spoke]")).not.toBeNull();
    expect(document.querySelectorAll('[data-landmark="sahara-grain"]')).toHaveLength(1);
    expect(document.querySelector("[data-opposite]")).toBeNull();
    expect(document.querySelector("[data-detail-opposite-title]")).toBeNull();
  });

  it("uses an initial deciban fragment and preserves the locally explored view", () => {
    history.replaceState(null, "", "#d=20");
    render();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("+20 dBan");
    document.querySelector<HTMLElement>(".scale")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    history.replaceState(null, "", "/");
    render();
    expect(Number(document.querySelector<HTMLElement>(".scale")?.dataset.depth)).toBeGreaterThan(20);

    history.replaceState(null, "", "#d=-0.04");
    render();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("0 dBan");
    expect(document.querySelector("[data-center-marker]")?.textContent).not.toContain("−0 dBan");
  });

  it("aligns a neutral zero tick with the same spoke projection as its ring", () => {
    history.replaceState(null, "", "#d=4");
    render(1200);

    const tick = document.querySelector<HTMLElement>('[data-tick="0"]')!;
    const ring = drawnGuideAt(0)!;
    expect(Number.parseFloat(tick.style.top)).toBeCloseTo(160 - ring.radius, 8);
  });

  it("keeps the depth spoke visible at distant catalogue positions", () => {
    for (const center of [-100, 40]) {
      document.body.innerHTML = '<main id="app"></main>';
      history.replaceState(null, "", `#d=${center}`);
      render(1280);
      expect(Number.parseFloat(document.querySelector<HTMLElement>("[data-depth-spoke]")!.style.height)).toBeGreaterThan(100);
    }
  });

  it("uses independent events on both sides of the wider scale", () => {
    history.replaceState(null, "", "#d=-40");
    const first = render();
    expect(document.querySelector('[data-landmark="four-digit-pin"]')).not.toBeNull();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("Odds: 1 to 10,000");
    expect(document.querySelector<HTMLElement>("[data-center-marker]")?.style.getPropertyValue("--axis-color")).toBe("rgb(226 105 112)");
    expect(document.body.textContent).not.toContain("lock stays closed");
    first.dispose();

    history.replaceState(null, "", "#d=40");
    render();
    expect(document.querySelector('[data-landmark="birthday-79"]')).not.toBeNull();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("Odds: 10,000 to 1");
    expect(document.querySelector<HTMLElement>("[data-center-marker]")?.style.getPropertyValue("--axis-color")).toBe("rgb(74 185 137)");
    expect(document.body.textContent).not.toContain("another Sahara grain");
    history.replaceState(null, "", "#d=39");
    render();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("99.9874%");
    expect(document.querySelector("[data-center-marker]")?.textContent).not.toMatch(/100(?:\.0+)?%/);
  });

  it("presents historical password guesses with sourced advice and travels to the exact generated model", () => {
    vi.useFakeTimers();
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    history.replaceState(null, "", "#d=-33.4");
    const rendered = render();

    expect(document.querySelector('[data-landmark="password-qwerty"] .landmark-title')?.textContent).toBe('guess “qwerty”');
    document.querySelector<HTMLButtonElement>('[data-landmark="password-qwerty"]')!.click();
    clock.advanceTo(4000);
    expect(document.querySelector("[data-detail-kind]")?.textContent).toBe("Historical estimate");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("13,456 times among 32,603,388");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("does not represent every present-day password");
    expect(document.querySelector<HTMLAnchorElement>('[data-detail-sources] a[href*="ab068333d7d44a9376e2037b0ed7d2e8ca5c6610"]')).not.toBeNull();
    expect(document.querySelector("[data-detail-advice]")?.textContent).toContain("keyboard runs");
    expect(document.querySelector("[data-detail-advice]")?.textContent).toContain("passkey");
    const managerLink = document.querySelector<HTMLButtonElement>('[data-advice-related="manager-password-16"]')!;
    expect(managerLink.textContent).toBe("password generated by a password manager");
    managerLink.click();

    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    expect(document.querySelector("[data-gap-caption]")?.textContent).toMatch(/−252\.9 dBan · odds ÷/);
    clock.advanceTo(8000);
    expect(document.activeElement).toBe(document.querySelector("[data-close-detail]"));
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("−286.8 dBan");
    expect(document.querySelector("[data-landmark-preview]")).toBeNull();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("62¹⁶");
    expect(document.querySelector('[data-related-landmark="aes-128-key"]')).not.toBeNull();
    rendered.dispose();

    history.replaceState(null, "", "#d=-20.5");
    const common = render();
    expect(document.querySelector('[data-landmark="password-123456"]')).not.toBeNull();
    common.dispose();

    history.replaceState(null, "", "#d=-40");
    render();
    document.querySelector<HTMLButtonElement>('[data-landmark="four-digit-pin"]')!.click();
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("limit repeated attempts");
    expect(document.querySelector('[data-related-landmark="manager-password-16"]')).not.toBeNull();
  });

  it("compares a sourced common password with stronger generated choices", () => {
    history.replaceState(null, "", "#d=-27.38230431145781");
    const base = render();

    const password = document.querySelector<HTMLButtonElement>('[data-landmark="password-password"]')!;
    expect(sceneArtwork("password-password").querySelector("text")?.textContent).toBe("password");
    password.click();
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("59,462 times among 32,603,388");
    expect(document.querySelector<HTMLAnchorElement>('[data-detail-sources] a[href*="ab068333d7d44a9376e2037b0ed7d2e8ca5c6610"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="manager-password-16"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="eff-passphrase-six"]')).not.toBeNull();
    base.dispose();
  });

  it("localizes a large related-travel distance without changing its mathematical scale", () => {
    vi.useFakeTimers();
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    localStorage.setItem("probability-scale-locale", "fr");
    history.replaceState(null, "", "#d=-33.4");
    render();

    document.querySelector<HTMLButtonElement>('[data-landmark="password-qwerty"]')!.click();
    clock.advanceTo(4000);
    const passphraseLink = document.querySelector<HTMLButtonElement>('[data-related-landmark="eff-passphrase-six"]')!;
    expect(passphraseLink.querySelector('[data-related-gain][data-direction="left"]')?.textContent).toContain("−199,6 dBan");
    expect(passphraseLink.getAttribute("aria-label")).toContain("écart −199,6 dBan");
    passphraseLink.click();

    const caption = document.querySelector<HTMLElement>("[data-gap-caption]")!;
    expect(caption.textContent).toContain("−199,6 dBan · cote ÷");
    clock.advanceTo(8000);
    document.querySelector<HTMLButtonElement>('[data-landmark="eff-passphrase-six"]')!.click();
    const reverseLink = document.querySelector<HTMLButtonElement>('[data-related-landmark="password-qwerty"]')!;
    expect(reverseLink.querySelector('[data-related-gain][data-direction="right"]')?.textContent).toContain("+199,6 dBan");
    expect(reverseLink.getAttribute("aria-label")).toContain("écart +199,6 dBan");
  });

  it("compares exact random guesses of AES keys with related cryptographic events", () => {
    history.replaceState(null, "", "#d=-385.3");
    const aes128 = render();
    const landmark = document.querySelector<HTMLButtonElement>('[data-landmark="aes-128-key"]')!;
    expect(landmark.querySelector(".landmark-title")?.textContent).toBe("128-bit AES key");
    expect(landmark.getAttribute("aria-label")).toContain("1 in 3.4 × 10³⁸");
    landmark.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("2¹²⁸");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("software and key handling");
    expect(document.querySelector<HTMLAnchorElement>('[data-detail-sources] a')?.href).toContain("csrc.nist.gov/pubs/fips/197/final");
    expect(document.querySelector('[data-related-landmark="aes-256-key"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="exact-hash-day"]')).not.toBeNull();
    aes128.dispose();

    history.replaceState(null, "", "#d=-770.6");
    render();
    const aes256 = document.querySelector<HTMLButtonElement>('[data-landmark="aes-256-key"]')!;
    expect(aes256.querySelector(".landmark-title")?.textContent).toBe("256-bit AES key");
    expect(aes256.getAttribute("aria-label")).toContain("1 in 1.16 × 10⁷⁷");

    history.replaceState(null, "", "#d=-511.3");
    render();
    const hash = document.querySelector<HTMLButtonElement>('[data-landmark="exact-hash-day"]')!;
    expect(hash.querySelector(".landmark-title")?.textContent).toBe("exact Bitcoin hash in a day");
    expect(sceneArtwork("exact-hash-day").documentElement.textContent).toContain("₿");
    hash.click();
    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("A preselected Bitcoin hash appears within one day");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("specific 256-bit hash chosen in advance");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("below a target threshold");
  });

  it("compares one drop-sized portion in Olympic and garden pools with explicit volume models", () => {
    history.replaceState(null, "", "#d=-101.8");
    render();
    const olympic = document.querySelector<HTMLButtonElement>('[data-landmark="drop-olympic-pool"]');
    expect(olympic).not.toBeNull();
    olympic!.click();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    expect(Number(scale.dataset.depth)).toBeCloseTo(-10 * Math.log10(15_000_000_000 - 1), 10);
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("3,750,000 L");
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("15,000,000,000");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("0.25 mL");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("uniformly");
    expect(document.querySelector('[data-detail-sources] a[href*="queenelizabetholympicpark.co.uk"]')).not.toBeNull();
    expect(document.querySelector('[data-detail-sources] a[href*="usgs.gov"]')).not.toBeNull();
    expect(sceneArtwork("drop-olympic-pool").querySelector('[data-pool="competition"] [data-water-drop]')).not.toBeNull();
    const garden = document.querySelector<HTMLButtonElement>('[data-related-landmark="drop-garden-pool"]')!;
    expect(garden.textContent).toContain("+21.4 dBan");
    garden.click();
    expect(Number(scale.dataset.depth)).toBeCloseTo(-10 * Math.log10(108_000_000 - 1), 10);
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("27,000 L");
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("108,000,000");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("illustrative");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("water depth");
    expect(document.querySelector('[data-related-landmark="needle-haystack"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="beach-grain"]')).not.toBeNull();
    expect(sceneArtwork("drop-garden-pool").querySelector('[data-pool="garden"] [data-water-drop]')).not.toBeNull();
    document.querySelector<HTMLButtonElement>('[data-locale-context="menu"][data-locale-choice="fr"]')!.click();
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("piscine de jardin");
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("108 000 000");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("0,25 mL");
    document.querySelector<HTMLButtonElement>('[data-related-landmark="drop-olympic-pool"]')!.click();
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("15 milliards");
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("3 750 000 L");
  });

  it("models a needle in one round hay bale by volume", () => {
    history.replaceState(null, "", "#d=-80.3");
    render();
    const needle = document.querySelector<HTMLButtonElement>('[data-landmark="needle-haystack"]')!;
    expect(needle.getAttribute("aria-label")).toContain("−80.3 dBan");
    needle.click();

    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("A needle in a haystack");
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("(0.00069 / 1.25)² × (0.037 / 1.20)");
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("1 in 106 million");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("uniformly sampled point");
    expect(document.querySelector<HTMLAnchorElement>('[data-detail-sources] a[href*="jjneedles.com"]')).not.toBeNull();
    expect(document.querySelector<HTMLAnchorElement>('[data-detail-sources] a[href*="newholland.com"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="beach-grain"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="sahara-grain"]')).not.toBeNull();
  });

  it("connects fair polyhedral dice and an EFF six-word passphrase", () => {
    const positions: Readonly<Record<string, string>> = {
      "die-d4-highest": "−4.8 dBan",
      "die-d12-highest": "−10.4 dBan",
      "die-d20-highest": "−12.8 dBan",
    };
    for (const [id, label] of Object.entries(positions)) {
      history.replaceState(null, "", `#d=${label.replace("−", "-").replace(" dBan", "")}`);
      render();
      const landmark = document.querySelector<HTMLButtonElement>(`[data-landmark="${id}"]`)!;
      expect(landmark.getAttribute("aria-label")).toContain(label);
      expect(sceneArtwork(id).querySelector(".polyhedral-die")).not.toBeNull();
    }
    const byId = new Map<string, (typeof displayLandmarks)[number]>(displayLandmarks.map(item => [item.id, item]));
    expect(byId.get("die-d20-no-critical-failure")?.position).toBeCloseTo(10 * Math.log10(19), 10);
    expect(relatedLandmarkIds["die-d20-highest"]).toContain("die-d20-no-critical-failure");
    history.replaceState(null, "", "#d=-12.8");
    render();
    document.querySelector<HTMLButtonElement>('[data-landmark="die-d20-highest"]')!.click();
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("critical");
    expect(document.querySelector('[data-related-landmark="die-d20-no-critical-failure"]')).not.toBeNull();

    history.replaceState(null, "", "#d=-233.4");
    render();
    const passphrase = document.querySelector<HTMLButtonElement>('[data-landmark="eff-passphrase-six"]')!;
    expect(passphrase.getAttribute("aria-label")).toContain("1 in 2.21 × 10²³");
    passphrase.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("7,776⁶");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("words may repeat");
    expect(document.querySelectorAll('[data-detail-sources] a[href*="eff.org"]')).toHaveLength(3);
    expect(document.querySelector('[data-related-landmark="eff-word-one"]')).not.toBeNull();

    history.replaceState(null, "", "#d=-38.9");
    render();
    const word = document.querySelector<HTMLButtonElement>('[data-landmark="eff-word-one"]')!;
    expect(word.getAttribute("aria-label")).toContain("−38.9 dBan");
    word.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("1 / 6⁵ = 1 / 7,776");
    expect(document.querySelector("[data-detail-explanation]")?.textContent).toContain("one component");
    expect(document.querySelector('[data-related-landmark="die-six"]')).not.toBeNull();
    expect(document.querySelector('[data-related-landmark="eff-passphrase-six"]')).not.toBeNull();

    history.replaceState(null, "", "#d=0");
    render();
    document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!.click();
    expect(document.querySelector('[data-related-landmark="die-d4-highest"]')).not.toBeNull();
  });

  it("places equal chances on one exact-depth ring with separate angles", () => {
    history.replaceState(null, "", "#d=-7");
    const first = render(390);
    const rollSix = document.querySelector<HTMLButtonElement>('[data-landmark="die-six"]')!;
    const matchingDice = document.querySelector<HTMLButtonElement>('[data-landmark="two-dice-any-double"]')!;
    const lotoPrize = document.querySelector<HTMLButtonElement>('[data-landmark="france-loto-main-prize"]')!;

    expect(rollSix).not.toBeNull();
    expect(sceneArtwork("two-dice-any-double").querySelector('.dice-set[data-face="4"]')).not.toBeNull();
    expect(lotoPrize).not.toBeNull();
    expect(rollSix.dataset.ringSize).toBe(matchingDice.dataset.ringSize);
    expect([rollSix.style.left, rollSix.style.top]).not.toEqual([matchingDice.style.left, matchingDice.style.top]);
    expect(lotoPrize.dataset.ringSize).not.toBe(rollSix.dataset.ringSize);
    expect(document.querySelector("[data-stem-for], [data-landmark-preview]")).toBeNull();

    matchingDice.focus();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("−7 dBan");
    matchingDice.click();
    expect(document.querySelector("[data-detail-sources]")?.textContent).toContain("Fair independent dice model");
    first.dispose();

    history.replaceState(null, "", "#d=0");
    render(390);
    const d4 = document.querySelector<HTMLElement>('[data-landmark="die-d4-highest"]')!;
    const d20 = document.querySelector<HTMLElement>('[data-landmark="die-d20-highest"]')!;
    expect(Number(d4.dataset.depthScale)).toBeGreaterThan(Number(d20.dataset.depthScale));
    expect(d20.querySelector<HTMLElement>(".landmark-title")?.hidden).toBe(true);
  });

  it("explains final Texas Hold’em categories after all seven cards are dealt", () => {
    history.replaceState(null, "", "#d=-5.1");
    render(390);
    const twoPair = document.querySelector<HTMLButtonElement>('[data-landmark="holdem-two-pair"]')!;
    expect(twoPair.hidden).toBe(false);
    expect(document.querySelector('[data-landmark^="holdem-starting-"]')).toBeNull();
    twoPair.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("31,433,400");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("Two private cards and five community cards");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("no cards known in advance");
  });

  it("shows the authorized main-draw lottery losses as sourced ticket events", () => {
    history.replaceState(null, "", "#d=10.78");
    render(390);

    const euroLoss = document.querySelector<HTMLButtonElement>('[data-landmark="euromillions-main-loss"]')!;
    expect(euroLoss).not.toBeNull();
    expect(euroLoss.getAttribute("aria-label")).toContain("92.29%");
    expect(sceneArtwork("euromillions-main-loss").querySelector(".lottery-ticket[data-event='loss']")).not.toBeNull();
    expect(sceneArtwork("euromillions-main-loss").querySelector(".ticket-flag.european")).not.toBeNull();
    euroLoss.click();
    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("A EuroMillions line wins no main-draw prize");
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("129,059,469");
    expect(document.querySelector("[data-detail-assumptions]")?.textContent).toContain("one line in one draw");
    expect(document.querySelector("[data-detail-sources]")?.textContent).toContain("25 October 2026");

    history.replaceState(null, "", "#d=-72.8");
    render(390);
    expect(sceneArtwork("france-loto-jackpot").querySelector(".lottery-ticket[data-event='jackpot'] .ticket-jackpot")?.textContent).toBe("Jackpot!");
  });

  it("states the radon decay model with an explicit exponent", () => {
    history.replaceState(null, "", "#d=289");
    render();
    document.querySelector<HTMLButtonElement>('[data-landmark="radon-222-decay"]')!.click();
    expect(document.querySelector("[data-detail-calculation]")?.textContent).toContain("1 − 2^(−365/3.8)");
  });

  it("fast-forwards wheel travel through empty space and keeps dense movement precise", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));

    history.replaceState(null, "", "#d=100");
    const sparse = render();
    const sparseScale = document.querySelector<HTMLElement>(".scale")!;
    sparseScale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    sparseScale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    clock.advanceTo(16);
    expect(Number(sparseScale.dataset.depth)).toBeGreaterThan(100);
    expect(document.querySelector("[data-gap-caption]")?.textContent).toMatch(/dBan · odds ×/);
    clock.advanceTo(1200);
    expect(document.querySelector("[data-center-marker]")?.textContent).not.toContain("+289.1 dBan");
    clock.advanceTo(3000);
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("+289.1 dBan");
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(true);
    sparse.dispose();

    history.replaceState(null, "", "#d=100");
    const reversing = render();
    const reversingScale = document.querySelector<HTMLElement>(".scale")!;
    reversingScale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    clock.advanceTo(3300);
    const beforeReverse = Number(reversingScale.dataset.depth);
    reversingScale.dispatchEvent(new WheelEvent("wheel", { deltaY: -104.4, cancelable: true }));
    const afterReverseInput = Number(reversingScale.dataset.depth);
    clock.advanceTo(3316);
    expect(Number(reversingScale.dataset.depth)).toBeLessThan(beforeReverse);
    expect(Number(reversingScale.dataset.depth)).toBeLessThan(afterReverseInput);
    reversing.dispose();

    history.replaceState(null, "", "#d=285");
    const approaching = render();
    const approachingScale = document.querySelector<HTMLElement>(".scale")!;
    approachingScale.dispatchEvent(new WheelEvent("wheel", { deltaY: 103.2, cancelable: true }));
    clock.advanceTo(3324);
    expect(Number(approachingScale.dataset.depth)).toBeGreaterThan(285);

    for (let event = 0; event < 10; event += 1) {
      approachingScale.dispatchEvent(new WheelEvent("wheel", { deltaY: 10000, cancelable: true }));
    }
    clock.advanceTo(3340);
    expect(Number(document.querySelector<HTMLElement>(".scale")?.dataset.depth)).toBeLessThanOrEqual(Math.max(...displayLandmarks.map(item => item.position)));
    expect(document.querySelector('[data-landmark="radon-222-decay"]')).not.toBeNull();
    approaching.dispose();

    history.replaceState(null, "", "#d=100");
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const reduced = render();
    document.querySelector<HTMLElement>(".scale")!.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("+289.1 dBan");
    expect(document.querySelector<HTMLParagraphElement>("[data-gap-caption]")?.hidden).toBe(true);
    reduced.dispose();

    history.replaceState(null, "", "#d=100");
    const swipe = render(390);
    const swipeScale = document.querySelector<HTMLElement>(".scale")!;
    const pointer = (type: string, clientY: number) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperties(event, { clientX: { value: 180 }, clientY: { value: clientY }, pointerId: { value: 4 } });
      return event;
    };
    swipeScale.dispatchEvent(pointer("pointerdown", 200));
    swipeScale.dispatchEvent(pointer("pointermove", 320));
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("+289.1 dBan");
    swipeScale.dispatchEvent(pointer("pointerup", 320));
    swipe.dispose();

    history.replaceState(null, "", "#d=100");
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const pending = render();
    const pendingScale = document.querySelector<HTMLElement>(".scale")!;
    pendingScale.dispatchEvent(new WheelEvent("wheel", { deltaY: 0, cancelable: true }));
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("+100 dBan");
    pendingScale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    pending.dispose();
    expect(clock.pendingFrames).toBe(0);
    expect(document.querySelector<HTMLParagraphElement>("[data-gap-caption]")?.hidden).toBe(true);
  });

  it("fast-forwards sparse pinch and swipe travel with an interruptible depth effect", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const pointer = (type: string, pointerId: number, clientX: number, clientY: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { clientX: { value: clientX }, clientY: { value: clientY }, pointerId: { value: pointerId }, pointerType: { value: "touch" } });
      return event;
    };

    history.replaceState(null, "", "#d=100");
    const pinched = render(390);
    const scale = document.querySelector<HTMLElement>(".scale")!;
    scale.dispatchEvent(pointer("pointerdown", 1, 100, 300));
    scale.dispatchEvent(pointer("pointerdown", 2, 300, 300));
    scale.dispatchEvent(pointer("pointermove", 2, 250, 300));
    clock.advanceTo(16);
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(false);
    expect(scale.dataset.fastForward).toBe("outward");
    expect(Number(document.querySelector<HTMLElement>("[data-hyperspace]")!.style.getPropertyValue("--hyperspace-opacity"))).toBe(0);
    clock.advanceTo(1400);
    expect(Number(document.querySelector<HTMLElement>("[data-hyperspace]")!.style.getPropertyValue("--hyperspace-opacity"))).toBeGreaterThan(0);
    clock.advanceTo(3000);
    expect(document.querySelector<HTMLElement>("[data-hyperspace]")!.style.getPropertyValue("--hyperspace-opacity")).toBe("0");
    const beforeReverse = Number(scale.dataset.depth);
    scale.dispatchEvent(pointer("pointermove", 2, 350, 300));
    clock.advanceTo(3016);
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(false);
    expect(scale.dataset.fastForward).toBe("inward");
    expect(Number(scale.dataset.depth)).toBeLessThan(beforeReverse);
    pinched.dispose();

    history.replaceState(null, "", "#d=100");
    const swiped = render(390);
    const swipeScale = document.querySelector<HTMLElement>(".scale")!;
    swipeScale.dispatchEvent(pointer("pointerdown", 3, 200, 200));
    swipeScale.dispatchEvent(pointer("pointermove", 3, 200, 260));
    clock.advanceTo(3032);
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(false);
    expect(swipeScale.dataset.fastForward).toBe("outward");
    swiped.dispose();

    history.replaceState(null, "", "#d=100");
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const reduced = render(390);
    const reducedScale = document.querySelector<HTMLElement>(".scale")!;
    reducedScale.dispatchEvent(pointer("pointerdown", 4, 100, 300));
    reducedScale.dispatchEvent(pointer("pointerdown", 5, 300, 300));
    reducedScale.dispatchEvent(pointer("pointermove", 5, 250, 300));
    expect(Number(reducedScale.dataset.depth)).toBeGreaterThan(250);
    expect(reducedScale.dataset.fastForward).toBeUndefined();
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(true);
    reduced.dispose();
  });

  it("keeps odds factors faithful for short and moderate depth journeys", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const target = displayLandmarks.find(item => item.id === "die-d20-highest")!;

    for (const [distance, factor] of [[0.3, "1.07"], [10, "10"], [20.1, "102"]] as const) {
      history.replaceState(null, "", `#d=${target.position + distance}`);
      const rendered = render();
      document.querySelector<HTMLButtonElement>('[data-landmark="die-d20-highest"]')!.click();
      expect(document.querySelector("[data-gap-caption]")?.textContent).toContain(`odds ÷${factor}`);
      rendered.dispose();
    }
  });

  it("offers an explicit animated return to zero and yields focus when it completes", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    history.replaceState(null, "", "#d=100");
    const rendered = render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const returnButton = document.querySelector<HTMLButtonElement>("[data-return-zero]")!;
    expect(returnButton.textContent).toBe("Return to 0 dBan");
    expect(returnButton.hidden).toBe(false);
    returnButton.focus();
    returnButton.click();
    expect(scale.dataset.fastForward).toBe("inward");
    expect(document.querySelector<HTMLElement>("[data-gap-caption]")?.hidden).toBe(false);
    clock.advanceTo(1000);
    expect(document.querySelector("[data-center-marker]")?.textContent).not.toContain("0 dBan");
    expect(Number(document.querySelector<HTMLElement>("[data-hyperspace]")!.style.getPropertyValue("--hyperspace-opacity"))).toBeGreaterThan(.9);
    clock.advanceTo(2000);
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("0 dBan");
    expect(scale.dataset.fastForward).toBeUndefined();
    expect(returnButton.hidden).toBe(true);
    expect(document.activeElement).toBe(scale);
    expect(clock.cancelled).toHaveLength(0);

    scale.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    returnButton.click();
    clock.advanceTo(2700);
    scale.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    clock.advanceTo(2716);
    const afterLeft = Number(scale.dataset.depth);
    expect(afterLeft).toBeLessThan(0);
    scale.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    clock.advanceTo(2732);
    expect(Number(scale.dataset.depth)).toBeGreaterThan(afterLeft);
    expect(clock.pendingFrames).toBe(1);

    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    returnButton.focus();
    returnButton.click();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("0 dBan");
    expect(document.activeElement).toBe(scale);

    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    scale.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    returnButton.click();
    rendered.dispose();
    expect(clock.pendingFrames).toBe(0);
  });

  it("shares travel lifecycle cleanup between a return and landmark journeys", () => {
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    history.replaceState(null, "", "#d=-6.989700043360188");
    const rendered = render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const returnButton = document.querySelector<HTMLButtonElement>("[data-return-zero]")!;

    document.querySelector<HTMLButtonElement>('[data-landmark="two-dice-any-double"]')!.click();
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(true);
    returnButton.focus();
    returnButton.click();

    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    expect(scale.dataset.fastForward).toBe("outward");
    clock.advanceTo(1000);
    expect(Number(scale.dataset.depth)).toBe(0);
    expect(document.activeElement).toBe(scale);

    history.replaceState(null, "", "#d=100");
    rendered.dispose();
    const wheelRendered = render();
    const wheelScale = document.querySelector<HTMLElement>(".scale")!;
    wheelScale.dispatchEvent(new WheelEvent("wheel", { deltaY: 104.4, cancelable: true }));
    clock.advanceTo(1016);
    expect(Number(wheelScale.dataset.depth)).toBeGreaterThan(100.1);
    clock.advanceTo(4000);
    expect(Number(wheelScale.dataset.depth)).toBeCloseTo(289.1, 1);
    wheelRendered.dispose();

    history.replaceState(null, "", "#d=100");
    const pinchRendered = render(390);
    const pinchScale = document.querySelector<HTMLElement>(".scale")!;
    const pointer = (type: string, pointerId: number, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { clientX: { value: clientX }, clientY: { value: 300 }, pointerId: { value: pointerId }, pointerType: { value: "touch" } });
      return event;
    };
    pinchScale.dispatchEvent(pointer("pointerdown", 1, 100));
    pinchScale.dispatchEvent(pointer("pointerdown", 2, 300));
    pinchScale.dispatchEvent(pointer("pointermove", 2, 250));
    const beforeQuietInterval = Number(pinchScale.dataset.depth);
    clock.advanceTo(4080);
    expect(Number(pinchScale.dataset.depth)).toBeGreaterThan(beforeQuietInterval);
    clock.advanceTo(7000);
    expect(Number(pinchScale.dataset.depth)).toBeCloseTo(289.1, 1);
    pinchRendered.dispose();
  });

  it("keeps the current extreme readout authoritative on the spoke", () => {
    history.replaceState(null, "", "#d=525");
    render(390);
    document.querySelector<HTMLButtonElement>('[data-landmark="carbon-14-decay"]')!.focus();

    expect(document.querySelector<HTMLElement>("[data-center-marker]")?.hidden).toBe(false);
    expect(document.querySelector("[data-center-marker] .probability")?.textContent).toBe("Probability: (100 − 3.16 × 10⁻⁵¹)%");
    expect(document.querySelector("[data-event-marker]")).toBeNull();
    expect(document.querySelector("[data-current-depth-marker]")?.textContent).toContain("+525 dBan");
  });

  it("falls back safely when local view storage is unavailable", () => {
    sessionStorage.setItem("probability-scale-view-v1", "{");
    render();
    expect(document.querySelector("[data-center-marker]")?.textContent).toContain("0 dBan");

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("storage unavailable"); });
    document.querySelector<HTMLButtonElement>("[data-all-references]")!.click();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    scale.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(Number(scale.dataset.depth)).toBeGreaterThan(0);

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("storage unavailable"); });
    render(1200, false);
    expect(document.querySelector<HTMLDialogElement>("[data-scale-intro]")?.open).toBe(true);
    document.querySelector<HTMLButtonElement>('[data-locale-context="intro"][data-locale-choice="fr"]')!.click();
    expect(document.documentElement.lang).toBe("fr");
    document.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.click();
  });

  it("stops exploration at the first and last catalogue examples", () => {
    const minimum = Math.min(...displayLandmarks.map(item => item.position));
    const maximum = Math.max(...displayLandmarks.map(item => item.position));
    history.replaceState(null, "", "#d=9999");
    const upper = render();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    scale.focus();
    scale.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    expect(Number(scale.dataset.depth)).toBe(maximum);
    expect(document.querySelector("[data-center-marker]")?.textContent).not.toMatch(/Infinity|100%/);
    const clock = new TestFrameClock();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 120, cancelable: true }));
    clock.advanceTo(16);
    expect(Number(scale.dataset.depth)).toBe(maximum);
    expect(clock.pendingFrames).toBe(0);
    upper.dispose();

    history.replaceState(null, "", "/");
    sessionStorage.setItem("probability-scale-view-v1", JSON.stringify({ center: -9999 }));
    render();
    const lowerScale = document.querySelector<HTMLElement>(".scale")!;
    lowerScale.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    clock.advanceTo(32);
    expect(Number(lowerScale.dataset.depth)).toBe(minimum);
    expect(document.querySelector("[data-center-marker]")?.textContent).not.toMatch(/Infinity|100%/);
  });
});
