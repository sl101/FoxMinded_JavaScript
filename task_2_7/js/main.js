'use strict';

function openCloseFilter() {
	if (filterButton.classList.contains('_active')) {
		filterButton.classList.remove('_active');
		filterList.classList.remove('_active');
	} else {
		filterButton.classList.add('_active');
		filterList.classList.add('_active');
	}
}

function sendRequest(requestUrl) {
	fetch(requestUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.length) {
				saveCountryArray(data);
			}
		})
		.catch((error) => {
			alert('Oops, something went wrong\n' + error);
		});
}

function saveCountryArray(data) {
	const regionsList = ['All regions'];
	for (let index = 0; index < data.length; index++) {
		const element = data[index];
		const region = element.region;
		allCountriesList.push(element);
		countryNameArray.push(element.name);

		if (!regionsList.includes(region)) {
			regionsList.push(region);
		}
	}
	loadCountryList();
	createFilterList(regionsList);
}

function createFilterList(dataArray) {
	if (dataArray) {
		dataArray.forEach((element) => {
			const itemField = document.createElement('li');
			itemField.classList.add('filter__item');
			filterList.appendChild(itemField);

			itemField.innerHTML = `<label class="filter__label">
			${element}<input class="filter__input" type="radio" name="region">
			</label>`;

			itemField.addEventListener('click', (e) => {
				e.preventDefault();
				const searchInput = document.querySelector('.search__input');
				searchInput.value = '';

				const region = itemField.firstElementChild.innerText;
				openCloseFilter();
				filterButton.innerHTML = region;
				loadCountryList(region);
			});
		});
	}
}

function loadCountryList(region = 'All regions') {
	cleanHTML();
	const currentArray = [];

	allCountriesList.forEach((element) => {
		if (region === 'All regions') {
			currentArray.push(element);
		} else if (element.region === region) {
			currentArray.push(element);
		}
	});

	currentArray.forEach((element) => {
		loadCountry(element);
	});
}

function loadCountry(element) {
	const flag = element.flags.png;
	const country = element.name;
	const population = element.population;
	const region = element.region;
	const capital = element.capital;

	const cardUnit = document.createElement('li');
	cardUnit.classList.add('card__unit');
	cardUnit.classList.add('change-theme');
	cardsList.appendChild(cardUnit);

	cardUnit.innerHTML = `<div class="card__picture">
		<img class="card__img" src=${flag} alt=${country}" country flag">
	</div>
	<div class="card__content">
		<div class="card__title">${country}</div>
		<ul class="card__list">
			<li class="card__item">
				<span class="card__subtitle">Population:</span>
				<span class="card__value">${population}</span>
			</li>
			<li class="card__item">
				<span class="card__subtitle">Region:</span>
				<span class="card__value">${region}</span>
			</li>
			<li class="card__item">
				<span class="card__subtitle">Capital:</span>
				<span class="card__value">${capital}</span>
			</li>
		</ul>
	</div>`;

	getSavedTheme();
}

function cleanHTML() {
	const cardsArray = cardsList.querySelectorAll('.card__unit');
	cardsArray.forEach((element) => {
		element.remove();
	});
}

function readSearchData() {
	const searchInput = body.querySelector('.search__input');
	const searchData = searchInput.value;

	if (searchData) {
		if (!countryNameArray.includes(searchData)) {
			searchInput.value = '';
			searchInput.placeholder = 'Incorrectly entered data...';
		} else {
			for (let index = 0; index < countryNameArray.length; index++) {
				const element = countryNameArray[index];
				if (element === searchData) {
					cleanHTML();
					loadCountry(allCountriesList[index]);
					break;
				}
			}
		}
	} else {
		searchInput.placeholder = 'Make a choice...';
	}
}

function applyTheme(themeName) {
	const changeStyleField = document.querySelectorAll('.change-theme');
	changeStyleField.forEach((element) => {
		element.classList.remove('dark');
		element.classList.add(`${themeName}`);
	});

	themeButton.forEach((button) => {
		button.style.display = 'flex';
	});
	document.querySelector(`[data-theme="${themeName}"]`).style.display = 'none';
	localStorage.setItem('theme', themeName);
}

function getSavedTheme() {
	let activeTheme = localStorage.getItem('theme');
	if (activeTheme === null || activeTheme === 'light') {
		applyTheme('light');
	} else if (activeTheme === 'dark') {
		applyTheme('dark');
	}
}

// ========================================================
const body = document.querySelector('body');
const filterList = body.querySelector('.filter__list');
const filterButton = body.querySelector('.filter__button');
const cardsList = body.querySelector('.page__list');
const searchButton = body.querySelector('.search__btn');
const themeButton = body.querySelectorAll('.header__button');

const requestUrl = 'https://restcountries.com/v2/all';
const allCountriesList = [];
const countryNameArray = [];

getSavedTheme();

filterButton.addEventListener('click', (e) => {
	e.preventDefault();
	openCloseFilter();
});

searchButton.addEventListener('click', (e) => {
	e.preventDefault();
	if (filterButton.classList.contains('_active')) {
		filterButton.classList.remove('_active');
		filterList.classList.remove('_active');
	}
	filterButton.innerHTML = 'Filter by Region';
	readSearchData();
	getSavedTheme();
});

themeButton.forEach((element) => {
	element.addEventListener('click', (e) => {
		e.preventDefault();
		let theme = element.dataset.theme;
		applyTheme(theme);
	});
});

sendRequest(requestUrl);
