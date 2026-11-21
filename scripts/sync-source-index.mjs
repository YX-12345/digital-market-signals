import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const data = new URL('../signals-data.js', import.meta.url);
const page = new URL('../market-signals.html', import.meta.url);
const context = { window: {} };
runInNewContext(readFileSync(data, 'utf8'), context);

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

const records = [...context.window.DMS_SIGNALS].sort((a, b) =>
  b.date.localeCompare(a.date) || a.headline.localeCompare(b.headline));
const rows = records.map(record => {
  const source = record.sources[0];
  return `          <li>${escapeHtml(record.headline)} · <a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a> · <time datetime="${source.date}">${source.date}</time></li>`;
});

const html = readFileSync(page, 'utf8');
const index = /(<ul class="source-list" id="original-sources">\n)[\s\S]*?(\n        <\/ul>)/;
if (!index.test(html)) throw new Error('Original sources list is missing from market-signals.html.');
const generated = html.replace(index, (_, opening, closing) => opening + rows.join('\n') + closing);

if (process.argv.includes('--check')) {
  if (generated !== html) {
    console.error('Original source index is out of date. Run node scripts/sync-source-index.mjs.');
    process.exitCode = 1;
  } else {
    console.log(`Original source index matches all ${records.length} records.`);
  }
} else if (generated !== html) {
  writeFileSync(page, generated);
}
