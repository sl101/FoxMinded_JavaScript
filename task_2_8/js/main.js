/*jshint esversion: 6 */

const body = document.querySelector('body');
const productPage = document.querySelector('.products');
const bag = body.querySelector('.bag');
const burgers = body.querySelectorAll('.burger');
const backet = body.querySelector('.menu__backet');
const menuLink = body.querySelector('.menu__list');
const menuLinks = body.querySelectorAll('.menu__link');
const fixedBlocks = body.querySelectorAll('.fixed');

const productList = body.querySelectorAll('.products__item.product');

const searchField = body.querySelector('.filter__search');
const choiceButton = body.querySelectorAll('.choice__button');

const rangeInput = body.querySelector('.range__input');

loadLocalStorageData();
rewriteBacketAmount();
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
		loadBasketStorage();
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

// Search =================================================
function loadGallery(data) {
	const listGallery = document.querySelector('.products__list');
	for (let index = 0; index < data.length; index++) {
		const element = data[index];
		const productData = element.productData;
		const productId = element.productId;
		const productLink = element.productLink;
		const productImg = element.productImg;
		const productAlt = element.productAlt;
		const productTitle = element.productTitle;
		const productPrice = element.productPrice;

		const rangeInput = body.querySelector('.range__input');
		if (Number(productPrice) <= Number(rangeInput.value)) {
			const productUnit = document.createElement('li');
			productUnit.classList.add('products__item');
			productUnit.classList.add('product');
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

function cleanGallery() {
	const gallery = document.querySelectorAll('.products__item.product');
	gallery.forEach((element) => {
		element.remove();
	});
}

function findSearchTarget(target) {
	const searchProducts = [];
	let value = false;
	if (target.value) {
		for (let index = 0; index < productsNames.length; index++) {
			const elementArray = productsNames[index].split(' ');
			elementArray.forEach((element) => {
				if (element.toLowerCase() === target.value.toLowerCase()) {
					searchProducts.push(productList[index]);
					value = true;
				}
			});
		}
		if (value) {
			cleanGallery();
			localStorage.setItem(
				'searchList',
				JSON.stringify(getObjectsList(searchProducts))
			);
			const currentData = JSON.parse(localStorage.getItem('searchList'));
			loadGallery(currentData);
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

// Company Filters ================================================
function loadLocalStorageData(data) {
	if (productPage) {
		const rangeInput = productPage.querySelector('.range__input');
		const rangeOutput = productPage.querySelector('.range__output');
		const rangeValue = localStorage.getItem('price');
		if (rangeValue) {
			rangeInput.value = rangeValue;
			rangeOutput.innerHTML = rangeValue;
		} else {
			localStorage.setItem('price', rangeInput.value);
			rangeOutput.innerHTML = rangeInput.value;
		}

		if (data) {
			const currentData = JSON.parse(localStorage.getItem(data));
			cleanGallery();
			loadGallery(currentData);
		} else {
			const productList = body.querySelectorAll('.products__item.product');
			const productData = getObjectsList(productList);
			localStorage.setItem('productList', JSON.stringify(productData));
			cleanGallery();
			const currentData = JSON.parse(localStorage.getItem('productList'));
			loadGallery(currentData);
		}
	}
}

function getObjectsList(productList) {
	const productObjectList = [];
	productList.forEach((element) => {
		productObjectList.push(writeProduct(element));
	});
	return productObjectList;
}

function writeProduct(data, amount = 1) {
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

function setAnimation(data) {
	if (productList) {
		const animateProducts = [];
		productList.forEach((element) => {
			if (element.dataset.company.includes(data)) {
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
		localStorage.setItem(
			'savedCompany',
			JSON.stringify(getObjectsList(animateProducts))
		);
		loadLocalStorageData('savedCompany');
	}
}

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

// Range ==========================================
if (rangeInput) {
	rangeInput.addEventListener('change', () => {
		localStorage.setItem('price', rangeInput.value);

		if (localStorage.getItem('searchList') !== null) {
			loadLocalStorageData('searchList');
		} else if (localStorage.getItem('savedCompany') !== null) {
			loadLocalStorageData('savedCompany');
		} else {
			loadLocalStorageData('productList');
		}
	});
}

// Backet ==============================================
function addToStorage(data) {
	const element = writeProduct(data);
	let existingEntries = JSON.parse(localStorage.getItem('backet'));
	if (existingEntries == null) existingEntries = [];
	existingEntries.push(element);
	localStorage.setItem('backet', JSON.stringify(existingEntries));
	loadBasketStorage();
}

function cleanBagList() {
	const itemList = document.querySelectorAll('.bag__item');
	itemList.forEach((element) => {
		element.remove();
	});
}

function loadBasketStorage() {
	cleanBagList();

	let existingEntries = JSON.parse(localStorage.getItem('backet'));
	const bagList = document.querySelector('.bag__list');

	if (existingEntries) {
		rewriteBacketAmount();

		existingEntries.forEach((element) => {
			let execute = true;

			const orderLink = element.productLink;
			const orderData = element.productData;
			const orderId = element.productId;
			const orderImg = element.productImg;
			const orderAlt = element.productAlt;
			const orderTitle = element.productTitle;
			const orderPrice = element.productPrice;
			let orderValue = element.productAmount;

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
					execute = false;
				}
			});

			if (execute) {
				const orderUnit = document.createElement('li');
				orderUnit.classList.add('bag__item');
				orderUnit.classList.add('order');
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
}

function removeOrder(product) {
	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	const newArray = [];
	for (let index = 0; index < existingEntries.length; index++) {
		const element = existingEntries[index];
		if (product.id !== element.productId) {
			newArray.push(element);
		}
	}
	localStorage.setItem('backet', JSON.stringify(newArray));
	product.remove();

	rewriteBacketAmount();
}

function rewriteBacketAmount() {
	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	if (existingEntries) {
		const backetAmount = document.querySelector('.menu__amount');
		backetAmount.innerHTML = existingEntries.length;
		const bagSumm = document.querySelector('.bag__summ');
		let totalSumm = '';
		existingEntries.forEach((element) => {
			totalSumm = Number(totalSumm) + Number(element.productPrice);
		});
		bagSumm.innerHTML = totalSumm.toFixed(2);
	}
}

function increaseAmount(product) {
	const valueField = product.querySelector('.amount-order__value');
	const value = valueField.innerHTML;
	valueField.innerHTML = Number(value) + 1;
	const orderDown = product.querySelector('.amount-order__bottom');
	orderDown.style.opacity = 1;
	orderDown.style.cursor = 'pointer';

	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	let newElement = '';
	let rewrite = true;
	for (let index = 0; index < existingEntries.length; index++) {
		if (rewrite) {
			const element = existingEntries[index];
			if (product.id === element.productId) {
				newElement = index;
				rewrite = false;
			}
		}
	}
	existingEntries.push(existingEntries[newElement]);
	localStorage.setItem('backet', JSON.stringify(existingEntries));
	rewriteBacketAmount();
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

	const existingEntries = JSON.parse(localStorage.getItem('backet'));
	let newElement = '';
	let rewrite = true;
	for (let index = 0; index < existingEntries.length; index++) {
		if (rewrite) {
			const element = existingEntries[index];
			if (product.id === element.productId) {
				newElement = index;
				rewrite = false;
			}
		}
	}
	existingEntries.splice(newElement, 1);
	localStorage.setItem('backet', JSON.stringify(existingEntries));
	rewriteBacketAmount();
}
