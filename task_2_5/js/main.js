'use strict';

const body = document.querySelector('body');
const widgetContent = body.querySelector('.widget__content');
const searchBtn = body.querySelector('.search__btn');
const locationInput = body.querySelector('.search__input');
const searchInfo = body.querySelector('.search__info');
const searchResult = body.querySelector('.search__result');
const labelWrapper = body.querySelector('.search__wrapper');
const locField = body.querySelector('.clouds__place');

let optionLabel = null;
let optionArray = [];
let forecast = null;
let locationArray = [];
let forecastArray = [];

// Fix layout =================================================
function checkoverflow() {
	const paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
	return paddingOffset;
}

function fixLayout(before, after) {
	console.log('before: ' + before);
	console.log('after: ' + after);
	if (before > after) {
		body.style.paddingRight = before;
	} else if (before < after) {
		body.style.paddingRight = '0';
	}
}
// ==========================

function createDay(dayData) {
	const forecastElement = body.querySelector('.forecast');

	const forecastLink = document.createElement('a');
	forecastLink.classList.add('forecast__item');
	forecastElement.appendChild(forecastLink);

	const dayField = document.createElement('div');
	dayField.classList.add('forecast__day');
	dayField.textContent = weekDay(dayData[0].dt_txt);
	forecastLink.appendChild(dayField);

	const pictureField = document.createElement('div');
	pictureField.classList.add('picture');
	forecastLink.appendChild(pictureField);

	const iconField = document.createElement('img');
	iconField.classList.add('picture__icon');
	iconField.src =
		'http://openweathermap.org/img/wn/' +
		dayData[0].weather[0].icon +
		'@2x.png';
	pictureField.appendChild(iconField);

	const cloudsDescrField = document.createElement('div');
	cloudsDescrField.classList.add('forecast__clouds');
	cloudsDescrField.textContent = dayData[0].weather[0].description;
	forecastLink.appendChild(cloudsDescrField);

	const forecastValue = document.createElement('div');
	forecastLink.appendChild(forecastValue);

	const maxField = document.createElement('div');
	maxField.classList.add('forecast__temp--max');
	maxField.textContent = tempMax(dayData) + '°C';
	forecastValue.appendChild(maxField);

	const minField = document.createElement('div');
	minField.classList.add('forecast__temp--min');
	minField.textContent = tempMin(dayData) + '°C';
	forecastValue.appendChild(minField);

	return forecastElement;
}

function weekDay(day) {
	const date = day.split(' ');
	const dayNum = new Date(date[0]).getDay();
	let result = '';
	switch (dayNum) {
		case 0:
			result = result.concat('Sun');
			break;
		case 1:
			result = result.concat('Mon');
			break;
		case 2:
			result = result.concat('Tue');
			break;
		case 3:
			result = result.concat('Wed');
			break;
		case 4:
			result = result.concat('Thu');
			break;
		case 5:
			result = result.concat('Fri');
			break;
		case 6:
			result = result.concat('Sat');
			break;
	}

	return result;
}

function tempMax(dayData) {
	let tempMax = dayData[0].main.temp_max;
	for (let index = 0; index < dayData.length; index++) {
		const element = dayData[index];

		if (tempMax < element.main.temp_max) {
			tempMax = element.main.temp_max;
		}
	}

	tempMax = Math.round(tempMax);
	return tempMax;
}

function tempMin(dayData) {
	let tempMin = dayData[0].main.temp_min;
	for (let index = 0; index < dayData.length; index++) {
		const element = dayData[index];

		if (tempMin > element.main.temp_min) {
			tempMin = element.main.temp_min;
		}
	}

	tempMin = Math.round(tempMin);
	return tempMin;
}

function getLocation() {
	const city = locationInput.value;

	if (city) {
		const cityRequest =
			'http://api.openweathermap.org/geo/1.0/direct?q=' +
			city +
			'&lang=uk&limit=10&appid=eff59b9c302282748a7ceec43463dd55&units=metric';
		sendRequest(cityRequest, 'city');
	} else if (city === '') {
		locationInput.placeholder = 'make a choice...';
	}
}

function sendRequest(requestMessage, requestType) {
	const request = new XMLHttpRequest();
	request.open('GET', requestMessage, true);
	request.responseType = 'json';
	request.send();

	request.onload = function () {
		try {
			const data = request.response;

			switch (requestType) {
				case 'city':
					if (data.length === 0) {
						locationInput.value = '';
						locationInput.placeholder = 'incorrect data, make a choice...';
					} else {
						findOption(data);
					}
					break;
				case 'weather':
					if (data.length === 0) {
						locationInput.value = '';
						locationInput.placeholder = 'Oops, something went wrong...';
					} else {
						saveForecastArray(data);
					}
					break;
			}
		} catch (error) {
			alert('Oops, something went wrong\n' + error);
		}
	};
}

