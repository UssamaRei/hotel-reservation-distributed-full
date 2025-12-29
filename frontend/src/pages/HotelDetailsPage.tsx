import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, Check, Calendar, Users, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Listing {
  id: number;
  title: string;
  description: string;
  city: string;
  address: string;
  pricePerNight: number;
  maxGuests: number;
  userId: number;
  imageUrls: string[];
  amenities?: string[];
  status: string;
}

const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const [listing, setListing] = React.useState<Listing | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [bookedDates, setBookedDates] = React.useState<Array<{checkIn: string, checkOut: string}>>([]);

  const [bookingData, setBookingData] = React.useState({
    checkIn: '',
    checkOut: '',
    guests: '2'
  });

  React.useEffect(() => {
    fetchListing();
    if (id) {
      fetchBookedDates();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/listings/${id}`, {
        headers: {
          'X-User-Id': '1',
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch listing');
      }

      const data = await response.json();
      setListing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedDates = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/listings/${id}/booked-dates`);
      if (response.ok) {
        const data = await response.json();
        setBookedDates(data);
      }
    } catch (err) {
      console.error('Failed to fetch booked dates:', err);
    }
  };

  const isDateBooked = (date: string): boolean => {
    const checkDate = new Date(date);
    return bookedDates.some(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return checkDate >= checkIn && checkDate < checkOut;
    });
  };

  const getMinCheckInDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinCheckOutDate = (): string => {
    if (!bookingData.checkIn) return '';
    const checkIn = new Date(bookingData.checkIn);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading apartment details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Apartment Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The apartment you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/hotels')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Apartments
          </button>
        </div>
      </div>
    );
  }

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: location }, replace: false });
      return;
    }
    
    // Validate dates
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    // Check if selected dates overlap with booked dates
    const checkIn = bookingData.checkIn;
    const checkOut = bookingData.checkOut;
    
    for (const booking of bookedDates) {
      if (checkIn < booking.checkOut && checkOut > booking.checkIn) {
        alert('Some of the selected dates are already booked. Please choose different dates.');
        return;
      }
    }
    
    try {
      // Calculate total price (number of nights * price per night)
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * listing.pricePerNight;
      
      const reservationData = {
        listingId: listing.id,
        userId: user.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalPrice: totalPrice,
        status: 'pending',
        guests: parseInt(bookingData.guests) || 2
      };
      
      const response = await fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create reservation');
      }
      
      const createdReservation = await response.json();
      alert(`Reservation confirmed for ${listing.title}!\nTotal: $${totalPrice} for ${nights} night(s)\nStatus: Pending approval`);
      
      // Reset form
      setBookingData({
        checkIn: '',
        checkOut: '',
        guests: '2'
      });
    } catch (err) {
      console.error('Reservation error:', err);
      alert(err instanceof Error ? err.message : 'Failed to create reservation. Please try again.');
    }
  };

  const locationString = `${listing.city || ''}${listing.address ? ', ' + listing.address : ''}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/hotels')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Apartments
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-xl bg-gray-200">
              {listing.imageUrls && listing.imageUrls.length > 0 ? (
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Listing Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{locationString || 'Location not specified'}</span>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Apartment</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{listing.description}</p>
              </div>

              {/* Max Guests Info */}
              <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-800 font-medium">Maximum {listing.maxGuests} guests</span>
                </div>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Check className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-gray-800 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Images */}
            {listing.imageUrls && listing.imageUrls.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">More Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.imageUrls.slice(1).map((imageUrl, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={imageUrl}
                        alt={`${listing.title} - Image ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Policies</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">Check-in</h3>
                  <p>After 3:00 PM</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Check-out</h3>
                  <p>Before 11:00 AM</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cancellation</h3>
                  <p>Free cancellation up to 24 hours before check-in</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Special Requests</h3>
                  <p>Subject to availability upon check-in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-blue-600">${listing.pricePerNight}</span>
                  <span className="text-gray-600">/night</span>
                </div>
                <p className="text-sm text-gray-500">Taxes and fees included</p>
              </div>

              <form onSubmit={handleReserve} className="space-y-4">
                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookingData.checkIn}
                      min={getMinCheckInDate()}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        if (isDateBooked(selectedDate)) {
                          alert('This date is already booked. Please select another date.');
                          e.target.value = '';
                          return;
                        }
                        setBookingData({ ...bookingData, checkIn: selectedDate, checkOut: '' });
                      }}
                      required
                    />
                  </div>
                  {bookedDates.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Some dates may be unavailable due to existing bookings
                    </p>
                  )}
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookingData.checkOut}
                      min={getMinCheckOutDate()}
                      disabled={!bookingData.checkIn}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        // Check if any date in the range is booked
                        const checkIn = new Date(bookingData.checkIn);
                        const checkOut = new Date(selectedDate);
                        let hasBookedDate = false;
                        
                        for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
                          const dateStr = d.toISOString().split('T')[0];
                          if (isDateBooked(dateStr)) {
                            hasBookedDate = true;
                            break;
                          }
                        }
                        
                        if (hasBookedDate) {
                          alert('Some dates in this range are already booked. Please select a different check-out date.');
                          e.target.value = '';
                          return;
                        }
                        
                        setBookingData({ ...bookingData, checkOut: selectedDate });
                      }}
                      required
                    />
                  </div>
                  {!bookingData.checkIn && (
                    <p className="text-xs text-gray-500 mt-1">
                      Please select check-in date first
                    </p>
                  )}
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                    >
                      {[...Array(Math.min(listing.maxGuests, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reserve Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  Reserve Now
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                You won't be charged yet
              </p>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Total before taxes</span>
                  <span className="font-semibold">${listing.pricePerNight}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-semibold">$15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
