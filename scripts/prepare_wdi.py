#!/usr/bin/env python3
"""Prepare the Digital Market Signals WDI tables from the public World Bank API."""

import argparse
import csv
import json
import math
import re
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
API = "https://api.worldbank.org/v2"
CLASSIFICATION = (
    "https://datahelpdesk.worldbank.org/knowledgebase/articles/906519-world-bank-country"
)
FEATURED = {"BRA", "IDN", "IND", "KEN", "MEX", "MYS", "NGA", "SGP", "THA"}
INDICATORS = {
    "IT.NET.USER.ZS": (
        "Individuals using the Internet", "Percent of population", "internet_use_pct"
    ),
    "IT.NET.BBND.P2": (
        "Fixed broadband subscriptions", "Subscriptions per 100 people", "fixed_broadband_per_100"
    ),
    "EG.ELC.ACCS.ZS": (
        "Access to electricity", "Percent of population", "electricity_access_pct"
    ),
}
DIMENSIONS = ("country_iso3", "country", "region", "income_group", "year")


def request_json(url):
    for attempt in range(3):
        try:
            with urlopen(url, timeout=35) as response:
                return json.load(response)
        except (URLError, TimeoutError) as error:
            transient = not isinstance(error, HTTPError) or error.code in {429, 500, 502, 503, 504}
            if not transient or attempt == 2:
                raise
            time.sleep(2 ** attempt)


def api_records(url):
    """Fetch every page and validate the collection envelope."""
    metadata, rows = request_json(url)
    if not isinstance(rows, list) or not isinstance(metadata, dict):
        raise ValueError(f"Unexpected World Bank API response: {url}")
    for page in range(2, int(metadata["pages"]) + 1):
        _, additional = request_json(f"{url}&page={page}")
        rows.extend(additional)
    if len(rows) != int(metadata["total"]):
        raise ValueError(f"Incomplete response from {url}")
    return metadata, rows


def source_urls(start, probe_end):
    urls = {"country": f"{API}/country?format=json&per_page=400"}
    query = urlencode({"source": 2, "date": f"{start}:{probe_end}", "format": "json", "per_page": 20000})
    for code in INDICATORS:
        urls[code] = f"{API}/country/all/indicator/{code}?{query}"
    return urls


def get_snapshot(urls, read_path):
    if read_path:
        snapshot = json.loads(read_path.read_text(encoding="utf-8"))
        if snapshot["urls"] != urls:
            raise ValueError("Date arguments do not match the saved API snapshot.")
        return snapshot
    with ThreadPoolExecutor(max_workers=4) as pool:
        responses = dict(zip(urls, pool.map(api_records, urls.values()), strict=True))
    return {
        "retrieved_on": datetime.now(ZoneInfo("America/New_York")).date().isoformat(),
        "urls": urls,
        "responses": responses,
    }


def select_countries(rows):
    eligible = {}
    for row in rows:
        code = row["id"]
        income = row["incomeLevel"]["id"]
        if row["region"]["id"] in {"", "NA"} or row["region"]["value"] == "Aggregates":
            continue
        if not re.fullmatch(r"[A-Z]{3}", code):
            raise ValueError(f"Unexpected country identifier: {code}")
        if income not in {"LIC", "LMC", "UMC"}:
            continue
        if code in eligible:
            raise ValueError(f"Duplicate country identifier: {code}")
        eligible[code] = row
    missing_cases = FEATURED - eligible.keys()
    selected = {
        code: row for code, row in eligible.items()
        if row["incomeLevel"]["id"] in {"LIC", "LMC"} or code in FEATURED
    }
    return selected, sorted(missing_cases)


def index_observations(snapshot, selected):
    observations = {}
    for indicator in INDICATORS:
        _, rows = snapshot["responses"][indicator]
        for row in rows:
            iso3 = row["countryiso3code"]
            if iso3 not in selected:
                continue
            if row["indicator"]["id"] != indicator:
                raise ValueError(f"Unexpected indicator in {indicator} response")
            year = int(row["date"])
            key = (iso3, year, indicator)
            if key in observations:
                raise ValueError(f"Duplicate observation: {key}")
            value = row["value"]
            if value is not None:
                if type(value) not in {int, float} or not math.isfinite(value) or value < 0:
                    raise ValueError(f"Invalid observation {key}: {value}")
                if indicator != "IT.NET.BBND.P2" and value > 100:
                    raise ValueError(f"Percent out of range {key}: {value}")
            observations[key] = value
    return observations


