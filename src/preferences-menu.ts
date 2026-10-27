import type { LocaleCode, LocaleDefinition } from "./locales";

type PreferencesMenuOptions = Readonly<{
  root: HTMLElement;
  localeChoices: readonly LocaleDefinition[];
  locale: LocaleDefinition;
  allReferences: boolean;
  onLocaleChange: (code: LocaleCode) => void;
  onAllReferencesChange: (checked: boolean) => void;
}>;

type OpenOptions = Readonly<{
  anchor: HTMLButtonElement;
  parent: HTMLElement;
  placement: "intro" | "toolbar";
}>;

export type PreferencesMenu = Readonly<{
  element: HTMLElement;
  open: (options: OpenOptions) => void;
  close: (restoreFocus?: boolean) => void;
  isOpen: () => boolean;
  update: (locale: LocaleDefinition, allReferences: boolean) => void;
  destroy: () => void;
}>;

let nextMenuId = 0;

export const createPreferencesMenu = ({
  root,
  localeChoices,
  locale: initialLocale,
  allReferences: initialAllReferences,
  onLocaleChange,
  onAllReferencesChange,
}: PreferencesMenuOptions): PreferencesMenu => {
  const menuId = `preferences-menu-${nextMenuId += 1}`;
  const languageGroupName = `${menuId}-language`;
  const element = document.createElement("div");
  element.className = "preferences-menu";
  element.dataset.preferencesMenu = "";
  element.id = menuId;
  element.setAttribute("popover", "auto");
  element.setAttribute("role", "dialog");
  element.hidden = true;

  const languages = document.createElement("fieldset");
  languages.className = "preferences-languages";
  const languageLegend = document.createElement("legend");
  languageLegend.dataset.preferencesLanguageLabel = "";
  languages.append(languageLegend);

  const choices = document.createElement("div");
  choices.className = "preferences-options";
  for (const choice of localeChoices) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = languageGroupName;
    input.value = choice.code;
    input.dataset.localeChoice = choice.code;
    label.lang = choice.code;
    label.append(input, document.createTextNode(choice.nativeName));
    choices.append(label);
  }
  languages.append(choices);

  const references = document.createElement("div");
  references.className = "preferences-references";
  const referencesLabel = document.createElement("label");
  const referencesCheckbox = document.createElement("input");
  referencesCheckbox.type = "checkbox";
  referencesCheckbox.dataset.allReferences = "";
  const referencesText = document.createElement("span");
  referencesText.dataset.allReferencesLabel = "";
  referencesLabel.append(referencesCheckbox, referencesText);
  const referencesHelp = document.createElement("p");
  referencesHelp.id = `${menuId}-references-help`;
  referencesHelp.dataset.allReferencesHelp = "";
  referencesCheckbox.setAttribute("aria-describedby", referencesHelp.id);
  references.append(referencesLabel, referencesHelp);
  element.append(languages, references);
  root.append(element);

  let open = false;
  let activeAnchor: HTMLButtonElement | undefined;

  const position = (): void => {
    if (!open) return;
    const rect = activeAnchor!.getBoundingClientRect();
    const menuWidth = element.getBoundingClientRect().width;
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8));
    element.style.setProperty("--preferences-anchor-top", `${rect.top}px`);
    element.style.setProperty("--preferences-anchor-bottom", `${rect.bottom}px`);
    element.style.setProperty("--preferences-left", `${left}px`);
  };

  const finishClose = (restoreFocus: boolean): void => {
    const anchor = activeAnchor!;
    open = false;
    element.hidden = true;
    element.removeAttribute("data-placement");
    anchor.setAttribute("aria-expanded", "false");
    activeAnchor = undefined;
    if (restoreFocus && anchor.isConnected) anchor.focus();
  };

  const close = (restoreFocus = true): void => {
    if (!open) return;
    open = false;
    if (typeof element.hidePopover === "function") {
      try { element.hidePopover(); } catch { /* The fallback state below still closes the menu. */ }
    }
    finishClose(restoreFocus);
  };

  const update = (locale: LocaleDefinition, allReferences: boolean): void => {
    element.setAttribute("aria-label", `${locale.ui.language}; ${locale.ui.allReferences}`);
    languageLegend.textContent = locale.ui.language;
    referencesText.textContent = locale.ui.allReferences;
    referencesHelp.textContent = locale.ui.allReferencesHelp;
    referencesCheckbox.checked = allReferences;
    for (const input of choices.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
      input.checked = input.value === locale.code;
    }
    position();
  };

  const show = ({ anchor, parent, placement }: OpenOptions): void => {
    if (open && activeAnchor === anchor) {
      close();
      return;
    }
    if (open) close(false);
    parent.append(element);
    activeAnchor = anchor;
    open = true;
    element.dataset.placement = placement;
    element.hidden = false;
    anchor.setAttribute("aria-expanded", "true");
    position();
    if (typeof element.showPopover === "function") {
      try { element.showPopover(); } catch { /* The visible fallback remains usable. */ }
    }
    position();
    choices.querySelector<HTMLInputElement>('input[type="radio"]:checked')!.focus();
  };

  const onLanguageChange = (event: Event): void => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
    onLocaleChange(input.value as LocaleCode);
  };
  const onReferencesChange = (): void => onAllReferencesChange(referencesCheckbox.checked);
  choices.addEventListener("change", onLanguageChange);
  referencesCheckbox.addEventListener("change", onReferencesChange);

  const onDocumentKeydown = (event: KeyboardEvent): void => {
    if (!root.isConnected || !open || event.key !== "Escape") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  };
  const onDocumentPointerdown = (event: PointerEvent): void => {
    if (!root.isConnected || !open) return;
    const target = event.target as Node;
    if (element.contains(target) || activeAnchor!.contains(target)) return;
    close();
  };
  const onToggle = (event: Event): void => {
    const newState = (event as ToggleEvent).newState;
    if (newState === "closed" && open) finishClose(true);
  };
  document.addEventListener("keydown", onDocumentKeydown, true);
  document.addEventListener("pointerdown", onDocumentPointerdown, true);
  window.addEventListener("resize", position);
  element.addEventListener("toggle", onToggle);
  update(initialLocale, initialAllReferences);

  return {
    element,
    open: show,
    close,
    isOpen: () => open,
    update,
    destroy: () => {
      close(false);
      choices.removeEventListener("change", onLanguageChange);
      referencesCheckbox.removeEventListener("change", onReferencesChange);
      document.removeEventListener("keydown", onDocumentKeydown, true);
      document.removeEventListener("pointerdown", onDocumentPointerdown, true);
      window.removeEventListener("resize", position);
      element.removeEventListener("toggle", onToggle);
      element.remove();
    },
  };
};
