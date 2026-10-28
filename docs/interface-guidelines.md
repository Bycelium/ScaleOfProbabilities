# Interface guidelines

Read this guide before changing the scale scene, readout, navigation, details, About dialog, accessibility, locale behavior, or regional filtering.

## Scene and scale

- Lead with the scientific examples. Keep the title, scale explanation, navigation help, Turing and Good history, source links, and inspiration credit in the opening About dialog. Reopen it from the bottom-right About control.
- Present examples as a radial depth scene around one vanishing point. An event's exact dBan depth determines radial distance; its illustration uses a stable angle. Equal probabilities share a radius and remain separately selectable.
- Project circle radius and illustration size as `10^((event dBan − current dBan) / 10)`. The current-depth circle is 78% of the smaller scene dimension, so every +10 dBan is exactly 10 times larger on screen. Do not normalize projection to catalogue density.
- Titles disappear before receding illustrations. Keep an illustration at its true geometric size until it is imperceptible or fully offscreen.
- Resolve dense landmark angles against the complete catalogue and keep them stable across locales and regional filters. Suppress a colliding title before moving its illustration; reveal that title when its landmark receives hover or keyboard focus.
- A compact family may share one restrained connector when its members use the same model and their exact depths leave every illustration separately selectable. Keep ordinary members on one stable ray. A longer offset series such as Hold’em keeps its main rail on the family's fixed angle, with short lateral branches to adjacent illustrations that cannot fit on that ray. A compact two-member offset family may use one depth-order connector between its artwork. Draw the rail from the nearest rendered member through the farthest family member, behind the artwork, and clip it with the scene. Preserve the projected continuation through scene rebases.
- Draw only geometrically visible one-dBan tick rings as thin solid grey and five-dBan rings slightly stronger. Keep a persistent thick current-depth circle above every guide, coloured by the current axis position. These graduation rings and the current-depth circle are the only concentric circles.
- Suppress crowded spoke marks and labels near the vanishing point while retaining pixel-visible circles.

## Current readout and formatting

- Open a fresh session at 0 dBan and preserve current depth across detail panels, resizing, and hot reloads.
- Put the explicitly labelled current percentage left of the spoke. Put event-to-non-event odds above the current dBan value to its right, above the current circle. Use plain-language odds in readouts and prose, such as “Odds: 3 to 1” and “Cote : 3 pour 1”; equations use conventional mathematical notation.
- Render the current dBan value at the same type size as the percentage and preserve the existing responsive compact treatment at extremes. Gently fade the odds-and-dBan stack near −20 to +20 dBan and the percentage toward the extremes, while keeping every value available to accessibility.
- Suppress nearby spoke labels across the full right-stack height. Draw the vertical spoke from the top edge toward the vanishing point and put dBan ticks at the exact top intersection of their rings. Colour tick marks and labels by their true dBan positions.
- During hover, the current probability, odds, and dBan marker remain authoritative. A hovered or focused event may show its exact spoke marker only when it does not collide with the current marker. Use red below 0 dBan, neutral grey at 0, and green above 0.
- Display dBan values with at most one decimal and suppress negative zero while retaining exact internal coordinates. Give ordinary probabilities at least one decimal before trimming trailing zeroes, adding decimal places as the smaller tail approaches an endpoint. Use two significant digits for central odds and three for larger finite ratios.
- Never display 0%, 100%, or infinity for a finite position. Format tiny lower tails in the spoke readout as scientific-notation percentages; format high probabilities as `(100 − tail)%` without floating-point subtraction. One-in-X remains useful in calculations and landmark accessibility text.

## Travel and selection

