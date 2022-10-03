'use strict';

const body = document.querySelector('body');
const form = body.querySelector('form');
const showPasswords = form.querySelectorAll('.form__input-show');

const firstNameInput = form.querySelector('.form__input--firstname');
const lastNameInput = form.querySelector('.form__input--lastname');
const birthDateInput = form.querySelector('.form__input--date');
const emailInput = form.querySelector('.form__input--email');
const passwordInput = form.querySelector('.form__input--password');
const passwordConfInput = form.querySelector('.form__input--passworСonfirm');
const textInput = form.querySelector('.form__input--textarea');

// Show/hide eye in password ========================
showPasswords.forEach((element) => {
	element.addEventListener('click', () => {
		showHidePassword(element);
	});
});

function showHidePassword(target) {
	const targetInput = target.parentNode.firstElementChild;
	if (targetInput.getAttribute('type') == 'password') {
		target.classList.add('view');
		targetInput.setAttribute('type', 'text');
	} else {
		target.classList.remove('view');
		targetInput.setAttribute('type', 'password');
	}
}

// ===================================
class Validator {
	constructor() {
		this.removeMessage();
	}

	removeMessage() {
		const errorMessage = form.querySelectorAll('.error-message');
		if (errorMessage) {
			errorMessage.forEach((element) => {
				element.remove('error');
			});
		}
	}

	commonMethod(incominData, pattern) {
		const errorMessage = document.createElement('div');
		errorMessage.classList.add('error-message');
		incominData.after(errorMessage);

		const targetName = incominData.name;
		const target = incominData.value;

		if (target) {
			if (target.match(pattern)) {
				incominData.classList.remove('error');
				errorMessage.classList.remove('error');
				return target;
			} else {
				incominData.classList.add('error');
				errorMessage.classList.add('error');
				errorMessage.innerHTML = 'Please enter a valid ' + targetName;

				return false;
			}
		} else if (target == '') {
			incominData.classList.add('error');
			errorMessage.classList.add('error');
			errorMessage.innerHTML = 'Required field: enter your ' + targetName;

			return false;
		} else {
			return false;
		}
	}

	validateName(incominData) {
		const pattern = new RegExp('^[a-zA-Z-]+$');
		return this.commonMethod(incominData, pattern);
	}

	validateDate(incominData) {
		const pattern = new RegExp('\\d{4}-\\d{1,2}-\\d{1,2}');
		return this.commonMethod(incominData, pattern);
	}

	validateEmail(incominData) {
		const pattern = new RegExp(
			"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
		);
		return this.commonMethod(incominData, pattern);
	}

	validatePassword(incominData) {
		const pattern = new RegExp('[0-9a-zA-Z!@#$%^&*]{6,}');
		return this.commonMethod(incominData, pattern);
	}

	validatePasswordConfirm(incominData) {
		const passwordInput = form.querySelector('.form__input--password');
		const password = passwordInput.value;
		const passwordConfirm = incominData.value;

		const errorMessage = document.createElement('div');
		errorMessage.classList.add('error-message');
		incominData.after(errorMessage);

		const pattern = new RegExp('[0-9a-zA-Z!@#$%^&*]{6,}');
		if (passwordConfirm) {
			if (passwordConfirm === password) {
				if (passwordConfirm.match(pattern)) {
					incominData.classList.remove('error');
					errorMessage.classList.remove('error');
					return passwordConfirm;
				} else {
					incominData.classList.add('error');
					errorMessage.classList.add('error');
					errorMessage.innerHTML = 'Please enter a valid password';
					return false;
				}
			} else {
				incominData.classList.add('error');
				errorMessage.classList.add('error');
				errorMessage.innerHTML = 'Мust be identical to a valid password';
				return false;
			}
		} else {
			incominData.classList.add('error');
			errorMessage.classList.add('error');
			errorMessage.innerHTML = 'Required field: confirm password';
			return false;
		}
	}
}

function validateForm() {
	let alertMessage = '';

	const validate = new Validator();

	const firstName = validate.validateName(firstNameInput);
	alertMessage = alertMessage.concat(firstName);

	const lastName = validate.validateName(lastNameInput);
	alertMessage = alertMessage.concat(' ' + lastName);

	const birthDate = validate.validateDate(birthDateInput);
	alertMessage = alertMessage.concat('\n' + 'birthday: ' + birthDate);

	const email = validate.validateEmail(emailInput);
	alertMessage = alertMessage.concat('\n' + 'e-mail: ' + email);

	const password = validate.validatePassword(passwordInput);
	const passwordConfirm = validate.validatePasswordConfirm(passwordConfInput);

	const textArea = textInput.value;

	alertMessage = alertMessage.concat('\n' + 'message:\n' + textArea);

	if (password && passwordConfirm) {
		showAlert(alertMessage);
	}
}

function showAlert(alertMessage) {
	if (!alertMessage.includes('false')) {
		alert('\n' + alertMessage + '\n\nMessage has been sent');
	}
}

// ======================================================
form.addEventListener('submit', function (e) {
	e.preventDefault();
	validateForm();
});
