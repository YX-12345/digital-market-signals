#!/usr/bin/env python3
"""Verify the published Data Lab figures using only the committed WDI snapshot."""

import argparse
import csv
import json
from collections import Counter
from decimal import Decimal
from pathlib import Path
from statistics import median

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "processed"
INTERNET, BROADBAND, ELECTRICITY = (
    "internet_use_pct", "fixed_broadband_per_100", "electricity_access_pct"
)
INDICATORS = {
    "IT.NET.USER.ZS": INTERNET,
    "IT.NET.BBND.P2": BROADBAND,
    "EG.ELC.ACCS.ZS": ELECTRICITY,
}
YEARS = range(2015, 2025)


def read_csv(name):
    with (DATA / name).open(newline="", encoding="utf-8") as stream:
        return list(csv.DictReader(stream))


def calculate():
    wide = read_csv("wdi_tableau.csv")
    long = read_csv("wdi_long.csv")
    indexed = {(row["country_iso3"], int(row["year"])): row for row in wide}
    by_indicator = {
        (row["country_iso3"], int(row["year"]), row["indicator_code"]): row["value"]
        for row in long
    }
    economies = {row["country_iso3"]: row for row in wide if row["year"] == "2024"}
    assert len(indexed) == len(wide) == 770, "Unexpected or duplicate country-year rows"
    assert len(by_indicator) == len(long) == 2310, "Unexpected or duplicate indicator rows"
    assert set(indexed) == {(country, year) for country in economies for year in YEARS}
    assert Counter(row["income_group"] for row in economies.values()) == {
        "Low income": 25, "Lower middle income": 47, "Upper middle income": 5,
    }
    assert {code for code, row in economies.items() if row["income_group"] == "Upper middle income"} == {
        "BRA", "IDN", "MYS", "MEX", "THA",
    }
    for (country, year), row in indexed.items():
        for code, field in INDICATORS.items():
            assert by_indicator[country, year, code] == row[field], (country, year, code)
    blanks = {field: sum(row[field] == "" for row in wide) for field in INDICATORS.values()}
    assert blanks == {INTERNET: 70, BROADBAND: 76, ELECTRICITY: 0}
    coverage = json.loads((DATA / "wdi_coverage.json").read_text(encoding="utf-8"))
    assert coverage["retrieved_on"] == "2026-11-20"
    assert set(coverage["api_last_updated"].values()) == {"2026-11-11"}
    assert coverage["analytical_period"] == [2015, 2024]
    assert (coverage["nonmissing_observations"], coverage["missing_observations"]) == (2164, 146)

    gains = {
        code: Decimal(row[INTERNET]) - Decimal(indexed[code, 2015][INTERNET])
        for code, row in economies.items()
        if row[INTERNET] != "" and indexed[code, 2015][INTERNET] != ""
    }
    pairs = {code: row for code, row in economies.items() if row[INTERNET] and row[BROADBAND]}
    assert len(gains) == 67 and min(gains.values()) > 0
    assert median(gains.values()) == Decimal("26.47149849")
    assert len(pairs) == 49 and len(economies) - len(pairs) == 28
    assert {
        code: format(gains[code], ".1f") for code in ("IDN", "IND", "NGA", "KEN")
    } == {"IDN": "50.7", "IND": "50.0", "NGA": "18.7", "KEN": "18.4"}
    assert {
        code: [format(Decimal(pairs[code][col]), ".1f") for col in (INTERNET, BROADBAND)]
        for code in ("MYS", "BRA")
    } == {"MYS": ["98.0", "13.5"], "BRA": ["84.5", "24.1"]}
    assert {
        code: [Decimal(indexed[code, year][ELECTRICITY]) for year in (2015, 2024)]
        for code in ("KEN", "NGA")
    } == {"KEN": [Decimal("41.6"), Decimal("77.0")], "NGA": [Decimal("52.5"), Decimal("62.5")]}
    assert [
        format(Decimal(indexed["IDN", year][field]), ".1f")
        for field in (INTERNET, BROADBAND, ELECTRICITY) for year in (2015, 2024)
    ] == ["22.1", "72.8", "1.5", "4.9", "97.5", "99.9"]
    return pairs


def scatter_svg(pairs):
    # Include only complete pairs. Both axes start at zero and retain source units.
    left, top, width, height = 48, 36, 352, 186
    max_broadband = 40

    def position(internet, broadband):
        return left + float(internet) * width / 100, top + height * (1 - float(broadband) / max_broadband)

    svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 282" role="img" aria-labelledby="title desc">',
        '<title id="title">Internet use and fixed broadband subscriptions, 2024</title>',
        '<desc id="desc">Forty-nine economies with both observations. Malaysia has higher internet use than Brazil, while Brazil has more fixed subscriptions per 100 people.</desc>',
        '<rect width="420" height="282" fill="#fffefa"/>',
        '<g font-family="system-ui, sans-serif" font-size="13" fill="#465866">',
        '<text x="48" y="20">Fixed subscriptions per 100 people</text>',
    ]
    for tick in range(0, max_broadband + 1, 10):
        _, y = position(0, tick)
        svg.append(f'<path d="M {left} {y:g} h {width}" stroke="#e0e6e0"/>')
        svg.append(f'<text x="39" y="{y + 4:g}" text-anchor="end">{tick}</text>')
    for tick in range(0, 101, 25):
        x, y = position(tick, 0)
        svg.append(f'<path d="M {x:g} {top} v {height}" stroke="#e0e6e0"/>')
        svg.append(f'<text x="{x:g}" y="{y + 21:g}" text-anchor="middle">{tick}</text>')
    svg.extend([
        f'<path d="M {left} {top} v {height} h {width}" stroke="#7f8d87" fill="none"/>',
        '<text x="224" y="267" text-anchor="middle">Individuals using the internet (% of population)</text>',
    ])
    highlight = {"BRA": ("Brazil", "#a44c2b"), "MYS": ("Malaysia", "#145c55")}
    for code, row in sorted(pairs.items(), key=lambda item: (item[0] in highlight, item[0])):
        x, y = position(row[INTERNET], row[BROADBAND])
        label, fill = highlight.get(code, ("", "#98aeb0"))
        radius = 5 if label else 3.1
        svg.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{radius:g}" fill="{fill}" stroke="#fffefa"/>')
        if label:
            svg.append(f'<text x="{x - 8:.2f}" y="{y - 7:.2f}" text-anchor="end" fill="{fill}" font-weight="700" paint-order="stroke" stroke="#fffefa" stroke-width="3">{label}</text>')
    return "\n".join([*svg, "</g>", "</svg>", ""])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write-scatter", action="store_true", help="Regenerate the chart asset from the frozen CSV.")
    args = parser.parse_args()
    pairs = calculate()
    chart = ROOT / "assets" / "wdi-access-scatter-2024.svg"
    rendered = scatter_svg(pairs)
    if args.write_scatter:
        chart.write_text(rendered, encoding="utf-8")
    else:
        assert chart.read_text(encoding="utf-8") == rendered, "Scatterplot differs from the committed CSV"
    print("Verified both WDI tables, all displayed findings, missingness, and the 49-point scatterplot.")


if __name__ == "__main__":
    main()
