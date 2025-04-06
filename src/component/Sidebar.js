import React, { useState } from 'react';
import '../component/styles/Sidebar.css';
import { FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';

const Sidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  barcodeSearch,
  onBarcodeToggle,
  applyFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    sort: true,
    search: true
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <div className="sidebar">
      <h2>Filter Products</h2>

      {/* Category Section */}
      <div className="filter-section">
        <div 
          className="section-header" 
          onClick={() => toggleSection('categories')}
        >
          <h3>Categories</h3>
          {expandedSections.categories ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        
        {expandedSections.categories && (
          <div className="filter-group">
            <select 
              value={selectedCategory} 
              onChange={(e) => onCategoryChange(e.target.value)}
              className="styled-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
            
            <div className="category-buttons">
              <button 
                className={selectedCategory === '' ? 'active' : ''} 
                onClick={() => onCategoryChange('')}
              >
                All
              </button>
              {categories.slice(0, 4).map((cat, idx) => (
                <button 
                  key={idx} 
                  className={selectedCategory === cat ? 'active' : ''} 
                  onClick={() => onCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sort By Section */}
      <div className="filter-section">
        <div 
          className="section-header" 
          onClick={() => toggleSection('sort')}
        >
          <h3>Sort By</h3>
          {expandedSections.sort ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        
        {expandedSections.sort && (
          <div className="filter-group">
            <select 
              value={sortOption} 
              onChange={(e) => onSortChange(e.target.value)}
              className="styled-select"
            >
              <option value="">Default Order</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="nutrition-asc">Nutrition Grade (Best First)</option>
              <option value="nutrition-desc">Nutrition Grade (Worst First)</option>
            </select>
          </div>
        )}
      </div>

      {/* Search Options */}
      <div className="filter-section">
        <div 
          className="section-header" 
          onClick={() => toggleSection('search')}
        >
          <h3>Search Options</h3>
          {expandedSections.search ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        
        {expandedSections.search && (
          <div className="filter-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={barcodeSearch} 
                onChange={onBarcodeToggle} 
              />
              <span className="checkbox-custom">
                {barcodeSearch && <FaCheck className="check-icon" />}
              </span>
              <span className="checkbox-text">Search by Barcode</span>
            </label>
            <p className="helper-text">
              {barcodeSearch 
                ? "Enter product barcode number to find exact product" 
                : "Search by product name"}
            </p>
          </div>
        )}
      </div>

      {/* Reset & Apply Buttons */}
      <div className="filter-actions">
        <button 
          className="reset-btn"
          onClick={() => {
            onCategoryChange('');
            onSortChange('');
            onBarcodeToggle(false);
          }}
        >
          Reset All
        </button>
        <button 
          className="apply-btn"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Sidebar;