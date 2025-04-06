
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../component/Sidebar';
// import FoodCard from '../component/FoodCard';
// import Navbar from './Navbar';
// import '../component/styles/Mainpage.css';
// import { FaFilter, FaSearch } from 'react-icons/fa';
// <Navbar/>
// const Mainpage = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState(['Beverages', 'Snacks', 'Dairies', 'Cereals', 'Biscuits', 'Fruits', 'Vegetables', 'Meat']);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [sortOption, setSortOption] = useState('');
//   const [barcodeSearch, setBarcodeSearch] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Pagination
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [itemsPerPage] = useState(20);
//   const observer = useRef();
//   const navigate = useNavigate();

//   // Debounce search term
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
//   const searchTimeout = useRef(null);

//   // Function to handle search input change with debounce
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
    
//     // Clear any existing timeout
//     if (searchTimeout.current) {
//       clearTimeout(searchTimeout.current);
//     }
    
//     // Set a new timeout
//     searchTimeout.current = setTimeout(() => {
//       setDebouncedSearchTerm(value);
//     }, 500); // 500ms debounce
//   };

//   // Cancel timeout on component unmount
//   useEffect(() => {
//     return () => {
//       if (searchTimeout.current) {
//         clearTimeout(searchTimeout.current);
//       }
//     };
//   }, []);

//   // Fetch products when category or debounced search term changes
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setPage(1); // Reset pagination when search/category changes
      
//       let url;
//       if (debouncedSearchTerm) {
//         url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${debouncedSearchTerm}&search_simple=1&action=process&json=1&page_size=100`;
//         if (barcodeSearch) {
//           url = `https://world.openfoodfacts.org/api/v0/product/${debouncedSearchTerm}.json`;
//         }
//       } else if (selectedCategory) {
//         url = `https://world.openfoodfacts.org/category/${selectedCategory.toLowerCase()}.json?page_size=100`;
//       } else {
//         url = `https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=100`;
//       }

//       try {
//         const res = await fetch(url);
//         const data = await res.json();
        
//         let allProducts = [];
//         if (barcodeSearch && debouncedSearchTerm) {
//           // Handle single product response from barcode search
//           if (data.status === 1 && data.product) {
//             allProducts = [data.product];
//           }
//         } else {
//           allProducts = data.products || [];
//         }
        
//         setProducts(allProducts);
//         applyFiltersAndSort(allProducts);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedCategory, debouncedSearchTerm, barcodeSearch]);

//   // Apply filters and sort
//   const applyFiltersAndSort = useCallback((productsToFilter = products) => {
//     let updated = [...productsToFilter];

//     // Client-side filtering
//     if (searchTerm && !barcodeSearch) {
//       updated = updated.filter(product =>
//         product.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Apply sorting
//     if (sortOption === 'name-asc') {
//       updated.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
//     } else if (sortOption === 'name-desc') {
//       updated.sort((a, b) => (b.product_name || '').localeCompare(a.product_name || ''));
//     } else if (sortOption === 'nutrition-asc') {
//       updated.sort((a, b) => (a.nutrition_grades || 'z').localeCompare(b.nutrition_grades || 'z'));
//     } else if (sortOption === 'nutrition-desc') {
//       updated.sort((a, b) => (b.nutrition_grades || 'z').localeCompare(a.nutrition_grades || 'z'));
//     }

//     setFilteredProducts(updated);
//     setPage(1); // Reset to first page
//     setHasMore(updated.length > itemsPerPage);
//     setDisplayedProducts(updated.slice(0, itemsPerPage));
//   }, [products, searchTerm, sortOption, barcodeSearch, itemsPerPage]);

//   // Apply filters when sort option changes
//   useEffect(() => {
//     applyFiltersAndSort();
//   }, [sortOption, applyFiltersAndSort]);

//   // Load more products when scrolling (pagination)
//   const loadMoreItems = useCallback(() => {
//     if (!isLoading && hasMore) {
//       const nextPage = page + 1;
//       const startIndex = (nextPage - 1) * itemsPerPage;
//       const endIndex = nextPage * itemsPerPage;
      
