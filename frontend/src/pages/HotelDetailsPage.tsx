import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, Check, Calendar, Users } from 'lucide-react';
import { mockHotels } from '../data/mockData';

const HotelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const hotel = mockHotels.find(h => h.id === parseInt(id || '0'));

  const [bookingData, setBookingData] = React.useState({
    checkIn: '',
    checkOut: '',
    guests: '2'
  });

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h2>
          <button
            onClick={() => navigate('/hotels')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reservation:', { hotel: hotel.name, ...bookingData });
    alert(`Reservation request sent for ${hotel.name}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/hotels')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Hotels
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{hotel.rating}</span>
                </div>
              </div>
            </div>

            {/* Hotel Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{hotel.name}</h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{hotel.location}</span>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Hotel</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{hotel.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.amenities.map((amenity, index) => (
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
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel Policies</h2>
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
                  <span className="text-4xl font-bold text-blue-600">${hotel.price}</span>
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
                      onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                      required
                    />
                  </div>
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
                      onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                      required
                    />
                  </div>
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
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
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
                  <span className="font-semibold">${hotel.price}</span>
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
