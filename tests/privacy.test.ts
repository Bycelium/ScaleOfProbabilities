import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Analytics, AnalyticsConsent, AnalyticsConsentListener } from "../src/analytics";
import { displayLandmarks } from "../src/catalogue";
import { createScale } from "../src/scale";
import type { SiteRoute } from "../src/site";

class TestResizeObserver {
  observe(): void {}
  disconnect(): void {}
}

class TestCanvasContext {
  lineWidth = 1;
  globalAlpha = 1;
  strokeStyle = "";
  setTransform(): void {}
  clearRect(): void {}
  beginPath(): void {}
  moveTo(): void {}
  arc(): void {}
  stroke(): void {}
}

const createMockAnalytics = (available = true, initialConsent: AnalyticsConsent = "unknown") => {
  let consent = initialConsent;
  const listeners = new Set<AnalyticsConsentListener>();
  const unsubscribe = vi.fn(() => listeners.clear());
  const notify = (next: AnalyticsConsent) => {
    consent = next;
    for (const listener of listeners) listener(consent);
  };
  const setConsent = vi.fn((next: Exclude<AnalyticsConsent, "unknown">) => notify(next));
  const subscribe = vi.fn((listener: AnalyticsConsentListener) => {
    listeners.add(listener);
    return unsubscribe;
  });
  const analytics: Analytics = {
    available,
    getConsent: () => consent,
    setConsent,
    subscribe,
    setLocale: vi.fn(),
    openExample: vi.fn(),
    closeExample: vi.fn(),
    setExampleVisible: vi.fn(),
    dispose: vi.fn(),
  };
  return { analytics, setConsent, unsubscribe, notify };
};

const render = (analytics: Analytics, introSeen = true, initialRoute?: SiteRoute) => {
  document.body.innerHTML = '<main id="app"></main>';
  if (introSeen) sessionStorage.setItem("probability-scale-intro-seen", "true");
  return createScale(document.querySelector<HTMLElement>("#app")!, initialRoute ? { analytics, initialRoute } : { analytics });
};

