import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');  // New state for username

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/get-product');
        setProducts(res.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchCart = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    try {
      const res = await axios.post('http://localhost:5000/cart/get-cart', { userId });
    
      const cartWithDetails = res.data.cart.productsInCart.map(item => {
        const product = products.find(p => p._id === item.productId);
        return {
          ...item,
          name: product ? product.name : 'Unknown',
          price: product ? product.price : 0,
        };
      });
      setCartItems(cartWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const deleteItem = async (productId) => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete('http://localhost:5000/cart/remove-from-cart', { data: { userId, productId } });
      setMessage('Item removed from cart.');
      fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setMessage('Failed to remove item from cart.');
    }
  };

  const placeOrder = async () => {
    const userId = localStorage.getItem('userId');
    const productsOrdered = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.productQty,
    }));
    const price = cartItems.reduce((sum, item) => sum + item.price * item.productQty, 0);
    try {
      const response = await axios.post('http://localhost:5000/cart/place-order', {
        userId,
        name,
        username,  // Send the username here
        date,
        time,
        address,
        price,
        productsOrdered,
      });
      setMessage('Order placed successfully!');
      setCartItems([]);
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage('Failed to place order.');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.productQty, 0);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-emerald-600 text-white">
      <Header component={true} />
      <main className="container mx-auto my-10 px-6 pt-32">
        <h1 className="text-4xl font-bold text-gold-500 mb-6">Your Cart</h1>

        {message && (
          <div className="mb-4 p-2 bg-gold-500 text-emerald-900 rounded-md">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center">Your cart is empty.</div>
        ) : (
          <div className="bg-emerald-700 rounded-md overflow-hidden shadow-lg">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 border-b border-emerald-600 hover:bg-emerald-800 transition duration-300">
                <div>
                  <h3 className="text-xl font-semibold text-gold-300">{item.name}</h3>
                  <p className="text-gray-300">Quantity: {item.productQty}</p>
                  <p className="text-gray-300">Price: ${(item.price * item.productQty).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => deleteItem(item.productId)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="p-4 bg-emerald-800">
              <p className="text-2xl font-bold text-gold-500">Total: ${totalPrice.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-emerald-700 rounded-md p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gold-500 mb-4">Order Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-lg font-semibold text-gold-300">Delivery Address:</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 mt-2 border rounded-md bg-emerald-800 text-white border-gold-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Enter your delivery address"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-gold-300">Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-2 border rounded-md bg-emerald-800 text-white border-gold-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Enter your Name"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-lg font-semibold text-gold-300">Delivery Date:</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 mt-2 border rounded-md bg-emerald-800 text-white border-gold-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={placeOrder}
            className="px-8 py-3 bg-gold-500 text-emerald-900 rounded-md hover:bg-gold-400 transition duration-300 font-bold text-lg"
            disabled={!address || !date || !name}  // Make sure username is filled before allowing to place order
          >
            Place Order
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
