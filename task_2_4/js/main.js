'use strict';

const body = document.querySelector('body');

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
