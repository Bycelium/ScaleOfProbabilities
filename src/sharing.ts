import type { DisplayLandmark } from "./catalogue";
import type { LocaleDefinition } from "./locales";
import { siteUrl, type SiteRoute } from "./site";

export type ShareSelection = Readonly<{
  item?: DisplayLandmark;
  locale: LocaleDefinition;
  route: SiteRoute;
}>;

export type SharingControl = Readonly<{
  isOpen: () => boolean;
  update: () => void;
  destroy: () => void;
}>;

export const sharePayload = ({ item, locale, route }: ShareSelection): ShareData => ({
  title: item ? locale.landmarks[item.id].title : locale.ui.title,
  text: item ? `${locale.ui.share.nativeText} ${locale.landmarks[item.id].title}` : locale.ui.share.nativeHomeText,
  url: siteUrl(route),
});

export const citationText = ({ item, locale, route }: ShareSelection, accessed = new Date()): string => {
  const accessedDate = new Intl.DateTimeFormat(locale.numberLocale, { dateStyle: "long", timeZone: "UTC" }).format(accessed);
  const title = item ? locale.landmarks[item.id].title : locale.ui.title;
  const sources = item?.sources.map(source => {
    const translated = locale.sources[source.id];
    return source.href ? `${translated.label} (${source.href})` : translated.label;
  });
  return [
    `Bycelium. ${title}. ${locale.ui.title}. ${siteUrl(route)}. ${locale.ui.share.citationAccessed} ${accessedDate}.`,
    sources?.length ? `${locale.ui.sources}: ${sources.join("; ")}.` : undefined,
  ].filter(Boolean).join("\n");
};

const isAbortError = (error: unknown): boolean => typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";

const icon = (content: string): string => `<span class="share-action-icon" aria-hidden="true">${content}</span>`;
const linkIcon = icon('<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg>');
const xIcon = icon('<svg viewBox="0 0 24 24"><path d="m5 4 14 16M19 4 5 20"/></svg>');
const linkedInIcon = icon('<svg viewBox="0 0 24 24"><path d="M6 9v10M6 6v.1M10 19V9m0 4c1-5 8-5 8 1v5"/></svg>');
const blueskyIcon = icon('<svg viewBox="0 0 24 24"><path d="M12 11c-1.5-3-5.6-6.1-7.2-7.2C3.3 2.8 3 3 3 4.4c0 1 .6 8 1 9.2.6 2.1 2.6 2.8 4.4 2.5-3.2.5-4 2.3-2.3 4.1 3.2 3.3 4.6-.7 5.9-3.2 1.3 2.5 2.7 6.5 5.9 3.2 1.7-1.8.9-3.6-2.3-4.1 1.8.3 3.8-.4 4.4-2.5.4-1.2 1-8.2 1-9.2 0-1.4-.3-1.6-1.8-.6C17.6 4.9 13.5 8 12 11Z"/></svg>');

