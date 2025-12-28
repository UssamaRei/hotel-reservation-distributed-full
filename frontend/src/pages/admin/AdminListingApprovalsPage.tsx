import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye, MapPin, DollarSign, Users, Bed, Bath } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Listing {
  id: number;
  title: string;
  description: string;
  city: string;
  address: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string;
  imageUrl: string;
  hostId: number;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminListingApprovalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const currentUserId = 1;

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter(listing => listing.status === filter));
    }
  }, [filter, listings]);

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
      // Set default status if not present
      const listingsWithStatus = data.map((listing: Listing) => ({
        ...listing,
        status: listing.status || 'approved'
      }));
      setListings(listingsWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listingId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/listings/${listingId}/approve`, {
        method: 'PATCH',
        headers: {
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve listing');
      }

      // Update local state
      setListings(listings.map(listing =>
        listing.id === listingId ? { ...listing, status: 'approved' as const } : listing
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve listing');
    }
  };

  const handleReject = async (listingId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/listings/${listingId}/reject`, {
        method: 'PATCH',
        headers: {
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject listing');
      }

      // Update local state
      setListings(listings.map(listing =>
        listing.id === listingId ? { ...listing, status: 'rejected' as const } : listing
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject listing');
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'pending').length,
    approved: listings.filter(l => l.status === 'approved').length,
    rejected: listings.filter(l => l.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Listing Approvals</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Total Listings</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize ${
                  filter === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} ({tab === 'all' ? stats.total : stats[tab]})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No {filter !== 'all' && filter} listings found
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={listing.imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'}
                          alt={listing.title}
                          className="w-16 h-16 rounded-lg object-cover mr-4"
                          onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'; }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                          <div className="text-xs text-gray-500">ID: {listing.id} | Host: {listing.hostId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {listing.city}{listing.address ? `, ${listing.address}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {listing.maxGuests}
                        </div>
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {listing.bedrooms}
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          {listing.bathrooms}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-semibold text-gray-900">
                        <DollarSign className="w-4 h-4" />
                        {listing.pricePerNight}/night
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => navigate(`/admin/listings/${listing.id}`)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 inline" />
                      </button>
                      {listing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(listing.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5 inline" />
                          </button>
                          <button
                            onClick={() => handleReject(listing.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5 inline" />
                          </button>
                        </>
                      )}
                      {listing.status === 'approved' && (
                        <button
                          onClick={() => handleReject(listing.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5 inline" />
                        </button>
                      )}
                      {listing.status === 'rejected' && (
                        <button
                          onClick={() => handleApprove(listing.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminListingApprovalsPage;
