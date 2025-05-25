import { questions } from "./questions.js";

const container = document.getElementById("quiz-container");
const result = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const submitBtn = document.getElementById("submit-btn");

let current = 0;
const answers = [];

questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.className = "question";
  if (i === 0) div.classList.add("active");
  div.innerHTML = `
    <label>
      <input type="checkbox" id="q${i}" />
      ${q.text}
    </label>
  `;
  container.appendChild(div);
});

function showQuestion(index) {
  const all = document.querySelectorAll(".question");
  all.forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });
  prevBtn.disabled = index === 0;
  nextBtn.style.display = index === questions.length - 1 ? "none" : "inline-block";
  submitBtn.style.display = index === questions.length - 1 ? "inline-block" : "none";
}

nextBtn.onclick = () => {
  current++;
  showQuestion(current);
};

prevBtn.onclick = () => {
  current--;
  showQuestion(current);
};

submitBtn.onclick = () => {
  let ipa = 0;
  let ips = 0;

  questions.forEach((q, i) => {
    const input = document.getElementById(`q${i}`);
    if (input.checked) {
      ipa += q.score.ipa;
      ips += q.score.ips;
    }
  });

  const jurusan = ipa === ips ? 
    "Kamu cocok di IPA atau IPS, tergantung minat lanjutanmu!" :
    `Kamu lebih cocok masuk jurusan ${ipa > ips ? "IPA" : "IPS"} (IPA: ${ipa} vs IPS: ${ips})`;

  result.innerText = jurusan;
  container.style.display = "none";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
  submitBtn.style.display = "none";
};
