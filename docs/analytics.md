# Consented analytics

The production application uses Vercel Web Analytics through a small provider adapter. The consent controller owns the lifecycle and sends neutral domain events to that adapter, so a future provider can replace the Vercel implementation without changing the scale or consent interface.

When analytics is configured and the visitor has no saved choice, the opening About dialog shows Participate and Do not participate choices and keeps Explore disabled until one is chosen. Analytics stays inactive when consent is declined or withdrawn. The readable privacy notice and later settings are in About. Consent is stored locally for 183 days with an explicit version; versioned source and browser tests document that behavior.

If a future change replaces Vercel or changes the analytics purpose, update the in-app privacy copy and increment the stored-consent policy version before enabling it. The version change makes the application ask again instead of silently reusing a previous choice. Keep the current Vercel implementation as the only provider until that replacement is complete.

## Enable Vercel Web Analytics

1. In the Vercel dashboard, open the project for `deciban.bycelium.com` and enable Web Analytics. Deploy the application after enabling it.
2. The small `@vercel/analytics` wrapper is bundled with the application, and the Vercel adapter injects its remote tracking script only after accepted consent. The wrapper does not collect data on import. Do not add a second snippet, environment variable, API key, rewrite, or collector proxy.
3. Confirm the project and team plan before enabling custom events. The adapter sends three event shapes with two properties each:

   - `example_opened` — `{ example_id, locale }`
   - `site_time` — `{ locale, seconds }`
   - `example_time` — `{ example_id, seconds }`

   Seconds are visible-time totals since the prior flush. These numeric properties do not create a native average-duration dashboard widget. Calculate `SUM(seconds)` and the appropriate visit or opening denominator from data available for that analysis; do not average checkpoint values.

   For a time analysis, select the event and inspect its `seconds` property. The [Web Analytics API](https://vercel.com/docs/analytics/web-analytics-api) can filter by event name and group by `eventData/seconds`; multiply each complete group value by its count, then divide by matching page views for `site_time`, or by `example_opened` counts for the same example and time window for `example_time`. Filter `example_time` by `example_id` before calculating an example’s mean. Vercel does not document a native sum or average metric for a numeric event property. The dashboard [CSV export](https://vercel.com/docs/analytics/using-web-analytics) is limited to 250 entries, and the API groups values beyond its limit as `Others`; do not compute totals from truncated or `Others` data. Use narrower time windows or property-value filters until the grouped data is complete.
4. Test a production deployment with accepted, declined, and withdrawn consent before relying on a dashboard. Browser tests inject a fake provider, and Vercel-adapter unit tests stub SDK calls; neither verifies Vercel ingestion, so perform a production smoke test.

Vercel’s current [pricing](https://vercel.com/docs/analytics/limits-and-pricing) says Web Analytics is charged by collected page-view and custom-event volume across a team. Hobby includes 50,000 events per month, has a one-month reporting window, and does not include custom events. Its native visitor reporting can still be useful on Hobby; the three custom mappings require a plan that includes custom events. Pro charges $0.03 per 1,000 events subject to its monthly usage credit, permits unlimited projects, includes custom events with two properties, and has a 12-month reporting window. Web Analytics Plus is an additional $10 per team per month and expands custom-event properties to eight and reporting to 24 months. The reporting window describes dashboard availability, not a statement of a maximum storage-retention period.

## Privacy and processing record

The self-contained About notice identifies [BYCELIUM SAS](https://annuaire-entreprises.data.gouv.fr/entreprise/bycelium-919837187) (SIREN 919 837 187), 9 Villa Wagram-Saint-Honoré, 75008 Paris, and provides `contact@bycelium.com` and `gdpr@bycelium.com`. Keep it accurate if provider configuration or analytics scope changes.

Vercel’s [Web Analytics privacy documentation](https://vercel.com/docs/analytics/privacy-policy) says it uses no third-party cookies; a visitor hash derived from the incoming request is discarded after 24 hours; and its standard reporting is anonymous and aggregated. Its documented data points can include timestamp, URL and dynamic path, referrer, filtered query parameters, country/region/city, browser and operating-system versions, and device type. The provider documentation does not establish EU-only data residency for this project, so the notice must not claim it.

The static entry documents use an early `no-referrer` policy. It removes the HTTP `Referer` header from analytics SDK requests. The adapter sends page views as `/` and only stable example IDs, selected application locale, and visible-time totals as custom-event properties. Vercel Web Analytics may still record its documented native external-referrer field; this policy does not erase that provider field. Avoid personal data in paths, query strings, referrers, or custom properties. Vercel documents URL redaction through its `beforeSend` option; retain or strengthen that protection if routing changes.

Record and keep current: purpose (aggregate audience measurement and example interest); data categories (the three event mappings plus Vercel’s documented aggregate dimensions); people (visitors who opt in); processor/subprocessors and transfer safeguards from current Vercel terms; plan and reporting window; access controls; consent withdrawal; and the controller identity/contact above. This guide records implementation and provider facts, not a legal exemption determination.
