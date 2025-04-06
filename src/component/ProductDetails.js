import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaList, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import '../component/styles/ProductDetails.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('nutrition');

  useEffect(() => {
    const fetchProduct = async () => {
      // First try to get from session storage (for better performance)
      const storedProduct = sessionStorage.getItem('selectedProduct');
      
      if (storedProduct) {
        const parsedProduct = JSON.parse(storedProduct);
        if (parsedProduct.code === productId) {
          setProduct(parsedProduct);
          setIsLoading(false);
          return;
        }
      }
      
      // If not in session storage, fetch from API
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${productId}.json`);
        const data = await response.json();
        
        if (data.status === 1) {
          setProduct(data.product);
        } else {
          throw new Error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToList = () => {
    if (!product) return;
    
    // Get existing list or create new one
    const savedList = JSON.parse(localStorage.getItem('foodList')) || [];
    
    // Check if already in list
    const productExists = savedList.some(item => item.code === product.code);
    
    if (!productExists) {
      savedList.push(product);
      localStorage.setItem('foodList', JSON.stringify(savedList));
      alert(`${product.product_name} added to your list!`);
    } else {
      alert(`${product.product_name} is already in your list!`);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <FaExclamationTriangle size={48} />
        <h2>Product Not Found</h2>
        <p>We couldn't find the product you're looking for.</p>
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Products
        </button>
      </div>
    );
  }

  const nutritionGrade = product.nutrition_grades || 'unknown';
  const nutritionColor = {
    'a': '#1e8f4e', 
    'b': '#85bb2f',
    'c': '#fecb02',
    'd': '#ee8100',
    'e': '#e63e11',
    'unknown': '#808080'
  }[nutritionGrade.toLowerCase()];

  return (
    <div className="product-details-container">
      <div className="product-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back
        </button>
        <button className="add-list-button" onClick={handleAddToList}>
          <FaList /> Add to List
        </button>
      </div>
      
      <div className="product-main">
        <div className="product-image-container">
          <img 
            src={product.image_url || '/placeholder-food.png'} 
            alt={product.product_name || 'Product'} 
            className="product-image"
            onError={(e) => {e.target.src = '/placeholder-food.png'}}
          />
        </div>
        
        <div className="product-info">
          <h1 className="product-name">{product.product_name || 'Unnamed Product'}</h1>
          
          <div className="product-meta">
            <div className="brand">{product.brands || 'Unknown Brand'}</div>
            <div className="quantity">{product.quantity || ''}</div>
          </div>
          
          <div className="nutrition-score">
            <div 
              className="nutri-score-badge"
              style={{ backgroundColor: nutritionColor }}
            >
              {nutritionGrade.toUpperCase()}
            </div>
            <span>Nutri-Score</span>
          </div>
          
          {product.allergens_tags && product.allergens_tags.length > 0 && (
            <div className="allergens-warning">
              <h3>Contains Allergens:</h3>
              <div className="allergens-list">
                {product.allergens_tags.map(allergen => (
                  <span key={allergen} className="allergen-tag">
                    {allergen.replace('en:', '')}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="barcode-info">
            <strong>Barcode:</strong> {product.code}
          </div>
        </div>
      </div>
      
      <div className="product-details-tabs">
        <button 
          className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <FaChartBar /> Nutrition
        </button>
        <button 
          className={`tab-button ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          <FaList /> Ingredients
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'nutrition' && (
          <div className="nutrition-tab">
            <h2>Nutrition Facts</h2>
            <div className="nutrition-table">
              {product.nutriments && (
                <table>
                  <tbody>
                    <tr>
                      <th>Energy</th>
                      <td>{product.nutriments.energy_100g || 'N/A'} {product.nutriments.energy_unit || 'kcal'}</td>
                    </tr>
                    <tr>
                      <th>Fat</th>
                      <td>{product.nutriments.fat_100g || 'N/A'} g</td>
                    </tr>
                    <tr>
                      <th>Saturated Fat</th>
                      <td>{product.nutriments['saturated-fat_100g'] || 'N/A'} g</td>
                    </tr>
                    <tr>
                      <th>Carbohydrates</th>
                      <td>{product.nutriments.carbohydrates_100g || 'N/A'} g</td>
                    </tr>
                    <tr>
                      <th>Sugars</th>
                      <td>{product.nutriments.sugars_100g || 'N/A'} g</td>
                    </tr>
                    <tr>
                      <th>Fiber</th>
                      <td>{product.nutriments.fiber_100g || 'N/A'} g</td>
                    </tr>
                    <tr>
                      <th>Proteins</th>
                      <td>{product.nutriments.proteins_100g || 'N/A'} g</td>
                    </tr>
                    <tr>
                      <th>Salt</th>
                      <td>{product.nutriments.salt_100g || 'N/A'} g</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {!product.nutriments && <p>No nutrition information available.</p>}
            </div>
          </div>
        )}
        
        {activeTab === 'ingredients' && (
          <div className="ingredients-tab">
            <h2>Ingredients</h2>
            {product.ingredients_text ? (
              <p className="ingredients-text">{product.ingredients_text}</p>
            ) : (
              <p>No ingredients information available.</p>
            )}
            
            {product.additives_tags && product.additives_tags.length > 0 && (
              <div className="additives-section">
                <h3>Additives:</h3>
                <div className="additives-list">
                  {product.additives_tags.map(additive => (
                    <span key={additive} className="additive-tag">
                      {additive.replace('en:', '')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;