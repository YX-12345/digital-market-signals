(() => {
  const form = document.getElementById('country-form');
  const options = document.getElementById('country-options');
  const chart = document.getElementById('chart');
  const tableContainer = document.getElementById('chart-table');
  const status = document.getElementById('chart-status');
  const format = new Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const display = value => format.format(value / 100);

  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function parseObservations(csv) {
    // WDI snapshot uses unquoted ISO codes, country labels without commas, and decimal values.
    const [header, ...lines] = csv.trim().split(/\r?\n/);
    if (header !== 'country_code,country,reference_year,internet_use_pct' || !lines.length) {
      throw new Error('Unexpected data snapshot format');
    }
    const records = lines.map(line => {
      const [code, country, year, value] = line.split(',');
      if (!/^[A-Z]{3}$/.test(code) || !country || year !== '2024' ||
          !/^\d+(\.\d+)?$/.test(value) || Number(value) > 100) {
        throw new Error('Invalid country observation');
      }
      return { code, country, value: Number(value) };
    });
    if (new Set(records.map(record => record.code)).size !== records.length) {
      throw new Error('Duplicate country observation');
    }
    return records;
  }

  function makeChartRow(record) {
    const row = element('div', '', 'chart-row');
    const track = element('div', '', 'bar-track');
    const fill = element('div', '', 'bar-fill');
    fill.style.width = record.value + '%';
    track.append(fill);
    row.append(element('span', record.country), track, element('span', display(record.value), 'chart-value'));
    return row;
  }

  function makeAxis() {
    const axis = element('div', '', 'chart-axis');
    const ticks = element('div', '', 'chart-ticks');
    [0, 25, 50, 75, 100].forEach(value => ticks.append(element('span', value + '%')));
    axis.append(ticks);
    return axis;
  }

  function initialize(records) {
    const table = element('table', '');
    const caption = table.createCaption();
    caption.textContent = 'Selected countries, 2024';
    const header = table.createTHead().insertRow();
    ['Country', 'Population using the internet (%)'].forEach(label => {
      const cell = element('th', label);
      cell.scope = 'col';
      header.append(cell);
    });
    const tableBody = table.createTBody();
    const dataView = element('details', '', 'chart-data');
    dataView.append(element('summary', 'View chart data as a table'), table);
    tableContainer.append(dataView);

    const checkboxes = new Map();
    [...records].sort((a, b) => a.country.localeCompare(b.country)).forEach(record => {
      const label = element('label', '');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.defaultChecked = true;
      checkboxes.set(record.code, checkbox);
      label.append(checkbox, record.country);
      options.append(label);
    });
    records.sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));

    function render() {
      const selected = records.filter(record => checkboxes.get(record.code).checked);
      status.textContent = selected.length
        ? selected.length + ' of ' + records.length + ' countries shown'
        : 'No countries selected. Choose a country or select all.';
      chart.replaceChildren(...selected.map(makeChartRow));
      if (selected.length) chart.append(makeAxis());
      chart.closest('figure').hidden = !selected.length;
      dataView.hidden = !selected.length;
      tableBody.replaceChildren();
      selected.forEach(record => {
        const row = tableBody.insertRow();
        const country = element('th', record.country);
        country.scope = 'row';
        row.append(country, element('td', display(record.value)));
      });
    }

    form.addEventListener('change', render);
    // Run after the browser restores the form controls.
    form.addEventListener('reset', () => setTimeout(render, 0));
    render();
    form.hidden = false;
  }

  fetch('internet-use-2024.csv')
    .then(response => {
      if (!response.ok) throw new Error('Unable to load the data snapshot');
      return response.text();
    })
    .then(parseObservations)
    .then(initialize)
    .catch(() => {
      chart.closest('figure').hidden = true;
      status.textContent = 'The chart data could not load. The CSV is available under Data and comparability.';
    });
})();
