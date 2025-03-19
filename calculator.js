const html = document.documentElement;
const body = document.body;
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector("[data-clear]");
const pointButton = document.querySelector("[data-point]");
const equalButton = document.querySelector("[data-equal]");
const previousDisplay = document.querySelector(".previous-screen");
const currentDisplay = document.querySelector(".current-screen");
const backspaceButton = document.querySelector(
  ".material-symbols-outlined.digits"
);
const switchModeBtn = document.querySelector(
  ".toggle-mode .material-symbols-outlined"
);
let isDarkMode = true;
let currentValue = "";
let previousValue = "";
let selectedOperator = null;

//Initialize Display
updateDisplay();

function updateDisplay() {
  currentDisplay.textContent = currentValue;
  previousDisplay.textContent = previousValue + (selectedOperator || "");
}

function calculate() {
  let result;
  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);

  if (isNaN(prev) || isNaN(curr)) return;

  switch (selectedOperator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "x":
      result = prev * curr;
      break;
    case "÷":
      result = curr === 0 ? "ERROR" : prev / curr;
      break;
    case "%":
      result = prev % curr;
      break;
  }

  if (result !== "ERROR") {
    const fixedResult = parseFloat(result.toFixed(4));
    result = fixedResult.toString();
  }

  currentValue = result;
  previousValue = result;
  selectedOperator = null;
}

function handleKeyboardInput(e) {
  const key = e.key;

  // Handle numbers and decimal point
  if (!isNaN(key) || key === ".") {
    if (currentValue.length >= 16) return;

    // Prevent multiple leading zeros
    if (currentValue === "0" && key !== ".") {
      currentValue = key; // Replace 0 instead of appending
    } else {
      currentValue += key;
    }

    updateDisplay();
    return;
  }

  // Handle operators
  if (["+", "-", "*", "/"].includes(key)) {
    if (!currentValue && !previousValue) return; // Ignore if nothing is entered

    // Convert keyboard operators to display-friendly symbols
    const operator = key === "*" ? "x" : key === "/" ? "÷" : key;

    // Case 1: If user enters an operator immediately after another, switch it
    if (!currentValue && previousValue) {
      selectedOperator = operator;
      updateDisplay();
      return;
    }

    // Case 2: If both previous and current values exist, calculate first
    if (previousValue && currentValue && selectedOperator) {
      calculate();
    }

    // Case 3: Use result as first value for new operation after pressing "="
    if (!previousValue && currentValue) {
      previousValue = currentValue;
    }

    selectedOperator = operator;
    currentValue = ""; // Clear for new input
    updateDisplay();
    return;
  }

  // Handle Enter for calculation
  if (key === "Enter" || key === "=") {
    if (!previousValue || !currentValue || !selectedOperator) return;
    calculate();
    previousValue = "";
    selectedOperator = null;
    updateDisplay();
    return;
  }

  // Handle Backspace
  if (key === "Backspace") {
    currentValue = currentValue.slice(0, -1);
    updateDisplay();
    return;
  }

  // Handle Clear (Escape key)
  if (key === "Escape") {
    currentValue = "";
    previousValue = "";
    selectedOperator = null;
    updateDisplay();
    return;
  }
}

window.addEventListener("keydown", handleKeyboardInput);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;

    // Prevent multiple leading zeros
    if (currentValue === "0" && number !== ".") {
      currentValue = number; // Replace 0 instead of appending
    } else {
      if (currentValue.length >= 16) return;
      currentValue += number;
    }

    updateDisplay();
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!currentValue && !previousValue) return;

    // Case 1: If we have a previous value but no current value,
    // we're likely just changing operators
    if (!currentValue && previousValue) {
      selectedOperator = button.dataset.operator;
      updateDisplay();
      return;
    }

    // Case 2: If we have both previous and current values, calculate
    if (previousValue && currentValue && selectedOperator) {
      calculate();
      // After calculation, set up for the next operation
      selectedOperator = button.dataset.operator;
      previousValue = currentValue; // Use the result as the previous value
      currentValue = ""; // Clear current value for new input
      updateDisplay();
      return;
    }

    // Case 3: Normal first-time operator selection
    selectedOperator = button.dataset.operator;
    previousValue = currentValue;
    currentValue = "";
    updateDisplay();
  });
});

equalButton.addEventListener("click", () => {
  if (!previousValue || !currentValue || !selectedOperator) return;
  calculate();
  previousValue = "";
  selectedOperator = null;
  updateDisplay();
});

clearButton.addEventListener("click", () => {
  currentValue = "";
  previousValue = "";
  selectedOperator = null;
  updateDisplay();
});

pointButton.addEventListener("click", () => {
  if (currentValue.includes(".")) return;
  currentValue += pointButton.dataset.point;
  updateDisplay();
});

backspaceButton.addEventListener("click", () => {
  currentValue = currentValue.slice(0, -1);
  updateDisplay();
});

switchModeBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    html.classList.remove("light-theme");
    html.classList.add("dark-theme");
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    switchModeBtn.textContent = "dark_mode";
  } else {
    html.classList.remove("dark-theme");
    html.classList.add("light-theme");
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    switchModeBtn.textContent = "light_mode";
  }
});
