class UserDatabase {
    constructor() {
        this.USERS_KEY = 'cyborg_users';
        this.CURRENT_USER_KEY = 'cyborg_current_user';
        this.API_URL = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
    }

    async signup(userData) {
        try {
            console.log('Signup request to:', `${this.API_URL}/signup`);
            const response = await fetch(`${this.API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            console.log('Signup response:', data);
            
            if (response.ok) {
                return { success: true, message: data.message, userId: data.userId };
            } else {
                return { success: false, message: data.error || 'Signup failed' };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: 'Cannot connect to server. Please make sure the backend is running on port 3000.' };
        }
    }

    async login(email, password) {
        try {
            console.log('Login request to:', `${this.API_URL}/signin`);
            const response = await fetch(`${this.API_URL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (response.ok && data.success) {
                const userData = data.user;
                localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userData));
                
                const users = this.getAllUsers();
                const existingUserIndex = users.findIndex(u => u.id === userData.id);
                
                if (existingUserIndex >= 0) {
                    users[existingUserIndex] = userData;
                } else {
                    users.push(userData);
                }
                
                localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
                
                return { success: true, user: userData };
            } else {
                return { success: false, message: data.error || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Cannot connect to server. Please make sure the backend is running on port 3000.' };
        }
    }

    getAllUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
    }

    findUserByEmail(email) {
        const users = this.getAllUsers();
        return users.find(user => user.email === email);
    }

    findUserByUsername(username) {
        const users = this.getAllUsers();
        return users.find(user => user.username === username);
    }

    async logout() {
        const currentUser = this.getCurrentUser();
        
        if (currentUser && currentUser.id) {
            try {
                await fetch(`${this.API_URL}/logout/${currentUser.id}`, {
                    method: 'POST'
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = '/frontend/public/index.html';
    }

    getCurrentUser() {
        const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }

    async refreshProfile() {
        const currentUser = this.getCurrentUser();
        
        if (currentUser && currentUser.id) {
            try {
                const response = await fetch(`${this.API_URL}/profile/${currentUser.id}`);
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(data.user));
                    return data.user;
                }
            } catch (error) {
                console.error('Refresh profile error:', error);
            }
        }
        
        return currentUser;
    }
}

const db = new UserDatabase();

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

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = message;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

function showErrorMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = message;
        element.style.display = 'block';
    }
}

function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    
    strengthBar.style.setProperty('--strength', strength + '%');
    
    if (strength < 25) {
        strengthText.textContent = 'Too weak';
        strengthText.style.color = '#ff8a8a';
    } else if (strength < 50) {
        strengthText.textContent = 'Fair';
        strengthText.style.color = '#ffdb8b';
    } else if (strength < 75) {
        strengthText.textContent = 'Good';
        strengthText.style.color = '#b3ffcf';
    } else {
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#6bff9b';
    }
}

