'use strict';

const body = document.querySelector('body');
const filterList = body.querySelector('.filter__list');
const filterButton = body.querySelector('.filter__button');
const cardsList = body.querySelector('.page__list');
const searchInput = body.querySelector('.search__input');
const searchButton = body.querySelector('.search__btn');
const themeButton = body.querySelectorAll('.header__button');

const requestUrl = 'https://restcountries.com/v2/all';
const allCountriesList = [];
const countryNameArray = [];
let targetEvent = '';

function toggleFilter() {
	if (filterButton.classList.contains('active')) {
		filterButton.classList.remove('active');
		filterList.classList.remove('active');
	} else {
		filterButton.classList.add('active');
		filterList.classList.add('active');
	}
}

function sendRequest(requestUrl) {
	fetch(requestUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.length) {
				saveCountries(data);
			}
		})
		.catch((error) => {
			alert('Oops, something went wrong\n' + error);
		});
}

function saveCountries(data) {
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
	createFilters(regionsList);
}

function createFilters(data) {
	if (data) {
		data.forEach((element) => {
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
				toggleFilter();
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
	let capitalStr = '';
	if (element.capital) {
		capitalStr = element.capital;
	} else {
		capitalStr = 'no data';
	}

	let [flag, country, population, region, capital] = [
		element.flags.png,
		element.name,
		element.population,
		element.region,
		capitalStr,
	];

	const cardUnit = document.createElement('li');
	cardUnit.classList.add('card__unit');
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
	applyTheme(getSavedTheme());
}

function cleanHTML() {
	const cardsArray = cardsList.querySelectorAll('.card__unit');
	cardsArray.forEach((element) => {
		element.remove();
	});
}

function getSearchData() {
	const searchData = searchInput.value;
	if (searchData) {
		if (!countryNameArray.includes(searchData)) {
			searchInput.value = '';
			searchButton.style.color = '#dadada';
			searchInput.placeholder = 'Incorrectly entered data...';
		} else {
			filterCountry(searchData);
		}
	} else {
		searchInput.placeholder = 'Make a choice...';
	}
}

function filterCountry(data) {
	for (let index = 0; index < countryNameArray.length; index++) {
		const element = countryNameArray[index];
		if (element === data) {
			cleanHTML();
			loadCountry(allCountriesList[index]);
			break;
		}
	}
}

function applyTheme(themeName) {
	body.classList.remove('dark');
	if (themeName === 'dark') {
		body.classList.add(`${themeName}`);
	}

	themeButton.forEach((button) => {
		button.style.display = 'flex';
	});
	document.querySelector(`[data-theme="${themeName}"]`).style.display = 'none';
	localStorage.setItem('theme', themeName);
}

function getSavedTheme() {
	return localStorage.getItem('theme');
}

function closeFilter() {
	if (filterButton.classList.contains('active')) {
		filterButton.classList.remove('active');
		filterList.classList.remove('active');
	}
	filterButton.innerHTML = 'Filter by Region';
}

// Listeners ================================================
filterButton.addEventListener('click', (e) => {
	e.preventDefault();
	toggleFilter();
});

searchInput.addEventListener('input', () => {
	if (searchInput.value) {
		searchButton.style.color = 'teal';
	} else {
		searchButton.style.color = 'red';
	}
});

searchInput.addEventListener('blur', (e) => {
	e.preventDefault();
	targetEvent = e.target.tagName;

	if (searchInput.value) {
		closeFilter();
		getSearchData();
		applyTheme(getSavedTheme());
	}
});

document.addEventListener('keydown', (e) => {
	if (e.keyCode === 27) {
		searchInput.value = '';
		searchInput.placeholder = 'Make a choice...';
	}
});

searchButton.addEventListener('click', (e) => {
	e.preventDefault();
	const searchData = searchInput.value;
	if (!searchData && targetEvent !== 'INPUT') {
		searchInput.placeholder = 'Make a choice...';
	}
});

// START ===================================================
themeButton.forEach((element) => {
	element.addEventListener('click', (e) => {
		e.preventDefault();
		const theme = element.dataset.theme;
		applyTheme(theme);
	});
});

applyTheme(getSavedTheme());

sendRequest(requestUrl);
