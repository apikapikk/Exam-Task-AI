import { questions } from "./questions.js";

const form = document.getElementById("quiz-form");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");

const options = [
  { label: "Sangat Tidak Pernah", value: 1 },
  { label: "Tidak Pernah", value: 2 },
  { label: "Kadang-Kadang", value: 3 },
  { label: "Sering", value: 4 },
  { label: "Sangat Sering", value: 5 },
];

let currentQuestionIndex = 0;
let quizFinished = false;

function renderQuestion(index) {
  form.innerHTML = "";

  // Update progress bar
  const progressPercent = ((index + 1) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  const q = questions[index];
  const div = document.createElement("div");
  div.classList.add("question-card");

  const optionHTML = options.map(opt => {
    const savedValue = localStorage.getItem(`q${index}`);
    const isChecked = savedValue == opt.value ? "checked" : "";
    return `
      <label>
        <input type="radio" name="q${index}" value="${opt.value}" ${isChecked} />
        ${opt.label}
      </label>
    `;
  }).join("");

  div.innerHTML = `
    <p>${q.text}</p>
    ${optionHTML}
  `;

  form.appendChild(div);

  prevBtn.disabled = index === 0;
  nextBtn.style.display = (index === questions.length - 1) ? "none" : "inline-block";
  submitBtn.style.display = (index === questions.length - 1) ? "inline-block" : "none";
  result.innerHTML = "";
}

form.addEventListener("change", e => {
  if (e.target.name.startsWith("q") && !quizFinished) {
    localStorage.setItem(e.target.name, e.target.value);
  }
});

function scaleToFuzzy(val) {
  return (val - 1) / 4;
}

function calculateResult() {
  let ipa = 0, ips = 0;
  let maxIpa = 0, maxIps = 0;

  for (let i = 0; i < questions.length; i++) {
    const val = localStorage.getItem(`q${i}`);
    if (!val) continue;

    const fuzzyVal = scaleToFuzzy(parseInt(val));
    ipa += fuzzyVal * questions[i].score.ipa;
    ips += fuzzyVal * questions[i].score.ips;

    maxIpa += 1 * questions[i].score.ipa; // max skor tiap soal (jika nilai = 1)
    maxIps += 1 * questions[i].score.ips;
  }

  // Hitung persentase
  const ipaPercent = maxIpa === 0 ? 0 : (ipa / maxIpa) * 100;
  const ipsPercent = maxIps === 0 ? 0 : (ips / maxIps) * 100;

  return { ipaPercent, ipsPercent };
}

function renderResultCards(ipaPercent, ipsPercent) {
  result.innerHTML = `
    <div class="result-cards">
      <div class="card ipa-card">
        <h3>IPA</h3>
        <p>${ipaPercent.toFixed(2)}%</p>
      </div>
      <div class="card ips-card">
        <h3>IPS</h3>
        <p>${ipsPercent.toFixed(2)}%</p>
      </div>
    </div>
  `;
}

submitBtn.onclick = (e) => {
  e.preventDefault();

  if (quizFinished) return;

  // Cek semua sudah diisi
  for (let i = 0; i < questions.length; i++) {
    if (!localStorage.getItem(`q${i}`)) {
      alert(`Silakan jawab pertanyaan nomor ${i + 1} terlebih dahulu.`);
      currentQuestionIndex = i;
      renderQuestion(currentQuestionIndex);
      return;
    }
  }

  const { ipaPercent, ipsPercent } = calculateResult();

  renderResultCards(ipaPercent, ipsPercent);

  quizFinished = true;

  // Disable navigasi & form
  form.innerHTML = "";
  progressBar.style.width = "100%";
  prevBtn.disabled = true;
  nextBtn.style.display = "none";
  submitBtn.style.display = "none";

  // Tampilkan tombol ulangi
  const ulangiBtn = document.createElement("button");
  ulangiBtn.textContent = "Ulangi Quiz";
  ulangiBtn.id = "ulangi-btn";
  ulangiBtn.style.marginTop = "1rem";
  ulangiBtn.style.padding = "0.7rem 1.5rem";
  ulangiBtn.style.fontWeight = "600";
  ulangiBtn.style.cursor = "pointer";
  ulangiBtn.style.border = "none";
  ulangiBtn.style.backgroundColor = "#222";
  ulangiBtn.style.color = "#fff";
  ulangiBtn.style.borderRadius = "6px";

  ulangiBtn.onclick = () => {
    quizFinished = false;
    currentQuestionIndex = 0;
    localStorage.clear();
    result.innerHTML = "";
    form.innerHTML = "";
    renderQuestion(currentQuestionIndex);
    prevBtn.disabled = true;
    nextBtn.style.display = "inline-block";
    submitBtn.style.display = "none";
    ulangiBtn.remove();
    progressBar.style.width = "0%";
  };

  result.appendChild(ulangiBtn);
};

nextBtn.onclick = () => {
  if (!localStorage.getItem(`q${currentQuestionIndex}`)) {
    alert("Silakan pilih jawaban sebelum ke soal berikutnya.");
    return;
  }
  currentQuestionIndex++;
  renderQuestion(currentQuestionIndex);
};

prevBtn.onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion(currentQuestionIndex);
  }
};

renderQuestion(currentQuestionIndex);
