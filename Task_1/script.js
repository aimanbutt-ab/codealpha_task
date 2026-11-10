
const result = document.getElementById("result");
const history = document.getElementById("history");
const preview = document.getElementById("preview");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentValue = "0";
let previousValue = "";
let operator = null;
let shouldReset = false;

function updateDisplay() {
    result.textContent = currentValue;

    if (operator !== null && previousValue !== "") {
        history.textContent =
            `${previousValue} ${operator} ${currentValue}`;

        const answer = calculate(
            Number(previousValue),
            Number(currentValue),
            operator
        );

        preview.textContent = Number.isFinite(answer)
            ? `= ${formatNumber(answer)}`
            : "";
    } else {
        history.textContent = "Ready to calculate";
        preview.textContent = "";
    }
}

// Format numbers
function formatNumber(number) {
    if (!Number.isFinite(number)) return "Error";

    return Number(number.toPrecision(12)).toString();
}

// Add numbers
function addNumber(number) {
    if (currentValue === "Error") clearCalculator();

    if (shouldReset) {
        currentValue = number;
        shouldReset = false;
    } else {
        if (currentValue.length >= 15) return;

        currentValue = currentValue === "0"
            ? number
            : currentValue + number;
    }

    updateDisplay();
}

// Decimal point
function addDecimal() {
    if (shouldReset) {
        currentValue = "0";
        shouldReset = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

// Arithmetic operations
function calculate(first, second, selectedOperator) {

    switch (selectedOperator) {
        case "+":
            return first + second;

        case "−":
            return first - second;

        case "×":
            return first * second;

        case "÷":
            return second === 0
                ? NaN
                : first / second;

        default:
            return second;
    }
}

// Select operator
function chooseOperator(selectedOperator) {

    if (currentValue === "Error") return;

    if (operator !== null && !shouldReset) {
        calculateResult();
    }

    previousValue = currentValue;
    operator = selectedOperator;
    shouldReset = true;

    updateDisplay();
}

// Show final result
function calculateResult() {

    if (operator === null || previousValue === "") return;

    const first = Number(previousValue);
    const second = Number(currentValue);

    const answer = calculate(first, second, operator);

    history.textContent =
        `${previousValue} ${operator} ${currentValue} =`;

    if (!Number.isFinite(answer)) {
        currentValue = "Error";
    } else {
        currentValue = formatNumber(answer);
    }

    previousValue = "";
    operator = null;
    shouldReset = true;

    result.textContent = currentValue;
    preview.textContent = "";
}

// Clear calculator
function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    operator = null;
    shouldReset = false;

    history.textContent = "Ready to calculate";
    updateDisplay();
}

// Delete last digit
function deleteNumber() {
    if (currentValue === "Error" || shouldReset) {
        currentValue = "0";
        shouldReset = false;
    } else {
        currentValue = currentValue.length > 1
            ? currentValue.slice(0, -1)
            : "0";

        if (currentValue === "-") currentValue = "0";
    }

    updateDisplay();
}

// Percentage
function percentage() {
    if (currentValue === "Error") return;

    currentValue = formatNumber(Number(currentValue) / 100);
    shouldReset = false;

    updateDisplay();
}

// Positive / Negative
function changeSign() {
    if (currentValue === "Error" || currentValue === "0") return;

    currentValue = currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;

    updateDisplay();
}

// Number button events
numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        addNumber(button.dataset.number);
    });
});

// Operator button events
operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

// Other button events
actionButtons.forEach(button => {
    button.addEventListener("click", () => {

        const action = button.dataset.action;

        switch (action) {
            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteNumber();
                break;

            case "percent":
                percentage();
                break;

            case "decimal":
                addDecimal();
                break;

            case "sign":
                changeSign();
                break;

            case "calculate":
                calculateResult();
                break;
        }
    });
});

// Keyboard support
document.addEventListener("keydown", event => {

    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        addNumber(key);
    }

    else if (key === ".") {
        addDecimal();
    }

    else if (key === "+") {
        chooseOperator("+");
    }

    else if (key === "-") {
        chooseOperator("−");
    }

    else if (key === "*") {
        chooseOperator("×");
    }

    else if (key === "/") {
        event.preventDefault();
        chooseOperator("÷");
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    }

    else if (key === "Backspace") {
        deleteNumber();
    }

    else if (key === "Escape") {
        clearCalculator();
    }

    else if (key === "%") {
        percentage();
    }
});

// Initial display
updateDisplay();
