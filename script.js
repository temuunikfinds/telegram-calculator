const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  console.log("Platform:", tg.platform);
  console.log("Versi Telegram:", tg.version);
}


const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let waitingForNumber = false;

function updateDisplay() {
  display.value = current;
}

function calculate() {
  if (previous === null || operator === null) return;

  const a = Number(previous);
  const b = Number(current);
  let result;

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b === 0) {
        current = "Tidak bisa ÷ 0";
        previous = null;
        operator = null;
        waitingForNumber = true;
        updateDisplay();
        return;
      }
      result = a / b;
      break;
  }

  current = String(Number(result.toPrecision(12)));
  previous = null;
  operator = null;
  waitingForNumber = true;
  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    const number = button.dataset.number;

    if (waitingForNumber || current === "Tidak bisa ÷ 0") {
      current = number === "." ? "0." : number;
      waitingForNumber = false;
    } else if (number !== "." || !current.includes(".")) {
      current = current === "0" && number !== "."
        ? number
        : current + number;
    }

    updateDisplay();
    return;
  }

  if (button.dataset.operator) {
    if (current === "Tidak bisa ÷ 0") return;

    if (previous !== null && !waitingForNumber) {
      calculate();
    }

    previous = current;
    operator = button.dataset.operator;
    waitingForNumber = true;
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      current = "0";
      previous = null;
      operator = null;
      waitingForNumber = false;
      updateDisplay();
      break;

    case "delete":
      if (waitingForNumber || current === "Tidak bisa ÷ 0") {
        current = "0";
        waitingForNumber = false;
      } else {
        current = current.length > 1
          ? current.slice(0, -1)
          : "0";
      }
      updateDisplay();
      break;

    case "equals":
      calculate();
      break;
  }
});
