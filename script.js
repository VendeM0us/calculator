function compute(expression) {
  const postfixOrder = translateToPostfixOrder(expression);
  return computeFromPostfixOrder(postfixOrder);
}

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
      const precise = result.toPrecision(12);
      stack.push(Number(precise));
    }
  }

  return stack[0];
}

function toNumber(str) {
  if (str.includes("%")) {
    const toDecimal = Number(str.slice(0, str.length - 1)) * 0.01;
    const precise = toDecimal.toPrecision(12);
    return Number(precise);
  } else if (parseInt(str) === Number(str)) {
    return Number(str);
  } else {
    const precise = parseFloat(str).toPrecision(12);
    return Number(precise);
  }
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

function getClassNameBySymbol(symbol) {
  switch (symbol) {
    case 'AC': return 'reset';
    case 'C': return 'delete';
    case '%': return 'percent';
    case '/': return 'divide';
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
  const symbols = ['AC', 'C', '%', '/', 'x', '-', '+', '.', '='];
  symbols.forEach(symbol => {
    const symbolButton = document.createElement("button");
    symbolButton.classList.add(getClassNameBySymbol(symbol));
    symbolButton.dataset.key = symbol;
    symbol === '/' ? symbolButton.innerText = '÷' : symbolButton.innerText = symbol;
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