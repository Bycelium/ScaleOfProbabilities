# Sharing and social GIFs

The published atlas is at `https://deciban.bycelium.com`. Share the URL currently open in the browser. A neutral landmark URL such as `/examples/france-loto-jackpot/` follows the recipient’s language selection. A localized URL such as `/en/examples/france-loto-jackpot/` preserves that locale. Sharing controls present no language choice.

## Share and feedback controls

The toolbar has one Share icon. On platforms with the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), it opens the native operating-system share sheet with the current URL. Device-provided destinations vary by device, installed apps, and platform. TikTok or Instagram can appear when the device supports them.

When native sharing is unavailable or returns a non-cancelled failure, a mobile bottom sheet opens. It gives equal emphasis to Copy link, X, LinkedIn, and Bluesky. Copy citation and Download GIF remain quieter supporting actions. The web links cover X, LinkedIn, and [Bluesky intent links](https://bsky.network/docs/intent-links/); TikTok and Instagram use device-app targets offered by the native share sheet.

The toolbar Feedback icon opens `mailto:feedback.scaleofprobabilities@bycelium.com`.

## Social GIF

`public/social/loto-journey.gif` is a 960 × 640, 20 fps GIF for posts. It shows the real scene at 0 dBan, travels inward to the France Loto jackpot, holds the readable `1 in 19,068,840` probability, and returns to 0 dBan for a clean loop. The capture overlay exists only in generated media.

Enter the Nix development shell so FFmpeg is available, start a local preview, and run this command from the repository root:

```sh
node scripts/capture-social-gif.mjs --url http://127.0.0.1:4173 --output public/social/loto-journey.gif --ffmpeg ffmpeg
```

The command writes `/tmp/loto-journey-poster.png` and `/tmp/loto-journey-contact-sheet.png`, then validates the GIF signature, dimensions, and frame count. Keep the final asset below 10 MiB when practical. It needs Playwright Chromium and a preview that serves the deep link; install Chromium with `pnpm exec playwright install chromium` when necessary.

## Future export brief

Plan any additional export format as a separate request with its target platform, dimensions, duration, captions, language behavior, preview frame, and validation method. Keep export tooling only while a supported workflow uses it.
