import wordList from '../wordList.js';

function init() {
    const wordIndex = getRandomInt(wordList.length);
    const word = wordList[wordIndex].word.split('');
    const hint = wordList[wordIndex].hint;
    const blockedLetters = new Set();

    console.log(word, hint);

    document.addEventListener('keydown', event =>
        handleKeydown(event, word, blockedLetters),
    );
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

function handleKeydown(event, word, blockedLetters) {
    let isCorrect = false;
    const isBlockedLetter = blockedLetters.has(event.key);

    word.forEach((letter, i) => {
        if (letter == event.key) {
            const correctLetter = document.getElementById(`${i}`);
            correctLetter.textContent = letter.toUpperCase();
            isCorrect = true;
            blockVirtualKey(event.key, isCorrect);
        }
    });

    if (!isCorrect && !isBlockedLetter) {
        blockedLetters.add(event.key);
        blockVirtualKey(event.key);
        incorrectAnswersCounter(blockedLetters);
    }
}

function incorrectAnswersCounter(blockedLetters) {
    const incorrectElement = document.querySelector('.incorrect-guesses');
    const gallowsImage = document.querySelector('.gallows-image');
    const incorrectAnswers = blockedLetters.size;

    if (incorrectAnswers <= 6) {
        incorrectElement.innerHTML = `Incorrect guesses:
                        <span class="text-highlight">${incorrectAnswers}/6</span>`;

        gallowsImage.src = `./src/images/hangman-${incorrectAnswers}.svg`;
    }
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

function blockVirtualKey(key) {
    console.log(key);
    const keyElements = document.querySelectorAll('.key');
    keyElements.forEach(el => {
        if (el.textContent == key.toUpperCase()) {
            el.classList.add('blocked');
        }
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

init();