const signinForm = document.getElementById("signinForm");
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
            const result = await db.login(email, password);
            
            if (result.success) {
                showSuccess("signinSuccess", "Login successful! Redirecting...");
                document.getElementById("signinError").style.display = 'none';
                
                setTimeout(() => {
                    window.location.href = '/frontend/public/profile.html';
                }, 1500);
            } else {
                showErrorMessage("signinError", result.message);
            }
        }
    });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
    const usernameInput = document.getElementById("signupUsername");
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");
    const confirmInput = document.getElementById("signupConfirmPassword");
    const termsCheckbox = document.getElementById("agreeTerms");
    
    if (usernameInput) {
        usernameInput.addEventListener('input', () => {
            if (usernameInput.value.length < 3 && usernameInput.value.length > 0) {
                showError("signupUsernameError", "Username must be at least 3 characters.");
                usernameInput.classList.add('error-input');
            } else if (usernameInput.value.length >= 3) {
                clearError("signupUsernameError");
                usernameInput.classList.remove('error-input');
                usernameInput.classList.add('success-input');
            } else {
                clearError("signupUsernameError");
                usernameInput.classList.remove('error-input', 'success-input');
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.value.trim() && !validateEmail(emailInput.value.trim())) {
                showError("signupEmailError", "Enter a valid email.");
                emailInput.classList.add('error-input');
            } else if (validateEmail(emailInput.value.trim())) {
                clearError("signupEmailError");
                emailInput.classList.remove('error-input');
                emailInput.classList.add('success-input');
            } else {
                clearError("signupEmailError");
                emailInput.classList.remove('error-input', 'success-input');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updatePasswordStrength(passwordInput.value);
            
            if (passwordInput.value.length < 6 && passwordInput.value.length > 0) {
                showError("signupPasswordError", "Password must be at least 6 characters.");
                passwordInput.classList.add('error-input');
            } else if (passwordInput.value.length >= 6) {
                clearError("signupPasswordError");
                passwordInput.classList.remove('error-input');
                passwordInput.classList.add('success-input');
            } else {
                clearError("signupPasswordError");
                passwordInput.classList.remove('error-input', 'success-input');
            }
            
            if (confirmInput && confirmInput.value && passwordInput.value !== confirmInput.value) {
                showError("signupConfirmPasswordError", "Passwords do not match.");
                confirmInput.classList.add('error-input');
            } else if (confirmInput && confirmInput.value && passwordInput.value === confirmInput.value) {
                clearError("signupConfirmPasswordError");
                confirmInput.classList.remove('error-input');
                confirmInput.classList.add('success-input');
            }
        });
    }
    
    if (confirmInput) {
        confirmInput.addEventListener('input', () => {
            if (passwordInput.value !== confirmInput.value) {
                showError("signupConfirmPasswordError", "Passwords do not match.");
                confirmInput.classList.add('error-input');
            } else if (confirmInput.value && passwordInput.value === confirmInput.value) {
                clearError("signupConfirmPasswordError");
                confirmInput.classList.remove('error-input');
                confirmInput.classList.add('success-input');
            } else {
                clearError("signupConfirmPasswordError");
                confirmInput.classList.remove('error-input', 'success-input');
            }
        });
    }
    
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmInput.value.trim();
        const agreeTerms = termsCheckbox ? termsCheckbox.checked : false;

        let valid = true;

        if (username.length < 3) {
            showError("signupUsernameError", "Username must be at least 3 characters.");
            usernameInput.classList.add('error-input');
            valid = false;
        } else {
            clearError("signupUsernameError");
            usernameInput.classList.remove('error-input');
        }

        if (!validateEmail(email)) {
            showError("signupEmailError", "Enter a valid email.");
            emailInput.classList.add('error-input');
            valid = false;
        } else {
            clearError("signupEmailError");
            emailInput.classList.remove('error-input');
        }

        if (password.length < 6) {
            showError("signupPasswordError", "Password must be at least 6 characters.");
            passwordInput.classList.add('error-input');
            valid = false;
        } else {
            clearError("signupPasswordError");
            passwordInput.classList.remove('error-input');
        }

        if (password !== confirmPassword) {
            showError("signupConfirmPasswordError", "Passwords do not match.");
            confirmInput.classList.add('error-input');
            valid = false;
        } else {
            clearError("signupConfirmPasswordError");
            confirmInput.classList.remove('error-input');
        }

        if (!agreeTerms) {
            alert("You must agree to the Terms of Service and Privacy Policy.");
            valid = false;
        }

        if (valid) {
            const result = await db.signup({
                username,
                email,
                password,
                gamertag: username
            });
            
            if (result.success) {
                showSuccess("signupSuccess", "Account created successfully! Redirecting to sign in...");
                document.getElementById("signupError").style.display = 'none';
                
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 2000);
            } else {
                showErrorMessage("signupError", result.message);
            }
        }
    });
}

window.auth = {
    db,
    logout: () => db.logout(),
    getCurrentUser: () => db.getCurrentUser(),
    isLoggedIn: () => db.isLoggedIn(),
    refreshProfile: () => db.refreshProfile()
};