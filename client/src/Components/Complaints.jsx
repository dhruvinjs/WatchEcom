import React, { useState } from 'react';
import axios from 'axios'; // Importing axios
import Footer from './Footer';
import NavBar from './NavBar';
import Header from './Header';




function ComplaintPage() {
  const [complaint, setComplaint] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const complaintData = {
      name,
      email,
      phone,
      message: complaint,
      userType: 'customer', 
    };

    try {
  
      const response = await axios.post('https://watch-ecom-bay.vercel.app/complaints/post-complaints', complaintData);

    
      if (response.data.message) {
        setSuccessMessage('Your complaint has been registered. We will get back to you soon.');
        setErrorMessage(''); 
      } else {
        setErrorMessage('There was an error submitting your complaint. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting your complaint. Please try again later.');
    } 
  };

  return (
    <>
     <Header component={true}/>

      <NavBar />


      <main className="pt-32 bg-white text-gray-900">
        <section className="container mx-auto px-6 py-8">
          <h2 className="text-3xl font-bold text-emerald-600 mb-6">Submit Your Complaint</h2>

  
          <div className="mb-6">
            {successMessage && (
              <div className="bg-green-100 text-green-800 p-4 rounded-md">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-100 text-red-800 p-4 rounded-md">
                {errorMessage}
              </div>
            )}
          </div>

          <form
            onSubmit={handleComplaintSubmit}
            className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200"
          >
        
            <div>
              <label htmlFor="name" className="text-emerald-600 text-sm font-semibold">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 p-3 rounded-md border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-emerald-300"
                required
              />
            </div>

       
            <div>
              <label htmlFor="email" className="text-emerald-500 text-sm font-semibold">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-3 rounded-md border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-emerald-300"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-emerald-500 text-sm font-semibold">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-2 p-3 rounded-md border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-emerald-300"
                required
              />
            </div>

           
            <div>
              <label htmlFor="complaint" className="text-emerald-600 text-sm font-semibold">Complaint</label>
              <textarea
                id="complaint"
                name="complaint"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows="6"
                className="w-full mt-2 p-3 rounded-md border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-emerald-300"
                placeholder="Describe your issue here..."
                required
              />
            </div>

   
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-400"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ComplaintPage;
