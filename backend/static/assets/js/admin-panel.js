// Admin Panel for Project Management
class AdminPanel {
  static init() {
    this.createAdminButton();
    this.checkAdminAccess();
  }

  static createAdminButton() {
    const header = document.querySelector('.header .signin-container');
    if (!header) return;

    const adminBtn = document.createElement('button');
    adminBtn.className = 'admin-btn';
    adminBtn.innerHTML = '<i class="fas fa-cog"></i> Admin';
    adminBtn.style.cssText = `
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      margin-left: 10px;
      font-size: 14px;
      transition: all 0.3s;
    `;

    adminBtn.addEventListener('click', () => this.showAdminPanel());
    header.appendChild(adminBtn);
  }

  static checkAdminAccess() {
    const user = Auth.getCurrentUser();
    const adminBtn = document.querySelector('.admin-btn');
    
    if (!user || !user.email.includes('admin')) {
      if (adminBtn) adminBtn.style.display = 'none';
    } else {
      if (adminBtn) adminBtn.style.display = 'block';
    }
  }

  static showAdminPanel() {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="AdminPanel.closeAdminPanel()"></div>
      <div class="modal-content admin-panel">
        <div class="modal-header">
          <h2><i class="fas fa-cog"></i> Admin Panel</h2>
          <button class="close-btn" onclick="AdminPanel.closeAdminPanel()">×</button>
        </div>
        <div class="modal-body">
          <div class="admin-tabs">
            <button class="tab-btn active" onclick="AdminPanel.showTab('dashboard')">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </button>
            <button class="tab-btn" onclick="AdminPanel.showTab('users')">
              <i class="fas fa-users"></i> Users
            </button>
            <button class="tab-btn" onclick="AdminPanel.showTab('products')">
              <i class="fas fa-shopping-bag"></i> Products
            </button>
            <button class="tab-btn" onclick="AdminPanel.showTab('analytics')">
              <i class="fas fa-chart-line"></i> Analytics
            </button>
            <button class="tab-btn" onclick="AdminPanel.showTab('settings')">
              <i class="fas fa-cog"></i> Settings
            </button>
          </div>
          
          <div class="tab-content" id="adminTabContent">
            ${this.getDashboardContent()}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  }

  static closeAdminPanel() {
    const modal = document.querySelector('.admin-modal');
    if (modal) {
      modal.remove();
      document.body.style.overflow = 'auto';
    }
  }

