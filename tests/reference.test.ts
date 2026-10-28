import { describe, expect, it } from "vitest";
import { displayLandmarks } from "../src/catalogue";
import { en } from "../src/locales/en";
import { locales, type LocaleDefinition } from "../src/locales";
import { renderReferenceArticle } from "../src/reference";

describe("reference article", () => {
  it("renders every localized article with the complete reference sections", () => {
    let externalSourceLink = "";
    for (const locale of Object.values(locales)) {
      for (const item of displayLandmarks) {
        const html = renderReferenceArticle(item, locale);
        expect(html).toContain(`data-landmark-id="${item.id}"`);
        expect(html).toContain('data-reference-section="summary"');
        expect(html).toContain('data-reference-section="calculation"');
        expect(html).toContain('data-reference-section="assumptions"');
        expect(html).toContain('data-reference-section="sources"');
        expect(html).toContain('data-reference-section="related"');
        expect(html).not.toContain(" id=");
        if (html.includes('<a href="http')) externalSourceLink = html;
      }
    }
    expect(externalSourceLink).toMatch(/<a href="https?:\/\/[^" ]+" target="_blank" rel="noreferrer">/u);
  });

  it("renders advice, source variants, related links and escaped localized copy", () => {
    const original = displayLandmarks.find(item => item.id === "four-digit-pin")!;
    const source = original.sources[0];
    const item = {
      ...original,
      classification: undefined,
      sources: [{ ...source, href: undefined, note: undefined }],
    };
    const locale: LocaleDefinition = {
      ...en,
      landmarks: {
        ...en.landmarks,
        [item.id]: {
          ...en.landmarks[item.id],
          title: `A&B <test> "quote" 'apostrophe'`,
          explanation: "Explain & compare <values>.",
        },
      },
      sources: {
        ...en.sources,
        [source.id]: { label: "Model & source", note: undefined },
      },
    };
    const html = renderReferenceArticle(item, locale);
    expect(html).toContain("A&amp;B &lt;test&gt; &quot;quote&quot; &#39;apostrophe&#39;");
    expect(html).toContain("Explain &amp; compare &lt;values&gt;.");
    expect(html).toContain('data-reference-section="advice"');
    expect(html).toContain('data-related-landmark="password-123456"');
    expect(html).toContain("Model &amp; source</li>");
    expect(html).not.toContain("reference-classification");
    const staticHtml = renderReferenceArticle(item, locale, 1);
    const appHtml = renderReferenceArticle(item, locale, 2);
    expect(staticHtml).toContain("<h1>A&amp;B &lt;test&gt; &quot;quote&quot; &#39;apostrophe&#39;</h1>");
    expect(staticHtml).toContain("<h2>Calculation</h2>");
    expect(appHtml).toContain("<h2>A&amp;B &lt;test&gt; &quot;quote&quot; &#39;apostrophe&#39;</h2>");
    expect(appHtml).toContain("<h3>Calculation</h3>");
  });
});
