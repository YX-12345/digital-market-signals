// Rates arrive as INR per instance-hour. Whole hours and paise keep base
// charges exact; ratios retain full precision until they are displayed.
export function calculateCost(instance, periods, months, usedHours) {
  const termKey = `reserved_${months}_month`;
  const billableHours = periods[`${termKey}_billable_hours`];
  const demandRate = Math.round(instance.rates.on_demand * 100);
  const reservedRate = Math.round(instance.rates[termKey] * 100);
  if (!Number.isInteger(billableHours) || !Number.isInteger(usedHours) ||
      usedHours < 0 || usedHours > billableHours || !(demandRate > 0 && reservedRate > 0)) {
    throw new RangeError('Choose a listed term and whole hours within that term.');
  }

  const onDemandPaise = usedHours * demandRate;
  const reservationPaise = billableHours * reservedRate;
  return {
    billableHours,
    onDemandRate: demandRate / 100,
    reservedRate: reservedRate / 100,
    onDemand: onDemandPaise / 100,
    reservation: reservationPaise / 100,
    difference: (onDemandPaise - reservationPaise) / 100,
    breakEvenHours: reservationPaise / demandRate,
    breakEvenShare: reservedRate / demandRate,
    usageShare: usedHours / billableHours,
  };
}
