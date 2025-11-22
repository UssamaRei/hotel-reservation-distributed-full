import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Hotel className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">HotelHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Home
            </Link>
            <Link to="/hotels" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Hotels
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/hotels"
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={toggleMenu}
            >
              Hotels
            </Link>
            <Link
              to="/login"
              className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-center"
              onClick={toggleMenu}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
