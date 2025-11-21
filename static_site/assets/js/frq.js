// Accessibility helper: focus outline for keyboard nav
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
});
document.addEventListener('mousedown', () => document.documentElement.classList.remove('user-is-tabbing'));

// FRQ Viewer Logic
const dataUrl = 'frqviewer/frqs.json';

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
  const yearSelect = document.getElementById('frq-year-select');
  const qList = document.getElementById('frq-question-list');
  const title = document.getElementById('frq-title');
  const subtitle = document.getElementById('frq-subtitle');
  const canvas = document.getElementById('frq-canvas');
  const answerBtn = document.getElementById('answer-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentIndex = -1; // index in normal[]
  let answerVisible = false;

  // Initialize Toolbar
  const years = Array.from(byYear.keys()).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (numA !== numB) return numB - numA; // Descending order
    return b.localeCompare(a);
  });

  // Populate Year Dropdown
  years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });

  // Handle Year Change
  yearSelect.addEventListener('change', () => {
    renderQuestionButtons(yearSelect.value);
    // Select first question of that year
    const firstQ = byYear.get(yearSelect.value)[0];
    const idx = normal.indexOf(firstQ);
    if (idx >= 0) selectIndex(idx);
  });

  function renderQuestionButtons(year) {
    qList.innerHTML = '';
    const items = byYear.get(year).slice().sort((a,b) => a.qNum - b.qNum);
    
    items.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'frq-q-btn';
        btn.textContent = q.qNum;
        btn.dataset.idx = normal.indexOf(q);
        btn.addEventListener('click', () => selectIndex(normal.indexOf(q)));
        qList.appendChild(btn);
    });
  }

  // Navigation
  prevBtn?.addEventListener('click', () => selectIndex(Math.max(0, currentIndex - 1)));
  nextBtn?.addEventListener('click', () => selectIndex(Math.min(normal.length - 1, currentIndex + 1)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });

  answerBtn?.addEventListener('click', () => toggleAnswer());

  // Initial Render
  if (years.length > 0) {
      renderQuestionButtons(years[0]);
      if (normal.length) selectIndex(0);
  }

  function selectIndex(idx) {
    currentIndex = idx;
    const q = normal[idx];
    answerVisible = false;
    
    // Sync Dropdown if needed (e.g. if using Prev/Next across years)
    if (yearSelect.value !== q.year) {
        yearSelect.value = q.year;
        renderQuestionButtons(q.year);
    }

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

    // Highlight current button
    const buttons = qList.querySelectorAll('.frq-q-btn');
    buttons.forEach(b => {
        if (parseInt(b.dataset.idx) === idx) {
            b.setAttribute('aria-current', 'true');
        } else {
            b.setAttribute('aria-current', 'false');
        }
    });
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

// Removed renderMenu function as it is no longer used

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
