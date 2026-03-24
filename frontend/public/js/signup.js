const signupForm = document.getElementById('signupForm');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
    
    strengthBar.style.width = strength + '%';
    
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

const passwordInput = document.getElementById('signupPassword');
if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
}

const confirmInput = document.getElementById('signupConfirmPassword');
if (confirmInput) {
    confirmInput.addEventListener('input', function() {
        const password = document.getElementById('signupPassword').value;
        const confirm = this.value;
        const errorDiv = document.getElementById('signupConfirmPasswordError');
        
        if (confirm && password !== confirm) {
            errorDiv.innerText = 'Passwords do not match';
            errorDiv.style.display = 'block';
        } else {
            errorDiv.style.display = 'none';
        }
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        document.getElementById('signupUsernameError').style.display = 'none';
        document.getElementById('signupEmailError').style.display = 'none';
        document.getElementById('signupPasswordError').style.display = 'none';
        document.getElementById('signupConfirmPasswordError').style.display = 'none';
        document.getElementById('signupError').style.display = 'none';
        document.getElementById('signupSuccess').style.display = 'none';
        
        let valid = true;
        
        if (username.length < 3) {
            document.getElementById('signupUsernameError').innerText = 'Username must be at least 3 characters';
            document.getElementById('signupUsernameError').style.display = 'block';
            valid = false;
        }
        
        if (!validateEmail(email)) {
            document.getElementById('signupEmailError').innerText = 'Enter a valid email';
            document.getElementById('signupEmailError').style.display = 'block';
            valid = false;
        }
        
        if (password.length < 6) {
            document.getElementById('signupPasswordError').innerText = 'Password must be at least 6 characters';
            document.getElementById('signupPasswordError').style.display = 'block';
            valid = false;
        }
        
        if (password !== confirm) {
            document.getElementById('signupConfirmPasswordError').innerText = 'Passwords do not match';
            document.getElementById('signupConfirmPasswordError').style.display = 'block';
            valid = false;
        }
        
        if (!agreeTerms) {
            alert('You must agree to the Terms of Service and Privacy Policy');
            valid = false;
        }
        
        if (!valid) return;
        
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        
        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    gamertag: username
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                localStorage.setItem('cyborg_token', data.token);
                
                const userData = {
                    id: data.userId,
                    username: username,
                    email: email,
                    gamertag: username
                };
                localStorage.setItem('cyborg_current_user', JSON.stringify(userData));
                
                document.getElementById('signupSuccess').innerText = 'Account created successfully! Redirecting to sign in...';
                document.getElementById('signupSuccess').style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = '../form/signin.html';
                }, 1500);
            } else {
                document.getElementById('signupError').innerText = data.error || 'Signup failed';
                document.getElementById('signupError').style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
            }
        } catch (error) {
            document.getElementById('signupError').innerText = 'Cannot connect to server. Make sure backend is running on port 3000';
            document.getElementById('signupError').style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
        }
    });
}