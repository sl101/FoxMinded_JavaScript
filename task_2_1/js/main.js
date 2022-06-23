"use strict";

const colorArray = ["beige", "bisque", "brown", "coral", "cyan", "firebrick", "gainsboro", "gold", "gray", "green", "GreenYellow", "HotPink", "IndianRed",  "khaki", "lavender", "linen", "magenta", "maroon", "medium", "moccasin", "NavyBlue", "orange", "orchid", "pale", "pink", "plum", "purple", "red", "salmon", "tan", "tomato", "violet", "white", "yellow"];
const body = document.querySelector('body');
const valueInput = document.querySelector('.form__value');
const btn = document.querySelector('.form__button');
const startColor = colorArray[8];

body.style.backgroundColor = startColor;
valueInput.textContent = startColor;

btn.addEventListener('click', () => {
	let randomInt = getRandomInt(3);

	if(randomInt){
		setColor(randomInt);
	}

});

function getRandomInt(el) {
	return Math.floor(Math.random() * el) + 1;
}

function setColor(value) {
	let color;
	switch(value) {
		case 1:
			color = getRandomRGB();
			break;
		case 2:
			color = getRandonHEX();
			break;
		case 3:
			color = getRandomColor();
			break;
	}
	body.style.backgroundColor = color;
	valueInput.textContent = color;
	valueInput.style.color = color;
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

function getRandomColor(){
	let randomNumber = Math.floor(Math.random()*colorArray.length);
	let randomColor = colorArray[randomNumber];
	return randomColor;
}


