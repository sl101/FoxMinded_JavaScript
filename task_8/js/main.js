/*jshint esversion: 6 */
'use strict';

import productsJSON from './products.json' assert { type: 'json' };

const body = document.querySelector('body');
const burgers = body.querySelectorAll('.burger');
const menuList = body.querySelector('.menu__list');
const bag = body.querySelector('.bag');

const backet = body.querySelector('.menu__backet');
const menuLinks = body.querySelectorAll('.menu__link');

const productPage = document.querySelector('.products');

const searchField = body.querySelector('.filter__search');
const choiceButton = body.querySelectorAll('.choice__button');

const rangeInput = body.querySelector('.range__input');

// Burgers ============================================
if (burgers) {
	burgers.forEach((element) => {
		element.addEventListener('click', (e) => {
			const paddingOffset =
				window.innerWidth - document.body.offsetWidth + 'px';
			if (document.body.classList.contains('lock')) {
				closeBurger(element);
			} else {
				openBurger(paddingOffset, element);
			}
		});
	});
}

backet.addEventListener('click', (e) => {
	e.preventDefault();
	const paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
	const bagBurger = document.querySelector('.bag__burger');
	openBurger(paddingOffset, bagBurger);
});

if (menuLinks.length > 0) {
	menuLinks.forEach((el) => {
		el.addEventListener('click', () => {
			burgers.forEach((element) => {
				if (
					element.classList.contains('active') &&
					!element.classList.contains('bag__burger')
				) {
					closeBurger(element);
				}
			});
		});
	});
}

function openBurger(paddingOffset, burger) {
	if (document.body.classList.contains('lock')) {
		const activeBurgers = document.querySelectorAll('.burger.active');
		activeBurgers.forEach((element) => {
			closeBurger(element);
		});
	}
	document.body.style.paddingRight = paddingOffset;
	document.body.classList.add('lock');
	burger.classList.add('active');
	if (!burger.classList.contains('bag__burger')) {
		menuList.classList.add('active');
	} else {
		bag.classList.add('active');
	}
}

function closeBurger(burger) {
	document.body.style.paddingRight = '0';
	document.body.classList.remove('lock');
	burger.classList.remove('active');
	if (!burger.classList.contains('bag__burger')) {
		menuList.classList.remove('active');
	} else {
		bag.classList.remove('active');
	}
}

// Storage ============================================
if (productPage) {
	showProducts();
	loadBasketStorage();

	searchField.addEventListener('keydown', (element) => {
		if (element.keyCode === 13) {
			const stringData = searchField.value;
			if (stringData) {
				showTargets(stringData);
			}
		} else if (element.keyCode === 27) {
			const stringData = 'Search...';
			rewriteSearch(stringData);
		}
	});

	choiceButton.forEach((element) => {
		element.addEventListener('click', (e) => {
			e.preventDefault();
			const searchData = 'Search...';
			rewriteSearch(searchData);
			const companyFilter = element.dataset.filter;
			showTargets(companyFilter);
		});
	});

	rangeInput.addEventListener('change', () => {
		const rangeInput = productPage.querySelector('.range__input');
		localStorage.setItem('price', rangeInput.value);
		showProducts();
	});
}

function showProducts() {
	const data = JSON.parse(localStorage.getItem('selectedList'));
	cleanGallery();
	if (data) {
		loadGallery(data);
	} else {
		loadGallery(productsJSON);
	}
}

function cleanGallery() {
	const gallery = document.querySelectorAll('.products__item.product');
	gallery.forEach((element) => {
		element.remove();
	});
}

function setRangeValue(productList) {
	let maxPrice = 0;

	const rangeInput = productPage.querySelector('.range__input');
	const rangeOutput = productPage.querySelector('.range__output');
	const rangeValue = localStorage.getItem('price');

	productList.forEach((element) => {
		if (maxPrice < element.productPrice) {
			maxPrice = Math.ceil(Math.round(element.productPrice) / 100) * 100;
		}
	});

	if (!rangeValue) {
		rangeOutput.innerHTML = maxPrice;
	} else if (rangeValue > maxPrice) {
		rangeOutput.innerHTML = maxPrice;
		localStorage.setItem('price', JSON.stringify(maxPrice));
	} else {
		rangeOutput.innerHTML = rangeValue;
	}
	rangeInput.value = rangeOutput.innerHTML;
	rangeInput.max = maxPrice;

	return rangeOutput.innerHTML;
}

function loadGallery(productList) {
	for (let index = 0; index < productList.length; index++) {
		const element = productList[index];
		if (Number(element.productPrice) <= Number(setRangeValue(productList))) {
			console.log('element in gallery:\n' + element);

			renderGalleryItem(element);
		}
	}
}

function renderGalleryItem({
	productId,
	productData,
	productLink,
	productImg,
	productAlt,
	productTitle,
	productPrice,
}) {
	const listGallery = document.querySelector('.products__list');

	const productUnit = document.createElement('li');
	productUnit.classList.add('products__item', 'product');
	productUnit.dataset.company = `${productData}`;
	productUnit.id = `${productId}`;
	listGallery.appendChild(productUnit);

	productUnit.innerHTML = `
		<a class="product__link" href=${productLink}>
			<div class="product__picture">
				<img class="product__img" src=${productImg} alt="${productAlt}">
			</div>
		</a>
		<div class="product__content">
			<div class="product__description">
				<div class="product__title">${productTitle}</div>
				<span class="product__currency">$</span>
				<span class="product__price">${productPrice}</span>
			</div>
			<button class="product__add" type="button"></button>
		</div>
		`;
	const backetAdd = productUnit.querySelector('.product__add');
	backetAdd.addEventListener('click', (e) => {
		e.preventDefault();
		addToBasket(productUnit);
	});
}

