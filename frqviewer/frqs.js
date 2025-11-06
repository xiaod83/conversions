// frqs.js - Two-pane viewer with sidebar selection
// Use the JSON URL provided by the page (via Liquid) if available,
// otherwise fall back to the local relative path (useful for local dev).
const dataUrl = (typeof window !== 'undefined' && window.FRQ_JSON) ? window.FRQ_JSON : './frqs.json';

(async function init() {
  try {
    const res = await fetch(dataUrl);
    if (!res.ok) throw new Error(`Failed to load frqs.json: ${res.status} ${res.statusText}`);
    const questions = await res.json();

    bootstrapUI(questions);
  } catch (err) {
    console.error(err);
    const canvas = document.getElementById('frq-canvas') || document.getElementById('frq-container');
    if (canvas) canvas.innerHTML = `<p style="color: #b00;">Unable to load questions: ${err.message}</p>`;
  }
})();

function bootstrapUI(questions) {
  // Normalize and index questions
  const normal = questions.map(q => ({
    ...q,
    year: Number(q.year),
    qNum: extractQNum(q.questionImage) || 0
  })).sort((a,b) => a.year - b.year || a.qNum - b.qNum);

  const byYear = groupBy(normal, q => q.year);

  // Elements
  const menu = document.getElementById('frq-menu');
  const filter = document.getElementById('frq-filter');
  const title = document.getElementById('frq-title');
  const subtitle = document.getElementById('frq-subtitle');
  const canvas = document.getElementById('frq-canvas');
  const answerBtn = document.getElementById('answer-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentIndex = -1; // index in normal[]

  // Build sidebar
  renderMenu(byYear, menu, (year, qNum) => {
    const idx = normal.findIndex(q => q.year === year && q.qNum === qNum);
    if (idx >= 0) selectIndex(idx);
  });

  // Filter by year
  filter?.addEventListener('input', () => {
    const query = filter.value.trim();
    const yearFilter = query ? new RegExp(query.replace(/[^0-9]/g,'')) : null;
    for (const section of menu.querySelectorAll('.frq-year')) {
      const y = Number(section.dataset.year);
      section.style.display = yearFilter ? (String(y).match(yearFilter) ? '' : 'none') : '';
    }
  });

  // Navigation
  prevBtn?.addEventListener('click', () => selectIndex(Math.max(0, currentIndex - 1)));
  nextBtn?.addEventListener('click', () => selectIndex(Math.min(normal.length - 1, currentIndex + 1)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });

  answerBtn?.addEventListener('click', () => showAnswer());

  // Select the first item by default
  if (normal.length) selectIndex(0);

  function selectIndex(idx) {
    currentIndex = idx;
    const q = normal[idx];
    // Update header
    title.textContent = `Year ${q.year} — Question ${q.qNum || '?'}`;
    subtitle.textContent = q.topic ? q.topic : 'AP Calculus AB';

    // Update viewer
    renderQuestion(canvas, q, answerBtn);

    // Enable/disable nav
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx >= normal.length - 1;

    // Highlight current in menu
    menu.querySelectorAll('.frq-q-btn[aria-current="true"]').forEach(el => el.setAttribute('aria-current','false'));
    const btn = menu.querySelector(`.frq-q-btn[data-year="${q.year}"][data-qnum="${q.qNum}"]`);
    if (btn) btn.setAttribute('aria-current','true');
  }

  function showAnswer() {
    const q = normal[currentIndex];
    if (!q || !q.answerImage) return;
    const answerImg = canvas.querySelector('img.frq-answer-img');
    if (answerImg) return; // already displayed

    const img = document.createElement('img');
    img.className = 'frq-answer-img';
    img.alt = `Answer ${q.id || ''}`.trim();
    img.src = q.answerImage;
    img.onload = () => img.style.display = '';
    img.onerror = () => {
      img.remove();
      toast(canvas, 'Answer image could not be loaded.');
      answerBtn.disabled = false;
    };
    canvas.querySelector('.frq-img-wrap')?.appendChild(img);
    answerBtn.disabled = true;
  }
}

function renderMenu(byYear, menuEl, onPick) {
  menuEl.innerHTML = '';
  const years = Array.from(byYear.keys()).sort((a,b)=>a-b);
  for (const y of years) {
    const section = document.createElement('details');
    section.className = 'frq-year';
    section.dataset.year = String(y);
    // Expand the most recent year by default
    if (y === years[years.length-1]) section.open = true;

    const sum = document.createElement('summary');
    sum.textContent = String(y);
    section.appendChild(sum);

    const list = document.createElement('div');
    list.className = 'frq-q-list';
    const items = byYear.get(y).slice().sort((a,b)=>a.qNum-b.qNum);
    for (const q of items) {
      const btn = document.createElement('button');
      btn.className = 'frq-q-btn';
      btn.type = 'button';
      btn.textContent = `Q${q.qNum || '?'}`;
      btn.dataset.year = String(y);
      btn.dataset.qnum = String(q.qNum || '');
      btn.addEventListener('click', () => onPick(y, q.qNum));
      list.appendChild(btn);
    }
    section.appendChild(list);
    menuEl.appendChild(section);
  }
}

function renderQuestion(canvas, q, answerBtn) {
  canvas.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'frq-img-wrap';

  const img = document.createElement('img');
  img.alt = `FRQ ${q.id || ''}`.trim();
  img.src = q.questionImage;
  img.onerror = () => {
    wrap.innerHTML = '';
    toast(canvas, 'Question image could not be loaded.');
  };
  wrap.appendChild(img);
  canvas.appendChild(wrap);

  // Answer button state
  if (answerBtn) {
    answerBtn.disabled = !q.answerImage;
  }
}

function extractQNum(url) {
  if (!url) return null;
  const m = String(url).match(/Q(\d+)/i);
  return m ? Number(m[1]) : null;
}

function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const k = keyFn(item);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(item);
  }
  return map;
}

function toast(container, msg) {
  const p = document.createElement('p');
  p.style.color = '#b00';
  p.style.padding = '10px';
  p.textContent = msg;
  container.appendChild(p);
}