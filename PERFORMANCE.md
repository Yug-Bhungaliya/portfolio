# Route-based loading performance

## Test setup

- Build command: `npm run build`
- Runtime check: Vite production preview at `http://127.0.0.1:4173/`
- Browser measurements: Chromium Performance Resource Timing entries for JavaScript assets
- Measurement date: 2026-09-24

## Before optimization

Before converting route components to lazy imports, the production build reported:

| Asset | Size | Gzip |
| --- | ---: | ---: |
| `dist/assets/index-K6DOUK5D.js` | 252.08 kB | 79.55 kB |

The Projects and Contact code was included in the initial JavaScript bundle.

## After optimization

After applying `React.lazy()` to the Projects and Contact routes and wrapping the route tree with `Suspense`, the production build reported:

| Asset | Size | Gzip |
| --- | ---: | ---: |
| `dist/assets/index-CVORBTVS.js` (initial shared bundle) | 245.39 kB | 77.88 kB |
| `dist/assets/Projects-irSDZZmq.js` | 3.02 kB | 1.20 kB |
| `dist/assets/Contact-Bp5XR43j.js` | 4.24 kB | 1.58 kB |

The initial JavaScript build size decreased by 6.69 kB (2.7%), with the Projects and Contact code deferred into route-specific chunks.

### Browser network observations

With the production preview loaded and the Network cache enabled:

| Navigation | JavaScript requests observed | Transferred | Resource timing |
| --- | --- | ---: | ---: |
| Initial `/` load | `index-CVORBTVS.js` | 77,357 bytes | 20 ms |
| Navigate to `/projects` | `Projects-irSDZZmq.js` | 1,502 bytes | 6 ms |
| Navigate to `/contact` | `Contact-Bp5XR43j.js` | 1,885 bytes | 9 ms |

The browser values above are from local production preview, so network timing will vary by machine and connection. The build output sizes are the reproducible comparison values.

## Suspense fallback validation

The route tree uses a meaningful loading state with `role="status"`, an animated spinner, and `Loading page...` text. To reproduce the loading state in browser developer tools:

1. Run `npm run build` and `npm run preview`.
2. Open the Network tab and select **Slow 3G** throttling.
3. Disable the cache and reload the home page.
4. Navigate to `/projects` or `/contact`.
5. Confirm the loading status appears before the corresponding route chunk finishes downloading.

