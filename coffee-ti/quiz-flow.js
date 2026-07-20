(function () {
  const root = document.getElementById('root');
  if (!root) return;

  let activeList = null;
  let currentIndex = 0;
  let autoAdvanceTimer = 0;

  function getQuestions() {
    return activeList ? Array.from(activeList.querySelectorAll(':scope > .question')) : [];
  }

  function scrollToQuestion() {
    const testWrap = document.querySelector('.test-wrap');
    if (!testWrap) return;
    const top = testWrap.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function showQuestion(index, shouldScroll) {
    const questions = getQuestions();
    if (!questions.length) return;

    currentIndex = Math.max(0, Math.min(index, questions.length - 1));
    questions.forEach((question, questionIndex) => {
      const isCurrent = questionIndex === currentIndex;
      question.classList.toggle('is-current', isCurrent);
      question.setAttribute('aria-hidden', String(!isCurrent));
    });

    const previousButton = document.querySelector('[data-quiz-action="previous"]');
    const nextButton = document.querySelector('[data-quiz-action="next"]');
    const position = document.querySelector('.quiz-step-position');
    if (previousButton) previousButton.disabled = currentIndex === 0;
    if (nextButton) {
      nextButton.disabled = currentIndex === questions.length - 1;
      const nextLabel = currentIndex === questions.length - 1 ? '已经是最后一题' : '下一题';
      if (nextButton.textContent !== nextLabel) nextButton.textContent = nextLabel;
    }
    if (position) {
      const positionLabel = `${currentIndex + 1} / ${questions.length}`;
      if (position.textContent !== positionLabel) position.textContent = positionLabel;
    }

    if (shouldScroll) scrollToQuestion();
  }

  function createNavigation() {
    const navigation = document.createElement('div');
    navigation.className = 'quiz-step-navigation';
    navigation.innerHTML = [
      '<button type="button" class="btn-secondary quiz-step-button" data-quiz-action="previous">上一题</button>',
      '<span class="quiz-step-position" aria-live="polite"></span>',
      '<button type="button" class="btn-primary quiz-step-button" data-quiz-action="next">下一题</button>'
    ].join('');
    activeList.insertAdjacentElement('afterend', navigation);
  }

  function setupQuestionFlow() {
    const questionList = root.querySelector('.question-list');
    if (!questionList) {
      activeList = null;
      currentIndex = 0;
      return;
    }

    if (questionList !== activeList) {
      activeList = questionList;
      currentIndex = 0;
      activeList.classList.add('quiz-step-mode');
      createNavigation();
    }

    const questions = getQuestions();
    if (currentIndex >= questions.length) currentIndex = Math.max(0, questions.length - 1);
    showQuestion(currentIndex, false);
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-quiz-action]');
    if (!button || button.disabled) return;
    const offset = button.dataset.quizAction === 'previous' ? -1 : 1;
    showQuestion(currentIndex + offset, true);
  });

  root.addEventListener('change', (event) => {
    if (!event.target.matches('.question input[type="radio"]')) return;
    window.clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = window.setTimeout(() => {
      const questions = getQuestions();
      if (currentIndex < questions.length - 1) showQuestion(currentIndex + 1, true);
    }, 260);
  });

  const observer = new MutationObserver(setupQuestionFlow);
  observer.observe(root, { childList: true, subtree: true });
  setupQuestionFlow();
})();