  static showTab(tabName) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const content = document.getElementById('adminTabContent');
    switch(tabName) {
      case 'dashboard':
        content.innerHTML = this.getDashboardContent();
        break;
      case 'users':
        content.innerHTML = this.getUsersContent();
        break;
      case 'products':
        content.innerHTML = this.getProductsContent();
        break;
      case 'analytics':
        content.innerHTML = this.getAnalyticsContent();
        break;
      case 'settings':
        content.innerHTML = this.getSettingsContent();
        break;
    }
  }

  static getDashboardContent() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalRevenue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return `
      <div class="dashboard-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <h3>1</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-info">
            <h3>${cartItems.length}</h3>
            <p>Cart Items</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stat-info">
            <h3>$${totalRevenue.toFixed(2)}</h3>
            <p>Potential Revenue</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-info">
            <h3>4</h3>
            <p>Products</p>
          </div>
        </div>
      </div>
      
      <div class="recent-activity">
        <h3>Recent Activity</h3>
        <div class="activity-list">
          <div class="activity-item">
            <i class="fas fa-user-plus"></i>
            <span>New user registered</span>
            <small>Just now</small>
          </div>
          <div class="activity-item">
            <i class="fas fa-shopping-cart"></i>
            <span>Item added to cart</span>
            <small>2 minutes ago</small>
          </div>
          <div class="activity-item">
            <i class="fas fa-sign-in-alt"></i>
            <span>User logged in</span>
            <small>5 minutes ago</small>
          </div>
        </div>
      </div>
    `;
  }

  static getUsersContent() {
    return `
      <div class="users-management">
        <div class="section-header">
          <h3>User Management</h3>
          <button class="btn-primary" onclick="AdminPanel.addUser()">
            <i class="fas fa-plus"></i> Add User
          </button>
        </div>
        <div class="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Admin User</td>
                <td>admin@uniserve.ai</td>
                <td><span class="status active">Active</span></td>
                <td>
                  <button class="btn-edit" onclick="AdminPanel.editUser(1)">Edit</button>
                  <button class="btn-delete" onclick="AdminPanel.deleteUser(1)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  static getProductsContent() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    return `
      <div class="products-management">
        <div class="section-header">
          <h3>Product Management</h3>
          <button class="btn-primary" onclick="AdminPanel.addProduct()">
            <i class="fas fa-plus"></i> Add Product
          </button>
        </div>
        <div class="products-grid">
          <div class="product-card">
            <div class="product-info">
              <h4>Student Bundle</h4>
              <p>$19.00</p>
              <span class="status in-stock">In Stock</span>
            </div>
            <div class="product-actions">
              <button class="btn-edit" onclick="AdminPanel.editProduct('student')">Edit</button>
              <button class="btn-delete" onclick="AdminPanel.deleteProduct('student')">Delete</button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-info">
              <h4>Creative Bundle</h4>
              <p>$29.00</p>
              <span class="status in-stock">In Stock</span>
            </div>
            <div class="product-actions">
              <button class="btn-edit" onclick="AdminPanel.editProduct('creative')">Edit</button>
              <button class="btn-delete" onclick="AdminPanel.deleteProduct('creative')">Delete</button>
            </div>
          </div>
          
          <div class="product-card">
            <div class="product-info">
              <h4>Startup Bundle</h4>
              <p>$34.00</p>
              <span class="status in-stock">In Stock</span>
            </div>
            <div class="product-actions">
              <button class="btn-edit" onclick="AdminPanel.editProduct('startup')">Edit</button>
              <button class="btn-delete" onclick="AdminPanel.deleteProduct('startup')">Delete</button>
            </div>
          </div>
        </div>
        
        <div class="cart-summary">
          <h4>Current Cart Items</h4>
          ${cartItems.length > 0 ? `
            <div class="cart-items-list">
              ${cartItems.map(item => `
                <div class="cart-item-admin">
                  <span>${item.name}</span>
                  <span>Qty: ${item.quantity}</span>
                  <span>$${item.price}</span>
                </div>
              `).join('')}
            </div>
          ` : '<p>No items in cart</p>'}
        </div>
      </div>
    `;
  }

  static getAnalyticsContent() {
    return `
      <div class="analytics-dashboard">
        <h3>Analytics Overview</h3>
        <div class="charts-grid">
          <div class="chart-card">
            <h4>Page Views</h4>
            <div class="chart-placeholder">
              <i class="fas fa-chart-bar"></i>
              <p>Chart coming soon</p>
            </div>
          </div>
          
          <div class="chart-card">
            <h4>User Activity</h4>
            <div class="chart-placeholder">
              <i class="fas fa-chart-line"></i>
              <p>Chart coming soon</p>
            </div>
          </div>
          
          <div class="chart-card">
            <h4>Sales Overview</h4>
            <div class="chart-placeholder">
              <i class="fas fa-chart-pie"></i>
              <p>Chart coming soon</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static getSettingsContent() {
    return `
      <div class="settings-panel">
        <h3>System Settings</h3>
        <div class="settings-form">
          <div class="form-group">
            <label>Site Title</label>
            <input type="text" value="Uniserve AI" />
          </div>
          
          <div class="form-group">
            <label>Admin Email</label>
            <input type="email" value="admin@uniserve.ai" />
          </div>
          
          <div class="form-group">
            <label>Maintenance Mode</label>
            <label class="switch">
              <input type="checkbox">
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="form-group">
            <label>Enable Registration</label>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
          
          <button class="btn-primary" onclick="AdminPanel.saveSettings()">
            <i class="fas fa-save"></i> Save Settings
          </button>
        </div>
      </div>
    `;
  }

  static addUser() {
    alert('Add user functionality coming soon!');
  }

  static editUser(id) {
    alert(`Edit user ${id} functionality coming soon!`);
  }

  static deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
      alert(`User ${id} deleted!`);
    }
  }

  static addProduct() {
    alert('Add product functionality coming soon!');
  }

  static editProduct(id) {
    alert(`Edit product ${id} functionality coming soon!`);
  }

  static deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      alert(`Product ${id} deleted!`);
    }
  }

  static saveSettings() {
    alert('Settings saved successfully!');
  }
}

// Add admin panel styles
const adminStyles = `
  .admin-btn:hover {
    background: #ff5252 !important;
    transform: translateY(-2px);
  }
  
  .admin-panel {
    max-width: 1200px !important;
    width: 95% !important;
  }
  
  .admin-tabs {
    display: flex;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  
  .tab-btn {
    background: none;
    border: none;
    padding: 15px 20px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .tab-btn.active {
    border-bottom-color: #007bff;
    color: #007bff;
  }
  
  .tab-btn:hover {
    background: #f8f9fa;
  }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    background: #007bff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  
  .stat-info h3 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }
  
  .stat-info p {
    margin: 0;
    color: #666;
  }
  
  .activity-list {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .status.active {
    background: #d4edda;
    color: #155724;
  }
  
  .status.in-stock {
    background: #d1ecf1;
    color: #0c5460;
  }
  
  .btn-edit, .btn-delete {
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
    font-size: 12px;
  }
  
  .btn-edit {
    background: #ffc107;
    color: #212529;
  }
  
  .btn-delete {
    background: #dc3545;
    color: white;
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #2196F3;
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
  AdminPanel.init();
});

// Make available globally
window.AdminPanel = AdminPanel;
