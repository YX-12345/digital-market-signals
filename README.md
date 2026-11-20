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
| November 2026 digest (linked from Home and Market Signals) | `digital-market-digest-2026-11.html` and `digital-market-digest-2026-11.txt` |

## Maintain the content

GitHub Pages serves the root of the `main` branch. All pages are static HTML and share `styles.css`. The library and chart use plain browser JavaScript.

- Edit or add entries in `signals-data.js`. Keep each `id` stable. Use YYYY-MM-DD for `date` (the publication date of the lead source at `sources[0]`) and `reviewed` (the latest source-check date). Use arrays for `countries` and `regions`, and a clear `stage` with an optional qualifying phrase in `status`.
- Each source has a title, source type, URL and a publication date when documented. For a changed milestone or substantive correction, add the dated evidence to `sources`, update the status and append a `history` item. Its `source` number is the zero-based index into `sources`. Keep history chronological.
- Update affected text in the Home, brief, qualitative case table and published digest as applicable. Maintain both the HTML digest and its copy-ready text. Update script and stylesheet version query strings in the HTML when changing those assets.
- The interactive chart uses `internet-use-2024.csv`, which preserves the seven World Development Indicators observations at source precision. An updated reference year requires a comparable sample and coordinated changes to the CSV, validation and prose.
- Preview from the repository root with `python3 -m http.server 8000`. Open `http://localhost:8000/` so the browser can load the CSV. Test the five pages, record routes, filters and chart before publishing. Reopen the production URLs after deployment and compare status, dates and evidence.

The Methodology page documents the worked example, AI-assisted source checks and the owner’s independent-review checklist.
