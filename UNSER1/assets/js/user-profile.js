// User Profile Management
class UserProfile {
  static showProfileModal() {
    const user = Auth.getCurrentUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'profile-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="UserProfile.closeProfileModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>My Profile</h2>
          <button class="close-btn" onclick="UserProfile.closeProfileModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="profile-section">
            <div class="profile-avatar">
              <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=195de6&color=fff&size=100" alt="Profile">
              <button class="change-avatar-btn">Change Photo</button>
            </div>
            <div class="profile-info">
              <div class="info-group">
                <label>Full Name</label>
                <input type="text" id="profileName" value="${user.name || ''}" readonly>
              </div>
              <div class="info-group">
                <label>Email</label>
                <input type="email" id="profileEmail" value="${user.email || ''}" readonly>
              </div>
              <div class="info-group">
                <label>Member Since</label>
                <input type="text" value="${new Date().toLocaleDateString()}" readonly>
              </div>
            </div>
          </div>
          
          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-number">${cart.getItemCount()}</div>
              <div class="stat-label">Cart Items</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">$${cart.getTotal().toFixed(2)}</div>
              <div class="stat-label">Cart Total</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">0</div>
              <div class="stat-label">Orders</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="UserProfile.closeProfileModal()">Close</button>
          <button class="btn-primary" onclick="UserProfile.editProfile()">Edit Profile</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  }

  static closeProfileModal() {
    const modal = document.querySelector('.profile-modal');
    if (modal) {
      modal.remove();
      document.body.style.overflow = 'auto';
    }
  }

  static editProfile() {
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    
    if (nameInput.readOnly) {
      nameInput.readOnly = false;
      emailInput.readOnly = false;
      nameInput.style.backgroundColor = '#fff';
      emailInput.style.backgroundColor = '#fff';
      nameInput.focus();
    } else {
      // Save changes
      const updatedUser = {
        ...Auth.getCurrentUser(),
        name: nameInput.value,
        email: emailInput.value
      };
      
      Auth.saveAuthData(localStorage.getItem('authToken'), updatedUser);
      AuthUI.updateUserInterface();
      
      nameInput.readOnly = true;
      emailInput.readOnly = true;
      nameInput.style.backgroundColor = '#f8f9fa';
      emailInput.style.backgroundColor = '#f8f9fa';
      
      this.showNotification('Profile updated successfully!');
    }
  }

  static showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'profile-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}

// Make available globally
window.UserProfile = UserProfile;
