'use strict';

const body = document.querySelector('body');
const buttonAdd = body.querySelector('.todo__button');
const buttonClear = body.querySelector('.todo__clear');
const listField = body.querySelector('.todo__list');
let key = 1;
// const expirationTime = 2592000000;
const expirationTime = 100000;

// =============================================
function loadData() {
	getItemWithoutExpiry();
	loadLocalStorageData();
}

function editElement(currentKey, itemField) {
	const currentInput = itemField.querySelector('.item__input');
	const buttonEdit = itemField.querySelector('.item__btn--edit');
	if (!buttonEdit.classList.contains('active')) {
		buttonEdit.classList.toggle('active');
		currentInput.focus();
		currentInput.select(this);
		currentInput.addEventListener('focusout', function (event) {
			buttonEdit.classList.remove('active');
			const newValue = currentInput.value;
			setItemWithExpiry(newValue, currentKey);
		});
	} else {
		const newValue = currentInput.value;
		setItemWithExpiry(newValue, currentKey);
	}
}

function deleteElement(currentKey) {
	localStorage.removeItem(currentKey);
	loadData();
}

function showElement(inputValue, currentKey) {
	if (currentKey) {
		const itemField = document.createElement('li');
		itemField.classList.add('item');
		listField.appendChild(itemField);

		itemField.innerHTML = `<input type="text" class="item__input" value="${inputValue}">
	<button class="item__btn item__btn--edit" type="button"></button>
	<button class="item__btn item__btn--trush" type="button"></button>
</li>`;

		const buttonEdit = itemField.querySelector('.item__btn--edit');
		const buttonDel = itemField.querySelector('.item__btn--trush');

		buttonEdit.addEventListener('click', (e) => {
			e.preventDefault();
			editElement(currentKey, itemField);
		});

		buttonDel.addEventListener('click', (e) => {
			e.preventDefault();
			deleteElement(currentKey, itemField);
		});
	}
}

function setItemWithExpiry(value, currentKey, ttl = expirationTime) {
	const now = new Date();

	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	};

	localStorage.setItem(currentKey, JSON.stringify(item));
	loadData();
	if (key <= currentKey) {
		key = Number(currentKey) + 1;
	}
}

function getItemWithoutExpiry() {
	if (localStorage.length > 0) {
		for (let i = 0; i < localStorage.length; i++) {
			let currentKey = localStorage.key(i);
			const inputTime = JSON.parse(localStorage.getItem(currentKey)).expiry;
			const now = new Date();
			if (now.getTime() > inputTime) {
				localStorage.removeItem(currentKey);
			}
		}
	}
}

function loadLocalStorageData() {
	cleanHTML();
	if (localStorage.length > 0) {
		for (let i = 0; i < localStorage.length; i++) {
			let currentKey = localStorage.key(i);
			const inputValue = JSON.parse(localStorage.getItem(currentKey)).value;
			showElement(inputValue, currentKey);
		}
	}
}

function cleanHTML() {
	const itemFieldArray = document.querySelectorAll('.item');
	if (itemFieldArray) {
		itemFieldArray.forEach((element) => {
			element.remove();
		});
	}
}

// ===============================================
loadData();

buttonAdd.addEventListener('click', (e) => {
	e.preventDefault();
	const inputField = body.querySelector('.todo__input');
	const inputValue = inputField.value;
	if (inputValue) {
		setItemWithExpiry(inputValue, key);
		inputField.value = '';
		inputField.placeholder = 'e.g. eggs';
	} else {
		inputField.placeholder = 'enter value';
	}
});

buttonClear.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.clear();
	loadData();
	key = 1;
});
