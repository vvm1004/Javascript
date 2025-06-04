//Switch Dark/Light Mode
const toggle = document.querySelector('.theme-toggle__checkbox');

if (toggle) {
  toggle.addEventListener('change', function () {
    if (this.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  });
}
// ----------------------------
// Lấy DOM element cần thiết
const startMenu = document.querySelector('.start-menu');
const quizSection = document.querySelector('.quiz');
const quizComplete = document.querySelector('.quiz-complete');

const questionNumberEl = document.querySelector('.quiz__question-number');
const questionTotalEl = document.querySelector('.quiz__question-total');
const questionTextEl = document.querySelector('.quiz__question-text');
const optionsButtons = document.querySelectorAll('.quiz__option');
const submitBtn = document.querySelector('.quiz__submit');
const promptEl = document.querySelector('.quiz__prompt');

const finalScoreEl = document.querySelector('.quiz-complete__final-score');
const finalSubjectEl = document.querySelector('.quiz-complete__subject-chosen');
const finalSubjectImg = document.querySelector('.quiz-complete__subject-img');
const finalQuestionTotalEl = document.querySelector('.quiz-complete__question-total');

const startButtons = document.querySelectorAll('.start-menu__button');
const themeToggleObject = document.querySelector('.theme-toggle__object');
const themeToggleImg = themeToggleObject.querySelector('img.subject-img');
const themeToggleHeading = themeToggleObject.querySelector('h2');

const progressBarFilled = document.querySelector('.quiz__progress-bar--filled');


let questionsData = {};
let currentSubject = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// Load data from question.json
async function loadQuestions() {
  try {
    const res = await fetch('./data/questions.json');
    questionsData = await res.json();
  } catch (error) {
    console.error('Failed to load questions:', error);
  }
}

// Bắt đầu load dữ liệu và gán sự kiện cho các nút chọn chủ đề
async function init() {
  await loadQuestions();

  startButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.textContent.trim();
      startQuiz(subject);
    });
  });

  // Khởi tạo quiz với chủ đề được chọn
  function startQuiz(subject) {
    themeToggleObject.style.display = 'flex';

    let imgSrc = '';
    switch (subject.toLowerCase()) {
      case 'html':
        imgSrc = './assets/images/icon-html.svg';
        themeToggleImg.style.setProperty('background-color', 'var(--html-bg)');
        break;
      case 'css':
        imgSrc = './assets/images/icon-css.svg';
        themeToggleImg.style.setProperty('background-color', 'var(--css-bg)');
        break;
      case 'javascript':
        imgSrc = './assets/images/icon-js.svg';
        themeToggleImg.style.setProperty('background-color', 'var(--js-bg)');
        break;
      case 'accessibility':
        imgSrc = './assets/images/icon-accessibility.svg';
        themeToggleImg.style.setProperty('background-color', 'var(--accessibility-bg)');
        break;
      default:
        imgSrc = './assets/images/icon-html.svg';
        themeToggleImg.style.setProperty('background-color', 'var(--html-bg)');
    }

    themeToggleImg.src = imgSrc;
    themeToggleHeading.textContent = subject;


    currentSubject = subject;
    currentQuestions = questionsData[subject.toLowerCase()];
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;

    // Cập nhật tổng số câu hỏi
    questionTotalEl.textContent = currentQuestions.length;

    // Ẩn start menu, hiện quiz, ẩn quiz complete
    startMenu.style.display = 'none';
    quizSection.style.display = 'flex';
    quizComplete.style.display = 'none';

    loadQuestion();
  }

  // Load câu hỏi hiện tại ra UI
  function loadQuestion() {
    promptEl.style.display = 'none';
    selectedAnswer = null;

    const currentQ = currentQuestions[currentQuestionIndex];
    questionNumberEl.textContent = currentQuestionIndex + 1;
    questionTextEl.textContent = currentQ.question;

    // Hiển thị các option
    optionsButtons.forEach((btn, idx) => {
      btn.classList.remove('selected', 'correct', 'incorrect');
      btn.disabled = false;
      btn.querySelector('.quiz__option-label').textContent = String.fromCharCode(65 + idx); // A, B, C, D

      const label = btn.querySelector('.quiz__option-label');
      btn.innerHTML = '';  // Xóa hết nội dung cũ trước
      btn.appendChild(label); // thêm lại label vào nút
      const optionTextSpan = document.createElement('span');
      optionTextSpan.textContent = currentQ.options[idx];
      btn.appendChild(optionTextSpan);
    });

    // Cập nhật progress bar
    const progressPercent = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressBarFilled.style.width = progressPercent + '%';
  }

  // Xử lý chọn đáp án
  optionsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Bỏ chọn tất cả, chọn lại nút được click
      optionsButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAnswer = btn.querySelector('span').textContent;
      promptEl.style.display = 'none';
    });
  });

  // Xử lý submit câu trả lời
  submitBtn.addEventListener('click', submitHandler);

  function submitHandler() {
    if (submitBtn.textContent === 'Submit') {
      if (!selectedAnswer) {
        promptEl.style.display = 'flex';
        return;
      }

      const currentQ = currentQuestions[currentQuestionIndex];

      optionsButtons.forEach(btn => {
        btn.disabled = true;

        // Xóa icon cũ nếu có
        const oldCorrectIcon = btn.querySelector('.correct-icon');
        if (oldCorrectIcon) oldCorrectIcon.remove();

        const oldWrongIcon = btn.querySelector('.wrong-icon');
        if (oldWrongIcon) oldWrongIcon.remove();


        const optionText = btn.querySelector('span').textContent;
        if (optionText === currentQ.answer) {
          btn.classList.add('correct');
          // Thêm icon đúng
          const img = document.createElement('img');
          img.src = './assets/images/icon-correct.svg';
          img.classList.add('correct-icon');
          btn.appendChild(img);
        } else {
          btn.classList.add('incorrect');

          const img = document.createElement('img');
          img.src = './assets/images/icon-incorrect.svg'; 
          img.classList.add('incorrect-icon');
          btn.appendChild(img);
        }
      });

      if (selectedAnswer === currentQ.answer) {
        score++;
      }

      submitBtn.textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'See Results' : 'Next Question';

    } else {
      // Next or Finish logic
      currentQuestionIndex++;
      if (currentQuestionIndex < currentQuestions.length) {
        submitBtn.textContent = 'Submit';
        loadQuestion();
      } else {
        showResults();
      }
    }
  }

  // Hiển thị màn hình kết thúc quiz
  function showResults() {
    quizSection.style.display = 'none';
    quizComplete.style.display = 'flex';

    finalScoreEl.textContent = score;
    finalQuestionTotalEl.textContent = currentQuestions.length;
    finalSubjectEl.textContent = currentSubject;

    // Cập nhật ảnh theo chủ đề
    let imgSrc = '';
    switch (currentSubject.toLowerCase()) {
      case 'html':
        imgSrc = './assets/images/icon-html.svg';
        break;
      case 'css':
        imgSrc = './assets/images/icon-css.svg';
        break;
      case 'javascript':
        imgSrc = './assets/images/icon-js.svg';
        break;
      case 'accessibility':
        imgSrc = './assets/images/icon-accessibility.svg';
        break;
    }
    finalSubjectImg.src = imgSrc;
  }


  // Ẩn quiz và kết thúc ban đầu
  quizSection.style.display = 'none';
  quizComplete.style.display = 'none';

  // Play again button
  const restartBtn = document.querySelector('.quiz-complete__restart');
  restartBtn.addEventListener('click', () => {
    quizComplete.style.display = 'none';
    startMenu.style.display = 'flex';
    themeToggleObject.style.display = 'none';
  });

}

init();
