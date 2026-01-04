import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Bed, Bath, DollarSign, CheckCircle, XCircle, Calendar } from 'lucide-react';

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
  amenities: string;
  imageUrl: string;
  imageUrls: string[];
  hostId: number;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminListingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserId = 1;

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/listings/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch listing details');
      }

      const data = await response.json();
      // Set default status if not present
      if (!data.status) {
        data.status = 'approved';
      }
      setListing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/listings/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve listing');
      }

      setListing(prev => prev ? { ...prev, status: 'approved' } : null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve listing');
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/listings/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject listing');
      }

      setListing(prev => prev ? { ...prev, status: 'rejected' } : null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'Listing not found'}</p>
          <button
            onClick={() => navigate('/admin/approvals')}
            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Approvals
          </button>
        </div>
      </div>
    );
  }

  const amenitiesList = listing.amenities ? listing.amenities.split(',').map(a => a.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/approvals')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Approvals
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{listing.city}{listing.address ? `, ${listing.address}` : ''}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span>Listing ID: #{listing.id}</span>
              <span className="text-gray-300">|</span>
              <span>Host ID: {listing.hostId}</span>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
              {listing.status ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1) : 'Unknown'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Price per night</p>
            <p className="text-3xl font-bold text-indigo-600">${listing.pricePerNight}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Listing Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Gallery */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {listing.imageUrls && listing.imageUrls.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 p-4">
                {listing.imageUrls.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${listing.title} - Image ${index + 1}`}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => { 
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23ddd" width="800" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="24"%3EImage Not Available%3C/text%3E%3C/svg%3E'; 
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">No Images Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{listing.maxGuests}</p>
                <p className="text-sm text-gray-600">Guests</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Bed className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{listing.beds || 1}</p>
                <p className="text-sm text-gray-600">Beds</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Bath className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{listing.bathrooms || 1}</p>
                <p className="text-sm text-gray-600">Bathrooms</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {amenitiesList.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {amenitiesList.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Actions & Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6 space-y-6">
            {/* Actions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Review Actions</h3>
              {(!listing.status || listing.status === 'pending') && (
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Listing
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Listing
                  </button>
                </div>
              )}
              {listing.status === 'approved' && (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">Listing Approved</p>
                  </div>
                  <button
                    onClick={handleReject}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Listing
                  </button>
                </div>
              )}
              {listing.status === 'rejected' && (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-red-800 font-medium">Listing Rejected</p>
                  </div>
                  <button
                    onClick={handleApprove}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Listing
                  </button>
                </div>
              )}
            </div>

            {/* Listing Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Listing Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing ID</span>
                  <span className="font-medium text-gray-900">#{listing.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Host ID</span>
                  <span className="font-medium text-gray-900">{listing.hostId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium text-gray-900">
                    {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(listing.status)}`}>
                    {listing.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminListingDetailsPage;
