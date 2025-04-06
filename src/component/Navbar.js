import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaBars } from 'react-icons/fa';
import '../component/styles/Navbar.css';
import Cart from '../component/cart';

const Navbar = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Load cart items on initial render
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);
    updateCartCount(savedCartItems);
    
    // Add event listener for cart updates
    const handleCartUpdate = (event) => {
      setCartItems(event.detail);
      updateCartCount(event.detail);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(count);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (cartOpen) setCartOpen(false);
  };

  const handleRemoveFromCart = (productCode) => {
    const updatedCart = cartItems.filter(item => item.code !== productCode);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    updateCartCount(updatedCart);
    
    // Dispatch custom event
    const cartUpdateEvent = new CustomEvent('cartUpdated', { detail: updatedCart });
    window.dispatchEvent(cartUpdateEvent);
  };

  const handleUpdateQuantity = (productCode, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.code === productCode ? { ...item, quantity: newQuantity } : item
    );
    
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    updateCartCount(updatedCart);
    
    // Dispatch custom event
    const cartUpdateEvent = new CustomEvent('cartUpdated', { detail: updatedCart });
    window.dispatchEvent(cartUpdateEvent);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">FoodLens</Link>
        </div>
        
        <div className="mobile-menu-button" onClick={toggleMobileMenu}>
          <FaBars />
        </div>
        
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <FaHome /> Home
            </Link>
          </li>
          
          <li className="nav-item cart-item">
            <button className="cart-button" onClick={toggleCart}>
              <FaShoppingCart />
              <span className="cart-count">{cartCount}</span>
            </button>
          </li>
        </ul>
        
        {cartOpen && (
          <Cart 
            cartItems={cartItems} 
            onClose={() => setCartOpen(false)} 
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
