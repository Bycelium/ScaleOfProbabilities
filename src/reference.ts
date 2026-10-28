import { displayLandmarks, relatedLandmarkIds, type DisplayLandmark } from "./catalogue";
import { localizeLandmark, type LocaleDefinition } from "./locales";
import { formatDecibans, formatOdds, formatProbabilityPercent } from "./probability";
import { sitePath } from "./site";

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, character => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character]!);

const landmarkById = new Map<string, DisplayLandmark>(displayLandmarks.map(item => [item.id, item]));

export const renderReferenceArticle = (item: DisplayLandmark, locale: LocaleDefinition, headingLevel: 1 | 2 = 2): string => {
  const subsectionHeadingLevel = headingLevel + 1;
  const translated = localizeLandmark(item, locale);
  const related = (relatedLandmarkIds[item.id] ?? []).map(id => localizeLandmark(landmarkById.get(id)!, locale));
  const classification = item.classification ? `<p class="reference-classification">${escapeHtml(locale.ui.classification[item.classification])}</p>` : "";
  const advice = translated.advice
    ? `<section data-reference-section="advice"><h${subsectionHeadingLevel}>${escapeHtml(locale.ui.securityAdvice)}</h${subsectionHeadingLevel}><p>${escapeHtml(translated.advice.before)}<a href="${sitePath({ locale: locale.code, landmarkId: translated.advice.relatedId })}">${escapeHtml(translated.advice.relatedLabel)}</a>${escapeHtml(translated.advice.after)}</p></section>`
    : "";
  const sources = translated.sources.map(source => {
    const label = escapeHtml(source.label);
    const linked = source.href ? `<a href="${escapeHtml(source.href)}" target="_blank" rel="noreferrer">${label}</a>` : label;
    return `<li>${linked}${source.note ? ` <span>${escapeHtml(source.note)}</span>` : ""}</li>`;
  }).join("");
  const relatedLinks = related.map(target => `<li><a href="${sitePath({ locale: locale.code, landmarkId: target.id })}" data-related-landmark="${target.id}">${escapeHtml(target.title)}</a></li>`).join("");

  return `<article class="reference-article" data-reference-article data-landmark-id="${item.id}">
  <header data-reference-section="summary">
    ${classification}
    <h${headingLevel}>${escapeHtml(translated.title)}</h${headingLevel}>
    <dl class="reference-values">
      <div><dt>${escapeHtml(locale.ui.probabilityLabel)}</dt><dd>${escapeHtml(formatProbabilityPercent(item.chance, locale.code))}</dd></div>
      <div><dt>${escapeHtml(locale.ui.oddsLabel)}</dt><dd>${escapeHtml(formatOdds(item.position, locale.code))}</dd></div>
      <div><dt>dBan</dt><dd>${escapeHtml(formatDecibans(item.position, locale.code))}</dd></div>
    </dl>
    <p>${escapeHtml(translated.explanation)}</p>
  </header>
  <section data-reference-section="calculation"><h${subsectionHeadingLevel}>${escapeHtml(locale.ui.calculation)}</h${subsectionHeadingLevel}><p>${escapeHtml(translated.calculation)}</p></section>
  <section data-reference-section="assumptions"><h${subsectionHeadingLevel}>${escapeHtml(locale.ui.assumptions)}</h${subsectionHeadingLevel}><p>${escapeHtml(translated.assumptions)}</p></section>
  ${advice}
  <section data-reference-section="sources"><h${subsectionHeadingLevel}>${escapeHtml(locale.ui.sources)}</h${subsectionHeadingLevel}><ol class="reference-sources">${sources}</ol></section>
  <nav data-reference-section="related" aria-label="${escapeHtml(locale.ui.exploreOnScale)}"><h${subsectionHeadingLevel}>${escapeHtml(locale.ui.exploreOnScale)}</h${subsectionHeadingLevel}><ul>${relatedLinks}</ul></nav>
</article>`;
};
