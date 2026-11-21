import { calculateCost } from './compute-cost.mjs';

const byId = id => document.getElementById(id);
const app = byId('scenario-app');
const fallback = byId('scenario-fallback');
const form = byId('scenario-controls');
const instanceInput = byId('scenario-instance');
const termInput = byId('scenario-term');
const hoursInput = byId('scenario-hours');
const slider = byId('scenario-slider');
const usageError = byId('usage-error');
const money = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger',
});
const compactMoney = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'INR', notation: 'compact', maximumFractionDigits: 2,
});
const hours = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat('en-US', {
  style: 'percent', maximumFractionDigits: 2,
});

function place(id, attributes) {
  const node = byId(id);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
}

function drawPlot(model) {
  const left = 65;
  const right = 393;
  const bottom = 162;
  const rise = 125;
  const x = share => left + (right - left) * share;
  const y = share => bottom - rise * share;
  const crossingX = x(model.breakEvenShare);
  const crossingY = y(model.breakEvenShare);
  const usageX = x(model.usageShare);
  const maxCost = model.billableHours * model.onDemandRate;
  byId('plot-max-cost').textContent = compactMoney.format(maxCost);
  byId('plot-mid-cost').textContent = compactMoney.format(maxCost / 2);
  place('plot-reserved', { y1: crossingY, y2: crossingY });
  place('plot-usage', { x1: usageX, x2: usageX });
  place('plot-usage-point', { cx: usageX, cy: y(model.usageShare) });
  place('plot-crossing', { cx: crossingX, cy: crossingY });
  place('plot-cross-label', { x: crossingX - 9, y: crossingY - 8 });
  byId('plot-desc').textContent =
    `On-demand base cost rises from zero; the reservation stays at ${money.format(model.reservation)}. ` +
    `They intersect at ${percent.format(model.breakEvenShare)} of the term. ` +
    `Selected usage is ${percent.format(model.usageShare)}.`;
}

function initialize(data) {
  const instances = new Map(data.instances.map(instance => [instance.instance_type, instance]));
  for (const item of instances.values()) {
    instanceInput.add(new Option(`${item.accelerator} · ${item.instance_type}`, item.instance_type));
  }
  instanceInput.value = 'H100SXM.1x';
  termInput.value = '1';
  let selectedHours = 360;

  function render() {
    const item = instances.get(instanceInput.value);
    const model = calculateCost(item, data.pricing_periods, termInput.value, selectedHours);
    hoursInput.max = slider.max = String(model.billableHours);
    hoursInput.value = slider.value = String(selectedHours);
    usageError.hidden = true;
    hoursInput.removeAttribute('aria-invalid');
    slider.setAttribute('aria-valuetext', `${hours.format(selectedHours)} hours, ${percent.format(model.usageShare)} of term`);
    byId('usage-summary').textContent =
      `${hours.format(selectedHours)} of ${hours.format(model.billableHours)} hours · ${percent.format(model.usageShare)} of term`;
    byId('scenario-rates').textContent =
      `${item.instance_type} · ${item.listed_gpu_memory_gb} GB · ${money.format(model.onDemandRate)} on demand / ${money.format(model.reservedRate)} reserved per instance-hour`;
    byId('scenario-source').href = item.official_source_url;
    byId('cost-demand').value = money.format(model.onDemand);
    byId('cost-reserved').value = money.format(model.reservation);
    byId('cost-threshold').value = percent.format(model.breakEvenShare);
    const difference = money.format(Math.abs(model.difference));
    const comparison = model.difference === 0 ? 'Both modeled charges are equal.' :
      `${model.difference > 0 ? 'The reservation' : 'On demand'} costs ${difference} less at this usage.`;
    byId('scenario-result').textContent =
      `${comparison} Charges cross at about ${hours.format(model.breakEvenHours)} instance-hours.`;
    drawPlot(model);
  }

  instanceInput.addEventListener('change', render);
  termInput.addEventListener('change', () => {
    const usageShare = selectedHours / Number(hoursInput.max);
    const nextTerm = data.pricing_periods[`reserved_${termInput.value}_month_billable_hours`];
    selectedHours = Math.round(usageShare * nextTerm);
    render();
  });
  slider.addEventListener('input', () => {
    selectedHours = Number(slider.value);
    render();
  });
  hoursInput.addEventListener('input', () => {
    if (hoursInput.value && hoursInput.validity.valid) {
      selectedHours = Number(hoursInput.value);
      render();
    } else {
      hoursInput.setAttribute('aria-invalid', 'true');
      usageError.textContent = `Enter a whole number from 0 to ${hours.format(Number(hoursInput.max))}.`;
      usageError.hidden = false;
    }
  });
  hoursInput.addEventListener('blur', () => {
    if (hoursInput.getAttribute('aria-invalid') === 'true') render();
  });
  form.addEventListener('submit', event => event.preventDefault());
  render();
  app.hidden = false;
  fallback.hidden = true;
}

try {
  const response = await fetch('data/research/indiaai_pricing_snapshot.json');
  if (!response.ok) throw new Error('Pricing snapshot unavailable.');
  initialize(await response.json());
} catch {
  fallback.firstChild.textContent = 'The pricing snapshot could not be loaded. Reload to try again. The ';
}
