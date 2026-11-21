# Digital Market Signals

An independent research portfolio by Phoebe Wang on AI infrastructure and cloud markets in emerging economies. [Open the public website](https://yx-12345.github.io/digital-market-signals/)

| Navigation | Product |
| --- | --- |
| Home | Research question, three current developments and featured products |
| Market Signals | Searchable evidence records with stable `signal.html?id=<record-id>` links |
| Intelligence Brief | Beyond the Announcement: What Makes AI Compute Accessible? Evidence from cloud launches, shared compute programs, and infrastructure proposals |
| Dashboard | Interactive Tableau charts, WDI findings and [data downloads](data-explorer.html) |

The November 2026 digest is available as [HTML](digital-market-digest-2026-11.html) and [email-ready text](digital-market-digest-2026-11.txt). See the [research workflow](methodology.html) and [owner review checklist](docs/owner-review.md). The [Indonesia country case](intelligence-brief.html#indonesia-case) connects the brief, market records and WDI data.

## Reproduce the WDI dataset

Run `python3 scripts/prepare_wdi.py` with Python 3.10 or later. The script retrieves three WDI indicators and country metadata, selects eligible economies, joins on ISO3, validates values and writes analysis-ready CSVs. The committed release covers 77 economies, 2015–2024, 770 country-year rows and 2,310 possible observations. Of those, 2,164 are reported and 146 are blank.

- [Wide CSV for Tableau](data/processed/wdi_tableau.csv)
- [Long CSV for analysis](data/processed/wdi_long.csv)
- [Annual coverage and API provenance](data/processed/wdi_coverage.json)
- [Data dictionary, definitions, scope and validation](docs/wdi-data.md)
- [Tableau Public build and verification guide](docs/tableau-authoring.md)

The published [Tableau Public workbook](https://public.tableau.com/app/profile/yu1607/viz/DigitalInfrastructureinEmergingEconomies/Dashboard1) is embedded on the [Dashboard page](data-explorer.html), which also includes the earlier seven-economy connectivity chart in the archive.

## Maintain Market Signals

1. Check primary operator, government or regulator material. If a milestone comes from later reporting, keep the attribution and link to that reporting separately. Identify operational, proposed, funded study, program launch and regulatory milestones by the evidence available.
2. Edit `signals-data.js`. Keep `id` stable. Store the lead publication date in `date`, the last source-check date in `reviewed`, and add countries, regions, topic, stage and qualifying status. Use YYYY-MM-DD.
3. Add source objects with label, type, URL and date when documented. For substantive updates, append a chronological `history` item referencing its zero-based source index. Update the stage only when the evidence supports it. Preserve conflicts, uncertainties and follow-up questions.
4. Check related prose in Home, the brief, the dashboard and both digest formats. Revisit the research question when a detail changes. Update the browser asset query versions for changed JavaScript or CSS.
5. Preview from the root with `python3 -m http.server 8000`. After GitHub Pages publishes from `main`, check the four main routes, brief direct link, ten record links, filters, reset, document downloads and responsive layout.
