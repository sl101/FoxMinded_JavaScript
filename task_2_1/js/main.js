"use strict";

const body = document.querySelector('body');
const valueInput = document.querySelector('.form__value');
const btn = document.querySelector('.form__button');



btn.addEventListener('click', e => {
	setColor();
});

function setColor() {
	let color = getRandomRGB();
	// let color = getRandonHEX();

	body.style.backgroundColor = color;
	valueInput.textContent = color;
}

function getRandonHEX() {
	let letters = '0123456789ABCDEF';
	let colorHEX = '#';
	for (var i = 0; i < 6; i++) {
		colorHEX += letters[Math.floor(Math.random() * 16)];
	}
	return colorHEX;
}

function getRandomRGB() {
    let r = Math.floor(Math.random() * (256)),
        g = Math.floor(Math.random() * (256)),
        b = Math.floor(Math.random() * (256));
	let colorRGB = "RGB(" + r + ", " + g + ", " + b + ")";

    return colorRGB;
}


