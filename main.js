import * as functions from './functions.js';

const screenHelloEl = document.getElementById('screenHello');
const screenGameEl = document.getElementById('screenGame');
const screenResultEl = document.getElementById('screenResult');
const bigNumEl = document.getElementById('bigNum');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const scoreResultEl = document.getElementById('scoreResult');

let bestResultEl = document.getElementById('bestResult');

let phase = 1; // 1 - screenHello, 2 - screenGame, 3 - screenResult

let randNum = 0;
let score = 0;
let bestResult = Number(localStorage.getItem('bestResult'));

// Speed Settings
const defaultAnimationSpeed = 5000;
const speedChange = 100;
const minAnimationSpeed = 600;

let animationSpeed = defaultAnimationSpeed;

let myTimeOut = null;

const youLose = () => {
	clearTimeout(myTimeOut);
	if (bestResult < score) {
		bestResult = score;
		localStorage.setItem('bestResult', bestResult);
		console.log('localStorage');
		bestResultEl.classList.add('new-record');
		bestResultEl.innerHTML = '*новый рекорд*';
	} else {
		bestResultEl.classList.remove('new-record');
		bestResultEl.innerHTML = `лучший результат: ${bestResult}`;
	}
	screenGameEl.classList.add('hidden');
	screenResultEl.classList.remove('hidden');
	scoreResultEl.innerHTML = score;
	phase = 3;
};

const roundBegin = () => {
	if (animationSpeed > minAnimationSpeed) {
		console.log(animationSpeed);
		animationSpeed -= speedChange;
	}

	clearTimeout(myTimeOut);
	myTimeOut = setTimeout(youLose, animationSpeed);
	randNum = functions.getRandomNumber();
	bigNumEl.innerHTML = randNum;

	setTimeout(() => {
		bigNumEl.classList.add('animation');
		timerEl.classList.add('animation');
		bigNumEl.style.animationDuration = `${animationSpeed}ms`;
		timerEl.style.animationDuration = `${animationSpeed}ms`;
	}, 10);
};

const correctNum = () => {
	bigNumEl.classList.remove('animation');
	timerEl.classList.remove('animation');

	score += 1;
	scoreEl.innerHTML = score;
	bigNumEl.innerHTML = randNum;
};

const incorrectNum = () => {
	bigNumEl.classList.remove('animation');
	timerEl.classList.remove('animation');

	clearTimeout(myTimeOut);
};

const gameReset = () => {
	score = 0;
	scoreEl.innerHTML = score;
	animationSpeed = defaultAnimationSpeed;
	screenHelloEl.classList.add('hidden');
	screenResultEl.classList.add('hidden');
	screenGameEl.classList.remove('hidden');
	phase = 2;
};

window.addEventListener('keydown', (e) => {
	switch (phase) {
		case 1:
			score = 0;
			scoreEl.innerHTML = score;
			if (e.code === 'Space') {
				gameReset();
				roundBegin();
			}
			break;

		case 2:
			if (e.code.includes('Digit') && Number(e.key) === randNum) {
				correctNum();
				roundBegin();
			} else {
				incorrectNum();
				youLose();
			}
			break;

		case 3: 
			if (e.code === 'Space') {
				gameReset();
				roundBegin();
			}
			break;
	}
});
