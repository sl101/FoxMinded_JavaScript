'use strict';

const body = document.querySelector('body');
const page = document.querySelector('.sorting');
const btn = document.querySelector('.form__button');
const resultValue = document.querySelector('.sorting__value');
const testValue = document.querySelector('.form__input--test');
const rangeValue = document.querySelector('.form__input--range');
const rangeNumber = document.querySelector('.form__amount');
const unitsArray = document.querySelectorAll('.unit__value');
const dataList = document.querySelector('.data__list');
const dataArrow = document.querySelector('.data__box');
const dataTextArray = document.querySelectorAll('.data__text');
const dataUnsorted = document.querySelector('.data__text--unsorted');
const dataSorted = document.querySelector('.data__text--sorted');
const minArrr = 400;
// Fix layout =================================================
function checkoverflow() {
	const paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
	return paddingOffset;
}

function fixLayout(before, after) {
	if (before > after) {
		body.style.paddingRight = before;
	} else if (before < after) {
		body.style.paddingRight = '0';
	}
}

// Random Array for compare ===================================
function createRandomArray(elementAmount) {
	const arr = [];
	for (let i = 0; i < elementAmount; i++) {
		arr.push(Math.random() * 10000);
	}
	return arr;
}

// Bubble sort method ===================================
function bubbleSort(arr) {
	for (let i = 0, endI = arr.length - 1; i < endI; i++) {
		for (let j = 0, endJ = endI - i; j < endJ; j++) {
			if (arr[j] > arr[j + 1]) {
				const current = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = current;
			}
		}
	}
	return arr;
}

// Insertion sort method ===================================
function insertionSort(arr) {
	for (let i = 1, l = arr.length; i < l; i++) {
		const current = arr[i];
		let j = i;
		while (j > 0 && arr[j - 1] > current) {
			arr[j] = arr[j - 1];
			j--;
		}
		arr[j] = current;
	}
	return arr;
}

// Quick sort method ===================================
function swap(items, firstIndex, secondIndex) {
	const temp = items[firstIndex];
	items[firstIndex] = items[secondIndex];
	items[secondIndex] = temp;
}

function partition(items, left, right) {
	let pivot = items[Math.floor((right + left) / 2)],
		i = left,
		j = right;
	while (i <= j) {
		while (items[i] < pivot) {
			i++;
		}
		while (items[j] > pivot) {
			j--;
		}
		if (i <= j) {
			swap(items, i, j);
			i++;
			j--;
		}
	}
	return i;
}

function quickSort(arr, start, end) {
	if (start >= end) {
		return;
	}
	let index = partition(arr, start, end);
	quickSort(arr, start, index - 1);
	quickSort(arr, index + 1, end);
}

// Merge sort method ===================================
function mergeSort(array) {
	const result = array.slice(0);

	function sort(array) {
		const length = array.length,
			mid = Math.floor(length * 0.5),
			left = array.slice(0, mid),
			right = array.slice(mid, length);
		if (length === 1) {
			return array;
		}
		return merge(sort(left), sort(right));
	}

	function merge(left, right) {
		const result = [];
		while (left.length || right.length) {
			if (left.length && right.length) {
				if (left[0] < right[0]) {
					result.push(left.shift());
				} else {
					result.push(right.shift());
				}
			} else if (left.length) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}
		return result;
	}

	return sort(result);
}

// Selection sort method ===================================
function selectionSort(arr) {
	for (let i = 0, l = arr.length, k = l - 1; i < k; i++) {
		let indexMin = i;
		for (let j = i + 1; j < l; j++) {
			if (arr[indexMin] > arr[j]) {
				indexMin = j;
			}
		}
		if (indexMin !== i) {
			[arr[i], arr[indexMin]] = [arr[indexMin], arr[i]];
		}
	}
	return arr;
}

