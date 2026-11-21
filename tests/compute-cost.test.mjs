import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { calculateCost } from '../compute-cost.mjs';

const snapshot = JSON.parse(readFileSync(new URL('../data/research/indiaai_pricing_snapshot.json', import.meta.url)));
const { instances, pricing_periods: periods } = snapshot;
const h100 = instances.find(item => item.instance_type === 'H100SXM.1x');

test('H100 monthly and annual source examples', () => {
  const monthly = calculateCost(h100, periods, 1, 100);
  assert.equal(monthly.reservation, 96552);
  assert.equal(monthly.onDemand, 15300);
  assert.equal(monthly.difference, -81252);
  assert.equal((monthly.breakEvenShare * 100).toFixed(2), '87.65');
  const annual = calculateCost(h100, periods, 12, 8760);
  assert.equal(annual.reservation, 1024920);
  assert.equal((annual.breakEvenShare * 100).toFixed(2), '76.47');
});

test('annual chart thresholds match both data and markup', () => {
  const article = readFileSync(new URL('../research.html', import.meta.url), 'utf8');
  for (const instance of instances) {
    const result = calculateCost(instance, periods, 12, 0);
    const pct = result.breakEvenShare * 100;
    assert.ok(Math.abs(pct - instance.annual_break_even_utilization_pct) <= 0.06);
    const published = instance.annual_break_even_utilization_pct.toFixed(1);
    assert.ok(article.includes(`--threshold: ${published}%`));
    assert.ok(article.includes(`<strong>${published}%</strong>`));
  }
});

test('all terms hold reserved cost constant and bound usage correctly', () => {
  for (const instance of instances) {
    for (const [term, billable] of [[1, 720], [6, 4320], [12, 8760]]) {
      const unused = calculateCost(instance, periods, term, 0);
      const full = calculateCost(instance, periods, term, billable);
      assert.equal(full.billableHours, billable);
      assert.equal(unused.onDemand, 0);
      assert.equal(full.onDemand, billable * Math.round(instance.rates.on_demand * 100) / 100);
      assert.equal(full.reservation, unused.reservation);
      assert.equal(full.usageShare, 1);
      assert.ok(full.difference > 0);
      assert.throws(() => calculateCost(instance, periods, term, -1), RangeError);
      assert.throws(() => calculateCost(instance, periods, term, billable + 1), RangeError);
    }
  }
});
