const form = document.getElementById("registration-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmedPassword =  document.getElementById("confirmedPassword");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isRequired = checkRequired([username, email, password, confirmedPassword])
});

function checkRequired(inputArray) {
    let isValid = true;

    inputArray.forEach(input => {
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);
            isValid = false
        } else {
            showSuccess(input);
        }
    })
};

function formatFieldName(input) {
    return input.id.char(0).toUpperCase() + input.id.slice(1);
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.className = "form-group error"
    const small = formGroup.querySelector("small");
    small.innerText = message;
}

function showSuccess(input, message) {
    const formGroup = input.parentElement;
    formGroup.className = "form-group success"
}