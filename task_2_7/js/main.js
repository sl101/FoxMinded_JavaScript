'use strict';

function checkoverflow() {
	const paddingOffset = `${window.innerWidth - document.body.offsetWidth}px`;
	return paddingOffset;
}

function fixLayout(before, after) {
	if (before > after) {
		body.style.paddingRight = before;
	} else if (before < after) {
		body.style.paddingRight = '0';
	}
}

function openCloseFilter() {
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

		if (!regionsList.includes(region)) {
			regionsList.push(region);
		}
	}
	console.log('allCountriesList__1: ' + allCountriesList.length);
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
		const flag = element.flags.png;
		const country = element.name;
		const population = element.population;
		const region = element.region;
		const capital = element.capital;

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
	});
}

function cleanHTML() {
	const cardsArray = cardsList.querySelectorAll('.card__unit');
	cardsArray.forEach((element) => {
		element.remove();
	});
}

// ========================================================
const body = document.querySelector('body');
const filterList = body.querySelector('.filter__list');
const filterButton = body.querySelector('.filter__button');
const cardsList = body.querySelector('.page__list');

const requestUrl = 'https://restcountries.com/v2/all';
const allCountriesList = [];

filterButton.addEventListener('click', (e) => {
	e.preventDefault();
	openCloseFilter();
});

sendRequest(requestUrl);
