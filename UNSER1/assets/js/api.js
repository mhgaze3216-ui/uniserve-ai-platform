// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Helper Functions
class API {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  static async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Check API status
  static async getStatus() {
    return this.request('/status');
  }
}

// Authentication utilities
class Auth {
  static isLoggedIn() {
    return !!localStorage.getItem('authToken');
  }

  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  static saveAuthData(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication on page load
  if (!Auth.isLoggedIn() && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
    // Redirect to login if not authenticated
    // Uncomment this line if you want to protect pages
    // window.location.href = '/login';
  }

  // Setup login form
  const loginBtn = document.getElementById('loginBtn');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');

  if (loginBtn && loginEmail && loginPassword) {
    loginBtn.addEventListener('click', async function() {
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();

      if (!email || !password) {
        alert('Please enter both email and password');
        return;
      }

      try {
        loginBtn.textContent = 'Signing in...';
        loginBtn.disabled = true;

        const response = await API.login(email, password);
        
        if (response.success) {
          Auth.saveAuthData(response.token, response.user);
          alert('Login successful!');
          window.location.href = '/';
        } else {
          alert(response.message || 'Login failed');
        }
      } catch (error) {
        alert('Login failed: ' + error.message);
      } finally {
        loginBtn.textContent = 'Sign In';
        loginBtn.disabled = false;
      }
    });
  }

  // Setup register form
  const registerBtn = document.getElementById('registerBtn');
  const registerEmail = document.getElementById('registerEmail');
  const registerPassword = document.getElementById('registerPassword');
  const registerName = document.getElementById('registerName');

  if (registerBtn && registerEmail && registerPassword && registerName) {
    registerBtn.addEventListener('click', async function() {
      const name = registerName.value.trim();
      const email = registerEmail.value.trim();
      const password = registerPassword.value.trim();

      if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
      }

      try {
        registerBtn.textContent = 'Creating account...';
        registerBtn.disabled = true;

        const response = await API.register(name, email, password);
        
        if (response.success) {
          alert('Registration successful! Please login.');
          window.location.href = '/login';
        } else {
          alert(response.message || 'Registration failed');
        }
      } catch (error) {
        alert('Registration failed: ' + error.message);
      } finally {
        registerBtn.textContent = 'Create Account';
        registerBtn.disabled = false;
      }
    });
  }
});

// Export for use in other files
window.API = API;
window.Auth = Auth;
