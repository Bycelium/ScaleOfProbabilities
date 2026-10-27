import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { displayLandmarks } from "../src/catalogue";
import { createScale } from "../src/scale";

class TestResizeObserver {
  observe(): void {}
  disconnect(): void {}
}

class TestFrameClock {
  private nextFrameId = 1;
  private readonly callbacks = new Map<number, FrameRequestCallback>();

  constructor() {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      const frameId = this.nextFrameId++;
      this.callbacks.set(frameId, callback);
      return frameId;
    });
    vi.stubGlobal("cancelAnimationFrame", (frameId: number) => this.callbacks.delete(frameId));
    vi.spyOn(performance, "now").mockReturnValue(0);
  }

  advanceTo(timestamp: number): void {
    const callbacks = [...this.callbacks.values()];
    this.callbacks.clear();
    for (const callback of callbacks) callback(timestamp);
  }
}

const canvasContext = {
  globalAlpha: 1,
  strokeStyle: "",
  lineWidth: 1,
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
};

const renderMobileScale = () => {
  document.body.innerHTML = '<main id="app"></main>';
  sessionStorage.setItem("probability-scale-intro-seen", "true");
  localStorage.setItem("probability-scale-all-references", "true");
  Object.defineProperties(HTMLElement.prototype, {
    clientWidth: {
      configurable: true,
      get() { return this.classList.contains("scale") ? 390 : 0; },
    },
    clientHeight: {
      configurable: true,
      get() { return this.classList.contains("scale") ? 844 : 0; },
    },
  });
  return createScale(document.querySelector<HTMLElement>("#app")!);
};

