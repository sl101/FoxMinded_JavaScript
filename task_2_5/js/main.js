'use strict';

const body = document.querySelector('body');
const locationInput = body.querySelector('.search__input');
const searchBtn = body.querySelector('.search__btn');
const labelWrapper = body.querySelector('.search__wrapper');
const searchResult = body.querySelector('.search__result');
const locField = document.querySelector('.clouds__place');

let option = null;
let optionArray = [];
let forecast = null;
let locationArray = [];
let forecastArray = [];

class Forecast {
	constructor(jsonObj) {
		this.name = jsonObj.name;
		this.local_names = jsonObj.local_names;
		this.state = jsonObj.state;
		this.country = jsonObj.country;
		this.lat = jsonObj.lat;
		this.lon = jsonObj.lon;
	}

	getName() {
		return this.name;
	}

	getLocal() {
		if (this.local_names) {
			if (this.local_names.uk) {
				return this.local_names.uk;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	getState() {
		return this.state;
	}

	getCountry() {
		return this.country;
	}

	getLat() {
		return this.lat;
	}

	getLon() {
		return this.lon;
	}
}

class DayForecast {
	constructor() {
		this.forecastElement = document.querySelector('.forecast');

		this.forecastLink = document.createElement('a');
		this.forecastLink.classList.add('forecast__item');
		this.forecastElement.appendChild(this.forecastLink);

		this.dayField = document.createElement('div');
		this.dayField.classList.add('forecast__day');
		this.forecastLink.appendChild(this.dayField);

		this.pictureField = document.createElement('div');
		this.pictureField.classList.add('picture');
		this.forecastLink.appendChild(this.pictureField);

		this.iconField = document.createElement('img');
		this.iconField.classList.add('picture__icon');
		this.pictureField.appendChild(this.iconField);

		this.cloudsDescrField = document.createElement('div');
		this.cloudsDescrField.classList.add('forecast__clouds');
		this.forecastLink.appendChild(this.cloudsDescrField);

		this.forecastValue = document.createElement('div');
		this.forecastValue.classList.add('forecast__value');
		this.forecastLink.appendChild(this.forecastValue);

		this.maxField = document.createElement('div');
		this.maxField.classList.add('forecast__temp--max');
		this.forecastValue.appendChild(this.maxField);

		this.minField = document.createElement('div');
		this.minField.classList.add('forecast__temp--min');
		this.forecastValue.appendChild(this.minField);
	}

	setLink(data) {
		this.forecastLink.classList.add(data);
	}

	getLink() {
		return this.forecastLink;
	}

	setDay(dayData) {
		let currentMessage = '';
		if (dayData) {
			currentMessage = currentMessage.concat(this.weekDay(dayData[0].dt_txt));
		} else {
			currentMessage = currentMessage.concat('- -');
		}
		this.day = currentMessage;
	}

	getDay() {
		this.dayField.textContent = this.day;
	}

	weekDay(day) {
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

	setIcon(dayData) {
		let currentMessage = '';
		if (dayData) {
			let iconNum = dayData[0].weather[0].icon;
			currentMessage = currentMessage.concat(
				'http://openweathermap.org/img/wn/' + iconNum + '@2x.png'
			);
		} else {
			currentMessage = currentMessage.concat('../img/loading.gif');
		}
		this.icon = currentMessage;
	}

	getIcon() {
		this.iconField.src = this.icon;
	}

	getCurrentIcont() {
		if (this.forecastLink.classList.contains('active')) {
			this.iconCurrent = document.querySelector('.picture__icon--current');
			this.iconCurrent.src = this.icon;
		}
	}

	setCloudsDescr(dayData) {
		let currentMessage = '';
		if (dayData) {
			currentMessage = currentMessage.concat(dayData[0].weather[0].description);
		} else {
			currentMessage = currentMessage.concat('- -');
		}
		this.clouds = currentMessage;
	}

	getCloudsDescr() {
		this.cloudsDescrField.textContent = this.clouds;
	}

	setTemp(dayData) {
		let currentMessageMax = '';
		let currentMessageMin = '';
		if (dayData) {
			let tempMax = dayData[0].main.temp_max;
			let tempMin = dayData[0].main.temp_min;

			for (let index = 0; index < dayData.length; index++) {
				const element = dayData[index];

				if (tempMax < element.main.temp_max) {
					tempMax = element.main.temp_max;
				}

				if (tempMin > element.main.temp_min) {
					tempMin = element.main.temp_min;
				}
			}

			tempMax = Math.round(tempMax);
			tempMin = Math.round(tempMin);

			currentMessageMax = currentMessageMax.concat(tempMax + '°C');
			currentMessageMin = currentMessageMin.concat(tempMin + '°C');
		} else {
			currentMessageMax = currentMessageMax.concat('- -');
			currentMessageMin = currentMessageMin.concat('- -');
		}

		this.tempMax = currentMessageMax;
		this.tempMin = currentMessageMin;
	}

	getTemp() {
		this.maxField.textContent = this.tempMax;
		this.minField.textContent = this.tempMin;
	}

	setTempCurrent(dayData) {
		let currentMessage = '';
		if (dayData) {
			currentMessage = currentMessage.concat(
				Math.round(dayData[0].main.temp) + '°C'
			);
		} else {
			currentMessage = currentMessage.concat('--' + '°С');
		}
		this.tempCurrent = currentMessage;
	}

	getTempCurrent() {
		if (this.forecastLink.classList.contains('active')) {
			this.tempCurentField = document.querySelector('.temp__main');
			this.tempCurentField.textContent = this.tempCurrent;
		}
	}

	setCurrentFeels(dayData) {
		let currentMessage = '';
		if (dayData) {
			currentMessage = currentMessage.concat(
				Math.round(dayData[0].main.feels_like) + '°C'
			);
		} else {
			currentMessage = currentMessage.concat('- -');
		}
		this.feels = currentMessage;
	}

	getCurrentFeels() {
		if (this.forecastLink.classList.contains('active')) {
			this.feelsField = document.querySelector('.temp__feel-value');
			this.feelsField.textContent = this.feels;
		}
	}

	setCurrentClouds(dayData) {
		let currentMessage = '';
		if (dayData) {
			currentMessage = currentMessage.concat(dayData[0].weather[0].main);
		} else {
			currentMessage = currentMessage.concat('- -');
		}
		this.cloudsCurrent = currentMessage;
	}

	getCurrentClouds() {
		if (this.forecastLink.classList.contains('active')) {
			this.cloudsField = document.querySelector('.clouds__type');
			this.cloudsField.textContent = this.cloudsCurrent;
		}
	}

	setCurrentLocation(dayData) {
		let currentMessage = '';

		if (dayData) {
			currentMessage = currentMessage.concat(dayData);
		} else {
			currentMessage = currentMessage.concat('--');
		}
		this.loc.textContent = currentMessage;
	}

	setVariables(dayData) {
		this.setDay(dayData);
		this.setIcon(dayData);
		this.setCloudsDescr(dayData);
		this.setTemp(dayData);
		this.setTempCurrent(dayData);
		this.setCurrentClouds(dayData);
		this.setCurrentFeels(dayData);
	}

	getVariables() {
		this.getDay();
		this.getIcon();
		this.getCurrentIcont();
		this.getCloudsDescr();
		this.getTemp();
		this.getTempCurrent();
		this.getCurrentClouds();
		this.getCurrentFeels();
	}
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
		if (request.status >= 200 && request.status < 400) {
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
						saveForecastArrray(data);
					}
					break;
			}
		} else {
			alert('Oops, something went wrong');
		}
	};
}

function findOption(data) {
	cleanOptions();
	for (let i = 0; i < data.length; i++) {
		const forecastTemp = new Forecast(data[i]);
		locationArray[i] = forecastTemp;
		option = document.createElement('label');
		option.classList.add('search__label');
		let optionValue = data[i].name;
		if (data[i].local_names) {
			if (data[i].local_names.uk) {
				optionValue = optionValue.concat(', ' + data[i].local_names.uk);
			}
		}
		if (data[i].state) {
			optionValue = optionValue.concat(', ' + data[i].state);
		}
		if (data[i].country) {
			optionValue = optionValue.concat(', ' + data[i].country);
		}

		option.innerHTML = optionValue;
		labelWrapper.classList.add('active');

		labelWrapper.appendChild(option);
		optionArray[i] = option;
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
				optionsAfter.forEach((el) => {
					el.remove();
				});
				forecast = new Forecast(locationArray[index]);
				weatherRequest(forecast);
			});
		}
	}
}

