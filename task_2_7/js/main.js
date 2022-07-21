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
	for (let index = 0; index < data.length; index++) {
		const element = data[index];
		allCountriesList[index].push(element);
		console.log(element.name);
		console.log(element.population);
		console.log(element.region);
		console.log(element.capital);
		console.log('\n');
	}
}

// ========================================================
const body = document.querySelector('body');
const requestUrl = 'https://restcountries.com/v2/all';
const allCountriesList = [];

// sendRequest(requestUrl);