- Use one interruptible travel controller for every journey. Vertical wheel or trackpad input, a one-finger vertical swipe, and the Up and Down arrow keys immediately travel to the next landmark in that direction. Ignore horizontal, multi-touch, and pinch gestures. Illustration clicks, related actions, and Return to 0 dBan provide explicit targets through the same lifecycle.
- Preserve continuous momentum and let repeated same-direction input build speed in proportion to total gesture displacement, enough to pass intermediate landmarks. From rest, keep the first one-finger swipe, wheel or trackpad burst, or arrow-key press locked to the immediately adjacent landmark; all samples and inertial events in that first gesture keep the same destination. Raise one shared cubic speed ceiling with each distinct swipe, renewed trackpad burst, or repeated arrow press: keep the second gesture controlled, give the third a clear acceleration, and reserve full speed for sustained input. Throttle held-key repeat credits to the same gesture cadence. When the immediately adjacent available landmark is separated by a true empty gap of at least 15 dBan, keep the exact destination and use the natural cubic acceleration and braking curve even on the first gesture. Apply a short smooth brake on touch-down or a blank tap. At substantial speed, consume the first opposing gesture to brake to rest and require a second distinct opposing gesture to start in that direction; keep low-speed direction changes direct. Do not reuse speed after the scene reaches rest. Every directional burst chooses a finite landmark where it can brake smoothly, while illustration, related, and Return to 0 journeys remain exact. Respect reduced motion by moving immediately. Show radial travel streaks only near peak speed on substantial journeys.
- Show signed dBan distance and an odds multiplier or divisor for directed or substantial travel.
- Provide one explicit Return to 0 dBan control away from the opening position. It targets exactly 0 through the shared controller and never runs on a timer. Do not add other global resets, jump controls, or clickable overviews.
- Beginning a journey closes details. An illustration or related example travels to its exact depth and opens full details only after arrival. Directional and return journeys do not open details on arrival.
- A landmark URL starts the same exact journey from the opening depth and opens that landmark’s details only after arrival. Preserve the scene’s normal motion and reduced-motion behavior for URL arrivals.

## Details and relationships

- The details card is nonmodal, stays above the scene, closes on a blank-scene click, and lets one click on another illustration begin the next journey. Do not add delayed hover or focus summaries.
- Put related examples near the top under “Explore on the scale”, using each target's illustration and title. Each related-family action shows signed target-minus-source dBan difference: right for positive, left for negative, and a neutral bidirectional mark at zero.
- Describe a related value as a difference between events. Use weight-of-evidence language only for a defined update between comparable states. Related travel shares the motion, caption, interruption, and reduced-motion behavior above.
- Every relationship, including an advice link, is reciprocal and targets an existing landmark.

## About and accessibility

- Keep the About dialog keyboard accessible and modal. Leave the current-depth scene visible through a light backdrop around its opaque reading panel.
- Keep probability-to-odds and odds-to-decibans equations in separate, explicitly labelled collapsed disclosures. Keep Turing history and the I. J. Good (1979) source beside the deciban explanation.
- Keep one Share icon in the toolbar. It shares the current URL through the native operating-system sheet when available and otherwise opens the fallback bottom sheet. Keep its fallback actions ordered as Copy link, X, LinkedIn, Bluesky, Copy citation, and Download GIF. Keep the Feedback toolbar icon as `mailto:feedback.scaleofprobabilities@bycelium.com`.

## Locales and regional references

- Keep translations in separate locale files behind the locale registry. Share catalogue probabilities, positions, artwork structure, relations, and navigation behavior across languages.
- A localized URL selects its language. For a neutral URL, a saved language wins; otherwise select the first supported entry in the browser's ordered language preferences and fall back safely to English. Localize visible copy, accessibility labels, locale-sensitive numbers, and text embedded in artwork without changing the mathematical model. Switching language preserves current depth and open details.
- Keep a neutral `/examples/<id>/` URL for recipient-selected language and localized `/en/examples/<id>/`, `/fr/examples/<id>/`, `/es/examples/<id>/`, and `/zh/examples/<id>/` URLs for a pinned linked language. A visitor can still choose and save another language after arrival.
- Keep regional weather, household equipment, postal-service, electricity, and national-lottery landmarks in central catalogue audience metadata. Default to the current language's regional selection and persist one All references map control beside the language picker.
- Keep unannotated science, games, sports, cybersecurity, Enigma, EuroMillions, and US lightning examples common. Filtering preserves full-catalogue angles and current depth; motion, snapping, bounds, rings, and related links use the visible subset. Retain a filtered shared-URL target during pending arrival and while its detail card remains open.