//       if (startIndex < filteredProducts.length) {
//         const newItems = filteredProducts.slice(startIndex, endIndex);
//         setDisplayedProducts(prev => [...prev, ...newItems]);
//         setPage(nextPage);
//         setHasMore(endIndex < filteredProducts.length);
//       } else {
//         setHasMore(false);
//       }
//     }
//   }, [filteredProducts, isLoading, page, hasMore, itemsPerPage]);

//   // Intersection observer for infinite scrolling
//   const lastProductRef = useCallback(node => {
//     if (isLoading) return;
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         loadMoreItems();
//       }
//     });
    
//     if (node) observer.current.observe(node);
//   }, [isLoading, hasMore, loadMoreItems]);

//   // Handle view details
//   const handleViewDetails = (product) => {
//     // Store product data in session storage for access in detail page
//     sessionStorage.setItem('selectedProduct', JSON.stringify(product));
//     navigate(`/product/${product.code}`);
//   };

//   const handleAddToList = (product) => {
//     // Get existing list from local storage or create a new one
//     const savedList = JSON.parse(localStorage.getItem('cartItems')) || [];
    
//     // Check if product is already in the list
//     const productExists = savedList.some(item => item.code === product.code);
    
//     if (!productExists) {
//       // Add product to cart
//       savedList.push(product);
//       localStorage.setItem('cartItems', JSON.stringify(savedList));
//       alert(`${product.product_name} added to your cart!`);
//     } else {
//       alert(`${product.product_name} is already in your cart!`);
//     }
//   };
//   // const handleAddToCart = (product) => {
//   //   const existing = JSON.parse(localStorage.getItem('cartItems')) || [];
//   //   const exists = existing.find(item => item.code === product.code);
//   //   if (!exists) {
//   //     const updated = [...existing, product];
//   //     localStorage.setItem('cartItems', JSON.stringify(updated));
//   //     alert('Product added to cart!');
//   //   } else {
//   //     alert('Product already in cart!');
//   //   }
//   // };
  
  
//   // Toggle mobile filters
//   const toggleMobileFilters = () => {
//     setShowMobileFilters(!showMobileFilters);
//   };

//   return (
//     <div className="app-container">
//     {/* Navbar/Header */}
//     <header className="main-header">
//       <Navbar />
//     </header>
  
//     {/* Body Container (Sidebar + Main Content) */}
//     <div className="main-container">
//       {/* Sidebar (Desktop View) */}
//       <aside className="desktop-sidebar">
//         <Sidebar
//           categories={categories}
//           selectedCategory={selectedCategory}
//           onCategoryChange={category => {
//             setSelectedCategory(category);
//             setSearchTerm('');
//             setDebouncedSearchTerm('');
//           }}
//           sortOption={sortOption}
//           onSortChange={setSortOption}
//           barcodeSearch={barcodeSearch}
//           onBarcodeToggle={() => {
//             setBarcodeSearch(!barcodeSearch);
//             setSearchTerm('');
//             setDebouncedSearchTerm('');
//           }}
//         />
//       </aside>
  
//       {/* Main Content Area */}
//       <main className="main-content">
//         {/* Header Section (Search + Filter) */}
//         <div className="content-header">
//           <div className="search-section">
//             <div className="search-input-container">
//               <input
//                 type="text"
//                 placeholder={barcodeSearch ? 'Enter Barcode...' : 'Search foods...'}
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 onKeyPress={(e) => e.key === 'Enter' && applyFiltersAndSort()}
//               />
//               <button className="search-btn" onClick={applyFiltersAndSort}><FaSearch /></button>
//             </div>
  
//             {/* Mobile Filter Toggle */}
//             <button className="filter-toggle-btn" onClick={toggleMobileFilters}>
//               <FaFilter /> Filters
//             </button>
//           </div>
//         </div>
  
