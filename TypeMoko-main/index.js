import { texts } from "./sentences.js";

const inputEl = document.querySelector(".input");
const sentenceContainer = document.querySelector(".sentences"); // sentence element
// Timer Elements
const timerEl = document.querySelector(".timer");
const errorEl = document.querySelector(".errorEl");
// Buttons Elements
const start = document.querySelector(".start");
const reset = document.querySelector(".reset");
const change = document.querySelector(".change");
// Record Elements
const table = document.querySelector("table");
// Modal Elements
const closeWelcome = document.querySelector(".fa-xmark");
const modalSection = document.querySelector(".modalSection");
const reportForm = document.querySelector(".reportsForm");
const closeReport = document.querySelector(".fa-circle-xmark");
const reportBtn = document.querySelector(".fa-bug");

// timer
let paused = true;
let seconds = 30;

let index = 0; // counting index
let errors = 0; // Error count
let correct = 0;
let wordCount = 0;
let guideIndex = 0; // the guide when typing

let span; // words container that has been splitted
let timeInterval;

start.addEventListener("click", () => {
    inputEl.focus();

    if (paused) {
        paused = false;
        start.style.opacity = 0.5;
        change.style.opacity = 0.5;
        timer();

        // show the text cursor / guide
        sentenceContainer.querySelectorAll("span")[0].className =
            "inputed-letter";
    }
});

reset.addEventListener("click", () => {
    if (!paused) {
        resetGame();
    }
    return;
});

change.addEventListener("click", () => {
    if (paused) {
        sentenceContainer.innerHTML = "";
        randomText();
    }
});

// Manually focus the input element
document.addEventListener("click", () => {
    if (!paused) {
        inputEl.focus();
    }
});

function randomText() {
    const randomNum = Math.floor(Math.random() * texts.length);
    texts[randomNum]
        .toLowerCase()
        .split("")
        .forEach((txt) => {
            sentenceContainer.innerHTML += `<span>${txt}</span>`;
        });
}

function checkInput() {
    inputEl.addEventListener("input", (e) => {
        span = sentenceContainer.querySelectorAll("span");

        const inputs = e.target.value.split("");
        if (inputs[index] == span[index].innerText) {
            span[index].style.color = "#FE9700";
            // span[index].className = "inputed-letter";
            correct++;
        } else {
            span[index].style.color = "red";
            // span[index].className = "inputed-letter";
            errors++;
            errorEl.textContent = `Errors: ${errors}`;
        }

        // Stop the function of backspace key
        onkeydown = (event) => {
            if (event.key === "Backspace") {
                event.preventDefault();
                return false;
            } else if (event.key === " ") {
                wordCount++;
            }
        };

        index++;

        if (inputs.length < span.length) {
            addGuide();
            removeGuide();
        } else if (inputs.length == span.length) {
            renderRecord();
            resetGame();
        }
    });
}

randomText();
checkInput();

function timer() {
    if (!paused) {
        timeInterval = setInterval(() => {
            seconds--;
            timerEl.textContent = `Time: ${seconds}s`;

            if (seconds == 0) {
                renderRecord();
                resetGame();
            }
        }, 1000);
    }
}

function renderRecord() {
    document.querySelector(".notice").innerHTML = "";

    let accuracy = Math.floor((correct / span.length) * 100);

    const tr = document.createElement("tr");
    tr.innerHTML += `
    <td>${errors}</td>
    <td>${accuracy}%</td>
    <td>${wordCount * 2} WPM</td>
    `;
    table.appendChild(tr);
}

function resetGame() {
    inputEl.blur();
    inputEl.value = "";

    // Reset Timer
    paused = true;
    seconds = 30;
    timerEl.textContent = `Time: 30s`;
    clearInterval(timeInterval);

    // Others
    index = 0;
    errors = 0;
    correct = 0;
    wordCount = 0;
    guideIndex = 0;
    start.style.opacity = 1;
    change.style.opacity = 1;
    errorEl.textContent = `Errors: 0`;
    sentenceContainer.innerHTML = "";
    randomText();
}

// Close button for welcome modal
closeWelcome.addEventListener("click", () => {
    modalSection.classList.add("hideModal");
});

reportBtn.addEventListener("click", () => {
    reportForm.classList.add("showReport");
});

closeReport.addEventListener("click", () => {
    reportForm.classList.remove("showReport");
});

function addGuide() {
    if (!paused) {
        guideIndex++;
        span[guideIndex].className = "inputed-letter";
    }
}

function removeGuide() {
    if (!paused) {
        span[guideIndex - 1].className = " ";
    }
}
