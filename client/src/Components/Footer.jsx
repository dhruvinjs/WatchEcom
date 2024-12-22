import React, { useState } from 'react';

const Footer = () => {
  const [openPopup, setOpenPopUp] = useState(false);

  const handleNewsLetterData = (e) => {
    e.preventDefault();
    const target = e.target;
    const formData = new FormData(target);
    const clientEmail = formData.get('newsletter_email');
    setOpenPopUp(true);
    target.reset();
    if (openPopup) {
      setTimeout(() => {
        setOpenPopUp(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-emerald-600 text-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">Stay Connected</h2>
          <p className="text-white mb-8">
            Subscribe to our newsletter for exclusive offers and updates.
          </p>
          <form onSubmit={handleNewsLetterData} className="flex gap-2">
            <input
              type="email"
              name="newsletter_email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-emerald-600 rounded-full hover:bg-emerald-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-600 py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Shop', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <div className="text-white hover:text-emerald-300 cursor-pointer transition-colors">
                    {item}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              {['Facebook', 'Instagram', 'Pinterest'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white hover:text-emerald-300 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg mb-4">Contact</h3>
            <p className="text-white">
              Email: hello@timelesspieces.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white text-center text-white">
          <p>&copy; 2024 TimelessPieces. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
