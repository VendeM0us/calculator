function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function operate(num1, num2, operator) {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
  }
}

function getClassNameBySymbol(symbol) {
  switch (symbol) {
    case 'AC': return 'reset';
    case 'C': return 'delete';
    case '%': return 'percent';
    case '÷': return 'divide';
    case 'x': return 'multiply';
    case '-': return 'subtract';
    case '+': return 'add';
    case '.': return 'decimal';
    case '=': return 'equal';
  }
}

function createNumButtons() {
  for (let numKey = 0; numKey <= 9; numKey++) {
    const numButton = document.createElement("button");
    numButton.classList.add("number");
    numButton.dataset.key = numKey;
    numButton.innerText = numKey;
    document.getElementById("buttons").appendChild(numButton);
  }
}

function createSymbolButtons() {
  const symbols = ['AC', 'C', '%', '÷', 'x', '-', '+', '.', '='];
  symbols.forEach(symbol => {
    const symbolButton = document.createElement("button");
    symbolButton.classList.add(getClassNameBySymbol(symbol));
    symbolButton.dataset.key = symbol;
    symbolButton.innerText = symbol;
    document.getElementById("buttons").appendChild(symbolButton);
  });
}

function createButtons() {
  createNumButtons();
  createSymbolButtons();
}

window.addEventListener("DOMContentLoaded", event => {
  createButtons();
})