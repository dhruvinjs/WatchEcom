import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import axios from 'axios';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate(); // Initialize navigation

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://watch-ecom-beryl.vercel.app/get-product');
        setProducts(res.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post('https://watch-ecom-beryl.vercel.app/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('userId'); // Clear user data from local storage
      navigate('/'); // Redirect to homepage
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Open Edit Form with pre-filled data
  const handleEditClick = (product) => {
    setEditFormData(product);
    setShowEditForm(true);
  };

  // Handle form input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Edit Form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('https://watch-ecom-beryl.vercel.app/instock-update', editFormData);
      if (res.data.success) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productId === editFormData.productId ? res.data.product : product
          )
        );
        setShowEditForm(false);
      } else {
        console.error('Error updating product:', res.data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Navbar */}
      <header className="bg-emerald-700 text-white py-4 shadow-md">
        <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
          <h1 className="text-xl font-bold">Seller Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gold-500 text-black py-2 px-4 rounded hover:bg-gold-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Product List */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Product List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <table className="min-w-full table-auto">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId} className="border-b">
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">${product.price}</td>
                      <td className="px-4 py-2">{product.inStockValue}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-emerald-700 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">In Stock Value</label>
                <input
                  type="number"
                  name="inStockValue"
                  value={editFormData.inStockValue}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Sold Stock Value</label>
                <input
                  type="number"
                  name="soldStockValue"
                  value={editFormData.soldStockValue}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 text-white py-2 px-4 rounded hover:bg-emerald-800"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
