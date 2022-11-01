let expression = "";
let allowMiniScreenUpdate = false;
const specialNums = ["%", "."];
const operators = ["+", "-", "*", "/"];

function compute(expression) {
  const postfixOrder = translateToPostfixOrder(expression);
  return computeFromPostfixOrder(postfixOrder);
}

function operate(num1, num2, operator) {
  let result;

  switch (operator) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      result = num1 - num2;
      break;
    case '*':
      result = num1 * num2;
      break;
    case '/':
      result = num1 / num2;
      break;
  }

  return precise(result);
}

function computeFromPostfixOrder(postfixOrder) {
  const stack = [];

  for (let i = 0; i < postfixOrder.length; i++) {
    const ele = postfixOrder[i];

    if (isOperand(ele)) {
      stack.push(toNumber(ele));
    } else {
      const num2 = stack.pop();
      const num1 = stack.pop();
      const result = operate(num1, num2, ele);
      stack.push(result);
    }
  }

  return stack[0];
}

function translateToPostfixOrder(expression) {
  const parts = expression.split(" ");
  const stack = [];
  const postfixOrder = [];

  for (let i = 0; i < parts.length; i++) {
    const ele = parts[i];

    if (isOperand(ele)) {
      postfixOrder.push(ele);
    } else {
      while (stack.length !== 0 && precedence(ele) <= precedence(stack[stack.length - 1])) {
        postfixOrder.push(stack.pop());
      }
      stack.push(ele);
    }
  }

  while(stack.length !== 0) postfixOrder.push(stack.pop());

  return postfixOrder;
}

function precedence(operator) {
  switch (operator) {
    case '*': 
    case '/': return 2;
    case '+':
    case '-': return 1;
  }
}

function isOperand(ele) {
  const operators = "*/+-";
  return !operators.includes(ele);
}

function precise(num) {
  const toPrecised = num.toFixed(12);
  return Number(toPrecised);
}

function toNumber(str) {
  if (parseInt(str) === Number(str)) {
    return Number(str);
  } else {
    const toDecimal = str.includes("%")
    ? Number(str.slice(0, str.length - 1)) * 0.01
    : parseFloat(str);
    return precise(toDecimal);
  }
}

function getClassNameBySymbol(symbol) {
  switch (symbol) {
    case 'AC': return 'reset';
    case 'C': return 'delete';
    case '%': return 'percent';
    case '.': return 'decimal';
    case '/': return 'add';
    case '*': return 'multiply';
    case '-': return 'subtract';
    case '+': return 'add';
    case '=': return 'equal';
  }
}

function decimalEnteredOnce() {
  const parts = expression.split(" ");
  const lastArgument = parts[parts.length - 1];

  for (let i = 0; i < lastArgument.length; i++) {
    if (lastArgument[i] === ".") return true;
  }

  return false;
}

function hasNoOperator() {
  const parts = expression.split(" ");
  return (parts.length <= 1 && !parts[0].includes("%"));
}

function updateScreen() {
  const screen = document.getElementById("bigger-text");
  screen.innerText = expression
    .replaceAll("/", "÷")
    .replaceAll("*", "x")
    .trimEnd();
}

function updateMiniScreen() {
  if (!allowMiniScreenUpdate) return false;

  const miniScreen = document.getElementById("smaller-text");
  const bigScreenTextHistory = document.getElementById("bigger-text").textContent;
  isNaN(Number(bigScreenTextHistory))
    ? miniScreen.innerText = bigScreenTextHistory
    : miniScreen.innerText = "Ans = " + bigScreenTextHistory;
}

function handleNumKeys(event) {
  if (expression[expression.length - 1] === "%") return;

  updateMiniScreen();
  allowMiniScreenUpdate = false;
  const number = event.target.dataset.key;
  expression += number;
  updateScreen();
}

function handleSpecialNumKeys(event) {
  const key = event.target.dataset.key;
  const percentagePlacedAfterOperator = key === "%" && operators.includes(expression[expression.length - 2]);
  const percentagePlacedOnEmptyExpression = key === "%" && expression.length === 0;
  const lastInputIsSpecialNumber = specialNums.includes(expression[expression.length - 1]);
  const invalidDecimalPlacement = key === "." && decimalEnteredOnce();

  if ( percentagePlacedAfterOperator || percentagePlacedOnEmptyExpression
    || lastInputIsSpecialNumber || invalidDecimalPlacement)  {
    return;
  }

  updateMiniScreen();
  allowMiniScreenUpdate = false;
  expression += key;
  updateScreen();
}

function handleOperatorKey(event) {
  const operator = event.target.dataset.key;

  if (expression.length === 0 || operators.includes(expression[expression.length - 2])) {
    return;
  }

  updateMiniScreen();
  allowMiniScreenUpdate = false;
  expression += ` ${operator} `;
  updateScreen();
}

function handleEqualButton() {
  if (operators.includes(expression[expression.length - 2]) || hasNoOperator()) {
    return;
  }

  allowMiniScreenUpdate = true;
  const result = compute(expression);
  updateMiniScreen();

  expression = result.toString();
  updateScreen();
  
  expression = "";
}

function handleDelete() {
  const endIndex = expression[expression.length - 1] === " " 
    ? expression.length - 2 
    : expression.length - 1

  updateMiniScreen();
  allowMiniScreenUpdate = false;
  expression = expression.slice(0, endIndex);
  updateScreen();
}

function handleReset() {
  updateMiniScreen();
  allowMiniScreenUpdate = false;
  expression = "";
  updateScreen();
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
  const symbols = ['AC', 'C', '%', '/', '*', '-', '+', '.', '='];
  symbols.forEach(symbol => {
    const symbolButton = document.createElement("button");
    symbolButton.classList.add(getClassNameBySymbol(symbol));
    symbolButton.dataset.key = symbol;

    if (symbol === '/') {
      symbolButton.innerText = "÷";
    } else if (symbol === '*') {
      symbolButton.innerText = 'x';
    } else {
      symbolButton.innerText = symbol;
    }

    document.getElementById("buttons").appendChild(symbolButton);
  });
}

function createButtons() {
  createNumButtons();
  createSymbolButtons();
}

window.addEventListener("DOMContentLoaded", event => {
  createButtons();

  const numKeys = document.querySelectorAll("button.number");
  numKeys.forEach(numKey => numKey.addEventListener("click", handleNumKeys));

  specialNums.forEach(specialNum => {
    const buttonRef = document.querySelector(`button[data-key="${specialNum}"]`);
    buttonRef.addEventListener("click", handleSpecialNumKeys);
  });

  const deleteBtn = document.querySelector("button.delete");
  deleteBtn.addEventListener("click", handleDelete);

  const resetBtn = document.querySelector("button.reset");
  resetBtn.addEventListener("click", handleReset);

  operators.forEach(operator => {
    const buttonRef = document.querySelector(`button[data-key="${operator}"]`);
    buttonRef.addEventListener("click", handleOperatorKey);
  });

  const equalBtn = document.querySelector("button.equal");
  equalBtn.addEventListener("click", handleEqualButton);
});