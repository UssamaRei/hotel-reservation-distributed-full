import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import HotelCard from '../components/HotelCard';

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
  status: string;
}

const HotelsPage = () => {
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 500 });
  const [showFilters, setShowFilters] = React.useState(true);
  const [sortBy, setSortBy] = React.useState('recommended');
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);

  const moroccanCities = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fes',
    'Tangier',
    'Agadir',
    'Meknes',
    'Oujda',
    'Kenitra',
    'Tetouan',
    'Safi',
    'Essaouira',
    'El Jadida',
    'Nador',
    'Taza'
  ];

  React.useEffect(() => {
    fetchApprovedListings();
  }, []);

  const fetchApprovedListings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/listings', {
        headers: {
          'X-User-Id': '1',
          'X-User-Role': 'admin',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      // Filter only approved listings
      const approvedListings = data.filter((listing: Listing) => listing.status === 'approved');
      setListings(approvedListings);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  // Filter listings by price range and city
  const filteredListings = React.useMemo(() => {
    return listings.filter(listing => {
      const matchesPrice = listing.pricePerNight >= priceRange.min && 
                          listing.pricePerNight <= priceRange.max;
      const matchesCity = selectedCities.length === 0 || 
                         selectedCities.some(city => 
                           listing.city?.toLowerCase() === city.toLowerCase()
                         );
      return matchesPrice && matchesCity;
    });
  }, [listings, priceRange, selectedCities]);

  // Sort filtered listings
  const sortedListings = React.useMemo(() => {
    const sorted = [...filteredListings];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price-high':
        return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      default:
        return sorted;
    }
  }, [filteredListings, sortBy]);

  const handleClearFilters = () => {
    setPriceRange({ min: 0, max: 500 });
    setSortBy('recommended');
    setSelectedCities([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Apartments</h1>
          <p className="text-gray-600">Discover your perfect stay from our curated collection of approved apartments</p>
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

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  City
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {moroccanCities.map((city) => (
                    <label key={city} className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded"
                        checked={selectedCities.includes(city)}
                        onChange={() => toggleCity(city)}
                      />
                      <span className="text-sm text-gray-700">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button 
                onClick={handleClearFilters}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
              >
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
                Showing <span className="font-semibold">{sortedListings.length}</span> approved apartments
              </p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading apartments...</p>
                </div>
              </div>
            ) : sortedListings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No apartments found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              /* Apartments Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedListings.map((listing) => (
                  <HotelCard key={listing.id} hotel={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
