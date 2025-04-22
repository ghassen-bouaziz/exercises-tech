// The 3 Complexity Symptoms Exercise
//
// This component exhibits all three symptoms of complexity:
// 
// 1. Unknown Unknowns: Incomplete error handling in data fetching
//    - API errors are not properly handled
//    - Network failures aren't properly communicated to users
//
// 2. Cognitive Load: Too many responsibilities in one component
//    - Mixing UI, data fetching, filtering, sorting, and business logic
//    - Complex calculations and transformations
//    - Difficult to understand the data flow
//
// 3. Change Amplification: Tight coupling between different concerns
//    - Changes to one feature might affect others
//    - UI, data fetching, and business logic are intertwined
//
// Your task: Refactor this component to address these symptoms by:
// 1. Improving error handling for better predictability
// 2. Breaking down the component to reduce cognitive load
// 3. Decoupling functionality to reduce change amplification
// 4. Applying proper separation of concerns

import React, { useState, useEffect } from 'react';

const ProductSearch = ({
  initialQuery = '',
  showRatings = true,
  allowFiltering = true,
  sortOptions = ['relevance', 'price-low', 'price-high'],
  saveSearchState = true
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: initialQuery,
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'relevance',
    page: 1,
    per_page: 10
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { ok, data, error } = await api.post('/products/search', filters);
      if (!ok) return setError(error);
      setProducts(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      page: 1,
      ...prev,
      [key]: value,
    }));
    if (!saveSearchState) return;
    if (key === 'q') {
      localStorage.setItem('lastSearchQuery', value);
    }
    localStorage.setItem('lastSearchFilters', JSON.stringify(filters));
  };

  const renderSortOptions = (option) => {
    if (option === 'relevance') return 'Relevance';
    if (option === 'price-low') return 'Price: Low to High';
    if (option === 'price-high') return 'Price: High to Low';
    return option;
  }

  const categorizedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          value={filters.q}
          name="q"
          onChange={e => handleFilterChange('q', e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <CustomFilters allowFiltering={allowFiltering} filters={filters} handleFilterChange={handleFilterChange} />
      <div className="mb-6">
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={e => handleFilterChange('sortBy', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option} value={option}>
              {renderSortOptions(option)}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {!error && !loading && (
        <div>
          {Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryProducts.map(product => (
                  <ProductCard product={product} showRatings={showRatings} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => handleFilterChange({ target: { name: 'page', value: filters.page - 1 } })}
          disabled={filters.page === 1}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1 bg-gray-100 text-gray-700 rounded-md">
          Page {filters.page}
        </span>
        <button
          onClick={() => handleFilterChange({ target: { name: 'page', value: filters.page + 1 } })}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const CustomFilters = ({ allowFiltering, filters, handleFilterChange }) => {
  if (!allowFiltering) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <select
        name="category"
        value={filters.category}
        onChange={e => handleFilterChange('category', e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="home">Home & Garden</option>
      </select>

      <input
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={e => handleFilterChange('minPrice', e.target.value)}
        placeholder="Min Price"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={e => handleFilterChange('maxPrice', e.target.value)}
        placeholder="Max Price"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="inStock"
          name="inStock"
          checked={filters.inStock}
          onChange={e => handleFilterChange('inStock', e.target.checked)}
          className="mr-2 h-5 w-5 text-blue-600"
        />
        <label htmlFor="inStock" className="text-gray-700">In Stock Only</label>
      </div>
    </div>
  )
}

const ProductCard = ({ product, showRatings }) => {
  return (
    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
        <ProductRating rating={product.rating} showRatings={showRatings} />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

const ProductRating = ({ showRatings, rating }) => {
  if (!showRatings) return null;
  return (
    <div className="flex mb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default ProductSearch;
