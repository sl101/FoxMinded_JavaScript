'use strict';

const burgers = document.querySelectorAll('.burger');
const backet = document.querySelector('.menu__backet');
const bag = document.querySelector('.bag');
const menuLink = document.querySelector('.menu__list');
const menuLinks = document.querySelectorAll('.menu__link');
const fixedBlocks = document.querySelectorAll('.fixed');

const productList = document.querySelectorAll('.products__item.product');

const searchField = document.querySelector('.filter__search');

// Burgers =============================================
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

function burger_open(paddingOffset, burger) {
	if (fixedBlocks) {
		fixedBlocks.forEach((el) => {
			el.style.paddingRight = paddingOffset;
		});
	}
	if (document.body.classList.contains('lock')) {
		const activeBurgers = document.querySelectorAll('.burger.active');
		activeBurgers.forEach((element) => {
			burger_close(element);
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

// Products ================================================
const productsNames = [];
if (productList) {
	productList.forEach((element) => {
		productsNames.push(element.querySelector('.product__title').innerHTML);
	});
}

// Filters =================================================

function loadSearchTarget(searchProducts) {
	const listGallery = document.querySelector('.products__list');
	searchProducts.forEach((element) => {
		const productImg = element.querySelector('.product__img').src;
		const productAlt = element.querySelector('.product__img').alt;
		const productTitle = element.querySelector('.product__title').innerHTML;
		const productPrice = element.querySelector('.product__price').innerHTML;

		const productUnit = document.createElement('li');
		productUnit.classList.add('products__item');
		productUnit.classList.add('product');
		listGallery.appendChild(productUnit);

		productUnit.innerHTML = `
		<a class="product__link" href="#">
		<div class="product__picture">
			<img class="product__img" src=${productImg} alt="${productAlt}">
		</div>
	</a>
	<div class="product__content">
		<div class="product__title">${productTitle}</div>
		<span class="product__price">${productPrice}</span>
	</div>`;
	});
}

function cleanGallery() {
	const gallery = document.querySelectorAll('.products__item.product');
	gallery.forEach((element) => {
		element.remove();
	});
}

function findSearchTarget(target) {
	const searchProducts = [];
	let value = false;
	for (let index = 0; index < productsNames.length; index++) {
		const element = productsNames[index];
		if (element.toLowerCase().includes(target.value.toLowerCase())) {
			searchProducts.push(productList[index]);
			value = true;
		}
	}
	if (value) {
		cleanGallery();
		loadSearchTarget(searchProducts);
	} else {
		target.innerHTML = '';
		target.value = '';
		target.placeholder = 'no data';
	}
}

if (searchField) {
	searchField.addEventListener('keydown', (element) => {
		if (element.keyCode === 13) {
			findSearchTarget(searchField);
		} else if (element.keyCode === 27) {
			searchField.innerHTML = '';
			searchField.value = '';
		}
	});
}
