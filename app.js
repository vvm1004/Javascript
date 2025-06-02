// Chuyển đổi chế độ sáng/tối
const toggleSwitch = document.querySelector('.light-dark-switch input[type="checkbox"]');
document.querySelector(".start-menu").classList.toggle("visible");

function switchMode(event) {
    document.documentElement.setAttribute('data-theme', event.target.checked ? 'dark' : 'light');
}

toggleSwitch.addEventListener('change', switchMode, false);

// Chọn chủ đề quiz
let quizType;
const quizButtons = document.querySelectorAll(".quiz-type");

quizButtons.forEach(button => {
    button.addEventListener("click", () => {
        quizType = button.id;
        questionScreen(quizType);
    });
});

function questionScreen(type) {
    document.querySelector(".start-menu").classList.toggle("visible");
    setSubjectBars(type);
    document.querySelector(".question-screen").classList.toggle("visible");
    getQuiz(type);
}

function setSubjectBars(type) {
    const bars = document.querySelectorAll(".curr-subject");
    bars.forEach(bar => {
        bar.lastElementChild.innerHTML = type;
        const icon = bar.firstElementChild.firstElementChild;
        switch (type) {
            case "HTML":
                icon.src = "./assets/images/icon-html.svg";
                break;
            case "CSS":
                icon.src = "./assets/images/icon-css.svg";
                break;
            case "JavaScript":
                icon.src = "./assets/images/icon-js.svg";
                break;
            default:
                icon.src = "./assets/images/icon-accessibility.svg";
        }
        bar.style.visibility = "visible";
    });
}

// Quản lý quiz
let quizChosen;
let qCount = -1;
let totalQuestions;
let score = 0;
let increment;
const submit = document.querySelector(".submit-answer");

async function getQuiz(type) {
    const response = await fetch('./data.json');
    const data = await response.json();
    quizChosen = data.quizzes.find(quiz => quiz.title === type);
    if (quizChosen) {
        totalQuestions = quizChosen.questions.length;
        document.querySelector(".question-total").textContent = totalQuestions;
        increment = (1 / totalQuestions) * 100;
        makeQuestions(quizChosen);
    }
}

function makeQuestions(quizChoice) {
    qCount++;
    document.querySelector(".question-number").textContent = (qCount + 1);
    document.querySelector(".progress-bar.done").style.width = `${increment * (qCount + 1)}%`;
    submit.textContent = "Submit";

    const options = document.querySelectorAll(".option");
    const question = quizChoice.questions[qCount];
    document.querySelector(".question").textContent = question.question;

    options.forEach((option, index) => {
        option.classList.remove("selected", "invalid", "correct");
        option.innerHTML = `<div class='option-box'>${String.fromCharCode(65 + index)}</div>${question.options[index]}`;
    });
}

const options = document.querySelectorAll(".option");

options.forEach(option => {
    option.addEventListener("click", () => {
        options.forEach(opt => {
            opt.classList.remove("selected");
            opt.firstChild.classList.remove("selected-box");
        });
        option.classList.add("selected");
        option.firstChild.classList.add("selected-box");
    });
});

submit.addEventListener("click", () => {
    const selectedBox = document.querySelector(".selected");
    if (!selectedBox) {
        document.querySelector(".select-prompt").style.visibility = "visible";
        return;
    }

    const answerText = selectedBox.textContent.slice(1);
    selectedBox.classList.remove("selected");
    selectedBox.firstChild.classList.remove("selected-box");

    if (validate(answerText)) {
        if (!selectedBox.classList.contains("correct")) {
            score++;
            selectedBox.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>";
        }
        selectedBox.classList.add("correct");
        selectedBox.firstChild.classList.add("correct-box");
        document.querySelector(".select-prompt").style.visibility = "hidden";
    } else {
        if (!selectedBox.classList.contains("invalid")) {
            selectedBox.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>";
        }
        selectedBox.classList.add("invalid");
        selectedBox.firstChild.classList.add("invalid-box");
        document.querySelector(".select-prompt").style.visibility = "hidden";
    }

    revealAnswers();

    if (qCount >= totalQuestions - 1) {
        submit.textContent = "See Results";
    } else {
        submit.textContent = "Next Question";
    }
});

function revealAnswers() {
    options.forEach(option => {
        const text = option.textContent.slice(1);
        if (validate(text)) {
            if (!option.classList.contains("correct")) {
                option.classList.add("correct");
                option.firstChild.classList.add("correct-box");
                option.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>";
            }
        } else {
            if (!option.classList.contains("invalid")) {
                option.classList.add("invalid");
                option.firstChild.classList.add("invalid-box");
                option.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>";
            }
        }
    });
}

function validate(selected) {
    const question = quizChosen.questions[qCount];
    return question.answer === selected;
}

function showQuizComplete() {
    document.querySelector(".question-screen").classList.toggle("visible");
    document.querySelector(".quiz-complete").classList.toggle("visible");
    document.querySelector(".final-score").textContent = score;
    document.querySelector(".complete-question-total").textContent = totalQuestions;
}

document.querySelector(".restart").addEventListener("click", () => {
    document.querySelector(".quiz-complete").classList.toggle("visible");
    document.querySelector(".start-menu").classList.toggle("visible");
    document.querySelector(".curr-subject").style.visibility = "hidden";
    qCount = -1;
    score = 0;
});
