# Digital Market Signals

An independent research portfolio on AI infrastructure and cloud markets in emerging economies.

[Open the public website](https://yx-12345.github.io/digital-market-signals/)

## Site map

| Page | Source |
| --- | --- |
| Home | `index.html` |
| Market Signals, including the knowledge library | `market-signals.html` |
| Individual signal permalink | `signal.html?id=<record-id>` |
| Intelligence Brief | `intelligence-brief.html` |
| Data Explorer | `data-explorer.html` |
| Methodology | `methodology.html` |

## Maintain the content

GitHub Pages serves the root of the `main` branch. All pages are static HTML and share `styles.css`. The library and chart use plain browser JavaScript.

- Edit or add entries in `signals-data.js`. Keep existing record IDs stable. Dates use YYYY-MM-DD and refer to original source publication. Add later evidence with its own date and update the status when warranted.
- If you update a featured signal, review its summary on the home page and any relevant prose in the brief. Keep the citations and scope notes next to their claims.
- The chart uses `internet-use-2024.csv`, which preserves source precision for the 2024 WDI observation in each case economy. The chart rounds for display and ranks selected countries on the same axis. For another reference year, verify coverage across the selected countries and update the CSV, reference year and prose together.
- Preview from the repository root with `python3 -m http.server 8000`. Open `http://localhost:8000/` so the browser can load the CSV through HTTP.
- For material research corrections, note the change in Git history and update the entry where the correction affects interpretation.

The website’s Methodology page describes the source review and AI assistance for the initial release.
