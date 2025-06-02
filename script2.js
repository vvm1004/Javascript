let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let questions = [];
let currentSubject = '';

const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options');
const submitBtn = document.getElementById('submit-btn');
const scoreDisplay = document.getElementById('score');

document.querySelectorAll('.subject-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSubject = btn.dataset.subject;
    loadQuestions();
  });
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('theme--dark');
  document.body.classList.toggle('theme--light');
});

function loadQuestions() {
  fetch('questions.json')
    .then(res => res.json())
    .then(data => {
      questions = data.filter(q => q.subject === currentSubject);
      currentQuestion = 0;
      score = 0;
      startScreen.classList.add('hidden');
      questionScreen.classList.remove('hidden');
      showQuestion();
    });
}

function showQuestion() {
  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  optionsList.innerHTML = '';

  q.options.forEach((opt, index) => {
    const li = document.createElement('li');
    li.textContent = opt;
    li.tabIndex = 0;
    li.addEventListener('click', () => selectOption(index, li));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') selectOption(index, li);
    });
    optionsList.appendChild(li);
  });
}

function selectOption(index, element) {
  selectedAnswer = index;
  document.querySelectorAll('#options li').forEach(li => li.classList.remove('selected'));
  element.classList.add('selected');
}

submitBtn.addEventListener('click', () => {
  if (selectedAnswer === null) {
    alert("Please select an answer.");
    return;
  }

  if (selectedAnswer === questions[currentQuestion].answer) {
    score++;
  }

  selectedAnswer = null;
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  questionScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  scoreDisplay.textContent = `${score}/${questions.length}`;
}

document.getElementById('restart-btn').addEventListener('click', () => {
  resultScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});
