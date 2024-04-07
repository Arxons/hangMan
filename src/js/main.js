import wordList from '../wordList.js';

function init() {
    const wordIndex = getRandomInt(wordList.length);
    const word = wordList[wordIndex].word.toLowerCase().split('');
    const hint = wordList[wordIndex].hint;
    const virtualKeys = document.querySelectorAll('.key');
    const tryAgainBtn = document.querySelector('.try-again-btn');
    const modal = document.querySelector('.modal');
    const blockedLetters = new Set();

    console.log(word, hint);

    document.addEventListener('keydown', event => {
        const key = event.key;
        const isModalOpened = modal.classList.contains('open');

        !isModalOpened && event.key.match(/[a-zA-Z]/) && key.length == 1
            ? handleKeydown(key, word, blockedLetters)
            : event.preventDefault();
    });

    virtualKeys.forEach(el => {
        el.addEventListener('click', event => {
            const key = event.target.closest('.key').textContent.toLowerCase();
            handleKeydown(key, word, blockedLetters);
        });
    });

    tryAgainBtn.addEventListener('click', () => location.reload());

    createAnswerLetters(word, hint);
    console.log(blockedLetters);
}

function createAnswerLetters(word, hint) {
    const answerLetters = document.querySelector('.answer-letters');
    const hintElement = document.querySelector('.hint');
    let wordContent = '';
    let hintContent = '';

    word.forEach((letter, i) => {
        wordContent += createContent(i, true);
        hintContent = createContent(i, false, hint);
    });
    answerLetters.innerHTML = wordContent;
    hintElement.innerHTML = hintContent;
}

function createContent(i, isWordContent, hint) {
    if (isWordContent) {
        const content = `<div class="letter" id="${i}">_</div>`;
        return content;
    } else {
        const content = `
                        Hint: <strong>${hint}</strong>`;
        return content;
    }
}

function handleKeydown(key, word, blockedLetters) {
    const letter = document.querySelectorAll('.letter');
    const correctWord = new Array();
    const isBlockedLetter = blockedLetters.has(key);
    let isCorrect = false;

    word.forEach((letter, i) => {
        if (letter == key) {
            const correctLetter = document.getElementById(`${i}`);
            correctLetter.textContent = letter.toUpperCase();
            isCorrect = true;
            blockVirtualKey(key, isCorrect);
        }
    });

    if (!isCorrect && !isBlockedLetter) {
        blockedLetters.add(key);
        blockVirtualKey(key);
        incorrectAnswersCounter(blockedLetters, word);
    }

    letter.forEach(el => {
        correctWord.push(el.textContent);
    });
    if (word.join('').toLowerCase() == correctWord.join('').toLowerCase()) {
        const isWin = true;
        openModal(isWin, word);
    }
}

function incorrectAnswersCounter(blockedLetters, word) {
    const incorrectElement = document.querySelector('.incorrect-guesses');
    const gallowsImage = document.querySelector('.gallows-image');
    const incorrectAnswers = blockedLetters.size;

    if (incorrectAnswers <= 6) {
        incorrectElement.innerHTML = `Incorrect guesses:
                        <span class="text-highlight">${incorrectAnswers}/6</span>`;

        gallowsImage.src = `./src/images/hangman-${incorrectAnswers}.svg`;
    }

    if (incorrectAnswers == 6) {
        const isWin = false;
        openModal(isWin, word);
    }
}

function blockVirtualKey(key) {
    console.log(key);
    const keyElements = document.querySelectorAll('.key');
    keyElements.forEach(el => {
        if (el.textContent == key.toUpperCase()) {
            el.classList.add('blocked');
        }
    });
}

function openModal(isWin, word) {
    const modal = document.querySelector('.modal');
    const modalTitle = document.querySelector('.modal-title');
    const hiddenWord = document.querySelector('.hidden-word');

    hiddenWord.textContent = `The word is ${word.join('').toUpperCase()}`;

    isWin
        ? (modalTitle.textContent = 'You Win!')
        : (modalTitle.textContent = 'You Lost!');

    modal.classList.add('open');
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

init();
