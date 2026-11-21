(() => {
  const records = window.DMS_SIGNALS;
  if (!Array.isArray(records) || !records.length) return;
  const byId = id => document.getElementById(id);
  const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' });
  const dateText = iso => dateFormat.format(new Date(iso));
  const signalLink = id => 'signal.html?id=' + encodeURIComponent(id);

  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function link(label, url) {
    const anchor = element('a', label);
    anchor.href = url;
    return anchor;
  }

  function time(iso) {
    const label = element('time', dateText(iso));
    label.dateTime = iso;
    return label;
  }

  function describe(record) {
    return [record.geographyLabel || record.countries.join(', '), record.topic].join(' · ');
  }

  function recordDates(record) {
    const dates = element('p', 'Original source published ', 'metadata record-dates');
    dates.append(time(record.date), ' · Last reviewed ', time(record.reviewed));
    return dates;
  }

  function recordStatus(record) {
    const description = record.status === record.stage ? record.stage : record.stage + ' · ' + record.status;
    return element('p', description, 'status');
  }

  function sourceLine(source, includeDate = true) {
    const line = element('span', source.type + ' · ');
    line.append(link(source.label, source.url));
    if (includeDate && source.date) line.append(' · ', time(source.date));
    return line;
  }

  function card(record) {
    const item = element('article', '', 'card signal-card');
    const heading = element('h2', '');
    heading.append(link(record.headline, signalLink(record.id)));
    const attribution = element('p', '', 'source-line');
    attribution.append(sourceLine(record.sources[0], false));
    item.append(element('p', describe(record), 'metadata'), heading, element('p', record.takeaway),
      recordStatus(record), recordDates(record), attribution);
    return item;
  }

  function initializeLibrary(form) {
    const keyword = byId('keyword');
    const topic = byId('topic');
    const geography = byId('geography');
    const sort = byId('sort');
    const results = byId('results');
    const count = byId('result-count');
    const alphabetical = field => [...new Set(records.flatMap(record => record[field]))].sort();

    alphabetical('topic').forEach(value => topic.add(new Option(value)));
    const regions = element('optgroup', '');
    regions.label = 'Regions';
    alphabetical('regions').forEach(value => regions.append(new Option(value)));
    const countries = element('optgroup', '');
    countries.label = 'Countries';
    alphabetical('countries').forEach(value => countries.append(new Option(value)));
    geography.append(regions, countries);

    const searchable = records.map(record => ({
      record,
      text: [record.headline, describe(record), record.status, record.takeaway, record.summary,
        record.evidence, record.why, record.watch, record.limits, record.stage, ...record.countries,
        ...record.regions, ...record.sources.flatMap(source => [source.label, source.type])]
        .join(' ').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    }));

    function render() {
      const terms = keyword.value.normalize('NFKD').replace(/\p{M}/gu, '')
        .toLowerCase().trim().split(/\s+/).filter(Boolean);
      const matching = searchable.filter(({ record, text }) =>
        (!topic.value || record.topic === topic.value) &&
        (!geography.value || record.countries.includes(geography.value) || record.regions.includes(geography.value)) &&
        terms.every(term => text.includes(term))
      ).map(({ record }) => record);

      const direction = sort.value === 'oldest' ? 1 : -1;
      matching.sort((a, b) => direction * a.date.localeCompare(b.date) || a.headline.localeCompare(b.headline));
      count.textContent = matching.length + ' of ' + records.length + ' signals';
      results.replaceChildren(...matching.map(card));
      if (!matching.length) results.append(element('p', 'No signals match. Try another keyword or reset the filters.'));
    }

    form.addEventListener('submit', event => event.preventDefault());
    keyword.addEventListener('input', render);
    form.addEventListener('change', render);
    // Run after the browser restores the form controls.
    form.addEventListener('reset', () => setTimeout(render, 0));
    render();
    form.hidden = false;
    byId('library-fallback').hidden = true;
  }

  function initializeDetail(article) {
    const id = new URLSearchParams(window.location.search).get('id');
    const record = records.find(item => item.id === id);
    if (!record) {
      article.replaceChildren(element('h1', 'Signal unavailable'),
        element('p', 'Choose a record from the Market Signals library.'));
      return;
    }
    document.title = record.headline + ' | Digital Market Signals';
    article.replaceChildren(element('p', describe(record), 'metadata'),
      element('h1', record.headline), recordStatus(record), recordDates(record),
      element('p', record.takeaway, 'lede'));
    const sections = [
      ['Factual summary', record.summary], ['Evidence and attribution', record.evidence],
      ['Why This Matters', record.why], ['What to Watch', record.watch],
      ['Uncertainties and limitations', record.limits]
    ];
    sections.forEach(([heading, text]) => article.append(element('h2', heading), element('p', text)));

    if (record.history?.length) {
      const history = element('ol', '', 'source-list');
      record.history.forEach(event => {
        const item = element('li', '');
        const source = record.sources[event.source];
        item.append(time(event.date), ' · ' + event.text + ' ', link(source.label, source.url));
        history.append(item);
      });
      article.append(element('h2', 'Update history'), history);
    }

    const sources = element('ul', '', 'source-list');
    record.sources.forEach(source => {
      const item = element('li', '');
      item.append(sourceLine(source));
      sources.append(item);
    });
    article.append(element('h2', 'Sources'), sources);

    if (record.related?.length) {
      const related = element('ul', '', 'source-list');
      record.related.forEach(({ label, url }) => {
        const item = element('li', '');
        item.append(link(label, url));
        related.append(item);
      });
      article.append(element('h2', 'Related analysis'), related);
    }
  }

  const library = byId('library-form');
  const detail = byId('signal-detail');
  if (library) initializeLibrary(library);
  if (detail) initializeDetail(detail);
})();
