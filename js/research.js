(async function () {
  const panel = document.getElementById('panel-research');
  if (!panel) return;

  panel.innerHTML = '<p class="muted" style="padding:24px 0">Loading…</p>';

  let text;
  try {
    const res = await fetch('content/research.md');
    if (!res.ok) throw new Error('fetch failed');
    text = await res.text();
  } catch {
    panel.innerHTML = '<p class="muted">Could not load research content.</p>';
    return;
  }

  panel.innerHTML = renderResearch(text);

  const count = panel.querySelectorAll('.pubs li').length;
  const badge = document.querySelector('.tab[data-tab="research"] .count');
  if (badge) badge.textContent = count;
})();

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseInline(raw) {
  // Escape HTML first, then apply markdown-style inline patterns.
  // **name** → author highlight span, *text* → italic.
  return esc(raw)
    .replace(/\*\*(.+?)\*\*/g, '<span class="me">$1</span>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function renderPaper(block) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) return '';

  const titleLine = lines[0];
  let titleHtml;
  const m = titleLine.match(/^\[(.+)\]\((.+)\)$/);
  if (m) {
    titleHtml = `<a href="${esc(m[2])}" target="_blank" rel="noopener">${esc(m[1])}</a>`;
  } else {
    titleHtml = esc(titleLine);
  }

  const data = { badges: [], venues: [], links: [] };

  for (const line of lines.slice(1)) {
    const ci = line.indexOf(':');
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim().toLowerCase();
    const val = line.slice(ci + 1).trim();

    if (key === 'badges') {
      data.badges = val.split('|').map(b => {
        const bi = b.trim().indexOf(':');
        return bi === -1
          ? { cls: b.trim(), label: b.trim() }
          : { cls: b.trim().slice(0, bi), label: b.trim().slice(bi + 1) };
      });
    } else if (key === 'venue') {
      data.venues.push(val);
    } else if (key === 'link') {
      const pi = val.indexOf('|');
      if (pi !== -1) {
        data.links.push({ label: val.slice(0, pi).trim(), url: val.slice(pi + 1).trim() });
      }
    } else {
      data[key] = val;
    }
  }

  const badgesHtml = data.badges.map(b =>
    `<span class="badge ${esc(b.cls)}">${esc(b.label)}</span>`).join('');
  const yearHtml = data.year ? `<span class="pub-year">${esc(data.year)}</span>` : '';
  const authorsHtml = data.authors ? parseInline(data.authors) : '';
  const venuesHtml = data.venues.map(v => `<p class="pub-venue">${parseInline(v)}</p>`).join('');
  const linksHtml = data.links.map(l =>
    `<a class="pub-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');

  return `
    <li>
      <div class="pub-meta">${badgesHtml}${yearHtml}</div>
      <div>
        <p class="pub-title">${titleHtml}</p>
        ${authorsHtml ? `<p class="pub-authors">${authorsHtml}</p>` : ''}
        ${venuesHtml}
        ${linksHtml ? `<div class="pub-links">${linksHtml}</div>` : ''}
      </div>
    </li>`;
}

function renderResearch(md) {
  return md.split(/^## /m)
    .filter(s => s.trim())
    .map(block => {
      const lines = block.split('\n');
      const title = lines[0].trim();
      const rest = lines.slice(1).join('\n');

      const kickerMatch = rest.match(/^kicker:\s*(.+)$/m);
      const kicker = kickerMatch ? kickerMatch[1].trim() : '';

      const papers = rest.split(/^### /m).slice(1);
      const pubsHtml = papers.map(renderPaper).join('');

      return `
<div class="section">
  <div class="section-head">
    <h2>${esc(title)}<span class="accent">.</span></h2>
    ${kicker ? `<span class="section-kicker">${esc(kicker)}</span>` : ''}
  </div>
  <ul class="pubs">${pubsHtml}
  </ul>
</div>`;
    }).join('\n');
}
