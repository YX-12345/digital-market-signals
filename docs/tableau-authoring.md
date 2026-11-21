# Tableau Public authoring specification

Use [Tableau Public web authoring](https://public.tableau.com/) in the portfolio owner's account. Connect [wdi_tableau.csv](../data/processed/wdi_tableau.csv) and create an extract. Set country, ISO3, region and income group to dimensions. Set year to a whole-number dimension and the indicators to decimal measures. The input contains one row per economy and reference year.

The [published workbook](https://public.tableau.com/app/profile/yu1607/viz/DigitalInfrastructureinEmergingEconomies/Dashboard1) is embedded on the [Dashboard page](https://yx-12345.github.io/digital-market-signals/data-explorer.html). It shows internet-use trends, the 2024 fixed-broadband comparison, and a 2024 scatterplot. The remaining instructions describe the build and optional controls.

## Worksheets

**Infrastructure Trends Over Time.** Place continuous Year on Columns and AVG(Selected value) on Rows. Put Country on Color and the country filter on this worksheet only. Start with India, Indonesia, Kenya and Nigeria. Add a string parameter called Indicator with values **Internet use (% of population)**, **Fixed broadband (subscriptions per 100 people)** and **Electricity access (% of population)**. Use it in a CASE calculation on those three labels, returning `[internet_use_pct]`, `[fixed_broadband_per_100]` or `[electricity_access_pct]` respectively. Set the title to the selected parameter or include the unit in the title. Keep null measurements null and use the special-value option that breaks lines at missing observations. Verify the gap behavior with an economy whose series has an interior blank.

**Cross-Country Comparison.** Put country on Rows and AVG(Selected value) on Columns. Filter to a single Year, defaulting to 2024. Show region and income-group filters on this sheet and sort descending by the chosen measure. Exclude blank measure values from the sorted bars and show the reference year, metric unit and source. Default the view to a region such as Sub-Saharan Africa so labels remain readable, with other regions available through the filter.

**Internet Use and Fixed Broadband.** Put AVG(internet_use_pct) on Columns and AVG(fixed_broadband_per_100) on Rows. Use circle marks, put ISO3 on Detail, region on Color and filter to one Year. Exclude rows with either axis value blank. A tooltip should include country, year, both axis measures with units and electricity access when available. The expected 2024 count is 49 economies. A descriptive association does not establish causation.

## Dashboard and acceptance

Use **Digital Infrastructure in Emerging Economies**, subtitle **Connectivity, Broadband and Electricity: Cross-country Trends and Comparisons**. Put the trend above the comparison and scatter. Apply the year filter to the bar and scatter only, so the trend retains its full timeline. Put the three findings and coverage notes from the website below the charts. Add the WDI source and analysis limits. Check desktop and phone layouts. Save to Tableau Public, open the public view in a signed-out session, and verify all three views, controls, tooltips, source notes and nulls before embedding. Save both the working embed and public direct link on the website.

## Five-minute hands-on practice

After a workbook is published to your profile, open it in Edit, select the comparison worksheet and change its Year from 2024 to 2020. Confirm that bars retain the selected unit and the line chart still shows the full timeline. Save and reopen the public version in a signed-out tab to confirm the change. Restore 2024 and save if that remains the desired default.
