const signinForm = document.getElementById("signinForm");

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    const input = document.getElementById(elementId.replace('Error', ''));
    
    if (element) {
        element.innerText = message;
        element.style.display = 'block';
    }
    
    if (input) {
        input.classList.add('error-input');
        input.classList.remove('success-input');
    }
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    const input = document.getElementById(elementId.replace('Error', ''));
    
    if (element) {
        element.innerText = '';
        element.style.display = 'none';
    }
    
    if (input) {
        input.classList.remove('error-input');
        input.classList.remove('success-input');
    }
}

function redirectToHome() {
    window.location.href = '../home.html';
}

if (signinForm) {
    const emailInput = document.getElementById("signinEmail");
    const passwordInput = document.getElementById("signinPassword");
    
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.value.trim() && !validateEmail(emailInput.value.trim())) {
                showError("signinEmailError", "Enter a valid email.");
            } else if (emailInput.value.trim()) {
                clearError("signinEmailError");
                emailInput.classList.add('success-input');
            } else {
                clearError("signinEmailError");
                emailInput.classList.remove('success-input');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            if (passwordInput.value.trim() && passwordInput.value.trim().length < 6) {
                showError("signinPasswordError", "Password must be at least 6 characters.");
            } else if (passwordInput.value.trim()) {
                clearError("signinPasswordError");
                passwordInput.classList.add('success-input');
            } else {
                clearError("signinPasswordError");
                passwordInput.classList.remove('success-input');
            }
        });
    }
    
    signinForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let valid = true;

        if (!validateEmail(email)) {
            showError("signinEmailError", "Enter a valid email.");
            emailInput.classList.add('error-input');
            valid = false;
        } else {
            clearError("signinEmailError");
            emailInput.classList.remove('error-input');
        }

        if (password.length < 6) {
            showError("signinPasswordError", "Password must be at least 6 characters.");
            passwordInput.classList.add('error-input');
            valid = false;
        } else {
            clearError("signinPasswordError");
            passwordInput.classList.remove('error-input');
        }

        if (valid) {
            try {
                const response = await fetch('http://localhost:3000/api/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    localStorage.setItem('cyborg_token', data.token);
                    localStorage.setItem('cyborg_current_user', JSON.stringify(data.user));
                    redirectToHome();
                } else {
                    showError("signinError", data.error || 'Login failed');
                }
            } catch (error) {
                showError("signinError", 'Cannot connect to server. Please make sure the backend is running on port 3000.');
            }
        }
    });
}