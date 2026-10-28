# SEO and previews

The published atlas is at `https://deciban.bycelium.com`. Each landmark has a stable neutral URL at `/examples/<id>/` and localized URLs at `/en/examples/<id>/`, `/fr/examples/<id>/`, `/es/examples/<id>/`, and `/zh/examples/<id>/`. For example, the France Loto jackpot is available at `/examples/france-loto-jackpot/` and `/en/examples/france-loto-jackpot/`.

A localized URL selects its language. A neutral URL uses the recipient's saved language, then the browser's ordered language preferences, then English. Deep links begin at 0 dBan and open the landmark details after the arrival journey completes.

## Static pages and metadata

The build writes a static HTML page for the home route and every neutral and localized landmark route. These pages include a no-JavaScript reference article, localized document language, a canonical URL, alternate-language links, an Open Graph title, description, URL, image, locale, and matching Twitter card fields. The build also writes `robots.txt` and `sitemap.xml` from the same route list.

Each route receives a 1200 × 630 PNG preview at `/social/<locale-or-neutral>/<landmark-id-or-home>.png`. Preview images are generated from the localized title and probability summary. Keep the image path, canonical route, alternates, and metadata derived from the same route object when changing the generator.

Run `pnpm build` after changing routes, metadata, previews, or reference content. Inspect the generated HTML for the intended canonical URL, `hreflang` alternates, Open Graph and Twitter fields, localized static article, preview image path, sitemap entry, and robots sitemap reference. Check a neutral route and one route for each supported language without JavaScript.

## Release verification

After deployment, submit or request indexing for new routes in Google Search Console. Refresh cached previews in LinkedIn Post Inspector. Paste a neutral landmark URL and a localized landmark URL into Discord and Bluesky to check the generated card fields and image. Do not post public announcements during this review.
