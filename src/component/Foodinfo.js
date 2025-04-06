import React from 'react';
import { useLocation } from 'react-router-dom';
import './styles/Foodinfo.css';

const Foodinfo = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) return <div className="no-info">Product not found</div>;

  return (
    <div className="foodinfo-container">
      <h2>{product.product_name}</h2>
      <img src={product.image_front_url || 'https://via.placeholder.com/200'} alt={product.product_name} />
      <p><strong>Ingredients:</strong> {product.ingredients_text || 'Not listed'}</p>
      <p><strong>Nutrition Grade:</strong> {product.nutrition_grades?.toUpperCase() || 'N/A'}</p>
      <p><strong>Vegan:</strong> {product.labels_tags?.includes('vegan') ? 'Yes' : 'No'}</p>
      <p><strong>Gluten Free:</strong> {product.labels_tags?.includes('gluten-free') ? 'Yes' : 'No'}</p>
      <div className="nutrition">
        <h3>Nutritional Values (per 100g):</h3>
        <p>Energy: {product.nutriments['energy_100g']} kJ</p>
        <p>Fat: {product.nutriments['fat_100g']} g</p>
        <p>Carbohydrates: {product.nutriments['carbohydrates_100g']} g</p>
        <p>Proteins: {product.nutriments['proteins_100g']} g</p>
        <p>Sugars: {product.nutriments['sugars_100g']} g</p>
      </div>
    </div>
  );
};

export default Foodinfo;
