const form = document.getElementById("registration-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmedPassword =  document.getElementById("confirmedPassword");
const button = document.getElementById("btn");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    resetErrors([username, email, password, confirmedPassword]);
    const isRequiredValid = checkRequired([username, email, password, confirmedPassword])
    const isUsernameValid = checkLength(username, 3, 15);
    const isEmailValid = checkEmail(email);
    const isPasswordValid = checkLength(password, 8, 25);
    const isPasswordMatchValid = checkPasswordMatch(password, confirmedPassword);

    if(isRequiredValid && isUsernameValid && isEmailValid && isPasswordValid && isPasswordMatchValid) {
        console.log("Form submitted successfully!");

        showFormSuccess();

        setTimeout(() => {
            window.open('public/main', '_blank');
        }, 500);

        // setTimeout(() => {
        //     window.open('/public/main', '_blank');
        // }, 2000);

    }

});

function resetErrors(inputArray) {
    inputArray.forEach(input => {
        const formGroup = input.parentElement;
        formGroup.className = "form-group";
        const small = formGroup.querySelector("small");
        small.innerText = "";
        small.style.visibility = "hidden";
    });
}

function checkRequired(inputArray) {
    let isValid = true;

    inputArray.forEach(input => {
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);
            isValid = false
        } else {
            showSuccess(input);
        }
    });

    return isValid;
};

function formatFieldName(input) {
    const name = input.id.replace(/([A-Z])/g, '$1');
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function checkLength(input, min, max) {
    if(input.value.trim() === "") return false;

    if(input.value.length < min) {
        showError(input, `${formatFieldName(input)} must be atleast ${min} characters`);
        return false;
    } else if(input.value.length > max) {
        showError(input, `${formatFieldName(input)} must be less than ${max} characters`);
        return false;
    } else {
        showSuccess(input);
        return true;
    };
}

function checkEmail(input) {
    if(input.value.trim() === "") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(input.value.trim())) {
        showError(input, "Email is not valid");
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}

function checkPasswordMatch(passwordInput, confirmedPasswordInput) {
    if(passwordInput.value.trim() === "" || confirmedPasswordInput.value.trim() === "") {
        return false;
    }

    if(passwordInput.value !== confirmedPasswordInput.value) {
        showError(confirmedPasswordInput, "Passwords do not match");
        return false;
    } else {
        showSuccess(confirmedPasswordInput);
        return true;
    }
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.className = "form-group error"
    const small = formGroup.querySelector("small");
    small.innerText = message;
    small.style.visibility = "visible"
}

function showSuccess(input, message) {
    if(!input) return;
    const formGroup = input.parentElement;
    formGroup.className = "form-group success";
    const small = formGroup.querySelector("small");
    small.innerText = "";
    small.style.visibility = "hidden";
}

function showFormSuccess() {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        form.dispatchEvent(new Event('submmit'));
    })
}