//         {/* Active Filters */}
//         <div className="active-filters">
//           {selectedCategory && (
//             <span className="filter-tag">
//               Category: {selectedCategory}
//               <button onClick={() => setSelectedCategory('')}>×</button>
//             </span>
//           )}
//           {sortOption && (
//             <span className="filter-tag">
//               Sorted by: {sortOption.replace('-', ' ').replace('asc', '↑').replace('desc', '↓')}
//               <button onClick={() => setSortOption('')}>×</button>
//             </span>
//           )}
//           {searchTerm && (
//             <span className="filter-tag">
//               {barcodeSearch ? 'Barcode: ' : 'Search: '}{searchTerm}
//               <button onClick={() => {
//                 setSearchTerm('');
//                 setDebouncedSearchTerm('');
//               }}>×</button>
//             </span>
//           )}
//         </div>
  
//         {/* Mobile Filters Overlay */}
//         {showMobileFilters && (
//           <div className="mobile-filters">
//             <div className="mobile-filters-content">
//               <div className="mobile-filters-header">
//                 <h3>Filters</h3>
//                 <button onClick={toggleMobileFilters}>×</button>
//               </div>
//               <Sidebar
//                 categories={categories}
//                 selectedCategory={selectedCategory}
//                 onCategoryChange={category => {
//                   setSelectedCategory(category);
//                   setSearchTerm('');
//                   setDebouncedSearchTerm('');
//                 }}
//                 sortOption={sortOption}
//                 onSortChange={setSortOption}
//                 barcodeSearch={barcodeSearch}
//                 onBarcodeToggle={() => {
//                   setBarcodeSearch(!barcodeSearch);
//                   setSearchTerm('');
//                   setDebouncedSearchTerm('');
//                 }}
//               />
//               <button
//                 className="apply-filters-btn"
//                 onClick={() => {
//                   applyFiltersAndSort();
//                   setShowMobileFilters(false);
//                 }}
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         )}
  
//         {/* Products Section */}
//         {isLoading ? (
//           <div className="loading-container">
//             <div className="loader"></div>
//             <p>Loading products...</p>
//           </div>
//         ) : (
//           <div className="products-section">
//             <h2>{selectedCategory || 'All Products'}</h2>
//             <p className="results-count">{filteredProducts.length} products found</p>
  
//             <div className="products-grid">
//               {displayedProducts.length > 0 ? (
//                 displayedProducts.map((product, index) => {
//                   if (index === displayedProducts.length - 1) {
//                     return (
//                       <div ref={lastProductRef} key={`${product.code}-${index}`}>
//                         <FoodCard
//                           product={product}
//                           onViewDetails={() => handleViewDetails(product)}
//                           onAddToList={() => handleAddToList(product)}
//                         />
//                       </div>
//                     );
//                   } else {
//                     return (
//                       <FoodCard
//                         key={`${product.code}-${index}`}
//                         product={product}
//                         onViewDetails={() => handleViewDetails(product)}
//                         onAddToList={() => handleAddToList(product)}
//                       />
//                     );
//                   }
//                 })
//               ) : (
//                 <div className="no-results">
//                   <h3>No products found</h3>
//                   <p>Try changing your search or filters</p>
//                 </div>
//               )}
//             </div>
  
//             {/* Load More Spinner */}
//             {hasMore && !isLoading && displayedProducts.length > 0 && (
//               <div className="loading-more">
//                 <div className="loader-small"></div>
//                 <p>Loading more...</p>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   </div>
  
//   );
// };

// export default Mainpage;
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../component/Sidebar';
import FoodCard from '../component/FoodCard';
import Navbar from './Navbar';
import '../component/styles/Mainpage.css';
import { FaFilter, FaSearch } from 'react-icons/fa';

