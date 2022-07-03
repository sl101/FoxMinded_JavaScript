'use strict';

const body = document.querySelector('body');
const form = body.querySelector('form');

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

// ================================================================
const firstNameInput = form.querySelector('.form__input--firstname');
const lastNameInput = form.querySelector('.form__input--lastname');
const birthDateInput = form.querySelector('.form__input--date');
const emailInput = form.querySelector('.form__input--email');
const passwordInput = form.querySelector('.form__input--password');
const passwordConfInput = form.querySelector('.form__input--password.confirm');
const textArray = form.querySelector('.form__input--textarea');
const button = form.querySelector('.form__button');
const showPasswords = form.querySelectorAll('.form__input-show');

// Show/hide eye in password ========================
showPasswords.forEach((element) => {
	element.addEventListener('click', () => {
		showHidePassword(element);
	});
});

function showHidePassword(target) {
	const targetInput = target.previousElementSibling;

	if (targetInput.getAttribute('type') == 'password') {
		target.classList.add('view');
		targetInput.setAttribute('type', 'text');
	} else {
		target.classList.remove('view');
		targetInput.setAttribute('type', 'password');
	}
}

// ====================================
class Person {
	constructor(firstNameInput, lastNameInput, birthDateInput) {
		const validator = new Validator();
		this.firstName = validator.validate(firstNameInput);
		this.lastName = validator.validate(lastNameInput);
		this.birthDate = validator.validate(birthDateInput);
	}

	getFullName() {
		return (
			'\n' +
			this.firstName +
			' ' +
			this.lastName +
			'\ndate of birth: ' +
			this.birthDate
		);
	}
}

class User {
	constructor(person, emailInput, passwordInput, passwordConfInput) {
		const validator = new Validator();
		this.person = person;
		this.email = validator.validate(emailInput);
		this.password = validator.validate(passwordInput);
		this.confirmPassword = validator.validate(passwordConfInput);
	}

	getUser() {
		if (this.person && this.email && this.password && this.confirmPassword) {
			return this.person.getFullName() + '\nemail: ' + this.email;
		} else {
			return false;
		}
	}
}

class MessageRequest {
	constructor(user, message) {
		this.user = user;
		this.message = message;
	}

	getRequest() {
		if (this.user) {
			return this.user.getUser() + '\nmessage:\n' + this.message;
		} else {
			return false;
		}
	}
}

function createRequest() {
	const message = textArray.value;

	const person = new Person(firstNameInput, lastNameInput, birthDateInput);
	if (person.getFullName()) {
		const user = new User(person, emailInput, passwordInput, passwordConfInput);
		if (user.getUser()) {
			const request = new MessageRequest(user, message);
			return request.getRequest();
		} else {
			return false;
		}
	} else {
		return false;
	}
}

class Validator {
	validate(inputTarget) {
		const targetName = inputTarget.name;
		const target = inputTarget.value;
		let patternString = '';
		let password = '';

		switch (targetName) {
			case 'email':
				patternString = patternString.concat(
					"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
				);
				break;

			case 'first-name':
				patternString = patternString.concat('^[a-zA-Z-]+$');
				break;

			case 'last-name':
				patternString = patternString.concat('^[a-zA-Z-]+$');
				break;

			case 'date':
				patternString = patternString.concat('\\d{4}-\\d{1,2}-\\d{1,2}');
				break;

			case 'password':
				patternString = patternString.concat('[0-9a-zA-Z!@#$%^&*]{6,}');
				break;

			case 'passwordConfirm':
				const passwordValue = passwordInput.value;
				password = patternString.concat(passwordValue);
				patternString = patternString.concat('[0-9a-zA-Z!@#$%^&*]{6,}');
				break;
		}

		const pattern = new RegExp(patternString);

		const errorMessage = document.createElement('div');
		errorMessage.classList.add('error-message');
		inputTarget.parentElement.appendChild(errorMessage);

		if (target) {
			if (target.match(pattern) || target === password) {
				inputTarget.classList.remove('error');
				errorMessage.classList.remove('error');

				if (targetName === 'passwordConfirm') {
					if (target.match(pattern)) {
						if (target !== password) {
							inputTarget.classList.add('error');
							errorMessage.classList.add('error');
							errorMessage.innerHTML = 'Мust be identical to a valid password';
							return false;
						} else {
							return target;
						}
					} else {
						inputTarget.classList.add('error');
						errorMessage.classList.add('error');
						errorMessage.innerHTML = 'Please enter a valid password';
						return false;
					}
				} else {
					return target;
				}
			} else {
				inputTarget.classList.add('error');
				errorMessage.classList.add('error');
				if (targetName === 'passwordConfirm') {
					errorMessage.innerHTML = 'Required field: confirm your password';
				} else {
					errorMessage.innerHTML = 'Please enter a valid ' + targetName;
				}
				return false;
			}
		} else if (target == '') {
			inputTarget.classList.add('error');
			errorMessage.classList.add('error');
			if (targetName === 'passwordConfirm') {
				errorMessage.innerHTML = 'Required field: confirm your password';
			} else {
				errorMessage.innerHTML = 'Required field: enter your ' + targetName;
			}
			return false;
		}
	}
}

function removeMessage() {
	const errorMessage = form.querySelectorAll('.error-message');
	errorMessage.forEach((element) => {
		element.remove();
	});
}

function showAlert(alertMessage) {
	if (alertMessage) {
		alert('\n' + alertMessage + '\n\nMessage has been sent');
	}
}

// ======================================================
form.addEventListener('submit', function (e) {
	e.preventDefault();
	removeMessage();
	showAlert(createRequest());
});
