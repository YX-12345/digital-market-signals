# Digital Market Signals

An independent research portfolio by Phoebe Wang on AI infrastructure and cloud markets in emerging economies. [Open the public website](https://yx-12345.github.io/digital-market-signals/)

| Navigation | Product |
| --- | --- |
| Home | Featured research and a guide to the portfolio |
| Research | [When Does Reserved AI Compute Pay Off?](research.html), an IndiaAI pricing article and interactive scenario explorer |
| Market Monitor | [Featured updates, research questions and searchable evidence](market-signals.html) with stable `signal.html?id=<record-id>` links |
| Data Lab | Interactive Tableau charts, WDI findings and [data downloads](data-explorer.html) |
| Methods & Sources | [Research workflow](methodology.html) and [owner review checklist](docs/owner-review.md) |

The [earlier brief](intelligence-brief.html), its [Indonesia country case](intelligence-brief.html#indonesia-case), and the November 2026 digest in [HTML](digital-market-digest-2026-11.html) and [email-ready text](digital-market-digest-2026-11.txt) remain available. The [pre-redesign site snapshot](https://github.com/YX-12345/digital-market-signals/tree/cb17c6fc6d78e920e2e2a8d3de6bc3ef9dc91fad) is retained in the repository history.

## Reproduce the IndiaAI cost model

The [pricing snapshot](data/research/indiaai_pricing_snapshot.json) contains the six selected instance records and reservation periods. On November 21, 2026, the 24 rates were checked against both the [official calculator](https://compute.indiaai.gov.in/indiaaipricecalculator) and the [official price list](https://compute.indiaai.gov.in/pricelist). Use `node --test tests/compute-cost.test.mjs` to check the stated examples, all annual thresholds and both usage extremes for every term. Serve the repository root over HTTP to use the explorer. Research text, the annual chart, rate table and citations work with JavaScript disabled.

## Reproduce the WDI dataset

Run `python3 scripts/prepare_wdi.py` with Python 3.10 or later. The script retrieves three WDI indicators and country metadata, selects eligible economies, joins on ISO3, validates values and writes analysis-ready CSVs. The committed release covers 77 economies, 2015–2024, 770 country-year rows and 2,310 possible observations. Of those, 2,164 are reported and 146 are blank.

- [Wide CSV for Tableau](data/processed/wdi_tableau.csv)
- [Long CSV for analysis](data/processed/wdi_long.csv)
- [Annual coverage and API provenance](data/processed/wdi_coverage.json)
- [Data dictionary, definitions, scope and validation](docs/wdi-data.md)
- [Tableau Public build and verification guide](docs/tableau-authoring.md)

The published [Tableau Public workbook](https://public.tableau.com/app/profile/yu1607/viz/DigitalInfrastructureinEmergingEconomies/Dashboard1) is embedded on the [Dashboard page](data-explorer.html), which also includes the earlier seven-economy connectivity chart in the archive.

## Maintain Market Monitor

The [record-by-record source audit](docs/market-monitor-source-audit.md) documents the November 21, 2026 review and open verification questions.

1. Check primary operator, government or regulator material. If a milestone comes from later reporting, keep the attribution and link to that reporting separately. Identify operational, proposed, funded study, program launch and regulatory milestones by the evidence available.
2. Edit `signals-data.js`. Keep `id` and the original source publication `date` stable. Store the last source check in `reviewed`, a dated event or announcement in `milestone`, and the last documented substantive change in `lastUpdate` when applicable. Use YYYY-MM-DD. Set countries, regions, topic, stage type, stage and qualifying status.
3. Add source objects with publisher, label, type, URL and date when documented. Append chronological `history` items referencing their zero-based source indexes. Update the stage only when the evidence supports it. Preserve conflicts, uncertainties and follow-up questions.
4. Check related prose in Home, the brief, the dashboard and both digest formats. Revisit the research question when a detail changes. Update the browser asset query versions for changed JavaScript or CSS.
5. Keep the no-JavaScript source index in `market-signals.html` aligned with the original source of each record. Preview from the repository root over HTTP and check record links, milestone and other filters, publication-date sorting, histories and mobile layout.
