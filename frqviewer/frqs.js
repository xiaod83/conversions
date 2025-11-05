// frqs.js
// Use the JSON URL provided by the page (via Liquid) if available,
// otherwise fall back to the local relative path (useful for local dev).
const dataUrl = (typeof window !== 'undefined' && window.FRQ_JSON) ? window.FRQ_JSON : './frqs.json';

fetch(dataUrl)
  .then(res => {
    if (!res.ok) throw new Error(`Failed to load frqs.json: ${res.status} ${res.statusText}`);
    return res.json();
  })
  .then(questions => {
    const container = document.getElementById("frq-container");
    questions.forEach(q => {
      const wrapper = document.createElement('div');
      wrapper.className = 'frq-item';

      // Question image
      const questionImg = document.createElement("img");
      questionImg.src = q.questionImage;
      questionImg.alt = `FRQ ${q.id}`;
      questionImg.style.maxWidth = "100%";

      questionImg.onerror = () => {
        questionImg.style.display = 'none';
        const msg = document.createElement('p');
        msg.style.color = '#b00';
        msg.textContent = 'Question image could not be loaded.';
        wrapper.appendChild(msg);
      };

      wrapper.appendChild(questionImg);

      // Show answer button only if answerImage exists
      if (q.answerImage) {
        const answerBtn = document.createElement("button");
        answerBtn.textContent = "Show Answer";
        wrapper.appendChild(answerBtn);

        answerBtn.addEventListener("click", () => {
          if (wrapper.querySelector('.answer-image')) return;

          const answerImg = document.createElement("img");
          answerImg.className = 'answer-image';
          answerImg.src = q.answerImage;
          answerImg.alt = `Answer ${q.id}`;
          answerImg.style.maxWidth = "100%";

          answerImg.onerror = () => {
            const msg = document.createElement('p');
            msg.style.color = '#b00';
            msg.textContent = 'Answer image could not be loaded.';
            wrapper.appendChild(msg);
          };

          wrapper.appendChild(answerImg);
          answerBtn.disabled = true;
        });
      } else {
        const hint = document.createElement('p');
        hint.style.fontStyle = 'italic';
        hint.textContent = 'No answer image provided for this question.';
        wrapper.appendChild(hint);
      }

      wrapper.appendChild(document.createElement("hr"));
      container.appendChild(wrapper);
    });
  })
  .catch(err => {
    console.error(err);
    const container = document.getElementById("frq-container");
    container.innerHTML = `<p style="color: #b00;">Unable to load questions: ${err.message}</p>`;
  });