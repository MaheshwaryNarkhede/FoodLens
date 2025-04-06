import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Mainpage from './component/Mainpage';
import ProductDetails from './component/ProductDetails';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FoodList from './component/FoodList';

// ✅ Create the QueryClient instance here
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/list" element={<FoodList />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