def save_csv(path, columns, rows):
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.writer(stream, lineterminator="\n")
        writer.writerow(columns)
        writer.writerows(rows)


def prepare(args):
    urls = source_urls(args.start, args.probe_through)
    snapshot = get_snapshot(urls, args.from_snapshot)
    if args.save_snapshot:
        args.save_snapshot.write_text(json.dumps(snapshot, ensure_ascii=False) + "\n", encoding="utf-8")

    selected, excluded_cases = select_countries(snapshot["responses"]["country"][1])
    values = index_observations(snapshot, selected)
    long_rows, wide_rows = [], []
    for code, row in sorted(selected.items()):
        for year in range(args.start, args.end + 1):
            dimensions = (code, row["name"].strip(), row["region"]["value"].strip(), row["incomeLevel"]["value"].strip(), year)
            measure_values = []
            for indicator, (name, unit, _) in INDICATORS.items():
                value = values.get((code, year, indicator))
                long_rows.append((*dimensions, indicator, name, value, unit))
                measure_values.append(value)
            wide_rows.append((*dimensions, *measure_values))

    output = args.output
    output.mkdir(parents=True, exist_ok=True)
    save_csv(output / "wdi_long.csv", (*DIMENSIONS, "indicator_code", "indicator_name", "value", "unit"), long_rows)
    save_csv(output / "wdi_tableau.csv", (*DIMENSIONS, *(d[2] for d in INDICATORS.values())), wide_rows)

    coverage = {}
    for year in range(args.start, args.probe_through + 1):
        coverage[str(year)] = {
            indicator: sum(values.get((code, year, indicator)) is not None for code in selected)
            for indicator in INDICATORS
        }
        coverage[str(year)]["all_three"] = sum(
            all(values.get((code, year, indicator)) is not None for indicator in INDICATORS)
            for code in selected
        )
    missing = {
        indicator: len(wide_rows) - sum(
            coverage[str(year)][indicator] for year in range(args.start, args.end + 1)
        )
        for indicator in INDICATORS
    }
    absence = sum((code, year, indicator) not in values
                  for code in selected for year in range(args.start, args.end + 1) for indicator in INDICATORS)
    report = {
        "retrieved_on": snapshot["retrieved_on"],
        "classification_fiscal_year": args.classification_fy,
        "classification_source": CLASSIFICATION,
        "api_urls": urls,
        "api_last_updated": {code: snapshot["responses"][code][0].get("lastupdated") for code in INDICATORS},
        "analytical_period": [args.start, args.end],
        "coverage_checked_through": args.probe_through,
        "economies": len(selected),
        "economies_by_income_group": dict(sorted(Counter(row["incomeLevel"]["value"] for row in selected.values()).items())),
        "economies_by_region": dict(sorted(Counter(row["region"]["value"].strip() for row in selected.values()).items())),
        "featured_economies_excluded": excluded_cases,
        "country_year_rows": len(wide_rows),
        "indicator_rows": len(long_rows),
        "nonmissing_observations": len(long_rows) - sum(missing.values()),
        "missing_observations": sum(missing.values()),
        "missing_by_indicator": missing,
        "absent_api_keys_in_window": absence,
        "annual_nonmissing_counts": coverage,
    }
    (output / "wdi_coverage.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", type=int, default=2015)
    parser.add_argument("--end", type=int, default=2024)
    parser.add_argument("--probe-through", type=int, default=2026)
    parser.add_argument("--classification-fy", type=int, default=2027,
                        help="Fiscal year verified against the currently retrieved country metadata")
    parser.add_argument("--output", type=Path, default=ROOT / "data" / "processed")
    parser.add_argument("--save-snapshot", type=Path)
    parser.add_argument("--from-snapshot", type=Path)
    args = parser.parse_args()
    if not args.start <= args.end <= args.probe_through:
        parser.error("Expected start <= end <= probe-through")
    prepare(args)


if __name__ == "__main__":
    main()
