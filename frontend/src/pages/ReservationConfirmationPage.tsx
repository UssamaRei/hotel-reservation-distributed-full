import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Phone, MessageSquare, CreditCard, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  listing: {
    id: number;
    title: string;
    city: string;
    address: string;
    pricePerNight: number;
    imageUrls?: string[];
  };
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: string;
  };
  totalPrice: number;
  nights: number;
}

const ReservationConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as LocationState;

  const [formData, setFormData] = useState({
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if no booking data
    if (!state || !state.listing || !state.bookingData) {
      navigate('/hotels');
    }
  }, [state, navigate]);

  if (!state || !state.listing || !state.bookingData) {
    return null;
  }

  const { listing, bookingData, totalPrice, nights } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const reservationData = {
        listingId: listing.id,
        userId: user?.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalPrice: totalPrice,
        status: 'pending',
        guests: parseInt(bookingData.guests) || 2,
        guestPhone: formData.phone,
        guestNotes: formData.notes,
      };

      const response = await fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.id?.toString() || '',
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create reservation');
      }

      // Success - navigate to reservations page
      navigate('/my-reservations', {
        state: { 
          message: 'Reservation created successfully! Waiting for host approval.' 
        }
      });

    } catch (err) {
      console.error('Reservation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Confirm Your Reservation</h1>
            <p className="text-blue-100">Please review your booking details and provide contact information</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Booking Details */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

                {/* Property Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.city}{listing.address ? `, ${listing.address}` : ''}
                  </div>
                  {listing.imageUrls && listing.imageUrls.length > 0 && (
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.title}
                      className="w-full h-32 object-cover rounded-lg mt-3"
                    />
                  )}
                </div>

                {/* Dates */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="font-medium">Check-in</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {new Date(bookingData.checkIn).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="font-medium">Check-out</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {new Date(bookingData.checkOut).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="font-medium">Guests</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{bookingData.guests}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="w-5 h-5 mr-1 text-blue-600" />
                    Price Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>${listing.pricePerNight} × {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span>${(listing.pricePerNight * nights).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>Service fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Guest Information Form */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Guest Name (from user account) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>

                  {/* Email (from user account) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">The host will use this to contact you</p>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any special requests or questions for the host..."
                        rows={4}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Booking Status</p>
                        <p>Your reservation will be <strong>pending</strong> until the host approves it. You will be notified once confirmed.</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Confirm Reservation
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By clicking "Confirm Reservation", you agree to our terms and conditions
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmationPage;
