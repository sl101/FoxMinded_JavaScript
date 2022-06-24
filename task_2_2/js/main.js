"use strict";

const gallery = document.querySelector('.gallery');
const btnArray = document.querySelectorAll('.gallery__btn');
const productArray = document.querySelectorAll('.product');
const time = 400;

if(btnArray){
	btnArray.forEach(element => {
		element.addEventListener('click', () => {
			let scrollBefore = checkoverflow();
			let btnData = element.dataset.filter;
			setAnimation(btnData);
			let scrollAfter = checkoverflow();
			fixLayout(scrollBefore, scrollAfter);
		});
	});
}

function checkoverflow(){
	let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
	return paddingOffset;
}

function fixLayout(before, after){
		if(before > after){
			gallery.style.paddingRight = before;
		}else if(before < after) {
			gallery.style.paddingRight = '0';
		}
}

function setAnimation(data){
	if(productArray){
		productArray.forEach(element => {
				element.classList.remove('animate');
				if(element.classList.contains(data)){
					element.classList.add('animate');
				}
		});
	}
}
