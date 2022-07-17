'use strict';

const body = document.querySelector('body');
const widgetContent = body.querySelector('.widget__content');
const searchBtn = body.querySelector('.search__btn');
const locationInput = body.querySelector('.search__input');
const searchInfo = body.querySelector('.search__info');
const searchResult = body.querySelector('.search__result');
const labelWrapper = body.querySelector('.search__wrapper');
const locField = body.querySelector('.clouds__place');

let optionArray = [];
let forecast = null;
let locationArray = [];
let forecastArray = [];

// reads the width of the window
function checkoverflow() {
	const paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
	return paddingOffset;
}
// fixes the window when scrolling is added
function fixLayout(before, after) {
	if (before > after) {
		body.style.paddingRight = before;
	} else if (before < after) {
		body.style.paddingRight = '0';
	}
}
// forms the HTML structure for the day and fills it with data
function createDay(dayData) {
	const forecastElement = body.querySelector('.forecast');

	const temp = weekDay(dayData[0].dt_txt);
	const icon =
		'http://openweathermap.org/img/wn/' +
		dayData[0].weather[0].icon +
		'@2x.png';
	const cloudsDescription = dayData[0].weather[0].description;
	const tempMax = getTempMax(dayData) + '°C';
	const tempMin = getTempMin(dayData) + '°C';

	const forecastLink = document.createElement('a');
	forecastLink.classList.add('forecast__item');
	forecastElement.appendChild(forecastLink);

	forecastLink.innerHTML = `<div class="forecast__day">${temp}</div><div class="picture"><img class="picture__icon" src=${icon}></div><div class="forecast__clouds">${cloudsDescription}</div><div><div class="forecast__temp--max">${tempMax}</div><div class="forecast__temp--min">${tempMin}</div></div>`;

	return forecastElement;
}
// convert date to day of week
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
// determines the maximum temperature per day
function getTempMax(dayData) {
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
// determines the minimum temperature per day
function getTempMin(dayData) {
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
// query string to search for cities with the same name
function searchLocation() {
	const city = locationInput.value;
	let stringRequest = '';

	if (city) {
		stringRequest = stringRequest.concat(
			'http://api.openweathermap.org/geo/1.0/direct?q=' +
				city +
				'&lang=uk&limit=10&appid=eff59b9c302282748a7ceec43463dd55&units=metric'
		);
	} else if (city === '') {
		locationInput.placeholder = 'make a choice...';
	}

	return stringRequest;
}
// sending a request
function sendRequest(requestMessage, requestType) {
	fetch(requestMessage)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.length === 0) {
				locationInput.value = '';
				locationInput.placeholder = 'incorrect data, make a choice...';
			} else {
				switch (requestType) {
					case 'city':
						findOption(data);
						break;
					case 'weather':
						saveForecastArray(data);
						break;
				}
			}
		})
		.catch((error) => {
			alert('Oops, something went wrong\n' + error);
		});
}
// creates a list of found cities
function findOption(data) {
	cleanLabels();
	for (let i = 0; i < data.length; i++) {
		locationArray[i] = data[i];
		const optionLabel = document.createElement('label');
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
// writes the data of the selected location, deletes an already unnecessary list
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
// forecast query string for the selected location
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
// clears the list of cities
function cleanLabels() {
	const optionsField = body.querySelectorAll('.search__label');
	if (optionsField) {
		optionsField.forEach((element) => {
			element.remove();
		});
	}
}
// clears the form, removes forecast data
function cleanFields() {
	const scrollBefore = checkoverflow();
	searchBtn.classList.remove('active');
	widgetContent.classList.remove('active');
	locationInput.value = '';
	searchResult.innerHTML = '';
	searchInfo.classList.remove('selected');
	forecastArray.length = 0;
	const forecastLink = body.querySelectorAll('.forecast__item');
	if (forecastLink) {
		forecastLink.forEach((element) => {
			element.remove();
		});
	}
	const scrollAfter = checkoverflow();
	fixLayout(scrollBefore, scrollAfter);
}
// shows the weather of the current day, generates data for the forecast for all days
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
// writes data to the current day
function setDayInfo(dayData) {
	const temp = Math.round(dayData.main.temp) + '°C';
	const feels = Math.round(dayData.main.feels_like) + '°C';
	const clouds = dayData.weather[0].main;
	const icon =
		'http://openweathermap.org/img/wn/' + dayData.weather[0].icon + '@2x.png';

	const tempCurentField = document.querySelector('.temp__main');
	tempCurentField.textContent = temp;

	const feelsField = document.querySelector('.temp__feel-value');
	feelsField.textContent = feels;

	const cloudsField = document.querySelector('.clouds__type');
	cloudsField.textContent = clouds;

	const iconCurrent = document.querySelector('.picture__icon--current');
	iconCurrent.src = icon;
}
// =========================================================
searchBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (!searchBtn.classList.contains('active')) {
		const requestData = searchLocation();
		sendRequest(requestData, 'city');
	} else {
		cleanFields();
	}
});
