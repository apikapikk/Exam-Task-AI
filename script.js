import { questions } from "./questions.js";

const form = document.getElementById("quiz-form");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");

questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.classList.add("question");
  div.innerHTML = `
    <label for="q${i}">${q.text}</label>
    <div class="slider-group">
      <input type="range" id="q${i}" name="q${i}" min="1" max="5" value="3"/>
      <span class="value-label" id="value${i}">3</span>
    </div>
  `;
  div.querySelector(`input[name="q${i}"]`).addEventListener("input", (e) => {
    document.getElementById(`value${i}`).innerText = e.target.value;
  });
  form.appendChild(div);
});

function scaleToFuzzy(val) {
  return (val - 1) / 4;
}

submitBtn.onclick = (e) => {
  e.preventDefault();
  let ipa = 0, ips = 0;

  questions.forEach((q, i) => {
    const input = document.querySelector(`input[name="q${i}"]`);
    const fuzzyVal = scaleToFuzzy(parseInt(input.value));
    ipa += fuzzyVal * q.score.ipa;
    ips += fuzzyVal * q.score.ips;
  });

  let text = "";
  if (ipa === ips) {
    text = `Kamu cocok di IPA atau IPS, tergantung minatmu!`;
  } else {
    const jurusan = ipa > ips ? "IPA" : "IPS";
    text = `Kamu lebih cocok masuk jurusan <strong>${jurusan}</strong><br />(Skor IPA: ${ipa.toFixed(2)}, IPS: ${ips.toFixed(2)})`;
  }

  result.innerHTML = text;
};
