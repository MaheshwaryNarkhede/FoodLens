// import React, { useEffect, useState } from 'react';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);

//   // Load from localStorage when component mounts
//   useEffect(() => {
//     const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     setCartItems(storedItems);
//   }, []);

//   // Remove item from cart
//   const removeFromCart = (code) => {
//     const updatedItems = cartItems.filter(item => item.code !== code);
//     setCartItems(updatedItems);
//     localStorage.setItem('cartItems', JSON.stringify(updatedItems));
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Your Cart</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div>
//           {cartItems.map(item => (
//             <div key={item.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #ddd' }}>
//               <div>
//                 <h4>{item.name}</h4>
//                 <p>Brand: {item.brands}</p>
//               </div>
//               <button
//                 onClick={() => removeFromCart(item.code)}
//                 style={{
//                   backgroundColor: '#e74c3c',
//                   color: '#fff',
//                   border: 'none',
//                   padding: '8px 12px',
//                   borderRadius: '5px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;
import React from 'react';
import { FaTimes, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../component/styles/cart.css';

const Cart = ({ cartItems, onClose, onRemoveItem, onUpdateQuantity }) => {
  // Calculate total price (assuming products have a price field)
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price || 0);
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };
  
  // If no items in cart
  if (cartItems.length === 0) {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={onClose} className="continue-shopping-btn">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Your Cart ({cartItems.length} items)</h3>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
      </div>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.code} className="cart-item">
            <div className="item-image">
              <img 
                src={item.image_url || item.image_front_url || '/placeholder.png'} 
                alt={item.product_name || 'Product'} 
                onError={(e) => {e.target.onerror = null; e.target.src = '/placeholder.png'}}
              />
            </div>
            <div className="item-details">
              <h4>{item.product_name || 'Unknown Product'}</h4>
              <p className="item-brand">{item.brands || 'Unknown Brand'}</p>
              {item.price && <p className="item-price">${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</p>}
            </div>
            <div className="item-actions">
              <div className="quantity-controls">
                <button 
                  onClick={() => onUpdateQuantity(item.code, (item.quantity || 1) - 1)}
                  disabled={(item.quantity || 1) <= 1}
                >
                  <FaMinus />
                </button>
                <span className="quantity">{item.quantity || 1}</span>
                <button onClick={() => onUpdateQuantity(item.code, (item.quantity || 1) + 1)}>
                  <FaPlus />
                </button>
              </div>
              <button className="remove-btn" onClick={() => onRemoveItem(item.code)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span>${calculateTotal()}</span>
        </div>
        <div className="cart-buttons">
          <button className="checkout-btn">
            <Link to="/checkout">Proceed to Checkout</Link>
          </button>
          <button className="continue-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;