'use strict';

// Random Array for compare ===================================
function createRandomArray(elementAmount) {
	const arr = [];
	for (var i = 0; i < elementAmount; i++) {
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
function compareSort(cnt) {
	const arr = createRandomArray(cnt);
	const generalArray = [bubbleSort, insertionSort, mergeSort, selectionSort];

	for (let index = 0; index < generalArray.length; index++) {
		const element = generalArray[index];
		let time = performance.now();
		element(arr);
		time = performance.now() - time;
		console.log('Время выполнения = ', time);
	}

	let time = performance.now();
	quickSort(arr, 0, arr.length - 1);
	time = performance.now() - time;
	console.log('Время выполнения = ', time);
}

// ==================================================

compareSort(10000);
