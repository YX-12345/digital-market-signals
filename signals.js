(() => {
  const records = window.DMS_SIGNALS;
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
    return record.country + ' · ' + record.region + ' · ' + record.topic;
  }

  function card(record) {
    const item = element('article', '', 'card signal-card');
    const heading = element('h2', '');
    heading.append(link(record.headline, signalLink(record.id)));
    const meta = element('p', describe(record) + ' · ', 'metadata');
    meta.append(time(record.date));
    const attribution = element('p', '');
    attribution.append('Original source: ', link(record.sources[0][0], record.sources[0][2]));
    attribution.className = 'source-line';
    item.append(meta, heading, element('p', record.takeaway),
      element('p', record.status, 'status'), attribution);
    return item;
  }

  function initializeLibrary(form) {
    const keyword = byId('keyword');
    const topic = byId('topic');
    const geography = byId('geography');
    const sort = byId('sort');
    const results = byId('results');
    const count = byId('result-count');
    const alphabetical = field => [...new Set(records.map(record => record[field]))].sort();

    alphabetical('topic').forEach(value => topic.add(new Option(value)));
    const regions = element('optgroup', '');
    regions.label = 'Regions';
    alphabetical('region').forEach(value => regions.append(new Option(value)));
    const countries = element('optgroup', '');
    countries.label = 'Countries';
    alphabetical('country').forEach(value => countries.append(new Option(value)));
    geography.append(regions, countries);

    const searchable = records.map(record => ({
      record,
      text: [record.headline, describe(record), record.status, record.takeaway, record.summary,
        record.evidence, record.why, record.watch, record.limits, ...record.sources.flat()]
        .join(' ').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    }));

    function render() {
      const terms = keyword.value.normalize('NFKD').replace(/\p{M}/gu, '')
        .toLowerCase().trim().split(/\s+/).filter(Boolean);
      const matching = searchable.filter(({ record, text }) =>
        (!topic.value || record.topic === topic.value) &&
        (!geography.value || record.country === geography.value || record.region === geography.value) &&
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
    const meta = element('p', describe(record) + ' · ', 'metadata');
    meta.append(time(record.date));
    article.replaceChildren(meta, element('h1', record.headline),
      element('p', record.status, 'status'), element('p', record.takeaway, 'lede'));
    const sections = [
      ['Factual summary', record.summary], ['Evidence', record.evidence],
      ['Why This Matters', record.why], ['What to Watch', record.watch],
      ['Uncertainties and limitations', record.limits]
    ];
    sections.forEach(([heading, text]) => article.append(element('h2', heading), element('p', text)));

    const sources = element('ul', '', 'source-list');
    record.sources.forEach(([label, date, url]) => {
      const item = element('li', '');
      item.append(link(label, url), ' · ', time(date));
      sources.append(item);
    });
    article.append(element('h2', 'Sources'), sources);
  }

  const library = byId('library-form');
  const detail = byId('signal-detail');
  if (library) initializeLibrary(library);
  if (detail) initializeDetail(detail);
})();
