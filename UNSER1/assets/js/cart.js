// Shopping Cart Management
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    
    this.saveCart();
    this.updateUI();
    this.showNotification('Product added to cart!');
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.updateUI();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.saveCart();
        this.updateUI();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateUI();
  }

  updateUI() {
    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = this.getItemCount();
      cartCount.style.display = this.getItemCount() > 0 ? 'block' : 'none';
    }

    // Update cart modal/dropdown if exists
    this.renderCartItems();
  }

  renderCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;

    if (this.items.length === 0) {
      cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }

    cartContainer.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>$${item.price} x ${item.quantity}</p>
        </div>
        <div class="item-actions">
          <input type="number" value="${item.quantity}" min="1" 
                 onchange="cart.updateQuantity('${item.id}', this.value)">
          <button onclick="cart.removeItem('${item.id}')" class="remove-btn">Remove</button>
        </div>
      </div>
    `).join('');

    // Update total
    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
      totalElement.textContent = `Total: $${this.getTotal().toFixed(2)}`;
    }
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart buttons
document.addEventListener('DOMContentLoaded', function() {
  // Update cart UI on load
  cart.updateUI();

  // Add event listeners to "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const product = {
        id: this.dataset.productId || Date.now().toString(),
        name: this.dataset.productName || 'Product',
        price: parseFloat(this.dataset.productPrice || '0'),
        image: this.dataset.productImage || ''
      };
      
      cart.addItem(product);
    });
  });

  // Add event listeners to product cards
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', function() {
        const product = {
          id: card.dataset.productId || Date.now().toString(),
          name: card.querySelector('.product-title')?.textContent || 'Product',
          price: parseFloat(card.dataset.productPrice || '0'),
          image: card.querySelector('.product-image')?.src || ''
        };
        
        cart.addItem(product);
      });
    }
  });
});

// Make cart available globally
window.cart = cart;

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .cart-count {
    background: #ff4757;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 18px;
    text-align: center;
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .empty-cart {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  
  .remove-btn {
    background: #ff4757;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .remove-btn:hover {
    background: #ff3838;
  }
`;
document.head.appendChild(style);
