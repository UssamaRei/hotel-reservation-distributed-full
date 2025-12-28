import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Mail, Phone, DollarSign, Clock } from 'lucide-react';

interface Booking {
  id: number;
  listingId: number;
  listingTitle: string;
  guestId: number;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrl: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string;
}

const AdminBookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserId = 1;

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch all reservations
      const response = await fetch('http://localhost:8080/api/admin/reservations', {
        headers: {
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const reservations = await response.json();
      const foundBooking = reservations.find((r: Booking) => r.id === parseInt(id!));

      if (!foundBooking) {
        throw new Error('Booking not found');
      }

      setBooking(foundBooking);

      // Fetch listing details
      const listingResponse = await fetch(`http://localhost:8080/api/listings/${foundBooking.listingId}`);
      
      if (listingResponse.ok) {
        const listingData = await listingResponse.json();
        setListing(listingData);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'Booking not found'}</p>
          <button
            onClick={() => navigate('/admin/bookings')}
            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const amenitiesList = listing?.amenities ? listing.amenities.split(',').map(a => a.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/bookings')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Bookings
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking #{booking.id}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-3xl font-bold text-indigo-600">${booking.totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking & Guest Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Guest Name</p>
                  <p className="font-medium text-gray-900">{booking.guestName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{booking.guestEmail}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Booked On</p>
                  <p className="font-medium text-gray-900">
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Stay Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-in</p>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                  <p className="font-medium text-gray-900">
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-out</p>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                  <p className="font-medium text-gray-900">
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Nights</span>
                <span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Listing Information */}
          {listing && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={listing.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
                alt={listing.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h2>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{listing.location}</span>
                </div>
                <p className="text-gray-700 mb-4">{listing.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{listing.maxGuests}</p>
                    <p className="text-sm text-gray-600">Guests</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{listing.bedrooms}</p>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{listing.bathrooms}</p>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                  </div>
                </div>

                {amenitiesList.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Price Breakdown */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Price Breakdown</h2>
            <div className="space-y-3">
              {listing && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">${listing.pricePerNight} × {nights} nights</span>
                    <span className="font-medium">${(listing.pricePerNight * nights).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">${booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Booking ID</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded font-mono">
                #{booking.id}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Listing ID</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded font-mono">
                #{booking.listingId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetailsPage;
