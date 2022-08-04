const body = document.querySelector('body');
const burgers = body.querySelectorAll('.burger');
const backet = body.querySelector('.menu__backet');
const bag = body.querySelector('.bag');
const menuLink = body.querySelector('.menu__list');
const menuLinks = body.querySelectorAll('.menu__link');
const fixedBlocks = body.querySelectorAll('.fixed');

const productList = body.querySelectorAll('.products__item.product');

const searchField = body.querySelector('.filter__search');
const choiceButton = body.querySelectorAll('.choice__button');

const rangeInput = body.querySelector('.range__input');

loadLocalStorageData();
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

// Search =================================================
function loadGallery(data) {
	const listGallery = document.querySelector('.products__list');
	data.forEach((element) => {
		const product = element.product;
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
			productUnit.dataset.compaty = `${product}`;
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
		}
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
	const rangeInput = body.querySelector('.range__input');
	const rangeOutput = body.querySelector('.range__output');
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

function getObjectsList(productList) {
	const productObjectList = [];
	productList.forEach((element) => {
		const product = {
			product: element.dataset.company,
			productLink: element.querySelector('.product__link').href,
			productImg: element.querySelector('.product__img').src,
			productAlt: element.querySelector('.product__img').alt,
			productTitle: element.querySelector('.product__title').innerHTML,
			productPrice: element.querySelector('.product__price').innerHTML,
		};
		productObjectList.push(product);
	});
	return productObjectList;
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
function addToCart(data) {
	console.log('data: ' + data.className);
}
const backetAddList = body.querySelectorAll('.product__add');

// if (productList) {
// 	productList.forEach((element) => {
// 		const backetAdd = element.querySelector('.product__add');
// 		backetAdd.addEventListener('click', (e) => {
// 			e.preventDefault();
// 			addToCart(element);
// 			// console.log('backetAdd: ' + backetAdd.className);
// 		});
// 	});
// }