// Basket Storage ============================================
function loadBasketStorage() {
	cleanBasketList();

	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	const bagList = document.querySelector('.bag__list');

	if (existingEntries) {
		existingEntries.forEach((element) => {
			let isRender = true;
			const showedProducts = bagList.querySelectorAll('.bag__item.order');
			showedProducts.forEach((field) => {
				if (Number(field.id) === Number(element.productId)) {
					increaseItemNumbers(field);
					isRender = false;
				}
			});

			if (isRender) {
				console.log('element in basket:\n' + element);
				renderBasketItem(element);
			}
		});
	}
	rewriteBasketAmount();
}

function cleanBasketList() {
	const itemList = document.querySelectorAll('.bag__item');
	itemList.forEach((element) => {
		element.remove();
	});
}

function renderBasketItem({
	productId,
	productData,
	productAmount,
	productImg,
	productAlt,
	productTitle,
	productPrice,
}) {
	const bagList = document.querySelector('.bag__list');
	const orderUnit = document.createElement('li');
	orderUnit.classList.add('bag__item', 'order');
	orderUnit.dataset.company = `${productData}`;
	orderUnit.id = `${productId}`;
	bagList.appendChild(orderUnit);

	orderUnit.innerHTML = `
		<div class="order__picture">
		<img class="order__img" src=${productImg} alt="${productAlt}">
	</div>
	<div class="order__content">
		<div class="order__description">
			<h3 class="order__title">
				${productTitle}
			</h3>
			<span class="product__currency">$</span>
			<span class="order__price">${productPrice}</span>
		</div>
		<button class="order__action" type="button">
			remove
		</button>
	</div>
	<div class="order__amount amount-order">
		<button class="amount-order__top" type="button"></button>
		<span class="amount-order__value">${productAmount}</span>
		<button class="amount-order__bottom" type="button"></button>
	</div>
	`;

	addListeners(orderUnit);
}

function addListeners(element) {
	const removeBtn = element.querySelector('.order__action');
	removeBtn.addEventListener('click', (e) => {
		e.preventDefault();
		removeBasketItem(element);
	});

	const orderUp = element.querySelector('.amount-order__top');
	orderUp.addEventListener('click', (e) => {
		e.preventDefault();
		addToBasket(element);
		increaseItemNumbers(element);
	});

	const orderDown = element.querySelector('.amount-order__bottom');
	const orderValue = element.querySelector('.amount-order__value').innerHTML;
	if (Number(orderValue) === 1) {
		orderDown.style.opacity = 0.2;
		orderDown.style.cursor = 'default';
	}

	orderDown.addEventListener('click', (e) => {
		e.preventDefault();
		deleteFromBasket(element);
		decreaseItemNumbers(element);
	});
}

function rewriteBasketAmount() {
	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	if (existingEntries) {
		const backetAmount = document.querySelector('.menu__amount');
		backetAmount.innerHTML = existingEntries.length;
		const bagSumm = document.querySelector('.bag__summ');
		let totalSumm = 0.0;
		existingEntries.forEach((element) => {
			totalSumm = Number(totalSumm) + Number(element.productPrice);
		});
		bagSumm.innerHTML = totalSumm.toFixed(2);
	}
}

function addToBasket(item) {
	const product = productsJSON[Number(item.id) - 1];
	const existingEntries = JSON.parse(localStorage.getItem('backet')) || [];
	existingEntries.push(product);

	localStorage.setItem('backet', JSON.stringify(existingEntries));

	loadBasketStorage();
}

function deleteFromBasket(item) {
	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	let target = '';
	for (let index = 0; index < existingEntries.length; index++) {
		const element = existingEntries[index];
		if (Number(element.productId) === Number(item.id)) {
			target = index;
		}
	}

	existingEntries.splice(target, 1);

	localStorage.setItem('backet', JSON.stringify(existingEntries));
	loadBasketStorage();
}

function increaseItemNumbers(field) {
	const valueField = field.querySelector('.amount-order__value');
	const value = valueField.innerHTML;
	valueField.innerHTML = Number(value) + 1;
	const orderDown = field.querySelector('.amount-order__bottom');
	orderDown.style.opacity = 1;
	orderDown.style.cursor = 'pointer';

	rewriteBasketAmount();
}

function decreaseItemNumbers(product) {
	const valueField = product.querySelector('.amount-order__value');
	let value = valueField.innerHTML;
	if (value >= 2) {
		valueField.innerHTML = Number(value) - 1;
		value = Number(value) - 1;
		if (value === 1) {
			const orderDown = product.querySelector('.amount-order__bottom');
			orderDown.style.opacity = 0.2;
			orderDown.style.cursor = 'default';
		}
	}

	rewriteBasketAmount();
}

function removeBasketItem(product) {
	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	const newArray = existingEntries.filter(
		(element) => Number(product.id) !== Number(element.productId)
	);

	localStorage.setItem('backet', JSON.stringify(newArray));
	product.remove();

	rewriteBasketAmount();
}

// Search =================================================

function rewriteSearch(string) {
	searchField.innerHTML = '';
	searchField.value = '';
	searchField.placeholder = string;
}

function selectList(value) {
	const selectedList = [];

	productsJSON.forEach((element) => {
		if (
			element.productTitle.toLowerCase().includes(value.toLowerCase()) ||
			element.productData.toLowerCase().includes(value.toLowerCase())
		) {
			selectedList.push(element);
		}
	});
	return selectedList;
}

function showTargets(stringData) {
	const selectedList = selectList(stringData);

	if (selectedList.length !== 0) {
		cleanGallery();
		localStorage.setItem('selectedList', JSON.stringify(selectedList));
		loadGallery(selectedList);
	} else {
		const stringData = 'no data';
		rewriteSearch(stringData);
	}
}
