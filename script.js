let expression = "";
let allowMiniScreenUpdate = false;
const errorMessage = "MATH ERROR";

const screen = document.getElementById("bigger-text");
const miniScreen = document.getElementById("smaller-text");
const numKeys = document.querySelectorAll("button.number");
const deleteBtn = document.querySelector("button.delete");
const resetBtn = document.querySelector("button.reset");
const equalBtn = document.querySelector("button.equal");
const specialNums = ["%", "."];
const operators = ["+", "-", "*", "/"];

function getButtonByKey(key) {
  return document.querySelector(`button[data-key="${key}"]`);
}

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

  if (stack[0] > -Infinity && stack[0] < Infinity) {
    return stack[0];
  } else {
    return errorMessage;
  }
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
  let toPrecised = num.toFixed(8);
  if (toPrecised.length >= 12) {
    toPrecised = parseFloat(toPrecised).toPrecision(11);
  }
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
  screen.innerText = expression
    .replaceAll("/", "÷")
    .replaceAll("*", "x")
    .trimEnd();
}

function updateMiniScreen() {
  if (!allowMiniScreenUpdate || screen.textContent === errorMessage) return;

  isNaN(Number(screen.textContent))
    ? miniScreen.innerText = screen.textContent
    : miniScreen.innerText = "Ans = " + screen.textContent;
}

function clearMiniScreen() {
  miniScreen.innerText = "";
}

function handleNumKeys(event) {
  if (expression[expression.length - 1] === "%" || screen.textContent === errorMessage) return;

  updateMiniScreen();
  allowMiniScreenUpdate = false;
  const number = event.target.dataset.key;
  expression += number;
  updateScreen();
}

function handleSpecialNumKeys(event) {
  const key = event.target.dataset.key;
  if (allowMiniScreenUpdate && key === "%" && screen.textContent !== errorMessage) {
    expression = screen.textContent;
  }

  const percentagePlacedAfterOperator = key === "%" && operators.includes(expression[expression.length - 2]);
  const percentagePlacedOnEmptyExpression = key === "%" && expression.length === 0;
  const lastInputIsSpecialNumber = specialNums.includes(expression[expression.length - 1]);
  const invalidDecimalPlacement = key === "." && decimalEnteredOnce();

  if ( percentagePlacedAfterOperator || percentagePlacedOnEmptyExpression
    || lastInputIsSpecialNumber || invalidDecimalPlacement || screen.textContent === errorMessage)  {
    return;
  }

  updateMiniScreen();
  allowMiniScreenUpdate = false;
  expression += key;
  updateScreen();
}

function handleOperatorKey(event) {
  if (allowMiniScreenUpdate && screen.textContent !== errorMessage) {
    expression = screen.textContent;
  }

  const operator = event.target.dataset.key;
  const alreadyPressedOperator = operators.includes(expression[expression.length - 2]);
  if (expression.length === 0 || alreadyPressedOperator || expression === errorMessage) {
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
  clearMiniScreen();
  allowMiniScreenUpdate = false;
  expression = "";
  updateScreen();
}

function keyboardShortcuts(event) {
  let key = event.key;
  if (key === "Enter") {
    key = "=";
  } else if (key === "Backspace") {
    key = "C";
  }

  const button = getButtonByKey(key);
  if (!button) return;

  button.click();
}

window.addEventListener("DOMContentLoaded", event => {
  window.addEventListener("keydown", keyboardShortcuts);
  equalBtn.addEventListener("click", handleEqualButton);
  deleteBtn.addEventListener("click", handleDelete);
  resetBtn.addEventListener("click", handleReset);

  numKeys.forEach(numKey => numKey.addEventListener("click", handleNumKeys));

  specialNums.forEach(specialNum => {
    const buttonRef = getButtonByKey(specialNum);
    buttonRef.addEventListener("click", handleSpecialNumKeys);
  });

  operators.forEach(operator => {
    const buttonRef = getButtonByKey(operator);
    buttonRef.addEventListener("click", handleOperatorKey);
  });
});