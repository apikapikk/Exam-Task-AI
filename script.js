import { questions } from "./questions.js";

const form = document.getElementById("quiz-form");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");

questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <label>
      <input type="checkbox" name="q${i}" />
      ${q.text}
    </label>
  `;
  form.appendChild(div);
});

submitBtn.onclick = () => {
  let ipa = 0;
  let ips = 0;

  questions.forEach((q, i) => {
    const input = document.querySelector(`input[name="q${i}"]`);
    if (input.checked) {
      ipa += q.score.ipa;
      ips += q.score.ips;
    }
  });

  if (ipa === ips) {
    result.innerText = `Kamu cocok di IPA atau IPS, tergantung minat lanjutanmu!`;
  } else {
    const jurusan = ipa > ips ? "IPA" : "IPS";
    result.innerText = `Kamu lebih cocok masuk jurusan ${jurusan} (IPA: ${ipa} vs IPS: ${ips})`;
  }
};
