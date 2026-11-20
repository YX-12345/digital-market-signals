# Digital Infrastructure in Emerging Economies — data dictionary

The analysis file covers **77 economies and 2015–2024**, with **770 country-year rows**. The long file contains **2,310 country–year–indicator rows**, including **2,164 observed values** and **146 blanks**. World Development Indicators (WDI) was retrieved on **20 November 2026**. The API identified its indicator data as updated on **11 November 2026**.

## Selection

Include all 25 low-income and 47 lower-middle-income economies in the World Bank country API and five upper-middle-income economies covered by the Market Signals library: Brazil, Indonesia, Malaysia, Mexico and Thailand. India, Kenya and Nigeria already qualify as lower-middle-income. Singapore is high-income and remains in the market-policy record. The sample spans six World Bank regions. Regional and income-group aggregates and economies without an eligible classification are excluded.

World Bank income groups are the FY2027 classification, effective 1 July 2026 through 30 June 2027. Country names, World Bank regions and income groups are a snapshot retrieved on 20 November 2026 and are held fixed across historical observations. The sample deliberately emphasizes low- and lower-middle-income economies, with an explicit set of market case additions. It is not a representative global sample or an income-group time series. [World Bank country and lending groups](https://datahelpdesk.worldbank.org/knowledgebase/articles/906519-world-bank-country) · [Country API](https://api.worldbank.org/v2/country?format=json&per_page=400)

## Files and fields

| Field | File | Definition and type |
| --- | --- | --- |
| `country_iso3` | Both CSVs | Three-character World Bank economy identifier. String and join key. |
| `country` | Both CSVs | World Bank economy name. String. |
| `region` | Both CSVs | World Bank geographical region as retrieved. String. |
| `income_group` | Both CSVs | Retrieved FY2027 World Bank income group. String. |
| `year` | Both CSVs | Annual observation reference year. Integer, 2015–2024. |
| `indicator_code` | Long | WDI series identifier. String. |
| `indicator_name` | Long | Standardized display name. String. |
| `value` | Long | Numeric API observation at source precision, or blank. |
| `unit` | Long | Percent of population or subscriptions per 100 people. String. |
| `internet_use_pct` | Wide | IT.NET.USER.ZS observation, numeric percent of population, or blank. |
| `fixed_broadband_per_100` | Wide | IT.NET.BBND.P2 observation, numeric subscriptions per 100 people, or blank. |
| `electricity_access_pct` | Wide | EG.ELC.ACCS.ZS observation, numeric percent of population, or blank. |

The long key is `country_iso3, year, indicator_code`. The wide key is `country_iso3, year`. A blank is missing. An observed zero is retained.

## Indicator definitions

| Indicator | Official WDI definition and unit | Interpretation |
| --- | --- | --- |
| [IT.NET.USER.ZS](https://databank.worldbank.org/metadataglossary/world-development-indicators/series/IT.NET.USER.ZS) | Share of the population who used the internet from any location during the previous three months, expressed as a percentage. Original provider: ITU. | Captures use across access modes and devices. |
| [IT.NET.BBND.P2](https://databank.worldbank.org/metadataglossary/world-development-indicators/series/IT.NET.BBND.P2) | Fixed high-speed public internet subscriptions per 100 people. Includes fixed wired, satellite and fixed wireless subscriptions at downstream speeds of at least 256 kbit/s. Original provider: ITU. | Counts subscriptions, including organizations. Mobile-cellular subscriptions are outside this definition. |
| [EG.ELC.ACCS.ZS](https://databank.worldbank.org/metadataglossary/world-development-indicators/series/EG.ELC.ACCS.ZS) | Percentage of the population with access to electricity. WDI compiles inputs including surveys, industry and international sources. | Measures access. A facility’s firm grid power, outages and backup provisioning require separate evidence. |

National averages can mask differences within economies. Coverage and collection practices differ across indicators and years. The sample and measures provide background on digital-service adoption. Facility commissioning, AI accelerators, cloud capacity and workload eligibility require project or provider evidence.

## Coverage and missing data

| Series | Non-missing in 2015–2024 | Blank in 2015–2024 | 2024 | 2025 | 2026 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Internet use | 700 | 70 | 67 | 1 | 0 |
| Fixed broadband | 694 | 76 | 53 | 0 | 0 |
| Electricity access | 770 | 0 | 77 | 0 | 0 |
| All three for a given economy and year | — | — | 49 | 0 | 0 |

Counts in year columns are economies with reported observations, out of 77. 2024 is the latest common reference year in this retrieval. 2025 and 2026 are coverage checks, outside the analytical period. The 2024 scatter has 49 usable internet-use and fixed-broadband pairs. See [annual coverage and API URLs](../data/processed/wdi_coverage.json).

## Reproduce and verify

1. Run `python3 scripts/prepare_wdi.py` from the repository root with Python 3.10 or later. The script queries WDI source 2 and the country endpoint, consumes every API page, applies documented eligibility and joins on the shared economy identifier.
2. Form the complete 77-economy × 10-year × 3-indicator grid. Use API values at source precision, leaving nulls blank. The script rejects duplicate keys, nonnumeric and nonfinite values, negatives, and percentages above 100. A broadband subscription rate can exceed 100, so the percent limit applies only to the two percentage series.
3. Write both CSVs and the coverage JSON. Rebuild the same release with `--save-snapshot /path/snapshot.json` and `--from-snapshot /path/snapshot.json` as needed. Live reruns may reflect later revisions. The committed CSVs preserve the published snapshot.
4. For the release, separate API requests limited to India, Kenya and Malaysia independently matched all 18 values across the three series in 2015 and 2024. The frozen API snapshot also regenerated the output files byte for byte.
5. For a future year, inspect the current World Bank classification, then update the classification and date arguments and recheck coverage and reported findings. Preserve existing historical blanks.

Source: World Bank, World Development Indicators. Official indicator pages identify underlying providers and methods. Release observations are available as [long CSV](../data/processed/wdi_long.csv) and [Tableau-ready wide CSV](../data/processed/wdi_tableau.csv).
