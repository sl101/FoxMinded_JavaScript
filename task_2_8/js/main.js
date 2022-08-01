'use strict';

// Burger =============================================
const burger = document.querySelector('.burger');
const bagBurger = document.querySelector('.bag__burger');
const backet = document.querySelector('.menu__backet');
const bag = document.querySelector('.bag');
const menuLink = document.querySelector('.menu__list');
const menuLinks = document.querySelectorAll('.menu__link');
const fixedBlocks = document.querySelectorAll('.fixed');

if (burger) {
	burger.addEventListener('click', (e) => {
		console.log('element: ' + burger.className);
		let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
		if (document.body.classList.contains('lock')) {
			burger_close();
		} else {
			burger_open(paddingOffset);
		}
	});
}

if (backet) {
	backet.addEventListener('click', (e) => {
		e.preventDefault();
		console.log('element: ' + backet.className);
		bagBurger.classList.add('active');
		bag.classList.add('active');
	});
}

if (bagBurger) {
	bagBurger.addEventListener('click', (e) => {
		e.preventDefault();
		console.log('element: ' + bagBurger.className);
		bagBurger.classList.remove('active');
		bag.classList.remove('active');
	});
}

function burger_open(element) {
	if (fixedBlocks) {
		fixedBlocks.forEach((el) => {
			el.style.paddingRight = element;
		});
	}
	document.body.style.paddingRight = element;
	document.body.classList.add('lock');
	burger.classList.add('active');
	menuLink.classList.add('active');
}

function burger_close() {
	if (fixedBlocks) {
		fixedBlocks.forEach((el) => {
			el.style.paddingRight = '0';
		});
	}
	document.body.style.paddingRight = '0';
	document.body.classList.remove('lock');
	burger.classList.remove('active');
	menuLink.classList.remove('active');
}

// =================================================

if (menuLinks.length > 0) {
	menuLinks.forEach((element) => {
		element.addEventListener('click', (e) => {
			if (burger.classList.contains('active')) {
				burger_close();
			}
		});
	});
}
