// Authentication UI Management
class AuthUI {
  static updateUserInterface() {
    const user = Auth.getCurrentUser();
    const signinBtn = document.querySelector('.signin-btn');
    const userAvatar = document.querySelector('.user-avatar');
    const mobileSignin = document.querySelector('.mobile-signin');
    
    if (user) {
      // User is logged in
      if (signinBtn) {
        signinBtn.textContent = user.name || 'User';
        signinBtn.href = '#';
        signinBtn.onclick = (e) => {
          e.preventDefault();
          this.showUserMenu();
        };
      }
      
      if (userAvatar) {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=195de6&color=fff`;
        userAvatar.style.display = 'block';
      }
      
      if (mobileSignin) {
        mobileSignin.textContent = user.name || 'User';
        mobileSignin.style.display = 'block';
      }
    } else {
      // User is not logged in
      if (signinBtn) {
        signinBtn.textContent = 'Sign In';
        signinBtn.href = '/login';
        signinBtn.onclick = null;
      }
      
      if (userAvatar) {
        userAvatar.style.display = 'none';
      }
      
      if (mobileSignin) {
        mobileSignin.style.display = 'none';
      }
    }
  }

  static showUserMenu() {
    const user = Auth.getCurrentUser();
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
      <div class="user-menu-header">
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=195de6&color=fff" alt="User">
        <div>
          <div class="user-name">${user.name || 'User'}</div>
          <div class="user-email">${user.email || ''}</div>
        </div>
      </div>
      <div class="user-menu-items">
        <a href="#" onclick="UserProfile.showProfileModal(); return false;">
          <i class="fas fa-user"></i> My Profile
        </a>
        <a href="#" onclick="CartWidget.toggleCart(); return false;">
          <i class="fas fa-shopping-cart"></i> My Cart (${cart.getItemCount()})
        </a>
        <a href="#" onclick="AuthUI.showOrders(); return false;">
          <i class="fas fa-box"></i> My Orders
        </a>
        <a href="#" onclick="AuthUI.showSettings(); return false;">
          <i class="fas fa-cog"></i> Settings
        </a>
        <hr>
        <a href="#" onclick="Auth.logout(); return false;" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Sign Out
        </a>
      </div>
    `;
    
    // Position menu
    const signinBtn = document.querySelector('.signin-btn');
    if (signinBtn) {
      const rect = signinBtn.getBoundingClientRect();
      menu.style.position = 'fixed';
      menu.style.top = rect.bottom + 'px';
      menu.style.right = '20px';
      menu.style.zIndex = '1000';
    }
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  }

  static showProfile() {
    alert('Profile page coming soon!');
  }

  static showSettings() {
    alert('Settings page coming soon!');
  }

  static showOrders() {
    alert('Orders page coming soon!');
  }
}

// Update UI when page loads
document.addEventListener('DOMContentLoaded', function() {
  AuthUI.updateUserInterface();
  
  // Update UI when auth state changes
  const originalSaveAuthData = Auth.saveAuthData;
  Auth.saveAuthData = function(token, user) {
    originalSaveAuthData.call(this, token, user);
    AuthUI.updateUserInterface();
  };
  
  const originalLogout = Auth.logout;
  Auth.logout = function() {
    originalLogout.call(this);
    AuthUI.updateUserInterface();
  };
});

// Add CSS for user menu
const style = document.createElement('style');
style.textContent = `
  .user-menu {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    min-width: 250px;
    overflow: hidden;
  }
  
  .user-menu-header {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
  }
  
  .user-menu-header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  }
  
  .user-name {
    font-weight: 600;
    color: #333;
  }
  
  .user-email {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
  
  .user-menu-items {
    padding: 0;
  }
  
  .user-menu-items a {
    display: block;
    padding: 12px 15px;
    color: #333;
    text-decoration: none;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
  }
  
  .user-menu-items a:hover {
    background: #f8f9fa;
  }
  
  .user-menu-items hr {
    margin: 0;
    border: none;
    border-top: 1px solid #eee;
  }
  
  .logout-btn {
    color: #dc3545 !important;
  }
  
  .logout-btn:hover {
    background: #fff5f5 !important;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .user-avatar:hover {
    transform: scale(1.1);
  }
`;
document.head.appendChild(style);
