
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cart } from './Components';
import { LandingPage } from './Components';
import { ComplaintPage } from './Components';
import SellerDashboard from './Components/SellerDashboard';
import { SellerAuth } from './Components';


function App() {


  return (
    <>
   <BrowserRouter>
   <Routes>
   <Route path="/" element={<LandingPage/>} />
   <Route path="/complaint" element={<ComplaintPage/>} />
   <Route path="/cart" element={<Cart/>} />
   <Route path="/seller" element={<SellerDashboard/>} />
   <Route path="/seller/auth" element={<SellerAuth/>} />
   </Routes>
   </BrowserRouter>
    </>
  )
}

export default App
