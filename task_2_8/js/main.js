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
			let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
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
	loadBasketStorage();
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
	loadLocalStorageData();
}

function loadLocalStorageData(data) {
	console.log(data);
	if (data) {
		const currentData = JSON.parse(localStorage.getItem(data));
		cleanGallery();
		loadGallery(currentData);
	} else {
		JSON.parse(localStorage.getItem('savedCompany'))
			? loadGallery(JSON.parse(localStorage.getItem('savedCompany')))
			: setProductList(productsJSON);
	}
}

function setProductList(data) {
	localStorage.setItem('productList', JSON.stringify(data));
	cleanGallery();
	const currentData = JSON.parse(localStorage.getItem('productList'));
	loadGallery(currentData);
}

function cleanGallery() {
	const gallery = document.querySelectorAll('.products__item.product');
	gallery.forEach((element) => {
		element.remove();
	});
}

function loadGallery(data) {
	const listGallery = document.querySelector('.products__list');

	let maxPrice = 0;

	const rangeInput = productPage.querySelector('.range__input');
	const rangeOutput = productPage.querySelector('.range__output');
	const rangeValue = localStorage.getItem('price');

	data.forEach((element) => {
		if (maxPrice < element.productPrice) {
			maxPrice = Math.ceil(Math.round(element.productPrice) / 100) * 100;
		}
	});

	if (!rangeValue) {
		rangeOutput.innerHTML = maxPrice;
	} else if (rangeValue > maxPrice) {
		rangeOutput.innerHTML = maxPrice;
	} else {
		rangeOutput.innerHTML = rangeValue;
	}
	rangeInput.max = maxPrice;

	for (let index = 0; index < data.length; index++) {
		const element = data[index];
		const [
			productData,
			productId,
			productLink,
			productImg,
			productAlt,
			productTitle,
			productPrice,
		] = [
			element.productData,
			element.productId,
			element.productLink,
			element.productImg,
			element.productAlt,
			element.productTitle,
			element.productPrice,
		];

		if (Number(productPrice) <= Number(rangeOutput.value)) {
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
				addToStorage(productUnit);
			});
		}
	}
}

function addToStorage(data) {
	const element = createObjectProduct(data);
	let existingEntries = JSON.parse(localStorage.getItem('backet'));
	existingEntries === null ? (existingEntries = []) : existingEntries;
	existingEntries.push(element);
	localStorage.setItem('backet', JSON.stringify(existingEntries));
	loadBasketStorage();
}

function createObjectProduct(data, amount = 1) {
	const element = {
		productId: data.id,
		productData: data.dataset.company,
		productLink: data.querySelector('.product__link').href,
		productImg: data.querySelector('.product__img').src,
		productAlt: data.querySelector('.product__img').alt,
		productTitle: data.querySelector('.product__title').innerHTML,
		productPrice: data.querySelector('.product__price').innerHTML,
		productAmount: amount,
	};
	return element;
}

// Basket Storage ============================================
loadBasketStorage();

function loadBasketStorage() {
	cleanBagList();

	let existingEntries = JSON.parse(localStorage.getItem('backet'));
	const bagList = document.querySelector('.bag__list');

	if (existingEntries) {
		existingEntries.forEach((element) => {
			let isExecute = true;

			let [
				orderData,
				orderId,
				orderImg,
				orderAlt,
				orderTitle,
				orderPrice,
				orderValue,
			] = [
				element.productData,
				element.productId,
				element.productImg,
				element.productAlt,
				element.productTitle,
				element.productPrice,
				element.productAmount,
			];

			const showedProducts = bagList.querySelectorAll('.bag__item.order');

			showedProducts.forEach((element) => {
				const elementId = element.id;
				const valueField = element.querySelector(
					'.amount-order__value'
				).innerHTML;
				if (elementId === orderId) {
					orderValue = Number(orderValue) + Number(valueField);
					element.querySelector('.amount-order__value').innerHTML = orderValue;
					element.querySelector('.amount-order__bottom').style.opacity = 1;
					element.querySelector('.amount-order__bottom').style.cursor =
						'pointer';
					isExecute = false;
				}
			});

			if (isExecute) {
				const orderUnit = document.createElement('li');
				orderUnit.classList.add('bag__item', 'order');
				orderUnit.dataset.company = `${orderData}`;
				orderUnit.id = `${orderId}`;
				bagList.appendChild(orderUnit);

				orderUnit.innerHTML = `
				<div class="order__picture">
				<img class="order__img" src=${orderImg} alt="${orderAlt}">
			</div>
			<div class="order__content">
				<div class="order__description">
					<h3 class="order__title">
						${orderTitle}
					</h3>
					<span class="product__currency">$</span>
					<span class="order__price">${orderPrice}</span>
				</div>
				<button class="order__action" type="button">
					remove
				</button>
			</div>
			<div class="order__amount amount-order">
				<button class="amount-order__top" type="button"></button>
				<span class="amount-order__value">${orderValue}</span>
				<button class="amount-order__bottom" type="button"></button>
			</div>
			`;

				const removeBtn = orderUnit.querySelector('.order__action');
				removeBtn.addEventListener('click', (e) => {
					e.preventDefault();
					removeOrder(orderUnit);
				});

				const orderUp = orderUnit.querySelector('.amount-order__top');
				orderUp.addEventListener('click', (e) => {
					e.preventDefault();
					increaseAmount(orderUnit);
				});

				const orderDown = orderUnit.querySelector('.amount-order__bottom');
				if (orderValue === 1) {
					orderDown.style.opacity = 0.2;
					orderDown.style.cursor = 'default';
				}

				orderDown.addEventListener('click', (e) => {
					e.preventDefault();
					decreaseAmount(orderUnit);
				});
			}
		});
	}
	rewriteBasketAmount();
}

