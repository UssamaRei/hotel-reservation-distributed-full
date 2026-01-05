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
    document.getElementById('welcome-text').textContent = `Welcome, ${username} (${role})`;
    
    // Auto-load rooms when showing main content
    loadRooms();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter username and password');
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
        alert('Login failed: ' + error);
    });
}

function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !password) {
        alert('Please enter username and password');
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
        
        showMainContent();
    })
    .catch(error => {
        alert('Registration failed: ' + error);
    });
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