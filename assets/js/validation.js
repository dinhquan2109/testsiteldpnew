// ===== VALIDATION UTILITIES =====

// ===== VALIDATION FUNCTIONS =====
function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 3;
}

function validateAge(age) {
    if (age === '') return true; // Age is optional
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum >= 1 && ageNum <= 120;
}

// ===== FORM VALIDATION SETUP =====
function setupFormValidation() {
    // Fullname validation
    const fullnameInput = document.getElementById('fullname');
    const fullnameError = document.getElementById('fullnameError');
    const fullnameCheck = document.getElementById('fullnameCheck');
    
    if (fullnameInput) {
        fullnameInput.addEventListener('input', function() {
            const input = this;
            const value = input.value.trim();
            
            if (value.length === 0) {
                // Chưa nhập - ẩn tất cả
                input.classList.remove('error', 'valid');
                if (fullnameError) fullnameError.classList.remove('show');
                if (fullnameCheck) fullnameCheck.classList.remove('show');
            } else if (value.length < 3) {
                // Nhập sai - hiển thị X đỏ
                input.classList.add('error');
                input.classList.remove('valid');
                if (fullnameError) fullnameError.classList.add('show');
                if (fullnameCheck) {
                    fullnameCheck.classList.add('show');
                    fullnameCheck.innerHTML = '✕';
                    fullnameCheck.style.background = '#f44336';
                }
            } else {
                // Nhập đúng - hiển thị tick xanh
                input.classList.remove('error');
                input.classList.add('valid');
                if (fullnameError) fullnameError.classList.remove('show');
                if (fullnameCheck) {
                    fullnameCheck.classList.add('show');
                    fullnameCheck.innerHTML = '✓';
                    fullnameCheck.style.background = '#4caf50';
                }
            }
        });
        
        fullnameInput.addEventListener('blur', function() {
            const input = this;
            const value = input.value.trim();
            if (fullnameCheck) {
                if (value.length >= 3) {
                    fullnameCheck.classList.add('show');
                    fullnameCheck.innerHTML = '✓';
                    fullnameCheck.style.background = '#4caf50';
                } else if (value.length > 0) {
                    fullnameCheck.classList.add('show');
                    fullnameCheck.innerHTML = '✕';
                    fullnameCheck.style.background = '#f44336';
                } else {
                    fullnameCheck.classList.remove('show');
                }
            }
        });
    }

    // Age validation
    const ageInput = document.getElementById('age');
    const ageError = document.getElementById('ageError');
    const ageCheck = document.getElementById('ageCheck');
    
    if (ageInput) {
        ageInput.addEventListener('input', function() {
            const input = this;
            const value = input.value.trim();

            if (value === '') {
                // Chưa nhập - ẩn tất cả (age là optional)
                input.classList.remove('error', 'valid');
                if (ageError) ageError.classList.remove('show');
                if (ageCheck) ageCheck.classList.remove('show');
                return;
            }

            const age = parseInt(value);
            if (isNaN(age) || age < 1 || age > 120) {
                // Nhập sai - hiển thị X đỏ
                input.classList.add('error');
                input.classList.remove('valid');
                if (ageError) ageError.classList.add('show');
                if (ageCheck) {
                    ageCheck.classList.add('show');
                    ageCheck.innerHTML = '✕';
                    ageCheck.style.background = '#f44336';
                }
            } else {
                // Nhập đúng - hiển thị tick xanh
                input.classList.remove('error');
                input.classList.add('valid');
                if (ageError) ageError.classList.remove('show');
                if (ageCheck) {
                    ageCheck.classList.add('show');
                    ageCheck.innerHTML = '✓';
                    ageCheck.style.background = '#4caf50';
                }
            }
        });
        
        ageInput.addEventListener('blur', function() {
            const input = this;
            const value = input.value.trim();
            if (ageCheck) {
                if (value === '') {
                    ageCheck.classList.remove('show');
                    return;
                }
                const age = parseInt(value);
                if (!isNaN(age) && age >= 1 && age <= 120) {
                    ageCheck.classList.add('show');
                    ageCheck.innerHTML = '✓';
                    ageCheck.style.background = '#4caf50';
                } else {
                    ageCheck.classList.add('show');
                    ageCheck.innerHTML = '✕';
                    ageCheck.style.background = '#f44336';
                }
            }
        });
    }

    // Phone validation
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    const phoneCheck = document.getElementById('phoneCheck');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const input = this;
            const value = input.value;
            
            if (value.length === 0) {
                // Chưa nhập - ẩn tất cả
                input.classList.remove('error', 'valid');
                if (phoneError) phoneError.classList.remove('show');
                if (phoneCheck) phoneCheck.classList.remove('show');
            } else if (!validatePhone(value)) {
                // Nhập sai - hiển thị X đỏ
                input.classList.add('error');
                input.classList.remove('valid');
                if (phoneError) phoneError.classList.add('show');
                if (phoneCheck) {
                    phoneCheck.classList.add('show');
                    phoneCheck.innerHTML = '✕';
                    phoneCheck.style.background = '#f44336';
                }
            } else {
                // Nhập đúng - hiển thị tick xanh
                input.classList.remove('error');
                input.classList.add('valid');
                if (phoneError) phoneError.classList.remove('show');
                if (phoneCheck) {
                    phoneCheck.classList.add('show');
                    phoneCheck.innerHTML = '✓';
                    phoneCheck.style.background = '#4caf50';
                }
            }
        });
        
        phoneInput.addEventListener('blur', function() {
            const input = this;
            const value = input.value;
            if (phoneCheck) {
                if (value.length === 0) {
                    phoneCheck.classList.remove('show');
                } else if (validatePhone(value)) {
                    phoneCheck.classList.add('show');
                    phoneCheck.innerHTML = '✓';
                    phoneCheck.style.background = '#4caf50';
                } else {
                    phoneCheck.classList.add('show');
                    phoneCheck.innerHTML = '✕';
                    phoneCheck.style.background = '#f44336';
                }
            }
        });
    }

    // Email validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailCheck = document.getElementById('emailCheck');
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const input = this;
            const value = input.value;
            
            if (value.length === 0) {
                // Chưa nhập - ẩn tất cả
                input.classList.remove('error', 'valid');
                if (emailError) emailError.classList.remove('show');
                if (emailCheck) emailCheck.classList.remove('show');
            } else if (!validateEmail(value)) {
                // Nhập sai - hiển thị X đỏ
                input.classList.add('error');
                input.classList.remove('valid');
                if (emailError) emailError.classList.add('show');
                if (emailCheck) {
                    emailCheck.classList.add('show');
                    emailCheck.innerHTML = '✕';
                    emailCheck.style.background = '#f44336';
                }
            } else {
                // Nhập đúng - hiển thị tick xanh
                input.classList.remove('error');
                input.classList.add('valid');
                if (emailError) emailError.classList.remove('show');
                if (emailCheck) {
                    emailCheck.classList.add('show');
                    emailCheck.innerHTML = '✓';
                    emailCheck.style.background = '#4caf50';
                }
            }
        });
        
        emailInput.addEventListener('blur', function() {
            const input = this;
            const value = input.value;
            if (emailCheck) {
                if (value.length === 0) {
                    emailCheck.classList.remove('show');
                } else if (validateEmail(value)) {
                    emailCheck.classList.add('show');
                    emailCheck.innerHTML = '✓';
                    emailCheck.style.background = '#4caf50';
                } else {
                    emailCheck.classList.add('show');
                    emailCheck.innerHTML = '✕';
                    emailCheck.style.background = '#f44336';
                }
            }
        });
    }
}

