import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NavBar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/get-product');
        const products = res.data?.products || []; // Fallback to empty array if undefined
        const uniqueCategories = [...new Set(products.map((product) => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchCategories();
  }, []); // Ensure this runs only once when the component mounts

  return (
    <>
    <header className="h-16 bg-emerald-700">
        <nav className="bg-emerald-700">
          <div className="container mx-auto px-6 py-3">
            {loading ? (
              <span className="text-white">Loading categories...</span>
            ) : categories.length > 0 ? (
              <ul className="flex space-x-6 overflow-x-auto">
                {categories.map((category, index) => (
                  <li key={index} className="text-white hover:text-gold-300">
                    {category}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-white">No categories available</span>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default NavBar;
