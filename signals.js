(() => {
  const records = window.DMS_SIGNALS;
  if (!Array.isArray(records) || !records.length) return;
  const byId = id => document.getElementById(id);
  const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' });
  const signalLink = id => 'signal.html?id=' + encodeURIComponent(id);
  const normalize = text => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
  const tierLabels = { featured: 'Featured', current: 'Current coverage', reference: 'Reference' };

  function element(tag, text = '', className) {
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
    const label = element('time', dateFormat.format(new Date(iso)));
    label.dateTime = iso;
    return label;
  }

  function describe(record) {
    return [record.geographyLabel || record.countries.join(', '), record.topic].join(' · ');
  }

  function status(record) {
    if (record.status === record.stage) return record.stage;
    return [record.stage, record.status].join(' · ');
  }

  function sourceLine(source, original) {
    const sourceName = element('span', '');
    sourceName.append(link(source.label, source.url));
    if (source.alternate) sourceName.append(' · ', link('Read syndicated copy', source.alternate));
    const annotation = [original ? 'Original source' : '', source.type].filter(Boolean).join(' · ');
    const detail = element('span', annotation + ' · ', 'source-annotation');
    detail.append(source.date ? time(source.date) : 'Publication date unspecified');
    sourceName.append(detail);
    return sourceName;
  }

  function card(record) {
    const item = element('article', '', 'library-record');
    const heading = element('h3');
    heading.append(link(record.headline, signalLink(record.id)));
    const context = element('p', '', 'record-context');
    context.append(element('strong', tierLabels[record.editorialTier]), ' · ', describe(record));
    const dates = element('p', '', 'caption record-dates');
    const labels = [
      ['Original source', record.date], [record.milestone.label, record.milestone.date],
      ['Last reviewed', record.reviewed]
    ];
    if (record.lastUpdate) labels.splice(2, 0, ['Last substantive update', record.lastUpdate]);
    labels.forEach(([label, date]) => {
      const part = element('span', label + ' ');
      part.append(time(date));
      dates.append(part);
    });
    const attribution = element('p', status(record) + ' · ', 'caption');
    const source = record.sources[0];
    attribution.append(link(source.publisher, source.url), ' (' + source.type.toLowerCase() + ')');
    item.append(context, heading, element('p', record.takeaway), attribution, dates);
    return item;
  }

  function addGroup(select, label, values) {
    const group = element('optgroup');
    group.label = label;
    values.forEach(item => group.append(new Option(item)));
    select.append(group);
  }

  function initializeLibrary(form) {
    const keyword = byId('keyword');
    const topic = byId('topic');
    const geography = byId('geography');
    const milestone = byId('milestone');
    const sort = byId('sort');
    const results = byId('results');
    const count = byId('result-count');
    const alphabetical = (field, items = records) => [...new Set(items.flatMap(record => record[field]))].sort();

    alphabetical('topic').forEach(value => topic.add(new Option(value)));
    addGroup(geography, 'Regions', alphabetical('regions'));
    addGroup(geography, 'Countries', alphabetical('countries'));
    alphabetical('stageType').forEach(type => {
      addGroup(milestone, type, alphabetical('stage', records.filter(record => record.stageType === type)));
    });

    const searchable = records.map(record => ({
      record,
      text: normalize([record.headline, describe(record), record.status, record.takeaway, record.summary,
        record.evidence, record.why, record.watch, record.limits, record.stage, ...record.countries,
        ...record.regions, ...record.sources.flatMap(source => [source.label, source.type])].join(' '))
    }));

    function render() {
      const terms = normalize(keyword.value).trim().split(/\s+/).filter(Boolean);
      const matching = searchable.filter(({ record, text }) =>
        (!topic.value || record.topic === topic.value) &&
        (!geography.value || record.countries.includes(geography.value) || record.regions.includes(geography.value)) &&
        (!milestone.value || record.stage === milestone.value) &&
        terms.every(term => text.includes(term))
      ).map(({ record }) => record);

      const direction = sort.value === 'oldest' ? 1 : -1;
      matching.sort((a, b) => direction * a.date.localeCompare(b.date) || a.headline.localeCompare(b.headline));
      count.textContent = matching.length + ' of ' + records.length + ' records';
      results.replaceChildren(...matching.map(card));
      if (!matching.length) results.append(element('p', 'No records match. Try another keyword or reset the filters.'));
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

  function section(article, heading, ...body) {
    const block = element('section', '', 'milestone-section');
    block.append(element('h2', heading), ...body);
    article.append(block);
  }

  function evidenceFacts(record) {
    const facts = element('dl', '', 'evidence-facts');
    const entries = [
      ['Milestone', status(record)],
      [record.milestone.label === record.stage ? 'Milestone date' : record.milestone.label, time(record.milestone.date)],
      ['Original source date', time(record.date)],
      ['Last reviewed', time(record.reviewed)]
    ];
    if (record.lastUpdate) entries.splice(3, 0, ['Last substantive update', time(record.lastUpdate)]);
    entries.forEach(([label, value]) => {
      const group = element('div');
      const detail = element('dd');
      detail.append(value);
      group.append(element('dt', label), detail);
      facts.append(group);
    });
    return facts;
  }

  function initializeDetail(article) {
    const id = new URLSearchParams(window.location.search).get('id');
    const record = records.find(item => item.id === id);
    if (!record) {
      const guidance = element('p', 'Choose a record from the ');
      guidance.append(link('Evidence Library', 'market-signals.html#evidence-library'), '.');
      article.replaceChildren(element('h1', 'Record unavailable'), guidance);
      return;
    }

    document.title = record.headline + ' | Digital Market Signals';
    const context = element('p', '', 'record-context');
    context.append(element('strong', tierLabels[record.editorialTier]), ' · ', describe(record));
    article.replaceChildren(context, element('h1', record.headline),
      element('p', record.takeaway, 'lede'), evidenceFacts(record));

    section(article, 'What changed', element('p', record.summary));
    const evidence = element('p', record.evidence + ' ');
    evidence.append(link('See sources', '#sources'));
    section(article, 'Evidence and attribution', evidence);
    section(article, 'Why it matters', element('p', record.why));
    section(article, 'Evidence limits', element('p', record.limits));

    const sources = element('ol', '', 'source-list');
    record.sources.forEach((source, index) => {
      const item = element('li');
      item.id = 'source-' + (index + 1);
      item.append(sourceLine(source, index === 0));
      sources.append(item);
    });
    section(article, 'Sources', sources);
    sources.parentElement.id = 'sources';

    if (record.related?.length) {
      const related = element('ul', '', 'source-list');
      record.related.forEach(({ label, url }) => {
        const item = element('li');
        item.append(link(label, url));
        related.append(item);
      });
      section(article, 'Related analysis', related);
    }

    section(article, 'Next evidence to check', element('p', record.watch));
    const history = element('ol', '', 'source-list');
    record.history.forEach(event => {
      const item = element('li');
      const source = record.sources[event.source];
      item.append(time(event.date), ' · ' + event.text + ' ',
        link(source.publisher + ' source', '#source-' + (event.source + 1)));
      history.append(item);
    });
    section(article, 'Update history', history);
  }

  const library = byId('library-form');
  const detail = byId('signal-detail');
  if (library) initializeLibrary(library);
  if (detail) initializeDetail(detail);
})();
