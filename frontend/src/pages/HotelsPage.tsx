import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import { mockHotels } from '../data/mockData';

const HotelsPage = () => {
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 500 });
  const [showFilters, setShowFilters] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Hotels</h1>
          <p className="text-gray-600">Discover your perfect stay from our curated collection</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <aside className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range (per night)
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600">Min Price</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="text-sm font-semibold text-blue-600 mt-1">${priceRange.min}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max Price</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-sm font-semibold text-blue-600 mt-1">${priceRange.max}</div>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-2 rounded" />
                      <span className="text-sm text-gray-700">{rating}+ ⭐</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="space-y-2">
                  {['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking', 'Spa'].map((amenity) => (
                    <label key={amenity} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-2 rounded" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium">
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            {!showFilters && (
              <button
                onClick={() => setShowFilters(true)}
                className="mb-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Show Filters
              </button>
            )}

            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{mockHotels.length}</span> hotels
              </p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