export const createSharingControl = (
  root: HTMLElement,
  trigger: HTMLButtonElement,
  getSelection: () => ShareSelection,
  beforeOpen: () => void = () => {},
): SharingControl => {
  const dialog = document.createElement("dialog");
  dialog.className = "share-dialog";
  dialog.dataset.shareDialog = "";
  dialog.setAttribute("aria-labelledby", "share-dialog-title");
  dialog.innerHTML = `<div class="share-sheet" data-share-sheet>
    <i class="share-handle" aria-hidden="true"></i>
    <header><div><h2 id="share-dialog-title" data-share-title></h2><p data-share-description></p></div><button type="button" data-close-share>×</button></header>
    <div class="share-destinations">
      <button type="button" data-copy-link>${linkIcon}<span data-copy-link-label></span></button>
      <a data-share-x target="_blank" rel="noreferrer">${xIcon}<span>X</span></a>
      <a data-share-linkedin target="_blank" rel="noreferrer">${linkedInIcon}<span>LinkedIn</span></a>
      <a data-share-bluesky target="_blank" rel="noreferrer">${blueskyIcon}<span>Bluesky</span></a>
    </div>
    <div class="share-utilities"><button type="button" data-copy-citation></button></div>
    <p class="share-status" data-share-status role="status" aria-live="polite"></p>
    <textarea data-share-fallback readonly hidden></textarea>
  </div>`;
  root.append(dialog);

  const closeButton = dialog.querySelector<HTMLButtonElement>("[data-close-share]")!;
  const status = dialog.querySelector<HTMLElement>("[data-share-status]")!;
  const fallback = dialog.querySelector<HTMLTextAreaElement>("[data-share-fallback]")!;
  const x = dialog.querySelector<HTMLAnchorElement>("[data-share-x]")!;
  const linkedIn = dialog.querySelector<HTMLAnchorElement>("[data-share-linkedin]")!;
  const bluesky = dialog.querySelector<HTMLAnchorElement>("[data-share-bluesky]")!;
  let requestVersion = 0;
  let destroyed = false;

  const isOpen = (): boolean => dialog.open;
  const currentPayload = (): ShareData => sharePayload(getSelection());
  const payloadKey = (payload: ShareData): string => JSON.stringify([payload.title, payload.text, payload.url]);
  const clearFeedback = (): void => {
    status.textContent = "";
    fallback.hidden = true;
    fallback.value = "";
  };
  const render = (): void => {
    const { locale } = getSelection();
    const payload = currentPayload();
    const shareText = `${payload.text} ${payload.url}`;
    trigger.setAttribute("aria-label", locale.ui.share.open);
    trigger.title = locale.ui.share.open;
    dialog.querySelector<HTMLElement>("[data-share-title]")!.textContent = locale.ui.share.title;
    dialog.querySelector<HTMLElement>("[data-share-description]")!.textContent = locale.ui.share.description;
    closeButton.setAttribute("aria-label", locale.ui.share.close);
    closeButton.title = locale.ui.share.close;
    dialog.querySelector<HTMLElement>("[data-copy-link-label]")!.textContent = locale.ui.share.copyLink;
    dialog.querySelector<HTMLButtonElement>("[data-copy-citation]")!.textContent = locale.ui.share.copyCitation;
    x.href = `https://x.com/intent/tweet?text=${encodeURIComponent(String(payload.text))}&url=${encodeURIComponent(String(payload.url))}`;
    linkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(String(payload.url))}`;
    bluesky.href = `https://bsky.app/intent/compose?text=${encodeURIComponent(shareText)}`;
  };
  const close = (restoreFocus = true): void => {
    if (!isOpen()) return;
    requestVersion += 1;
    try { dialog.close(); } catch { dialog.removeAttribute("open"); }
    clearFeedback();
    if (restoreFocus && trigger.isConnected) trigger.focus();
  };
  const openFallback = (message = ""): void => {
    beforeOpen();
    render();
    clearFeedback();
    status.textContent = message;
    if (!isOpen()) {
      try { dialog.showModal(); } catch { dialog.setAttribute("open", ""); }
    }
    closeButton.focus();
  };
  const showSelectable = (value: string, label: string): void => {
    const { locale } = getSelection();
    status.textContent = locale.ui.share.copyUnavailable;
    fallback.setAttribute("aria-label", label);
    fallback.value = value;
    fallback.hidden = false;
    fallback.focus();
    fallback.select();
  };
  const copy = async (value: string, success: string, label: string): Promise<void> => {
    const version = requestVersion;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      if (destroyed || version !== requestVersion || !isOpen()) return;
      fallback.hidden = true;
      status.textContent = success;
    } catch {
      if (destroyed || version !== requestVersion || !isOpen()) return;
      showSelectable(value, label);
    }
  };
  const handleShareFailure = (error: unknown, version: number, key: string): void => {
    if (isAbortError(error) || destroyed || version !== requestVersion || key !== payloadKey(currentPayload())) return;
    openFallback(getSelection().locale.ui.share.shareUnavailable);
  };
  const onTriggerClick = (): void => {
    beforeOpen();
    const payload = currentPayload();
    const version = ++requestVersion;
    const key = payloadKey(payload);
    if (typeof navigator.share !== "function") {
      openFallback();
      return;
    }
    try {
      void navigator.share(payload).catch(error => handleShareFailure(error, version, key));
    } catch (error) {
      handleShareFailure(error, version, key);
    }
  };
  const onDialogClick = (event: MouseEvent): void => {
    const target = event.target as Element;
    if (target === dialog || target.closest("[data-close-share]")) {
      close();
      return;
    }
    const selection = getSelection();
    if (target.closest("[data-copy-link]")) void copy(siteUrl(selection.route), selection.locale.ui.share.copiedLink, selection.locale.ui.share.copyLink);
    else if (target.closest("[data-copy-citation]")) void copy(citationText(selection), selection.locale.ui.share.copiedCitation, selection.locale.ui.share.copyCitation);
  };
  const onDialogCancel = (event: Event): void => {
    event.preventDefault();
    close();
  };
  const onDialogKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], textarea:not([hidden])')];
    const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
      : (currentIndex + 1) % focusable.length;
    event.preventDefault();
    focusable[nextIndex]?.focus();
  };
  const update = (): void => {
    requestVersion += 1;
    render();
    if (isOpen()) clearFeedback();
  };
  const destroy = (): void => {
    destroyed = true;
    requestVersion += 1;
    close(false);
    trigger.removeEventListener("click", onTriggerClick);
    dialog.removeEventListener("click", onDialogClick);
    dialog.removeEventListener("cancel", onDialogCancel);
    dialog.removeEventListener("keydown", onDialogKeydown);
    dialog.remove();
  };

  trigger.addEventListener("click", onTriggerClick);
  dialog.addEventListener("click", onDialogClick);
  dialog.addEventListener("cancel", onDialogCancel);
  dialog.addEventListener("keydown", onDialogKeydown);
  render();
  return { isOpen, update, destroy };
};