const Mainpage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories] = useState(['Beverages', 'Snacks', 'Dairies', 'Cereals', 'Biscuits', 'Fruits', 'Vegetables', 'Meat']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [barcodeSearch, setBarcodeSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [itemsPerPage] = useState(20);
  const observer = useRef();
  const navigate = useNavigate();

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const searchTimeout = useRef(null);

  // Load cart items on initial render
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);
  }, []);

  // Function to handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Set a new timeout
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 500); // 500ms debounce
  };

  // Cancel timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Function to apply filters and sorting
  // Moved outside of useCallback to avoid dependency issues
  const applyFiltersAndSort = (productsToFilter = products) => {
    let updated = [...productsToFilter];

    // Client-side filtering
    if (searchTerm && !barcodeSearch) {
      updated = updated.filter(product =>
        product.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOption === 'name-asc') {
      updated.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
    } else if (sortOption === 'name-desc') {
      updated.sort((a, b) => (b.product_name || '').localeCompare(a.product_name || ''));
    } else if (sortOption === 'nutrition-asc') {
      updated.sort((a, b) => (a.nutrition_grades || 'z').localeCompare(b.nutrition_grades || 'z'));
    } else if (sortOption === 'nutrition-desc') {
      updated.sort((a, b) => (b.nutrition_grades || 'z').localeCompare(a.nutrition_grades || 'z'));
    }

    setFilteredProducts(updated);
    setPage(1); // Reset to first page
    setHasMore(updated.length > itemsPerPage);
    setDisplayedProducts(updated.slice(0, itemsPerPage));
  };

  // Fetch products when category or debounced search term changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setPage(1); // Reset pagination when search/category changes
      
      let url;
      if (debouncedSearchTerm) {
        url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${debouncedSearchTerm}&search_simple=1&action=process&json=1&page_size=100`;
        if (barcodeSearch) {
          url = `https://world.openfoodfacts.org/api/v0/product/${debouncedSearchTerm}.json`;
        }
      } else if (selectedCategory) {
        url = `https://world.openfoodfacts.org/category/${selectedCategory.toLowerCase()}.json?page_size=100`;
      } else {
        url = `https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=100`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        
        let allProducts = [];
        if (barcodeSearch && debouncedSearchTerm) {
          // Handle single product response from barcode search
          if (data.status === 1 && data.product) {
            allProducts = [data.product];
          }
        } else {
          allProducts = data.products || [];
        }
        
        setProducts(allProducts);
        applyFiltersAndSort(allProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, debouncedSearchTerm, barcodeSearch]);

  // Apply filters when products, search term, sort option, or barcode search changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [products, searchTerm, sortOption, barcodeSearch, itemsPerPage]);

  // Load more products when scrolling (pagination)
  const loadMoreItems = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * itemsPerPage;
      const endIndex = nextPage * itemsPerPage;
      
      if (startIndex < filteredProducts.length) {
        const newItems = filteredProducts.slice(startIndex, endIndex);
        setDisplayedProducts(prev => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(endIndex < filteredProducts.length);
      } else {
        setHasMore(false);
      }
    }
  }, [filteredProducts, isLoading, page, hasMore, itemsPerPage]);

  // Intersection observer for infinite scrolling
  const lastProductRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreItems]);

  // Handle view details
  const handleViewDetails = (product) => {
    // Store product data in session storage for access in detail page
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate(`/product/${product.code}`);
  };

  // Updated add to cart with quantity management
  const handleAddToList = (product) => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProductIndex = savedCart.findIndex(item => item.code === product.code);
    
    if (existingProductIndex === -1) {
      // Add new product with quantity 1
      const productWithQuantity = { ...product, quantity: 1 };
      savedCart.push(productWithQuantity);
      
      // Show success notification
      const notification = document.getElementById('cart-notification');
      if (notification) {
        notification.textContent = `${product.product_name} added to cart!`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
      }
    } else {
      // Increment quantity if product already exists
      savedCart[existingProductIndex].quantity = (savedCart[existingProductIndex].quantity || 1) + 1;
      
      // Show update notification
      const notification = document.getElementById('cart-notification');
      if (notification) {
        notification.textContent = `${product.product_name} quantity updated!`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
      }
    }
    
    // Update localStorage and state
    localStorage.setItem('cartItems', JSON.stringify(savedCart));
    setCartItems(savedCart);
    
    // Dispatch custom event to notify Navbar of cart update
    const cartUpdateEvent = new CustomEvent('cartUpdated', { detail: savedCart });
    window.dispatchEvent(cartUpdateEvent);
  };
  
  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="app-container">
      {/* Navbar/Header */}
      <header className="main-header">
        <Navbar cartItems={cartItems} />
      </header>
    
      {/* Body Container (Sidebar + Main Content) */}
      <div className="main-container">
        {/* Sidebar (Desktop View) */}
        <aside className="desktop-sidebar">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={category => {
              setSelectedCategory(category);
              setSearchTerm('');
              setDebouncedSearchTerm('');
            }}
            sortOption={sortOption}
            onSortChange={setSortOption}
            barcodeSearch={barcodeSearch}
            onBarcodeToggle={() => {
              setBarcodeSearch(!barcodeSearch);
              setSearchTerm('');
              setDebouncedSearchTerm('');
            }}
          />
        </aside>
    
        {/* Main Content Area */}
        <main className="main-content">
          {/* Header Section (Search + Filter) */}
          <div className="content-header">
            <div className="search-section">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder={barcodeSearch ? 'Enter Barcode...' : 'Search foods...'}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && applyFiltersAndSort()}
                />
                <button className="search-btn" onClick={() => applyFiltersAndSort()}><FaSearch /></button>
              </div>
    
              {/* Mobile Filter Toggle */}
              <button className="filter-toggle-btn" onClick={toggleMobileFilters}>
                <FaFilter /> Filters
              </button>
            </div>
          </div>
    
          {/* Active Filters */}
          <div className="active-filters">
            {selectedCategory && (
              <span className="filter-tag">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')}>×</button>
              </span>
            )}
            {sortOption && (
              <span className="filter-tag">
                Sorted by: {sortOption.replace('-', ' ').replace('asc', '↑').replace('desc', '↓')}
                <button onClick={() => setSortOption('')}>×</button>
              </span>
            )}
            {searchTerm && (
              <span className="filter-tag">
                {barcodeSearch ? 'Barcode: ' : 'Search: '}{searchTerm}
                <button onClick={() => {
                  setSearchTerm('');
                  setDebouncedSearchTerm('');
                }}>×</button>
              </span>
            )}
          </div>
    
          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="mobile-filters">
              <div className="mobile-filters-content">
                <div className="mobile-filters-header">
                  <h3>Filters</h3>
                  <button onClick={toggleMobileFilters}>×</button>
                </div>
                <Sidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={category => {
                    setSelectedCategory(category);
                    setSearchTerm('');
                    setDebouncedSearchTerm('');
                  }}
                  sortOption={sortOption}
                  onSortChange={setSortOption}
                  barcodeSearch={barcodeSearch}
                  onBarcodeToggle={() => {
                    setBarcodeSearch(!barcodeSearch);
                    setSearchTerm('');
                    setDebouncedSearchTerm('');
                  }}
                />
                <button
                  className="apply-filters-btn"
                  onClick={() => {
                    applyFiltersAndSort();
                    setShowMobileFilters(false);
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
    
          {/* Products Section */}
          {isLoading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="products-section">
              <h2>{selectedCategory || 'All Products'}</h2>
              <p className="results-count">{filteredProducts.length} products found</p>
    
              <div className="products-grid">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product, index) => {
                    if (index === displayedProducts.length - 1) {
                      return (
                        <div ref={lastProductRef} key={`${product.code}-${index}`}>
                          <FoodCard
                            product={product}
                            onViewDetails={() => handleViewDetails(product)}
                            onAddToList={() => handleAddToList(product)}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <FoodCard
                          key={`${product.code}-${index}`}
                          product={product}
                          onViewDetails={() => handleViewDetails(product)}
                          onAddToList={() => handleAddToList(product)}
                        />
                      );
                    }
                  })
                ) : (
                  <div className="no-results">
                    <h3>No products found</h3>
                    <p>Try changing your search or filters</p>
                  </div>
                )}
              </div>
    
              {/* Load More Spinner */}
              {hasMore && !isLoading && displayedProducts.length > 0 && (
                <div className="loading-more">
                  <div className="loader-small"></div>
                  <p>Loading more...</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Cart notification */}
      <div id="cart-notification" className="cart-notification"></div>
    </div>
  );
};

export default Mainpage;