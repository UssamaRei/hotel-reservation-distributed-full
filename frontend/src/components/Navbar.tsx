import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hotel, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

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
              Apartments
            </Link>
            {isAuthenticated && (
              <Link to="/my-reservations" className="text-gray-700 hover:text-blue-600 font-medium transition">
                My Reservations
              </Link>
            )}
            {user?.role === 'host' && (
              <Link to="/host/listings" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Host Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Login
              </Link>
            )}
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
              Apartments
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-reservations"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={toggleMenu}
              >
                My Reservations
              </Link>
            )}
            {user?.role === 'host' && (
              <Link
                to="/host/listings"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={toggleMenu}
              >
                Host Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={toggleMenu}
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700 py-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-center"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
