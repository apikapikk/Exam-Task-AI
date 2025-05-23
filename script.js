import { questions } from "./questions.js";

const quizContainer = document.getElementById("quiz-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const result = document.getElementById("result");

let currentQuestion = 0;
const answers = Array(questions.length).fill(null);

function renderQuestion() {
  const q = questions[currentQuestion];
  quizContainer.innerHTML = `
    <div class="question">
      <p><strong>Pertanyaan ${currentQuestion + 1} dari ${questions.length}:</strong></p>
      <p>${q.text}</p>
      <label><input type="radio" name="answer" value="ya" ${answers[currentQuestion] === true ? "checked" : ""}/> Ya</label><br/>
      <label><input type="radio" name="answer" value="tidak" ${answers[currentQuestion] === false ? "checked" : ""}/> Tidak</label>
    </div>
  `;

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.style.display = currentQuestion === questions.length -1 ? "none" : "inline-block";
  submitBtn.style.display = currentQuestion === questions.length -1 ? "inline-block" : "none";
}

function saveAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return false;
  answers[currentQuestion] = selected.value === "ya";
  return true;
}

prevBtn.addEventListener("click", () => {
  if (!saveAnswer()) {
    alert("Silakan pilih jawaban terlebih dahulu.");
    return;
  }
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (!saveAnswer()) {
    alert("Silakan pilih jawaban terlebih dahulu.");
    return;
  }
  if (currentQuestion < questions.length -1) {
    currentQuestion++;
    renderQuestion();
  }
});

submitBtn.addEventListener("click", () => {
  if (!saveAnswer()) {
    alert("Silakan pilih jawaban terlebih dahulu.");
    return;
  }

  let ipa = 0;
  let ips = 0;
  answers.forEach((ans, i) => {
    if (ans) {
      ipa += questions[i].score.ipa;
      ips += questions[i].score.ips;
    }
  });

  if (ipa === ips) {
    result.innerText = `Kamu cocok di IPA atau IPS, tergantung minat lanjutanmu!`;
  } else {
    const jurusan = ipa > ips ? "IPA" : "IPS";
    result.innerText = `Kamu lebih cocok masuk jurusan ${jurusan} (IPA: ${ipa} vs IPS: ${ips})`;
  }
});

renderQuestion();
