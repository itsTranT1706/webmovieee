//Login/register

 // API Configuration
 const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your actual API URL
 let currentUser = null;
 let access_token = null;

 // Check for existing session on page load
 window.addEventListener('load', function() {
     const token = localStorage.getItem('access_token');
     const userData = localStorage.getItem('userData');
     
     if (token && userData) {
        access_token = token;
         currentUser = JSON.parse(userData);
         updateUserInterface();
     }
 });

 // Modal functions
 function openModal() {
     document.getElementById('authModal').classList.add('show');
 }

 function closeModal() {
     document.getElementById('authModal').classList.remove('show');
 }

 // Tab switching
 function showLogin() {
     document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
     document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
     
     event.target.classList.add('active');
     document.getElementById('loginForm').classList.add('active');
     document.querySelector('.form-title').textContent = 'Welcome Back!';
     hideSuccessMessage();
 }

 function showRegister() {
     document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
     document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
     
     event.target.classList.add('active');
     document.getElementById('registerForm').classList.add('active');
     document.querySelector('.form-title').textContent = 'Create Account';
     hideSuccessMessage();
 }
 
 // Success message functions
 function showSuccessMessage(message) {
     const successMsg = document.getElementById('successMessage');
     successMsg.textContent = message;
     successMsg.classList.add('show');
 }

 function hideSuccessMessage() {
     document.getElementById('successMessage').classList.remove('show');
 }

 function showErrorMessage(message) {
     alert(message); // You can replace this with a better error display
 }

 // Loading state functions
 function setButtonLoading(button, isLoading) {
     if (isLoading) {
         button.disabled = true;
         button.textContent = 'Loading...';
     } else {
         button.disabled = false;
         button.textContent = button.dataset.originalText;
     }
 }

 // API Functions
 async function registerUser(userData) {
    console.log(userData)
     try {
         const response = await fetch(`${API_BASE_URL}/auth/register`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify(userData)
         });

         const data = await response.json();
         console.log(data)

         if (!response.ok) {
             throw new Error(data.message || 'Registration failed');
         }

         return data;
     } catch (error) {
         throw error;
     }
 }

 async function loginUser(credentials) {
    console.log(credentials)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      return data;
    } catch (error) {
      throw error;
    }
  }

 async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to refresh token');
    }

    access_token = data.access_token;
    localStorage.setItem('access_token', access_token);

    return access_token;
  } catch (error) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
}

function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry;
    } catch (e) {
      return true;
    }
  }

 // Form submissions
 document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = this.querySelector('.submit-btn');
  submitBtn.dataset.originalText = submitBtn.textContent;
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
      showErrorMessage('Passwords do not match!');
      return;
  }

  const userData = {
      username: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      role: 1
  };

  setButtonLoading(submitBtn, true);

  try {
      const response = await registerUser(userData);
      if (response.status=="ERR") {
        alert (response.message);
        
      }
      else {

          console.log("res", response)
          showSuccessMessage('Registration successful! Please login.');
          
          // Clear form
          this.reset();
          
          // Switch to login after 2 seconds
          setTimeout(() => {
              showLogin();
          }, 2000);
      }
      
  } catch (error) {
      showErrorMessage(error.message || 'Registration failed. Please try again.');
  } finally {
      setButtonLoading(submitBtn, false);
  }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.dataset.originalText = submitBtn.textContent;
  
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    const credentials = {
      email: email,
      password: password,
    };
  
    setButtonLoading(submitBtn, true);
  
    try {
      const response = await loginUser(credentials);
      if (response.status === 'ERR') {
        alert(response.message);
        return;
      } else {
        // Store auth data
        access_token = response.token || response.access_token;
        currentUser = response.user || response.data;
  
        // Save to localStorage for persistence
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('userData', JSON.stringify(currentUser));
  
        // Update UI
        updateUserInterface();
        closeModal();
        this.reset();
      }
    } catch (error) {
      showErrorMessage(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });

// Update UI after login
function updateUserInterface() {
  document.querySelector('.login-btn').style.display = 'none';
  document.querySelector('.user-section').style.display = 'block';
  
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  
  // Handle different possible user data structures from API
  const displayName = currentUser.name || currentUser.full_name || currentUser.username || 'User';
  const firstName = displayName.split(' ')[0];
  
  userName.textContent = firstName;
  userAvatar.textContent = firstName.charAt(0).toUpperCase();
}

// Dropdown functions
function toggleDropdown() {
  document.getElementById('userDropdown').classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.user-section')) {
      document.getElementById('userDropdown').classList.remove('show');
  }
});

// Dropdown menu actions with API integration
async function showWatchHistory() {
  document.getElementById('userDropdown').classList.remove('show');
  
  try {
      // Example API call for watch history
      const response = await fetch(`${API_BASE_URL}/user/watch-history`, {
          headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
          }
      });
      
      if (response.ok) {
          const data = await response.json();
          // Handle watch history data
          alert('Watch History loaded! Check console for data.');
          console.log('Watch History:', data);
      } else {
          alert('Watch History feature coming soon!');
      }
  } catch (error) {
      alert('Watch History feature coming soon!');
  }
}

async function showFavorites() {
  document.getElementById('userDropdown').classList.remove('show');
  
  try {
      // Example API call for favorites
      const response = await fetch(`${API_BASE_URL}/user/favorites`, {
          headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
          }
      });
      
      if (response.ok) {
          const data = await response.json();
          // Handle favorites data
          alert('Favorites loaded! Check console for data.');
          console.log('Favorites:', data);
      } else {
          alert('Favorites feature coming soon!');
      }
  } catch (error) {
      alert('Favorites feature coming soon!');
  }
}

function showAccountInfo() {
    console.log(currentUser)
  const userInfo = `Account Info:
Name: ${currentUser.username || 'N/A'}
Email: ${currentUser.email || 'N/A'}
ID: ${currentUser.id || currentUser._id || 'N/A'}`;
  
  alert(userInfo);
  document.getElementById('userDropdown').classList.remove('show');
}

async function logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  
    currentUser = null;
    access_token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('userData');
  
    document.querySelector('.login-btn').style.display = 'block';
    document.querySelector('.user-section').style.display = 'none';
    document.getElementById('userDropdown').classList.remove('show');
  }


// API request helper with auth
async function makeAuthenticatedRequest(endpoint, options = {}) {
  if (access_token && isTokenExpired(access_token)) {
    await refreshAccessToken();
  }

  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: defaultOptions.headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      await refreshAccessToken();
      defaultOptions.headers['Authorization'] = `Bearer ${access_token}`;
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: defaultOptions.headers,
        credentials: 'include',
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
}

// Close modal when clicking outside
document.getElementById('authModal').addEventListener('click', function(e) {
  if (e.target === this) {
      closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
      closeModal();
  }
});