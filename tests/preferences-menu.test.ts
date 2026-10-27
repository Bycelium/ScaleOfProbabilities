import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { locales, localeChoices } from "../src/locales";
import { createPreferencesMenu } from "../src/preferences-menu";

describe("shared preferences menu", () => {
  const originalShowPopover = HTMLElement.prototype.showPopover;
  const originalHidePopover = HTMLElement.prototype.hidePopover;

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, writable: true, value: originalShowPopover });
    Object.defineProperty(HTMLElement.prototype, "hidePopover", { configurable: true, writable: true, value: originalHidePopover });
    vi.restoreAllMocks();
  });

  it("moves one menu between anchors and keeps its native controls in sync", () => {
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, writable: true, value: showPopover });
    Object.defineProperty(HTMLElement.prototype, "hidePopover", { configurable: true, writable: true, value: hidePopover });
    const root = document.createElement("main");
    const introParent = document.createElement("div");
    const toolbarParent = document.createElement("div");
    const introAnchor = document.createElement("button");
    const toolbarAnchor = document.createElement("button");
    introParent.append(introAnchor);
    toolbarParent.append(toolbarAnchor);
    root.append(introParent, toolbarParent);
    document.body.append(root);
    vi.spyOn(introAnchor, "getBoundingClientRect").mockReturnValue({ top: 10, right: 210, bottom: 54 } as DOMRect);
    vi.spyOn(toolbarAnchor, "getBoundingClientRect").mockReturnValue({ top: 500, right: 300, bottom: 544 } as DOMRect);
    const onLocaleChange = vi.fn();
    const onAllReferencesChange = vi.fn();
    const menu = createPreferencesMenu({ root, localeChoices, locale: locales.en, allReferences: false, onLocaleChange, onAllReferencesChange });

    menu.close();
    window.dispatchEvent(new Event("resize"));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    document.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    menu.open({ anchor: introAnchor, parent: introParent, placement: "intro" });
    expect(menu.isOpen()).toBe(true);
    expect(introParent.contains(menu.element)).toBe(true);
    expect(menu.element.style.getPropertyValue("--preferences-anchor-bottom")).toBe("54px");
    expect(showPopover).toHaveBeenCalledOnce();
    window.dispatchEvent(new Event("resize"));
    menu.open({ anchor: introAnchor, parent: introParent, placement: "intro" });
    expect(menu.isOpen()).toBe(false);
    expect(hidePopover).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(introAnchor);

    menu.open({ anchor: introAnchor, parent: introParent, placement: "intro" });
    menu.open({ anchor: toolbarAnchor, parent: toolbarParent, placement: "toolbar" });
    expect(toolbarParent.contains(menu.element)).toBe(true);
    expect(introAnchor.getAttribute("aria-expanded")).toBe("false");
    expect(toolbarAnchor.getAttribute("aria-expanded")).toBe("true");

    menu.update(locales.fr, true);
    expect(menu.element.querySelector<HTMLInputElement>('[data-locale-choice="fr"]')?.checked).toBe(true);
    expect(menu.element.querySelector<HTMLInputElement>("[data-all-references]")?.checked).toBe(true);
    menu.element.querySelector<HTMLInputElement>('[data-locale-choice="es"]')!.click();
    expect(onLocaleChange).toHaveBeenCalledWith("es");
    expect(menu.isOpen()).toBe(true);
    menu.element.querySelector<HTMLInputElement>("[data-all-references]")!.click();
    expect(onAllReferencesChange).toHaveBeenCalledWith(false);

    const options = menu.element.querySelector<HTMLElement>(".preferences-options")!;
    options.dispatchEvent(new Event("change", { bubbles: true }));
    const nonRadio = document.createElement("input");
    nonRadio.type = "checkbox";
    options.append(nonRadio);
    nonRadio.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onLocaleChange).toHaveBeenCalledTimes(1);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    menu.element.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    toolbarAnchor.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(menu.isOpen()).toBe(true);
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(menu.isOpen()).toBe(false);
    expect(document.activeElement).toBe(toolbarAnchor);

    menu.open({ anchor: toolbarAnchor, parent: toolbarParent, placement: "toolbar" });
    const openToggle = new Event("toggle");
    Object.defineProperty(openToggle, "newState", { value: "open" });
    menu.element.dispatchEvent(openToggle);
    expect(menu.isOpen()).toBe(true);
    const closedToggle = new Event("toggle");
    Object.defineProperty(closedToggle, "newState", { value: "closed" });
    menu.element.dispatchEvent(closedToggle);
    expect(menu.isOpen()).toBe(false);
    menu.element.dispatchEvent(closedToggle);

    menu.open({ anchor: toolbarAnchor, parent: toolbarParent, placement: "toolbar" });
    root.remove();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    document.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(menu.isOpen()).toBe(true);
    menu.close();
    expect(menu.isOpen()).toBe(false);
    menu.destroy();
    expect(menu.element.isConnected).toBe(false);
  });

  it("keeps the fallback usable when popover methods reject a transition", () => {
    Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, writable: true, value: vi.fn(() => { throw new Error("unsupported"); }) });
    Object.defineProperty(HTMLElement.prototype, "hidePopover", { configurable: true, writable: true, value: vi.fn(() => { throw new Error("unsupported"); }) });
    const root = document.createElement("main");
    const anchor = document.createElement("button");
    root.append(anchor);
    document.body.append(root);
    const menu = createPreferencesMenu({
      root,
      localeChoices,
      locale: locales.en,
      allReferences: false,
      onLocaleChange: vi.fn(),
      onAllReferencesChange: vi.fn(),
    });

    menu.open({ anchor, parent: root, placement: "toolbar" });
    expect(menu.element.hidden).toBe(false);
    menu.close(false);
    expect(menu.element.hidden).toBe(true);
    menu.destroy();
  });
});