// Execution speed comparison ===========================================
function compareSort(rangeValue, functionArray) {
	const arr = createRandomArray(rangeValue);
	let stringUnsorted = '';
	let stringSorted = '';
	let timeArray = [];

	if (rangeValue <= minArrr) {
		for (let index = 0; index < arr.length; index++) {
			const element = arr[index];
			stringUnsorted = stringUnsorted.concat('' + element + '\n');
			dataUnsorted.textContent = stringUnsorted;
		}
	} else {
		dataUnsorted.textContent = 'no data ' + '\nthe array was too long';
	}

	for (let index = 0; index < functionArray.length - 1; index++) {
		const element = functionArray[index];
		const temporaryArray = [];

		for (let index = 0; index < arr.length; index++) {
			const element = arr[index];
			temporaryArray[index] = element;
		}

		let time = performance.now();
		element(temporaryArray);
		time = performance.now() - time;
		timeArray[index] = time;
	}

	const temporaryLast = [];

	for (let index = 0; index < arr.length; index++) {
		const element = arr[index];
		temporaryLast[index] = element;
	}

	const lastElement = functionArray[functionArray.length - 1];
	let time = performance.now();
	lastElement(temporaryLast, 0, temporaryLast.length - 1);
	time = performance.now() - time;
	timeArray[timeArray.length] = time;

	if (rangeValue <= minArrr) {
		for (let index = 0; index < temporaryLast.length; index++) {
			const item = temporaryLast[index];
			stringSorted = stringSorted.concat('' + item + ' ');
			dataSorted.textContent = stringSorted;
		}
	} else {
		dataSorted.textContent = 'no data ' + '\nthe array was too long';
	}

	return timeArray;
}

// Data output
function dataOutput(resultArray) {
	const functionArrayNames = [
		'Bubble sort',
		'Insertion sort',
		'Merge sort',
		'Selection sort',
		'Quick sort',
	];

	let minNumber = resultArray[0];
	let sortingName;

	for (let index = 0; index < resultArray.length; index++) {
		const element = resultArray[index];

		unitsArray[index].textContent = resultArray[index];

		if (element < minNumber) {
			minNumber = element;
			sortingName = functionArrayNames[index];
		}
	}

	return sortingName;
}

// Find best result ===================================
function findResult(rangeValue, valueTest) {
	const functionArray = [
		bubbleSort,
		insertionSort,
		mergeSort,
		selectionSort,
		quickSort,
	];

	const resultArray = compareSort(rangeValue, functionArray);

	for (let index = 0; index < valueTest - 1; index++) {
		const array = compareSort(rangeValue, functionArray);

		for (let index = 0; index < resultArray.length; index++) {
			if (resultArray[index] > array[index]) {
				resultArray[index] = array[index];
			}
		}
	}

	return dataOutput(resultArray);
}

// Data overload =================================
function overload() {
	unitsArray.forEach((element) => {
		element.style.color = 'transparent';
	});

	arraySize();
	const valueTest = testValue.value;
	const valueRange = rangeValue.value;
	const result = findResult(valueRange, valueTest);

	unitsArray.forEach((element) => {
		element.style.color = '#000';
	});
	resultValue.style.color = '#000';
	resultValue.textContent = result;
	page.classList.remove('lock');
}

// Data reload =====================
function reloadData() {
	page.classList.add('lock');
	resultValue.style.color = 'transparent';
	setTimeout(overload, 100);
}

// Show arrays =====================
function showArrays() {
	const scrollBefore = checkoverflow();

	dataArrow.classList.toggle('active');
	dataTextArray.forEach((element) => {
		element.classList.toggle('active');
	});
	const scrollAfter = checkoverflow();
	fixLayout(scrollBefore, scrollAfter);
}

// Check array size ===========================
function arraySize() {
	const valueRange = rangeValue.value;
	if (valueRange > minArrr) {
		rangeNumber.style.color = 'red';
		dataArrow.classList.remove('active');
		dataList.classList.add('block');
		dataArrow.classList.add('block');
		dataTextArray.forEach((element) => {
			element.classList.remove('active');
		});
	} else {
		dataList.classList.remove('block');
		dataArrow.classList.remove('block');
		rangeNumber.style.color = '#000';
	}
}

//==================================================

if (rangeValue) {
	rangeValue.addEventListener('change', () => {
		arraySize();
	});
}

if (btn) {
	btn.addEventListener('click', (el) => {
		el.preventDefault;
		reloadData();
	});
}

if (dataArrow) {
	dataArrow.addEventListener('click', (el) => {
		el.preventDefault;
		showArrays();
	});
}