function cleanBagList() {
	const itemList = document.querySelectorAll('.bag__item');
	itemList.forEach((element) => {
		element.remove();
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

function removeOrder(product) {
	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	const newArray = existingEntries.filter(
		(element) => product.id !== element.productId
	);

	localStorage.setItem('backet', JSON.stringify(newArray));
	product.remove();

	rewriteBasketAmount();
}

function findSameElement(product) {
	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	let newElement = '';
	let isRewrite = true;
	for (let index = 0; index < existingEntries.length; index++) {
		if (rewrite) {
			const element = existingEntries[index];
			if (product.id === element.productId) {
				newElement = index;
				isRewrite = false;
			}
		}
	}
	return newElement;
}

function increaseAmount(product) {
	const valueField = product.querySelector('.amount-order__value');
	const value = valueField.innerHTML;
	valueField.innerHTML = Number(value) + 1;
	const orderDown = product.querySelector('.amount-order__bottom');
	orderDown.style.opacity = 1;
	orderDown.style.cursor = 'pointer';

	existingEntries.push(existingEntries[findSameElement(product)]);
	localStorage.setItem('backet', JSON.stringify(existingEntries));
	rewriteBasketAmount();
}

function decreaseAmount(product) {
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

	existingEntries.splice(findSameElement(product), 1);
	localStorage.setItem('backet', JSON.stringify(existingEntries));
	rewriteBasketAmount();
}

// Search =================================================
if (searchField) {
	searchField.addEventListener('keydown', (element) => {
		if (element.keyCode === 13) {
			findSearchTarget(searchField);
		} else if (element.keyCode === 27) {
			searchField.innerHTML = '';
			searchField.value = '';
			searchField.placeholder = 'Search...';
		}
	});
}

function getProductNameList() {
	let productsNames = new Map();
	const productList = JSON.parse(localStorage.getItem('productList'));
	productList.forEach((element) => {
		productsNames.set(element.productId, element.productTitle);
	});
	return productsNames;
}

function findSearchTarget(target) {
	const productsNames = getProductNameList();
	const searchProducts = [];
	let isValueExist = false;
	if (target.value) {
		for (let index = 0; index < productsNames.size; index++) {
			if (
				productsNames
					.get(index + 1)
					.toLowerCase()
					.includes(target.value.toLowerCase())
			) {
				searchProducts.push(
					JSON.parse(localStorage.getItem('productList'))[index]
				);
				isValueExist = true;
			}
		}
		console.log('searchProducts: = ' + searchProducts);
		if (isValueExist) {
			cleanGallery();
			localStorage.setItem('searchList', JSON.stringify(searchProducts));
			loadGallery(searchProducts);
		} else {
			target.innerHTML = '';
			target.value = '';
			target.placeholder = 'no data';
		}
	} else {
		target.innerHTML = '';
		target.value = '';
		target.placeholder = 'Search...';
	}
}

// Range ==========================================
if (rangeInput) {
	rangeInput.addEventListener('change', () => {
		const rangeInput = productPage.querySelector('.range__input');
		localStorage.setItem('price', rangeInput.value);

		if (localStorage.getItem('searchList')) {
			loadLocalStorageData('searchList');
		} else if (localStorage.getItem('savedCompany')) {
			loadLocalStorageData('savedCompany');
		} else {
			loadLocalStorageData('productList');
		}
	});
}

// Company Filters ================================================
if (choiceButton) {
	choiceButton.forEach((element) => {
		element.addEventListener('click', (e) => {
			e.preventDefault();
			searchField.innerHTML = '';
			searchField.value = '';
			searchField.placeholder = 'Search...';
			const filterData = element.dataset.filter;
			setAnimation(filterData);
		});
	});
}

function setAnimation(data) {
	const productList = JSON.parse(localStorage.getItem('productList'));
	const animateProducts = [];

	productList.forEach((element) => {
		if (element.productData.includes(data)) {
			animateProducts.push(element);
		}
	});

	if (
		localStorage.getItem('savedCompany') ||
		localStorage.getItem('searchList')
	) {
		localStorage.removeItem('savedCompany');
		localStorage.removeItem('searchList');
	}
	localStorage.setItem('savedCompany', JSON.stringify(animateProducts));
	loadLocalStorageData('savedCompany');
}
