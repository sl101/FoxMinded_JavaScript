"use strict";

const colorArray = ["AliceBlue", "AntiqueWhite", "beige", "bisque", "black", "BlanchedAlmond", "BlueViolet", "brown", "burlywood", "CadetBlue", "coral", "CornflowerBlue", "cyan", "DarkGoldenrod", "DarkGreen", "DarkKhaki", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray",
"DarkTurquoise", "DarkViolet", "DimGray", "firebrick", "FloralWhite", "ForestGreen", "gainsboro", "GhostWhite", "gold", "goldenrod", "gray", "green", "GreenYellow", "HotPink", "IndianRed",  "khaki", "lavender", "LawnGreen", "light", "LightBlue", "LightGoldenrodYellow", "LightGray", "LightPink", "LightSeaGreen", "LightSkyBlue", "LightSlateBlue", "LightSlateGray", "LightSteelBlue", "LimeGreen", "linen", "magenta", "maroon", "medium",
"MediumAquamarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue",
"MintCream", "moccasin", "NavyBlue", "OldLace", "OliveDrab", "orange", "OrangeRed1", "OrangeRed2", "OrangeRed3", "OrangeRed4", "orchid", "pale", "PaleGoldenrod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "pink", "plum", "PowderBlue", "purple", "rebeccapurple", "red", "RosyBrown", "RoyalBlue", "SaddleBrown", "salmon", "SandyBrown", "SeaGreen", "seashell", "sienna", "SkyBlue", "SlateBlue", "SlateGray", "snow", "SpringGreen", "SteelBlue", "tan", "thistle", "tomato", "turquoise", "violet", "VioletRed", "wheat", "white", "WhiteSmoke", "yellow","YellowGreen"];
const body = document.querySelector('body');
const valueInput = document.querySelector('.form__value');
const btn = document.querySelector('.form__button');
const startColor = 'Grey';

body.style.backgroundColor = startColor;
valueInput.textContent = startColor;

btn.addEventListener('click', e => {
	let randomInt = getRandomInt(3);

	if(randomInt){
		setColor(randomInt);
	}

});

function getRandomInt(el) {
	return Math.floor(Math.random() * el) + 1;
}

function setColor(value) {
	var color;
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


