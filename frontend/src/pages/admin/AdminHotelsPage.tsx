import React, { useState, useEffect } from 'react';
import { Trash2, MapPin, DollarSign, Users, Bed, Bath, Image as ImageIcon, Mail, UserCircle } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  description: string;
  city: string;
  address: string;
  pricePerNight: number;
  maxGuests: number;
  beds: number;
  bathrooms: number;
  userId: number;
  imageUrls: string[];
  host?: {
    name: string;
    email: string;
    role: string;
  };
}

const AdminHotelsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserId = 1;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/listings', {
        headers: {
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      console.log('Fetched listings:', data); // Debug log
      console.log('First listing:', data[0]); // Debug log
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      alert('Listing deleted successfully');
      fetchListings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Listings</h1>
          <p className="text-gray-600 mt-1">Manage all property listings across the platform</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{listings.length}</span> listings
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600">Listings will appear here once hosts create them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                {listing.imageUrls && listing.imageUrls.length > 0 ? (
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-semibold text-gray-900">
                    ${listing.pricePerNight}/night
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {listing.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.city}{listing.address ? `, ${listing.address}` : ''}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {listing.description}
                </p>

                {/* Host Information */}
                {listing.host && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <UserCircle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Host: {listing.host.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600 flex items-center mt-1 truncate">
                          <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                          {listing.host.email || 'No email'}
                        </p>
                        <p className="text-xs text-red-600 mt-1">Debug: {JSON.stringify(listing.host)}</p>
                      </div>
                    </div>
                  </div>
                )}
                {!listing.host && (
                  <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-800">Host information not available (host is null or undefined)</p>
                    <p className="text-xs text-gray-600">Listing ID: {listing.id}, User ID: {listing.userId}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {listing.maxGuests}
                    </span>
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {listing.beds || 1}
                    </span>
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {listing.bathrooms || 1}
                    </span>
                  </div>
                  <span>ID: {listing.id}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHotelsPage;
