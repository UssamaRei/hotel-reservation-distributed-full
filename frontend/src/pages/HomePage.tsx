import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const HomePage = () => {
  const [searchData, setSearchData] = React.useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '1'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchData);
    // Add search logic here
  };

  const featuredHotels = [
    {
      id: 1,
      name: 'Grand Plaza Hotel',
      location: 'New York, USA',
      price: 150,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Oceanview Resort',
      location: 'Miami, USA',
      price: 200,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Mountain Lodge',
      location: 'Colorado, USA',
      price: 120,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'City Center Suites',
      location: 'Los Angeles, USA',
      price: 180,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=600&fit=crop)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl text-gray-200 mb-12">
            Discover amazing hotels worldwide at the best prices
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchData.location}
                  onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                />
              </div>

              {/* Check-in */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  placeholder="Check-in"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                />
              </div>

              {/* Check-out */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  placeholder="Check-out"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                />
              </div>

              {/* Guests */}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={searchData.guests}
                  onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full md:w-auto bg-blue-600 text-white px-12 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search Hotels
            </button>
          </form>
        </div>
      </div>

      {/* Featured Hotels Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Hotels</h2>
          <p className="text-lg text-gray-600">Handpicked stays for your next adventure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHotels.map((hotel) => (
            <Link key={hotel.id} to={`/hotels/${hotel.id}`} className="block">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer">
                <div className="relative h-48">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    ⭐ {hotel.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {hotel.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">${hotel.price}</span>
                      <span className="text-gray-600 text-sm">/night</span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
