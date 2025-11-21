// Accessibility helper: focus outline for keyboard nav
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
});
document.addEventListener('mousedown', () => document.documentElement.classList.remove('user-is-tabbing'));

// FRQ Viewer Logic
const dataUrl = '/frqviewer/frqs.json';

(async function init() {
  // Only run if we are on the FRQ page
  const app = document.getElementById('frq-app');
  if (!app) return;

  try {
    const res = await fetch(dataUrl);
    if (!res.ok) throw new Error(`Failed to load frqs.json: ${res.status} ${res.statusText}`);
    const questions = await res.json();
    
    console.log(`Loaded ${questions.length} questions`);
    bootstrapUI(questions);
  } catch (err) {
    console.error(err);
    const canvas = document.getElementById('frq-canvas');
    if (canvas) canvas.innerHTML = `<p style="color: #b00;">Unable to load questions: ${err.message}</p>`;
  }
})();

function bootstrapUI(questions) {
  // Normalize and index questions - extract question number from URL
  const normal = questions.map(q => {
    const qNum = extractQNum(q.questionImage);
    return {
      ...q,
      qNum: qNum || 0
    };
  });

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
  let answerVisible = false;

  // Build sidebar
  renderMenu(byYear, menu, (year, qNum) => {
    const idx = normal.findIndex(q => q.year === year && q.qNum === qNum);
    if (idx >= 0) selectIndex(idx);
  });

  // Filter by year
  filter?.addEventListener('input', () => {
    const query = filter.value.trim();
    const yearFilter = query ? new RegExp(query.replace(/[^0-9B]/gi,''), 'i') : null;
    for (const section of menu.querySelectorAll('.frq-year')) {
      const y = section.dataset.year;
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

  answerBtn?.addEventListener('click', () => toggleAnswer());

  // Select the first item by default
  if (normal.length) selectIndex(0);

  function selectIndex(idx) {
    currentIndex = idx;
    const q = normal[idx];
    answerVisible = false;
    
    // Update header
    const isFormB = q.year.includes('B');
    const formLabel = isFormB ? ' (Form B)' : '';
    title.textContent = `${q.year}${formLabel} — Question ${q.qNum || '?'}`;
    subtitle.textContent = q.topic ? q.topic : 'AP Calculus AB';

    // Update viewer
    renderQuestion(canvas, q, answerBtn);

    // Enable/disable nav
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx >= normal.length - 1;

    // Update button text with arrows
    prevBtn.innerHTML = '← Previous';
    nextBtn.innerHTML = 'Next →';

    // Highlight current in menu
    menu.querySelectorAll('.frq-q-btn[aria-current="true"]').forEach(el => el.setAttribute('aria-current','false'));
    const btn = menu.querySelector(`.frq-q-btn[data-year="${q.year}"][data-qnum="${q.qNum}"]`);
    if (btn) btn.setAttribute('aria-current','true');
  }

  function toggleAnswer() {
    const q = normal[currentIndex];
    if (!q) return;
    
    if (!q.answerImage || q.answerImage.trim() === '') return;
    
    const wrap = canvas.querySelector('.frq-img-wrap');
    if (!wrap) return;
    
    const answerImg = wrap.querySelector('img.frq-answer-img');
    if (!answerImg) {
      // Create answer image if it doesn't exist
      const img = document.createElement('img');
      img.className = 'frq-answer-img';
      img.alt = `Answer for ${q.year} Question ${q.qNum}`;
      img.src = q.answerImage;
      img.onerror = () => {
        toast(canvas, `Could not load answer image.`);
        answerBtn.disabled = true;
        answerBtn.textContent = 'Answer Unavailable';
      };
      wrap.appendChild(img);
      answerVisible = true;
      answerBtn.textContent = 'Hide Answer';
    } else {
      // Toggle visibility
      answerVisible = !answerVisible;
      if (answerVisible) {
        answerImg.classList.remove('hidden');
        answerBtn.textContent = 'Hide Answer';
      } else {
        answerImg.classList.add('hidden');
        answerBtn.textContent = 'Show Answer';
      }
    }
  }
}

function renderMenu(byYear, menuEl, onPick) {
  menuEl.innerHTML = '';
  const years = Array.from(byYear.keys()).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b);
  });
  
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
    const items = byYear.get(y).slice().sort((a,b) => a.qNum - b.qNum);
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
  img.alt = `FRQ ${q.year} Question ${q.qNum}`;
  img.src = q.questionImage;
  img.onerror = () => {
    wrap.innerHTML = '';
    toast(canvas, 'Question image could not be loaded.');
  };
  wrap.appendChild(img);
  canvas.appendChild(wrap);

  // Answer button state
  if (answerBtn) {
    const hasAnswer = q.answerImage && typeof q.answerImage === 'string' && q.answerImage.trim().length > 0;
    answerBtn.disabled = !hasAnswer;
    answerBtn.textContent = 'Show Answer';
    answerBtn.title = hasAnswer ? 'Click to show answer' : 'Answer not available';
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
