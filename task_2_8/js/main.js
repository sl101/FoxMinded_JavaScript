'use strict';

// Burger =============================================
const burger = document.querySelector('.burger');
const menuLink = document.querySelector('.menu__list');
const menuLinks = document.querySelectorAll('.menu__link');
const fixedBlocks = document.querySelectorAll('.fixed');

if (burger) {
	burger.addEventListener('click', (e) => {
		let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
		if (document.body.classList.contains('lock')) {
			burger_close();
		} else {
			burger_open(paddingOffset);
		}
	});
}

function burger_open(element) {
	if (fixedBlocks) {
		fixedBlocks.forEach((el) => {
			el.style.paddingRight = element;
		});
	}
	// document.body.style.paddingRight = element;
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