describe("privacy and analytics choices", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    history.replaceState(null, "", "/");
    vi.stubGlobal("ResizeObserver", TestResizeObserver);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(new TestCanvasContext() as unknown as CanvasRenderingContext2D);
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get() { return this.classList.contains("scale") ? 1200 : 0; },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("requires an equally prominent analytics choice before exploring", () => {
    const mocked = createMockAnalytics();
    const dispose = render(mocked.analytics, false);
    const intro = document.querySelector<HTMLDialogElement>("[data-scale-intro]")!;
    expect(intro.open).toBe(true);
    const consent = intro.querySelector<HTMLElement>("[data-intro-consent]")!;
    const explore = intro.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!;
    const choices = [...consent.querySelectorAll<HTMLButtonElement>("[data-consent-choice]")];
    expect(consent.hidden).toBe(false);
    expect(consent.querySelector("[data-intro-consent-description]")?.textContent).toContain("examples opened and approximate visible time");
    const inlinePrivacy = consent.querySelector<HTMLButtonElement>("[data-privacy-from-description]")!;
    expect(inlinePrivacy.textContent).toBe("(See Privacy for more)");
    expect(choices.map(choice => choice.textContent)).toEqual(["Participate in analytics", "Do not participate in analytics"]);
    expect(choices.every(choice => !choice.hasAttribute("aria-pressed"))).toBe(true);
    expect(choices.every(choice => choice.parentElement === choices[0].parentElement)).toBe(true);
    expect(explore.disabled).toBe(true);
    const privacyButton = intro.querySelector<HTMLButtonElement>("[data-privacy-from-intro]")!;
    expect(privacyButton.parentElement).toBe(explore.parentElement);
    expect(privacyButton.compareDocumentPosition(intro.querySelector(".intro-credit")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    privacyButton.focus();
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(intro.querySelector(".intro-credit a"));

    const preferencesToggle = intro.querySelector<HTMLButtonElement>('[data-preferences-toggle="intro"]')!;
    preferencesToggle.click();
    const preferencesMenu = document.querySelector<HTMLElement>("[data-preferences-menu]")!;
    expect(preferencesMenu.hidden).toBe(false);
    document.activeElement!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(preferencesMenu.hidden).toBe(true);
    expect(intro.open).toBe(true);
    expect(document.activeElement).toBe(preferencesToggle);

    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(intro.open).toBe(true);
    expect(document.activeElement).toBe(choices[0]);
    intro.dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(intro.open).toBe(true);

    inlinePrivacy.click();
    const privacy = document.querySelector<HTMLDialogElement>("[data-privacy-dialog]")!;
    expect(privacy.open).toBe(true);
    const privacyAction = privacy.querySelector<HTMLButtonElement>('[data-consent-choice]')!;
    expect(privacy.querySelectorAll("[data-consent-choice]")).toHaveLength(1);
    expect(privacyAction.dataset.consentChoice).toBe("accepted");
    expect(privacyAction.textContent).toBe("Allow analytics");
    privacy.dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(privacy.open).toBe(false);
    expect(intro.open).toBe(true);
    expect(document.activeElement).toBe(inlinePrivacy);

    choices[0].focus();
    choices[0].click();
    expect(mocked.setConsent).toHaveBeenCalledWith("accepted");
    expect(explore.disabled).toBe(false);
    expect(consent.querySelector<HTMLElement>(".intro-consent")?.hidden).toBe(true);
    expect(document.activeElement).toBe(explore);
    privacyButton.click();
    expect(privacy.open).toBe(true);
    expect(privacy.querySelector("[data-privacy-dialog-status]")?.textContent).toBe("Analytics allowed");
    expect(privacy.textContent).toContain("BYCELIUM SAS");
    expect(privacy.textContent).toContain("SIREN 919 837 187");
    expect(privacy.querySelector<HTMLAnchorElement>('a[href="mailto:gdpr@bycelium.com"]')).not.toBeNull();
    expect(privacy.querySelector<HTMLAnchorElement>("[data-privacy-cnil]")?.href).toBe("https://www.cnil.fr/en/contact-us");
    expect(privacy.querySelector<HTMLAnchorElement>("[data-privacy-provider-policy]")?.href).toBe("https://vercel.com/docs/analytics/privacy-policy");
    expect(privacy.querySelector<HTMLAnchorElement>("[data-privacy-provider-dpa]")?.href).toBe("https://vercel.com/legal/dpa");
    expect(privacy.textContent).toContain("Vercel Web Analytics uses no third-party cookies");
    expect(privacy.textContent).toContain("12-month reporting window");
    expect(privacy.textContent).not.toContain("screen resolution");
    expect(privacy.textContent).not.toContain("browser language");
    expect(privacy.textContent).toContain("stored on this device for six months");
    expect(privacy.querySelectorAll("[data-consent-choice]")).toHaveLength(1);
    expect(privacyAction.dataset.consentChoice).toBe("declined");
    expect(privacyAction.textContent).toBe("Withdraw consent");
    privacyAction.focus();
    privacyAction.click();
    expect(mocked.setConsent).toHaveBeenLastCalledWith("declined");
    expect(privacy.querySelector("[data-privacy-dialog-status]")?.textContent).toBe("Analytics declined");
    expect(document.activeElement).toBe(privacyAction);
    expect(privacyAction.dataset.consentChoice).toBe("accepted");
    expect(privacyAction.textContent).toBe("Allow analytics");
    privacy.querySelector<HTMLButtonElement>("[data-close-privacy]")!.click();
    expect(privacy.open).toBe(false);
    expect(document.activeElement).toBe(privacyButton);
    expect(intro.open).toBe(true);
    expect(consent.querySelector<HTMLElement>(".intro-consent")?.hidden).toBe(false);
    expect(choices[0].hidden).toBe(false);
    expect(choices[0].dataset.consentChoice).toBe("accepted");
    expect(choices[0].textContent).toBe("Allow analytics");
    expect(choices[1].hidden).toBe(true);
    choices[0].focus();
    choices[0].click();
    expect(mocked.setConsent).toHaveBeenLastCalledWith("accepted");
    expect(consent.querySelector<HTMLElement>(".intro-consent")?.hidden).toBe(true);
    expect(document.activeElement).toBe(explore);
    explore.click();
    expect(intro.open).toBe(false);

    dispose();
    expect(mocked.unsubscribe).toHaveBeenCalledOnce();
    expect(mocked.analytics.dispose).toHaveBeenCalledOnce();
  });

  it("keeps local privacy information available without presenting fake consent controls", () => {
    const mocked = createMockAnalytics(false);
    render(mocked.analytics);

    document.querySelector<HTMLButtonElement>("[data-open-intro]")!.click();
    expect(document.querySelector<HTMLElement>("[data-intro-consent]")?.hidden).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("[data-dismiss-intro]")?.disabled).toBe(false);
    document.querySelector<HTMLButtonElement>("[data-privacy-from-intro]")!.click();
    const privacy = document.querySelector<HTMLDialogElement>("[data-privacy-dialog]")!;
    expect(privacy.open).toBe(true);
    expect(privacy.querySelector("[data-privacy-dialog-status]")?.textContent).toBe("Analytics is off on this site.");
    expect(privacy.querySelector<HTMLElement>("[data-privacy-actions]")?.hidden).toBe(true);
    expect(privacy.textContent).toContain("Functional browser storage");
    expect(mocked.setConsent).not.toHaveBeenCalled();

    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    privacy.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(privacy.querySelector("[data-close-privacy]"));
    privacy.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(privacy.querySelector("[data-privacy-cnil]"));
    privacy.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(privacy.open).toBe(false);
  });

  it("keeps collapsed prerender links out of the About dialog focus order", () => {
    const mocked = createMockAnalytics(false);
    const dispose = render(mocked.analytics, false);
    const intro = document.querySelector<HTMLDialogElement>("[data-scale-intro]")!;
    const disclosure = intro.querySelector<HTMLDetailsElement>(".prerender-disclosure")!;
    const summary = disclosure.querySelector<HTMLElement>("summary")!;
    const firstCatalogueLink = disclosure.querySelector<HTMLAnchorElement>("a[href]")!;
    const privacyButton = intro.querySelector<HTMLButtonElement>("[data-privacy-from-intro]")!;

    expect(disclosure.open).toBe(false);
    summary.focus();
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(privacyButton);
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(summary);

    disclosure.open = true;
    intro.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(firstCatalogueLink);
    dispose();
  });

  it("preserves depth and details while privacy, About, and language controls update analytics", () => {
    const mocked = createMockAnalytics(true, "accepted");
    const dispose = render(mocked.analytics);
    const scale = document.querySelector<HTMLElement>(".scale")!;
    document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!.click();
    const detail = document.querySelector<HTMLDialogElement>("[data-detail-panel]")!;
    const depth = scale.dataset.depth;

    expect(detail.open).toBe(true);
    expect(mocked.analytics.openExample).toHaveBeenCalledWith("coin-heads");
    document.querySelector<HTMLButtonElement>("[data-open-intro]")!.click();
    const privacyButton = document.querySelector<HTMLButtonElement>("[data-privacy-from-intro]")!;
    privacyButton.click();
    expect(detail.open).toBe(true);
    expect(scale.dataset.depth).toBe(depth);
    expect(mocked.analytics.setExampleVisible).toHaveBeenLastCalledWith(false);
    const privacy = document.querySelector<HTMLDialogElement>("[data-privacy-dialog]")!;
    privacy.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(detail.open).toBe(true);
    expect(document.activeElement).toBe(privacyButton);
    expect(mocked.analytics.setExampleVisible).toHaveBeenLastCalledWith(false);
    document.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.click();
    expect(mocked.analytics.setExampleVisible).toHaveBeenLastCalledWith(true);

    document.querySelector<HTMLButtonElement>('[data-preferences-toggle="toolbar"]')!.click();
    document.querySelector<HTMLInputElement>('[data-preferences-menu] [data-locale-choice="fr"]')!.click();
    expect(mocked.analytics.setLocale).toHaveBeenCalledTimes(1);
    expect(mocked.analytics.setLocale).toHaveBeenCalledWith("fr");
    expect(detail.open).toBe(true);
    expect(scale.dataset.depth).toBe(depth);
    expect(document.querySelector("[data-detail-title]")?.textContent).toContain("pièce équilibrée");
    expect(document.querySelector("[data-privacy-provider-policy]")?.textContent).toBe("Informations de confidentialité de Vercel Web Analytics");

    document.querySelector<HTMLButtonElement>("[data-open-intro]")!.click();
    expect(document.querySelector<HTMLElement>(".intro-consent")?.hidden).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("[data-privacy-from-description]")?.textContent).toBe("(Voir Confidentialité pour en savoir plus)");
    expect(detail.open).toBe(true);
    expect(mocked.analytics.setExampleVisible).toHaveBeenLastCalledWith(false);
    document.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.click();
    expect(detail.open).toBe(true);
    expect(mocked.analytics.setExampleVisible).toHaveBeenLastCalledWith(true);
    document.querySelector<HTMLButtonElement>("[data-close-detail]")!.click();
    expect(mocked.analytics.closeExample).toHaveBeenCalledOnce();

    dispose();
  });

  it("forces an unresolved choice and honors a saved decline on the next visit", () => {
    const mocked = createMockAnalytics();
    const dispose = render(mocked.analytics, true);
    const intro = document.querySelector<HTMLDialogElement>("[data-scale-intro]")!;
    const review = intro.querySelector<HTMLButtonElement>("[data-privacy-from-intro]")!;

    expect(intro.open).toBe(true);
    review.click();
    const privacy = document.querySelector<HTMLDialogElement>("[data-privacy-dialog]")!;
    expect(intro.open).toBe(false);
    expect(privacy.open).toBe(true);
    privacy.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(privacy.open).toBe(false);
    expect(intro.open).toBe(true);
    expect(document.activeElement).toBe(review);
    const decline = intro.querySelector<HTMLButtonElement>('[data-consent-choice="declined"]')!;
    const explore = intro.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!;
    decline.focus();
    decline.click();
    expect(document.activeElement).toBe(explore);
    explore.click();
    expect(intro.open).toBe(false);
    dispose();

    const saved = createMockAnalytics(true, "declined");
    render(saved.analytics, true);
    expect(document.querySelector<HTMLDialogElement>("[data-scale-intro]")?.open).toBe(false);
    saved.notify("unknown");
    expect(document.querySelector<HTMLDialogElement>("[data-scale-intro]")?.open).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("[data-dismiss-intro]")?.disabled).toBe(true);
    expect(document.querySelector<HTMLElement>(".intro-consent")?.hidden).toBe(false);
    expect(document.querySelectorAll(".intro-consent [data-consent-choice]:not([hidden])")).toHaveLength(2);
  });

  it("waits for a normal About dismissal before starting a shared route", () => {
    const mocked = createMockAnalytics(true, "accepted");
    render(mocked.analytics, false, { locale: "en", landmarkId: "die-six" });
    const intro = document.querySelector<HTMLDialogElement>("[data-scale-intro]")!;
    const detail = document.querySelector<HTMLDialogElement>("[data-detail-panel]")!;
    const scale = document.querySelector<HTMLElement>(".scale")!;
    expect(intro.open).toBe(true);
    expect(scale.dataset.depth).toBe("0");

    intro.querySelector<HTMLButtonElement>('[data-preferences-toggle="intro"]')!.click();
    document.querySelector<HTMLInputElement>('[data-locale-choice="fr"]')!.click();
    expect(location.pathname).toBe("/fr/examples/die-six/");
    expect(localStorage.getItem("probability-scale-locale")).toBe("fr");
    expect(scale.dataset.depth).toBe("0");

    intro.querySelector<HTMLButtonElement>("[data-privacy-from-intro]")!.click();
    const privacy = document.querySelector<HTMLDialogElement>("[data-privacy-dialog]")!;
    expect(privacy.open).toBe(true);
    expect(detail.open).toBe(false);
    expect(scale.dataset.depth).toBe("0");
    privacy.querySelector<HTMLButtonElement>("[data-close-privacy]")!.click();
    expect(intro.open).toBe(true);
    expect(detail.open).toBe(false);

    intro.querySelector<HTMLButtonElement>("[data-dismiss-intro]")!.click();
    expect(detail.open).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("Un six avec un dé équilibré");
  });

  it("synchronizes arrival, locale, close, and popstate routes without replaying About", () => {
    const mocked = createMockAnalytics(true, "accepted");
    render(mocked.analytics, true);
    const detail = document.querySelector<HTMLDialogElement>("[data-detail-panel]")!;

    document.querySelector<HTMLButtonElement>('[data-landmark="coin-heads"]')!.click();
    expect(detail.open).toBe(true);
    expect(location.pathname).toBe("/examples/coin-heads/");
    document.querySelector<HTMLButtonElement>('[data-preferences-toggle="toolbar"]')!.click();
    document.querySelector<HTMLInputElement>('[data-locale-choice="fr"]')!.click();
    expect(location.pathname).toBe("/fr/examples/coin-heads/");
    expect(localStorage.getItem("probability-scale-locale")).toBe("fr");
    document.querySelector<HTMLButtonElement>("[data-close-detail]")!.click();
    expect(location.pathname).toBe("/fr/");

    localStorage.setItem("probability-scale-locale", "es");
    history.replaceState(null, "", "/en/examples/die-six/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(detail.open).toBe(true);
    expect(document.querySelector("[data-detail-title]")?.textContent).toBe("A six on one fair die");
    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelector<HTMLDialogElement>("[data-scale-intro]")?.open).toBe(false);
    expect(localStorage.getItem("probability-scale-locale")).toBe("es");

    history.replaceState(null, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(detail.open).toBe(false);
    expect(document.documentElement.lang).toBe("es");
    expect(location.pathname).toBe("/");
  });

  it("preserves and localizes prerendered reference and catalogue content", () => {
    const mocked = createMockAnalytics(false);
    document.body.innerHTML = `<main id="app">
      <section data-prerender-catalogue>
        <h1>Static title</h1>
        <p>Static description</p>
        <ol><li>Static example</li></ol>
      </section>
    </main>`;
    const disposeCatalogue = createScale(document.querySelector<HTMLElement>("#app")!, {
      analytics: mocked.analytics,
      initialRoute: {},
    });
    const catalogue = document.querySelector<HTMLElement>("[data-scale-intro] [data-prerender-catalogue]")!;
    expect(catalogue.querySelector("h1")?.textContent).toBe("The Scale of Probability");
    expect(catalogue.querySelector("p")?.textContent).toContain("Probability ranges from 0");
    expect(catalogue.querySelectorAll("ol a")).toHaveLength(displayLandmarks.length);
    expect(catalogue.querySelector("ol")?.textContent).not.toContain("Static example");
    disposeCatalogue();

    document.body.innerHTML = `<main id="app">
      <section data-prerender-reference>
        <article data-reference-article><p>Static reference</p></article>
      </section>
    </main>`;
    const disposeReference = createScale(document.querySelector<HTMLElement>("#app")!, {
      analytics: mocked.analytics,
      initialRoute: { landmarkId: "coin-heads" },
    });
    const reference = document.querySelector<HTMLElement>("[data-scale-intro] [data-prerender-reference]")!;
    expect(reference.querySelectorAll("[data-reference-article]")).toHaveLength(1);
    expect(reference.textContent).toContain("A chosen side of a fair coin");
    expect(reference.textContent).not.toContain("Static reference");
    disposeReference();
  });

  it("keeps invalid browser paths inert", () => {
    const mocked = createMockAnalytics(false);
    history.replaceState(null, "", "/missing-page");
    const dispose = render(mocked.analytics);
    const scale = document.querySelector<HTMLElement>(".scale")!;
    const depth = scale.dataset.depth;

    history.pushState(null, "", "/also-missing");
    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(location.pathname).toBe("/also-missing");
    expect(scale.dataset.depth).toBe(depth);
    expect(document.querySelector<HTMLDialogElement>("[data-detail-panel]")?.open).toBe(false);
    dispose();
  });
});