// ===== FORM SUBMIT VALIDATION =====
function validateForm() {
    console.log('Starting form validation...');
    const fullname = document.getElementById('fullname').value.trim();
    const ageValue = document.getElementById('age').value.trim();
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    console.log('Form values:', { fullname, ageValue, phone, email });

    let isValid = true;
    let errors = [];

    // Validate fullname
    console.log('Validating fullname:', fullname, 'Result:', validateName(fullname));
    if (!validateName(fullname)) {
        document.getElementById('fullname').classList.add('error');
        document.getElementById('fullnameError').classList.add('show');
        isValid = false;
        errors.push('Họ và tên phải có ít nhất 3 ký tự');
    }

    // Validate age (optional)
    console.log('Validating age:', ageValue, 'Result:', validateAge(ageValue));
    if (ageValue !== '' && !validateAge(ageValue)) {
        document.getElementById('age').classList.add('error');
        document.getElementById('ageError').classList.add('show');
        isValid = false;
        errors.push('Tuổi phải từ 1 đến 120');
    }

    // Validate phone
    console.log('Validating phone:', phone, 'Result:', validatePhone(phone));
    if (!validatePhone(phone)) {
        document.getElementById('phone').classList.add('error');
        document.getElementById('phoneError').classList.add('show');
        isValid = false;
        errors.push('Số điện thoại phải có 10-11 chữ số');
    }

    // Validate email
    console.log('Validating email:', email, 'Result:', validateEmail(email));
    if (!validateEmail(email)) {
        document.getElementById('email').classList.add('error');
        document.getElementById('emailError').classList.add('show');
        isValid = false;
        errors.push('Email không đúng định dạng');
    }

    console.log('Validation result:', { isValid, errors });

    if (!isValid) {
        alert('Vui lòng kiểm tra lại thông tin đã nhập:\n' + errors.join('\n'));
    }

    return isValid;
}

// ===== REAL-TIME VALIDATION HELPERS =====
function clearValidation(inputId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + 'Error');
    const check = document.getElementById(inputId + 'Check');
    
    if (input) {
        input.classList.remove('error', 'valid');
    }
    if (error) {
        error.classList.remove('show');
    }
    if (check) {
        check.classList.remove('show');
    }
}

function showValidation(inputId, isValid) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + 'Error');
    const check = document.getElementById(inputId + 'Check');
    
    if (input) {
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
        }
    }
    
    if (error) {
        if (isValid) {
            error.classList.remove('show');
        } else {
            error.classList.add('show');
        }
    }
    
    if (check) {
        if (isValid) {
            check.classList.add('show');
        } else {
            check.classList.remove('show');
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
});

// Export functions for use in other modules
export { 
    validatePhone, 
    validateEmail, 
    validateName, 
    validateAge, 
    validateForm, 
    clearValidation, 
    showValidation 
};
