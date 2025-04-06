import React from 'react';
import { FaInfoCircle, FaCartPlus } from 'react-icons/fa';
import '../component/styles/FoodCard.css';

const FoodCard = ({ product, onViewDetails, onAddToList }) => {
  // Handle missing images
  const imageUrl = product.image_url || product.image_front_url || '/placeholder.png';
  
  // Format product name
  const productName = product.product_name || 'Unknown Product';
  const formattedName = productName.length > 40 
    ? productName.substring(0, 40) + '...' 
    : productName;
  
  // Nutrition grade circle color
  const getNutritionColor = (grade) => {
    switch(grade?.toLowerCase()) {
      case 'a': return '#1e8f4e';
      case 'b': return '#86bd40';
      case 'c': return '#efbf41';
      case 'd': return '#ee7239';
      case 'e': return '#e73333';
      default: return '#999999';
    }
  };
  
  return (
    <div className="food-card">
      <div className="card-image">
        <img 
          src={imageUrl} 
          alt={productName} 
          onError={(e) => {e.target.onerror = null; e.target.src = '/placeholder.png'}}
        />
        {product.nutrition_grades && (
          <div 
            className="nutrition-badge" 
            style={{ backgroundColor: getNutritionColor(product.nutrition_grades) }}
          >
            {product.nutrition_grades.toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{formattedName}</h3>
        <p className="card-brand">{product.brands || 'Unknown Brand'}</p>
        
        <div className="card-actions">
          <button 
            className="view-details-btn" 
            onClick={onViewDetails}
          >
            <FaInfoCircle /> Details
          </button>
          <button 
            className="add-to-list-btn" 
            onClick={onAddToList}
          >
            <FaCartPlus /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