describe("scene rendering performance", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", TestResizeObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(canvasContext as unknown as CanvasRenderingContext2D);
    history.replaceState(null, "", "/");
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps artwork on the exact projection without mutating title transforms during travel", () => {
    const clock = new TestFrameClock();
    const dispose = renderMobileScale();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const scene = document.querySelector<HTMLElement>("[data-depth-scene]")!;
    const titles = [...document.querySelectorAll<HTMLElement>(".landmark-title")];
    const initialTitleState = titles.map(title => ({ hidden: title.hidden, transform: title.style.transform }));

    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true }));
    clock.advanceTo(16);

    expect(scale.dataset.fastForward).toBe("outward");
    expect(titles.map(title => ({ hidden: title.hidden, transform: title.style.transform }))).toEqual(initialTitleState);
    expect(document.querySelector<HTMLElement>('[data-landmark="coin-heads"]')!.getAttribute("aria-label")).toContain("A chosen side of a fair coin");
    const sceneZoom = Number(scene.dataset.sceneZoom);
    const center = Number(scale.dataset.depth);
    for (const button of document.querySelectorAll<HTMLElement>("[data-landmark]")) {
      const landmark = displayLandmarks.find(item => item.id === button.dataset.landmark)!;
      expect(Number(button.dataset.depthScale) * sceneZoom).toBeCloseTo(10 ** ((landmark.position - center) / 10), 10);
    }

    clock.advanceTo(30);
    expect(titles.map(title => ({ hidden: title.hidden, transform: title.style.transform }))).toEqual(initialTitleState);

    const pointerDown = new Event("pointerdown", { bubbles: true });
    Object.defineProperties(pointerDown, { pointerId: { value: 1 }, pointerType: { value: "mouse" } });
    scale.dispatchEvent(pointerDown);
    expect(scale.dataset.fastForward).toBeUndefined();
    expect(scene.style.transform).toBe("scale(1)");

    scale.dispatchEvent(new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true }));
    clock.advanceTo(46);
    clock.advanceTo(4000);
    expect(scale.dataset.fastForward).toBeUndefined();
    expect(scene.style.transform).toBe("scale(1)");
    const settledCenter = Number(scale.dataset.depth);
    let eligibleVisibleTitles = 0;
    for (const button of document.querySelectorAll<HTMLElement>("[data-landmark]")) {
      const landmark = displayLandmarks.find(item => item.id === button.dataset.landmark)!;
      const projectedSize = landmark.size * 0.76 * 10 ** ((landmark.position - settledCenter) / 10);
      const eligible = !button.hidden && projectedSize >= 32 && Math.abs(landmark.position - settledCenter) <= 1.7;
      const title = button.querySelector<HTMLElement>(".landmark-title")!;
      if (!eligible) expect(title.hidden).toBe(true);
      if (!title.hidden) {
        eligibleVisibleTitles += 1;
        expect(title.style.transform).toBe("scale(1) translate(var(--title-x), var(--title-y))");
      }
      expect(button.getAttribute("aria-label")).toBeTruthy();
    }
    expect(eligibleVisibleTitles).toBeGreaterThan(0);
    dispose();
  });

  it("defers title measurement during travel rebases and restores layout after interruption and arrival", () => {
    const measuredTitles: HTMLElement[] = [];
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains("landmark-title")) measuredTitles.push(this);
      return this.classList.contains("landmark-title") ? 96 : 0;
    });
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
      return this.classList.contains("landmark-title") ? 18 : 0;
    });
    const clock = new TestFrameClock();
    const dispose = renderMobileScale();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const scene = document.querySelector<HTMLElement>("[data-depth-scene]")!;
    const initialLabels = new Map([...document.querySelectorAll<HTMLElement>("[data-landmark]")]
      .map(button => [button.dataset.landmark!, button.getAttribute("aria-label")]));
    const initialMeasurementCount = measuredTitles.length;
    const initialCoinLeft = document.querySelector<HTMLElement>('[data-landmark="coin-heads"]')!.style.left;
    const railSnapshot = () => [...document.querySelectorAll<SVGElement>("[data-family-rail]")].map(rail => ({
      id: rail.dataset.familyRail,
      hidden: rail.hasAttribute("hidden"),
      path: rail.tagName,
      geometry: rail.tagName === "polyline"
        ? (rail.getAttribute("points")?.trim().split(/[\s,]+/).map(Number) ?? [])
        : ["x1", "y1", "x2", "y2"].map(attribute => Number(rail.getAttribute(attribute))),
    }));
    const initialRails = railSnapshot();

    document.querySelector<HTMLButtonElement>('[data-landmark="die-six"]')!.click();
    clock.advanceTo(400);

    expect(Math.abs(Number(scale.dataset.depth))).toBeGreaterThanOrEqual(5);
    expect(document.querySelector<HTMLElement>('[data-landmark="coin-heads"]')!.style.left).not.toBe(initialCoinLeft);
    expect(measuredTitles).toHaveLength(initialMeasurementCount);
    const rebasedRails = railSnapshot();
    expect(rebasedRails).not.toEqual(initialRails);
    expect(rebasedRails.find(rail => rail.id === "holdem-seven-card-hands")?.geometry)
      .not.toEqual(initialRails.find(rail => rail.id === "holdem-seven-card-hands")?.geometry);
    for (const rail of rebasedRails.filter(rail => !rail.hidden)) {
      expect(rail.geometry.length).toBeGreaterThanOrEqual(4);
      expect(rail.geometry.every(Number.isFinite)).toBe(true);
    }

    const pointerDown = new Event("pointerdown", { bubbles: true });
    Object.defineProperties(pointerDown, { pointerId: { value: 1 }, pointerType: { value: "mouse" } });
    scale.dispatchEvent(pointerDown);

    expect(scale.dataset.fastForward).toBeUndefined();
    expect(scene.style.transform).toBe("scale(1)");
    expect(measuredTitles.length).toBeGreaterThan(initialMeasurementCount);
    const interruptedMeasurementCount = measuredTitles.length;

    document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!.click();
    clock.advanceTo(4000);

    expect(scale.dataset.fastForward).toBeUndefined();
    expect(scene.style.transform).toBe("scale(1)");
    expect(measuredTitles.length).toBeGreaterThan(interruptedMeasurementCount);
    let suppressedEligibleTitles = 0;
    const arrivedCenter = Number(scale.dataset.depth);
    for (const button of document.querySelectorAll<HTMLElement>("[data-landmark]")) {
      expect(button.getAttribute("aria-label")).toBe(initialLabels.get(button.dataset.landmark!));
      const landmark = displayLandmarks.find(item => item.id === button.dataset.landmark)!;
      const projectedSize = landmark.size * 0.76 * 10 ** ((landmark.position - arrivedCenter) / 10);
      const eligible = !button.hidden && projectedSize >= 32 && Math.abs(landmark.position - arrivedCenter) <= 1.7;
      const title = button.querySelector<HTMLElement>(".landmark-title")!;
      if (eligible && title.hidden) suppressedEligibleTitles += 1;
      if (!title.hidden) expect(title.style.transform).toBe("scale(1) translate(var(--title-x), var(--title-y))");
    }
    expect(suppressedEligibleTitles).toBeGreaterThan(0);
    dispose();
  });

  it("reuses a compact scene snapshot across nearby dense landmarks", () => {
    const clock = new TestFrameClock();
    const dispose = renderMobileScale();
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const scene = document.querySelector<HTMLElement>("[data-depth-scene]")!;
    const coin = document.querySelector<HTMLElement>('[data-landmark="coin-heads"]')!;
    const initialCoinPosition = [coin.style.left, coin.style.top];

    document.querySelector<HTMLButtonElement>('[data-landmark="die-six"]')!.click();
    clock.advanceTo(350);

    const center = Number(scale.dataset.depth);
    expect(Math.abs(center)).toBeGreaterThan(2);
    expect(Math.abs(center)).toBeLessThan(5);
    expect([coin.style.left, coin.style.top]).toEqual(initialCoinPosition);
    expect(Number(scene.dataset.sceneZoom)).toBeCloseTo(10 ** (-center / 10), 10);
    expect(Number(coin.dataset.depthScale) * Number(scene.dataset.sceneZoom)).toBeCloseTo(10 ** (-center / 10), 10);
    dispose();
  });
});
