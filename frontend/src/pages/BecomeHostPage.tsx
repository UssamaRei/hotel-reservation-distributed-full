import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, DollarSign, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BecomeHostPage: React.FC = () => {
  const { user, becomeHost, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBecomeHost = () => {
    becomeHost();
    navigate('/host/listings');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to become a host</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'host') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">You're Already a Host!</h2>
            <p className="text-gray-600 mb-6">Start managing your listings</p>
            <button
              onClick={() => navigate('/host/listings')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Host Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Become a Host</h1>
          <p className="text-xl text-gray-600">Share your space and earn money</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Home className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">List Your Space</h3>
            <p className="text-gray-600">
              Create listings for your apartments and reach thousands of travelers
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Earn Money</h3>
            <p className="text-gray-600">
              Set your own prices and earn passive income from your properties
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Bookings</h3>
            <p className="text-gray-600">
              Easy-to-use dashboard to manage your reservations and calendar
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Upgrade your account to host and start listing your properties today
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Maybe Later
              </button>
              <button
                onClick={handleBecomeHost}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
              >
                Become a Host
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Your account will be upgraded to host status</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>You'll get access to the Host Dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>You can create and manage your apartment listings</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Start accepting reservations immediately</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeHostPage;
