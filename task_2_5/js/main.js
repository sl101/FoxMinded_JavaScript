'use strict';

const body = document.querySelector('body');
const locationInput = body.querySelector('.search__input');
const searchBtn = body.querySelector('.search__btn');
const labelWrapper = body.querySelector('.search__wrapper');
const labelTop = body.querySelector('.search__top');
const searchResult = body.querySelector('.search__result');

let option = null;
let data = null;
let dataString = [];
let city = null;
let cityRequest = '';

let optionArray = [];

function sendRequest(requestMessage) {
	const request = new XMLHttpRequest();
	request.open('GET', requestMessage, true);
	// cleanOptions();
	request.send();

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			data = JSON.parse(request.responseText);
			// dataString = data.concat(dataString);
			// console.log('dataString: ' + dataString);
			// console.log(data);
			if (data.length === 0) {
				// console.log('data 0');
				locationInput.value = 'incorrect data, make a choice...';
				// locationInput.placeholder = 'uncorrect data, make a choice...';
			} else {
				findOption(data);
			}
		} else {
			alert('Oops, something went wrong');
		}
	};

	// data.forEach((element) => {
	// console.log(JSON.stringify(element));
	// console.log(JSON.parse(element));
	// console.table(JSON.parse(element));
	// });
}

function cleanOptions() {
	const options = document.querySelectorAll('.search__label');
	if (options) {
		options.forEach((element) => {
			element.remove();
		});
		labelWrapper.classList.remove('active');
	}
}

function getLocation() {
	city = locationInput.value;
	// console.log('city: ' + city);

	if (city) {
		cityRequest = cityRequest.concat(
			'http://api.openweathermap.org/geo/1.0/direct?q=' +
				city +
				'&lang=uk&limit=10&appid=eff59b9c302282748a7ceec43463dd55&units=metric'
		);
		sendRequest(cityRequest);
	} else if (city === '') {
		locationInput.placeholder = 'make a choice...';
	}
}

function setupChoise() {
	const optionsAfter = document.querySelectorAll('.search__label');

	if (optionsAfter) {
		optionsAfter.forEach((element) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				locationInput.value = element.textContent;
				searchResult.innerHTML = element.textContent;
				labelWrapper.classList.remove('active');
				searchBtn.classList.add('active');
				optionsAfter.forEach((el) => {
					el.remove();
				});
				const locationData = locationInput.value;
				weatherRequest(locationData);
			});
		});
	}
}

function weatherRequest(locationData) {
	console.log('start weatherRequest' + locationData);
}

function findOption(data) {
	cleanOptions();
	for (let i = 0; i < data.length; i++) {
		// console.log(data[i]);
		// console.table(JSON.stringify(data[i]));
		// option.value = data[i];
		option = document.createElement('label');
		option.classList.add('search__label');
		let optionValue = data[i].name;
		if (data[i].state) {
			optionValue = optionValue.concat(
				', ' +
					data[i].local_names.uk +
					', ' +
					data[i].state +
					', ' +
					data[i].country
			);
		} else {
			optionValue = optionValue.concat(
				', ' + data[i].local_names.uk + ', ' + data[i].country
			);
		}
		option.innerHTML = optionValue;
		labelWrapper.classList.add('active');

		labelWrapper.appendChild(option);
		optionArray[i] = option;
	}

	setupChoise();
}

// =========================================================
searchBtn.addEventListener('click', (e) => {
	e.preventDefault();

	if (!searchBtn.classList.contains('active')) {
		getLocation();
	} else {
		searchBtn.classList.remove('active');
		locationInput.value = '';
		searchResult.innerHTML = '';
	}
});

// =================================
// https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

// cityRequest = cityRequest.concat(
// 	'https://api.openweathermap.org/data/2.5/weather?q=' +
// 		city +
// 		'&appid=eff59b9c302282748a7ceec43463dd55'
// );
