// ===== FORM VALIDATION =====

// ===== VALIDATION FUNCTIONS =====
export function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
}

export function validateEmail(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
}

export function validateFullname(fullname) {
    return fullname.trim().length >= 3;
}

export function validateAge(age) {
    if (age === '') return true; // Optional field
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum >= 1 && ageNum <= 120;
}

// ===== FORM VALIDATION SETUP =====
export function setupFormValidation() {
    // Fullname validation
    const fullnameInput = document.getElementById('fullname');
    const fullnameError = document.getElementById('fullnameError');
    const fullnameCheck = document.getElementById('fullnameCheck');
    
    if (fullnameInput && fullnameError && fullnameCheck) {
        fullnameInput.addEventListener('input', function() {
            const input = this;
            if (input.value.trim().length > 0 && input.value.trim().length < 3) {
                input.classList.add('error');
                input.classList.remove('valid');
                fullnameError.classList.add('show');
                fullnameCheck.classList.remove('show');
            } else if (input.value.trim().length >= 3) {
                input.classList.remove('error');
                input.classList.add('valid');
                fullnameError.classList.remove('show');
                fullnameCheck.classList.remove('show');
            } else {
                input.classList.remove('error');
                input.classList.remove('valid');
                fullnameError.classList.remove('show');
                fullnameCheck.classList.remove('show');
            }
        });
        
        fullnameInput.addEventListener('blur', function() {
            const input = this;
            if (input.value.trim().length >= 3) {
                fullnameCheck.classList.add('show');
            } else {
                fullnameCheck.classList.remove('show');
            }
        });
    }

    // Age validation
    const ageInput = document.getElementById('age');
    const ageError = document.getElementById('ageError');
    const ageCheck = document.getElementById('ageCheck');
    
    if (ageInput && ageError && ageCheck) {
        ageInput.addEventListener('input', function() {
            const input = this;
            const value = input.value.trim();

            if (value === '') {
                input.classList.remove('error');
                input.classList.remove('valid');
                ageError.classList.remove('show');
                ageCheck.classList.remove('show');
                return;
            }

            const age = parseInt(value);
            if (isNaN(age) || age < 1 || age > 120) {
                input.classList.add('error');
                input.classList.remove('valid');
                ageError.classList.add('show');
                ageCheck.classList.remove('show');
            } else {
                input.classList.remove('error');
                input.classList.add('valid');
                ageError.classList.remove('show');
                ageCheck.classList.remove('show');
            }
        });
        
        ageInput.addEventListener('blur', function() {
            const input = this;
            const value = input.value.trim();
            if (value === '') {
                ageCheck.classList.remove('show');
                return;
            }
            const age = parseInt(value);
            if (!isNaN(age) && age >= 1 && age <= 120) {
                ageCheck.classList.add('show');
            } else {
                ageCheck.classList.remove('show');
            }
        });
    }

    // Phone validation
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    const phoneCheck = document.getElementById('phoneCheck');
    
    if (phoneInput && phoneError && phoneCheck) {
        phoneInput.addEventListener('input', function() {
            const input = this;
            if (input.value.length > 0 && !validatePhone(input.value)) {
                input.classList.add('error');
                input.classList.remove('valid');
                phoneError.classList.add('show');
                phoneCheck.classList.remove('show');
            } else if (validatePhone(input.value)) {
                input.classList.remove('error');
                input.classList.add('valid');
                phoneError.classList.remove('show');
                phoneCheck.classList.remove('show');
            } else {
                input.classList.remove('error');
                input.classList.remove('valid');
                phoneError.classList.remove('show');
                phoneCheck.classList.remove('show');
            }
        });
        
        phoneInput.addEventListener('blur', function() {
            const input = this;
            if (validatePhone(input.value)) {
                phoneCheck.classList.add('show');
            } else {
                phoneCheck.classList.remove('show');
            }
        });
    }

    // Email validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailCheck = document.getElementById('emailCheck');
    
    if (emailInput && emailError && emailCheck) {
        emailInput.addEventListener('input', function() {
            const input = this;
            if (input.value.length > 0 && !validateEmail(input.value)) {
                input.classList.add('error');
                input.classList.remove('valid');
                emailError.classList.add('show');
                emailCheck.classList.remove('show');
            } else if (validateEmail(input.value)) {
                input.classList.remove('error');
                input.classList.add('valid');
                emailError.classList.remove('show');
                emailCheck.classList.remove('show');
            } else {
                input.classList.remove('error');
                input.classList.remove('valid');
                emailError.classList.remove('show');
                emailCheck.classList.remove('show');
            }
        });
        
        emailInput.addEventListener('blur', function() {
            const input = this;
            if (validateEmail(input.value)) {
                emailCheck.classList.add('show');
            } else {
                emailCheck.classList.remove('show');
            }
        });
    }
}

// ===== FORM SUBMIT VALIDATION =====
export function validateForm() {
    const fullname = document.getElementById('fullname').value.trim();
    const ageValue = document.getElementById('age').value.trim();
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    let isValid = true;

    if (!validateFullname(fullname)) {
        document.getElementById('fullname').classList.add('error');
        document.getElementById('fullnameError').classList.add('show');
        isValid = false;
    }

    if (ageValue !== '') {
        if (!validateAge(ageValue)) {
            document.getElementById('age').classList.add('error');
            document.getElementById('ageError').classList.add('show');
            isValid = false;
        }
    }

    if (!validatePhone(phone)) {
        document.getElementById('phone').classList.add('error');
        document.getElementById('phoneError').classList.add('show');
        isValid = false;
    }

    if (!validateEmail(email)) {
        document.getElementById('email').classList.add('error');
        document.getElementById('emailError').classList.add('show');
        isValid = false;
    }

    return isValid;
}
