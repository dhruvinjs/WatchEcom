import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import Footer from './Footer';
import axios from 'axios';
import Header from './Header';

function LandingPage() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // State for the success message

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

  const addCart = useCallback(async (productId, quantity) => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.post("http://localhost:5000/cart/addtocart", { userId, productId, quantity });
      setMessage('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setMessage('Failed to add product to cart.');
    }
  }, []);

  const updateQuantity = useCallback(async () => {
    const userId = localStorage.getItem('userId');

    try {
      // Get the user's cart
      const cartRes = await axios.post(`http://localhost:5000/cart/get-cart`, { userId });
      const cart = cartRes.data;

      if (cart && cart.productsInCart && Array.isArray(cart.productsInCart)) {
        let updateSuccess = true;

        // Update the quantity of all products
        for (let item of cart.productsInCart) {
          const newQuantity = item.productQty + 1;
          try {
            await axios.put("http://localhost:5000/cart/update-quantity", { userId, productId: item.productId, productQty: newQuantity });
          } catch (error) {
            console.error('Error updating product quantity:', error);
            updateSuccess = false;
          }
        }

        // Set success or failure message
        if (updateSuccess) {
          setMessage('Quantities updated successfully!');
        } else {
          setMessage('Some quantities failed to update.');
        }
      } else {
        setMessage('No products in cart to update.');
      }
    } catch (error) {
      console.error('Error updating product quantity:', error);
      setMessage('Error updating quantities.');
    }
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <Header />
      <main className="pt-32 bg-emerald-600 text-white">
        <section>
          <Slider {...sliderSettings}>
            <div>
              <img
                src="https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg?cs=srgb&dl=pexels-pixabay-277319.jpg&fm=jpg"
                alt="Classic"
                className="w-full h-auto"
              />
            </div>
            <div>
              <img
                src="https://images7.alphacoders.com/857/857415.jpg"
                alt="Unique"
                className="w-full h-auto"
              />
            </div>
            <div>
              <img
                src="https://wallpaperaccess.com/full/812857.jpg"
                alt="Elegant"
                className="w-full h-auto"
              />
            </div>
          </Slider>
        </section>

        <section className="container mx-auto my-10 px-6">
          <h2 className="text-3xl font-bold text-gold-500 mb-6">Featured Products</h2>

          {message && (
            <div className="mb-4 p-2 bg-gold-500 text-emerald-900 rounded-md">
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center text-white">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border border-gold-400 rounded-md overflow-hidden shadow-lg bg-emerald-600 hover:shadow-xl"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gold-300">{product.name}</h3>
                    <p className="text-gray-200">${product.price}</p>
                    <p className="text-gray-200">Rating: {product.rating} ⭐</p>
                    <button
                      onClick={() => addCart(product._id, 1)}
                      className="mt-4 px-4 py-2 bg-gold-500 text-emerald-900 rounded-md hover:bg-gold-400"
                    >
                      Add to Cart
                    </button>
                    <br />
                    <button
            onClick={updateQuantity}
            className="mt-6 px-4 py-2 bg-gold-500 text-emerald-900 rounded-md hover:bg-gold-400"
          >
            Add More Quantities
          </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        
        </section>
        <Footer />
      </main>
    </>
  );
}

export default LandingPage;

