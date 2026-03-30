import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const PublicLayout = () => (
  <div className="min-h-screen bg-tc-bg text-white font-['Space_Grotesk']">
    <Navbar />
    <main><Outlet /></main>
    <Footer />
  </div>
);

export default PublicLayout;
