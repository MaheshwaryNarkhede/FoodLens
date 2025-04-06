import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaDownload, FaSearch } from 'react-icons/fa';
import '../component/styles/FoodList.css';

const FoodList = () => {
  const navigate = useNavigate();
  const [foodList, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  // Load food list from localStorage on component mount
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('foodList')) || [];
    setFoodList(savedList);
    setFilteredList(savedList);
  }, []);

  // Filter list when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredList(foodList);
      return;
    }
    
    const filtered = foodList.filter(item => 
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
  }, [searchTerm, foodList]);

  // Remove item from list
  const removeItem = (code) => {
    const updatedList = foodList.filter(item => item.code !== code);
    setFoodList(updatedList);
    localStorage.setItem('foodList', JSON.stringify(updatedList));
  };

  // Clear entire list
  const clearList = () => {
    if (window.confirm('Are you sure you want to clear your entire food list?')) {
      setFoodList([]);
      localStorage.removeItem('foodList');
    }
  };

  // View product details
  const viewDetails = (product) => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate(`/product/${product.code}`);
  };

  // Export list as CSV
  const exportCSV = () => {
    if (foodList.length === 0) {
      alert('Your food list is empty.');
      return;
    }
    
    // Get all possible headers from all products
    const allKeys = new Set();
    foodList.forEach(product => {
      Object.keys(product).forEach(key => {
        // Only include relevant fields
        if (['product_name', 'brands', 'quantity', 'nutrition_grades', 'code'].includes(key) ||
            key.startsWith('nutriments.')) {
          allKeys.add(key);
        }
      });
    });
    
    const headers = Array.from(allKeys);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    foodList.forEach(product => {
      const row = headers.map(header => {
        const value = product[header] || '';
        // Wrap values in quotes and escape quotes within
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'food_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate nutrition summary
  const calculateNutritionSummary = () => {
    if (foodList.length === 0) return null;
    
    let nutritionGrades = {
      'a': 0,
      'b': 0,
      'c': 0,
      'd': 0,
      'e': 0,
      'unknown': 0
    };
    
    foodList.forEach(product => {
      const grade = (product.nutrition_grades || 'unknown').toLowerCase();
      if (nutritionGrades.hasOwnProperty(grade)) {
        nutritionGrades[grade]++;
      } else {
        nutritionGrades.unknown++;
      }
    });
    
    return nutritionGrades;
  };

  const nutritionSummary = calculateNutritionSummary();

  return (
    <div className="food-list-container">
      <div className="list-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Products
        </button>
        <h1>My Food List</h1>
        <div className="list-actions">
          <button className="action-button" onClick={exportCSV} disabled={foodList.length === 0}>
            <FaDownload /> Export
          </button>
          <button className="action-button delete" onClick={clearList} disabled={foodList.length === 0}>
            <FaTrash /> Clear List
          </button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="list-search">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search your list..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon"><FaSearch /></span>
        </div>
      </div>
      
      {/* Nutrition summary */}
      {foodList.length > 0 && nutritionSummary && (
        <div className="nutrition-summary">
          <h3>Nutrition Summary</h3>
          <div className="nutrition-grades">
            {Object.entries(nutritionSummary).map(([grade, count]) => {
              if (count === 0) return null;
              
              const colors = {
                'a': '#1e8f4e',
                'b': '#85bb2f',
                'c': '#fecb02',
                'd': '#ee8100',
                'e': '#e63e11',
                'unknown': '#808080'
              };
              
              return (
                <div key={grade} className="grade-item">
                  <div 
                    className="grade-badge"
                    style={{ backgroundColor: colors[grade] }}
                  >
                    {grade === 'unknown' ? '?' : grade.toUpperCase()}
                  </div>
                  <span className="grade-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* List content */}
      <div className="list-content">
        {filteredList.length > 0 ? (
          <ul className="food-items-list">
            {filteredList.map(item => (
              <li key={item.code} className="food-list-item">
                <div 
                  className="item-content"
                  onClick={() => viewDetails(item)}
                >
                  <div className="item-image">
                    <img 
                      src={item.image_url || '/placeholder-food.png'} 
                      alt={item.product_name || 'Food item'} 
                      onError={(e) => {e.target.src = '/placeholder-food.png'}}
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.product_name || 'Unnamed Product'}</h3>
                    <div className="item-meta">
                      <span className="item-brand">{item.brands || 'Unknown Brand'}</span>
                      <span className="item-quantity">{item.quantity || ''}</span>
                    </div>
                    {item.nutrition_grades && (
                      <div 
                        className="nutri-badge"
                        style={{ 
                          backgroundColor: {
                            'a': '#1e8f4e',
                            'b': '#85bb2f',
                            'c': '#fecb02',
                            'd': '#ee8100',
                            'e': '#e63e11'
                          }[item.nutrition_grades.toLowerCase()] || '#808080'
                        }}
                      >
                        {item.nutrition_grades.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  className="remove-item-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.code);
                  }}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-list">
            {searchTerm ? (
              <>
                <h3>No matching items found</h3>
                <p>Try a different search term</p>
              </>
            ) : (
              <>
                <h3>Your food list is empty</h3>
                <p>Add items from the product pages</p>
                <button 
                  className="browse-products-btn"
                  onClick={() => navigate('/')}
                >
                  Browse Products
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodList;
