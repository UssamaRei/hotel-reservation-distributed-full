import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield, Ban, Trash2, CheckCircle, XCircle, AlertCircle, Home } from 'lucide-react';

interface UserDetails {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  reservations: Reservation[];
  listings?: Listing[];
}

interface Reservation {
  id: number;
  listingId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  listingTitle?: string;
  listingCity?: string;
}

interface Listing {
  id: number;
  title: string;
  city: string;
  address: string;
  pricePerNight: number;
  status: string;
  createdAt: string;
}

const AdminUserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        headers: {
          'X-User-Id': localStorage.getItem('userId') || '1',
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const banUser = async () => {
    if (!confirm(`Are you sure you want to ban ${userDetails?.user.name}? This will delete all their listings and reservations.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}/ban`, {
        method: 'PUT',
        headers: {
          'X-User-Id': localStorage.getItem('userId') || '1',
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      alert('User banned successfully');
      navigate('/admin/users');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to ban user');
    }
  };

  const unbanUser = async () => {
    if (!confirm(`Are you sure you want to unban ${userDetails?.user.name}? They will be restored as a guest.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': localStorage.getItem('userId') || '1',
          'X-User-Role': 'admin',
        },
        body: JSON.stringify({ role: 'guest' }),
      });

      if (!response.ok) {
        throw new Error('Failed to unban user');
      }

      alert('User unbanned successfully and restored as guest');
      fetchUserDetails();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to unban user');
    }
  };

  const deleteReservation = async (reservationId: number) => {
    if (!confirm('Are you sure you want to delete this reservation?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': localStorage.getItem('userId') || '1',
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }

      alert('Reservation deleted successfully');
      fetchUserDetails();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete reservation');
    }
  };

  const deleteListing = async (listingId: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': localStorage.getItem('userId') || '1',
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      alert('Listing deleted successfully');
      fetchUserDetails();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete listing');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled':
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'User not found'}
          </div>
        </div>
      </div>
    );
  }

  const { user, reservations, listings } = userDetails;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Users
        </button>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 rounded-full p-4">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className={getStatusBadge(user.role)}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {user.role.toLowerCase() === 'banned' ? (
                <button
                  onClick={unbanUser}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  Unban User
                </button>
              ) : user.role.toLowerCase() !== 'admin' && (
                <button
                  onClick={banUser}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Ban className="w-4 h-4" />
                  Ban User
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Reservations</div>
            <div className="text-2xl font-bold text-gray-900">{reservations.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Confirmed Reservations</div>
            <div className="text-2xl font-bold text-green-600">
              {reservations.filter(r => r.status.toLowerCase() === 'confirmed').length}
            </div>
          </div>
          {listings && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600">Total Listings</div>
              <div className="text-2xl font-bold text-indigo-600">{listings.length}</div>
            </div>
          )}
        </div>

        {/* Reservations Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservations</h2>
          {reservations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reservations found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-Out</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">#{reservation.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-900">{reservation.listingTitle || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{reservation.listingCity || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(reservation.checkIn).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(reservation.checkOut).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">${reservation.totalPrice}</td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadge(reservation.status)}>
                          {getStatusIcon(reservation.status)}
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Listings Section (if host) */}
        {listings && listings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-6 h-6" />
              Host Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <span className={getStatusBadge(listing.status)}>
                      {listing.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{listing.city}</p>
                  <p className="text-sm text-gray-500 mb-3">{listing.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">
                      ${listing.pricePerNight}/night
                    </span>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetailsPage;
