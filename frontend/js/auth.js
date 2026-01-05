const API = 'http://localhost:8080';

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token) {
        showMainContent();
    } else {
        showLoginForm();
    }
});

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('main-content').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('main-content').style.display = 'none';
}

function showMainContent() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('main-content').style.display = 'block';
    
    // Update user avatar with first letter of username
    const avatar = document.getElementById('user-avatar');
    avatar.textContent = username.charAt(0).toUpperCase();
    
    // Update welcome text with proper role styling
    const welcomeText = document.getElementById('welcome-text');
    const roleBadgeClass = role.toLowerCase();
    welcomeText.innerHTML = `
        <span>👋 Welcome, <strong>${username}</strong> 
        (<span class="role-badge ${roleBadgeClass}">${role}</span>)</span>
    `;
    
    // Auto-load rooms when showing main content
    loadRooms();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    // Clear previous errors
    errorDiv.style.display = 'none';

    if (!username || !password) {
        showError('login-error', 'Please enter username and password');
        return;
    }

    fetch(API + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => Promise.reject(text));
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        // Clear login form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        showMainContent();
    })
    .catch(error => {
        showError('login-error', 'Login failed: ' + error);
    });
}

function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    // Clear previous messages
    document.getElementById('register-error').style.display = 'none';
    document.getElementById('register-success').style.display = 'none';

    if (!username || !password) {
        showError('register-error', 'Please enter username and password');
        return;
    }

    if (password.length < 6) {
        showError('register-error', 'Password must be at least 6 characters long');
        return;
    }

    fetch(API + '/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => Promise.reject(text));
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        // Clear registration form
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        
        showSuccess('register-success', 'Account created successfully! Redirecting...');
        setTimeout(() => showMainContent(), 1500);
    })
    .catch(error => {
        showError('register-error', 'Registration failed: ' + error);
    });
}

function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showSuccess(elementId, message) {
    const successDiv = document.getElementById(elementId);
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    showLoginForm();
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}