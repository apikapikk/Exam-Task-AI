import { questions } from "./questions.js";

document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("question-card");
  const result = document.getElementById("result");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  let currentQuestion = 0;
  const answers = [];

  function renderQuestion(index) {
    const q = questions[index];
    card.innerHTML = `
      <div class="question">
        <p>${index + 1}. ${q.text}</p>
        <div class="options">
          <label><input type="radio" name="answer" value="1" /> Ya</label>
          <label><input type="radio" name="answer" value="0" /> Tidak</label>
        </div>
      </div>
    `;

    // Pre-select if already answered
    if (answers[index] !== undefined) {
      const inputs = document.getElementsByName("answer");
      inputs.forEach((input) => {
        if (input.value == answers[index]) input.checked = true;
      });
    }
  }

  function calculateResult() {
    let ipa = 0;
    let ips = 0;

    answers.forEach((ans, i) => {
      const val = parseInt(ans);
      const weight = val; // 1 jika Ya, 0 jika Tidak
      ipa += weight * questions[i].score.ipa;
      ips += weight * questions[i].score.ips;
    });

    let final = "";
    if (ipa === ips) {
      final = `Kamu cocok di IPA atau IPS, tergantung minatmu!`;
    } else {
      const jurusan = ipa > ips ? "IPA" : "IPS";
      final = `Kamu lebih cocok masuk jurusan <strong>${jurusan}</strong><br />(Skor IPA: ${ipa.toFixed(2)}, IPS: ${ips.toFixed(2)})`;
    }

    card.style.display = "none";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    result.innerHTML = final;
  }

  renderQuestion(currentQuestion);

  nextBtn.onclick = () => {
    const selected = document.querySelector("input[name='answer']:checked");
    if (!selected) return alert("Pilih jawaban terlebih dahulu!");

    answers[currentQuestion] = selected.value;

    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion(currentQuestion);
      prevBtn.disabled = false;
    } else {
      calculateResult();
    }
  };

  prevBtn.onclick = () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion(currentQuestion);
      nextBtn.innerText = "Berikutnya";
    }

    if (currentQuestion === 0) prevBtn.disabled = true;
  };
});