function weatherRequest(locationData) {
	const selectedLocation =
		locationData.getName() + ', ' + locationData.getCountry();
	const forecastRequest =
		'https://api.openweathermap.org/data/2.5/forecast?lat=' +
		locationData.getLat() +
		'&lon=' +
		locationData.getLon() +
		'&appid=eff59b9c302282748a7ceec43463dd55&units=metric';

	locField.textContent = selectedLocation;
	sendRequest(forecastRequest, 'weather');
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

function saveForecastArrray(jsonObj) {
	const timePeriods = 8;
	const forecastDataArray = [];
	for (let index = 0; index < jsonObj.list.length; index += timePeriods) {
		forecastDataArray.push(jsonObj.list.slice(index, index + timePeriods));
	}

	for (let index = 0; index < forecastDataArray.length; index++) {
		const element = forecastDataArray[index];
		forecastArray[index].setVariables(element);
		forecastArray[index].getVariables();
	}
}

// =========================================================
for (let index = 0; index < 5; index++) {
	const forecastDay = new DayForecast();
	forecastDay.setVariables('');

	if (index === 0) {
		forecastDay.setLink('active');
	}

	forecastDay.getVariables();
	forecastArray.push(forecastDay);
	locField.textContent = '- -';

	forecastDay.getLink().addEventListener('click', (e) => {
		e.preventDefault();
		for (let index = 0; index < forecastArray.length; index++) {
			const element = forecastArray[index];
			element.getLink().classList.remove('active');
		}
		forecastDay.getLink().classList.add('active');
		forecastDay.getVariables();
	});
}

searchBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (!searchBtn.classList.contains('active')) {
		getLocation();
	} else {
		searchBtn.classList.remove('active');
		locationInput.value = '';
		searchResult.innerHTML = '';
		for (let index = 0; index < forecastArray.length; index++) {
			forecastArray[index].setVariables('');
			forecastArray[index].getVariables();
			locField.textContent = '- -';
		}
	}
});