function findOption(data) {
	cleanOptions();
	for (let i = 0; i < data.length; i++) {
		locationArray[i] = data[i];
		optionLabel = document.createElement('label');
		optionLabel.classList.add('search__label');
		let name = data[i].name;
		let localName = '';
		let state = '';
		let country = '';
		if (data[i].local_names) {
			if (data[i].local_names.uk) {
				localName = localName.concat(', ' + data[i].local_names.uk);
			}
		}
		if (data[i].state) {
			state = state.concat(', ' + data[i].state);
		}
		if (data[i].country) {
			country = country.concat(', ' + data[i].country);
		}
		const optionValue = name + localName + state + country;
		optionLabel.innerHTML = optionValue;

		labelWrapper.appendChild(optionLabel);
		optionArray[i] = optionLabel;
	}
	setupChoise();
}

function setupChoise() {
	const optionsAfter = document.querySelectorAll('.search__label');

	if (optionsAfter) {
		for (let index = 0; index < optionsAfter.length; index++) {
			const element = optionsAfter[index];
			element.addEventListener('click', (e) => {
				e.preventDefault();
				locationInput.value = element.textContent;
				searchResult.innerHTML = element.textContent;
				labelWrapper.classList.remove('active');
				searchBtn.classList.add('active');
				searchInfo.classList.add('selected');
				optionsAfter.forEach((el) => {
					el.remove();
				});
				weatherRequest(locationArray[index]);
			});
		}
	}
}

function weatherRequest(locationData) {
	const selectedLocation = locationData.name + ', ' + locationData.country;
	const forecastRequest =
		'https://api.openweathermap.org/data/2.5/forecast?lat=' +
		locationData.lat +
		'&lon=' +
		locationData.lon +
		'&appid=eff59b9c302282748a7ceec43463dd55&units=metric';

	locField.textContent = selectedLocation;
	sendRequest(forecastRequest, 'weather');
}

function cleanOptions() {
	const optionsField = body.querySelectorAll('.search__label');
	if (optionsField) {
		optionsField.forEach((element) => {
			element.remove();
		});
	}
}

function cleanFields() {
	const forecastLink = body.querySelectorAll('.forecast__item');
	if (forecastLink) {
		forecastLink.forEach((element) => {
			element.remove();
		});
	}
}

function saveForecastArray(jsonObj) {
	const timePeriods = 8;
	const forecastDataArray = [];
	const scrollBefore = checkoverflow();

	for (let index = 0; index < jsonObj.list.length; index += timePeriods) {
		forecastDataArray.push(jsonObj.list.slice(index, index + timePeriods));
	}

	for (let index = 0; index < forecastDataArray.length; index++) {
		const element = forecastDataArray[index];
		forecastArray.push(createDay(element));
	}

	widgetContent.classList.add('active');

	const scrollAfter = checkoverflow();
	fixLayout(scrollBefore, scrollAfter);

	const dayLinks = document.querySelectorAll('.forecast__item');
	setDayInfo(forecastDataArray[0][0]);

	for (let index = 0; index < dayLinks.length; index++) {
		const element = dayLinks[index];
		element.addEventListener('click', (e) => {
			e.preventDefault();
			setDayInfo(forecastDataArray[index][0]);
		});
	}
}

function setDayInfo(dayData) {
	const tempCurentField = document.querySelector('.temp__main');
	tempCurentField.textContent = Math.round(dayData.main.temp) + '°C';

	const feelsField = document.querySelector('.temp__feel-value');
	feelsField.textContent = Math.round(dayData.main.feels_like) + '°C';

	const cloudsField = document.querySelector('.clouds__type');
	cloudsField.textContent = dayData.weather[0].main;

	const iconCurrent = document.querySelector('.picture__icon--current');
	const icon =
		'http://openweathermap.org/img/wn/' + dayData.weather[0].icon + '@2x.png';
	iconCurrent.src = icon;
}

// =========================================================
searchBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (!searchBtn.classList.contains('active')) {
		getLocation();
	} else {
		const scrollBefore = checkoverflow();
		searchBtn.classList.remove('active');
		widgetContent.classList.remove('active');
		locationInput.value = '';
		searchResult.innerHTML = '';
		searchInfo.classList.remove('selected');
		forecastArray.length = 0;
		cleanFields();
		const scrollAfter = checkoverflow();
		fixLayout(scrollBefore, scrollAfter);
	}
});
