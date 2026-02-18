// Cart Widget for Header
class CartWidget {
  static init() {
    this.createCartWidget();
    this.updateCartWidget();
  }

  static createCartWidget() {
    const header = document.querySelector('.header');
    if (!header) return;

    const cartWidget = document.createElement('div');
    cartWidget.className = 'cart-widget';
    cartWidget.innerHTML = `
      <div class="cart-icon" onclick="CartWidget.toggleCart()">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count">0</span>
      </div>
      <div class="cart-dropdown" id="cartDropdown">
        <div class="cart-header">
          <h3>Shopping Cart</h3>
          <button class="close-cart" onclick="CartWidget.toggleCart()">×</button>
        </div>
        <div class="cart-items" id="cartItems">
          <div class="empty-cart-message">Your cart is empty</div>
        </div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span id="cartTotal">$0.00</span>
          </div>
          <div class="cart-actions">
            <button class="btn-secondary" onclick="CartWidget.clearCart()">Clear Cart</button>
            <button class="btn-primary" onclick="CartWidget.checkout()">Checkout</button>
          </div>
        </div>
      </div>
    `;

    // Insert after signin container
    const signinContainer = header.querySelector('.signin-container');
    if (signinContainer) {
      signinContainer.parentNode.insertBefore(cartWidget, signinContainer.nextSibling);
    } else {
      header.appendChild(cartWidget);
    }
  }

  static toggleCart() {
    const dropdown = document.getElementById('cartDropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  static updateCartWidget() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartCount || !cartItems || !cartTotal) return;

    const items = JSON.parse(localStorage.getItem('cart')) || [];
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update count
    cartCount.textContent = itemCount;
    cartCount.style.display = itemCount > 0 ? 'block' : 'none';

    // Update items
    if (items.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
    } else {
      cartItems.innerHTML = items.map(item => `
        <div class="cart-item-widget">
          <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-price">$${item.price} x ${item.quantity}</div>
          </div>
          <div class="item-actions">
            <input type="number" value="${item.quantity}" min="1" max="99" 
                   onchange="CartWidget.updateQuantity('${item.id}', this.value)">
            <button class="remove-item" onclick="CartWidget.removeItem('${item.id}')">×</button>
          </div>
        </div>
      `).join('');
    }

    // Update total
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  static updateQuantity(productId, quantity) {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    const item = items.find(item => item.id === productId);
    
    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        localStorage.setItem('cart', JSON.stringify(items));
        this.updateCartWidget();
      }
    }
  }

  static removeItem(productId) {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    const filteredItems = items.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(filteredItems));
    this.updateCartWidget();
    cart.updateUI();
  }

  static clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      localStorage.removeItem('cart');
      this.updateCartWidget();
      cart.updateUI();
    }
  }

  static checkout() {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const user = Auth.getCurrentUser();
    if (!user) {
      alert('Please login to checkout!');
      window.location.href = '/login';
      return;
    }

    // Show checkout confirmation
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    
    if (confirm(`Checkout Summary:\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nProceed to payment?`)) {
      alert('Payment processing coming soon! This is a demo.');
      // In real app, this would process payment
    }
  }
}

// Close cart when clicking outside
document.addEventListener('click', function(e) {
  const cartWidget = document.querySelector('.cart-widget');
  const dropdown = document.getElementById('cartDropdown');
  
  if (cartWidget && !cartWidget.contains(e.target) && dropdown) {
    dropdown.classList.remove('show');
  }
});

// Initialize cart widget when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  CartWidget.init();
});

// Update cart widget when cart changes
const originalAddItem = cart.addItem;
cart.addItem = function(product) {
  originalAddItem.call(this, product);
  CartWidget.updateCartWidget();
};

const originalRemoveItem = cart.removeItem;
cart.removeItem = function(productId) {
  originalRemoveItem.call(this, productId);
  CartWidget.updateCartWidget();
};

const originalClearCart = cart.clearCart;
cart.clearCart = function() {
  originalClearCart.call(this);
  CartWidget.updateCartWidget();
};

// Make available globally
window.CartWidget = CartWidget;
