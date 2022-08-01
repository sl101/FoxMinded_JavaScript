'use strict';

// Burger =============================================
const burgers = document.querySelectorAll('.burger');
const backet = document.querySelector('.menu__backet');
const bag = document.querySelector('.bag');
const menuLink = document.querySelector('.menu__list');
const menuLinks = document.querySelectorAll('.menu__link');
const fixedBlocks = document.querySelectorAll('.fixed');

if (burgers) {
	burgers.forEach((element) => {
		element.addEventListener('click', (e) => {
			let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
			if (document.body.classList.contains('lock')) {
				burger_close(element);
			} else {
				burger_open(paddingOffset, element);
			}
		});
	});
}

if (backet) {
	backet.addEventListener('click', (e) => {
		e.preventDefault();
		let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
		const bagBurger = document.querySelector('.bag__burger');
		burger_open(paddingOffset, bagBurger);
	});
}

function burger_open(paddingOffset, burger) {
	if (fixedBlocks) {
		fixedBlocks.forEach((el) => {
			el.style.paddingRight = paddingOffset;
		});
	}
	document.body.style.paddingRight = paddingOffset;
	document.body.classList.add('lock');
	burger.classList.add('active');
	if (!burger.classList.contains('bag__burger')) {
		menuLink.classList.add('active');
	} else {
		bag.classList.add('active');
	}
}

function burger_close(burger) {
	if (fixedBlocks) {
		fixedBlocks.forEach((el) => {
			el.style.paddingRight = '0';
		});
	}
	document.body.style.paddingRight = '0';
	document.body.classList.remove('lock');
	burger.classList.remove('active');
	if (!burger.classList.contains('bag__burger')) {
		menuLink.classList.remove('active');
	} else {
		bag.classList.remove('active');
	}
}

// =================================================

if (menuLinks.length > 0) {
	menuLinks.forEach((element) => {
		element.addEventListener('click', (e) => {
			burgers.forEach((element) => {
				if (
					element.classList.contains('active') &&
					!element.classList.contains('bag__burger')
				) {
					burger_close(element);
				}
			});
		});
	});
}
