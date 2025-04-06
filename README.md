# 🥗 Food Product Explorer

A responsive web application built using **React**, **React Bootstrap**, and **CSS**, which integrates with the [OpenFoodFacts API](https://world.openfoodfacts.org/) to allow users to search, filter, and explore food products with ease.

---

## 📌 Features

### ✅ Homepage
- Displays a list of food products fetched from the OpenFoodFacts API.
- Each product shows:
  - Product name
  - Image
  - Category
  - Ingredients (if available)
  - Nutrition Grade (A to E)
- Infinite scroll/load more functionality for seamless browsing.

### 🔍 Search Functionality
- **Search by Product Name**: Filters product list based on the search term.
- **Search by Barcode**: Direct search using a product barcode for detailed info.

### 🗂️ Category Filter
- Dropdown list to filter products by category (e.g., beverages, dairy, snacks).
- Categories are dynamically fetched from the API.

### 📊 Sort Options
- Sort products by:
  - Product Name (A-Z, Z-A)
  - Nutrition Grade (Ascending / Descending)

### 📄 Product Detail Page
- When a product is selected, detailed info is displayed including:
  - High-resolution image
  - Complete list of ingredients
  - Nutritional values (energy, fat, carbs, protein, etc.)
  - Labels like Vegan, Gluten-Free, etc.

### 📱 Responsive Design
- Fully optimized for mobile, tablet, and desktop views.

---

## 🔧 Tech Stack

- **Frontend**: ReactJS
- **Styling**: CSS, React Bootstrap
- **API Integration**: OpenFoodFacts API

---
🌐 **Live Demo**: [Click here to explore the app](https://magical-taffy-82c749.netlify.app/)
