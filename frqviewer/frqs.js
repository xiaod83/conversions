// frqs.js
fetch('frqviewer/frqs.json')
  .then(res => res.json())
  .then(questions => {
    const container = document.getElementById("frq-container");
    questions.forEach(q => {
      // Question image
      const questionImg = document.createElement("img");
      questionImg.src = q.questionImage;
      questionImg.alt = `FRQ ${q.id}`;
      questionImg.style.maxWidth = "100%";
      container.appendChild(questionImg);

      // Show answer button
      const answerBtn = document.createElement("button");
      answerBtn.textContent = "Show Answer";
      container.appendChild(answerBtn);

      answerBtn.addEventListener("click", () => {
        const answerImg = document.createElement("img");
        answerImg.src = q.answerImage;
        answerImg.alt = `Answer ${q.id}`;
        answerImg.style.maxWidth = "100%";
        container.appendChild(answerImg);
        answerBtn.disabled = true; // prevent multiple clicks
      });

      // Optional separator
      const hr = document.createElement("hr");
      container.appendChild(hr);
    });
  });
