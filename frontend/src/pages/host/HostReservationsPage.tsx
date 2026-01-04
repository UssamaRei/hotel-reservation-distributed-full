import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, Home, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Reservation {
  id: number;
  listingId: number;
  userId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  listingTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestNotes?: string;
}

const HostReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/host/reservations', {
        headers: {
          'X-User-Id': user.id.toString(),
          'X-User-Role': 'host',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reservationId: number, newStatus: string) => {
    try {
      if (!user) return;
      
      const response = await fetch(`http://localhost:8080/api/host/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString(),
          'X-User-Role': 'host',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setReservations(reservations.map(r =>
        r.id === reservationId ? { ...r, status: newStatus } : r
      ));
      alert(`Reservation ${newStatus} successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update reservation');
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

  const filteredReservations = reservations.filter(r =>
    filter === 'all' ? true : r.status.toLowerCase() === filter
  );

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status.toLowerCase() === 'confirmed').length,
    pending: reservations.filter(r => r.status.toLowerCase() === 'pending').length,
    revenue: reservations
      .filter(r => r.status.toLowerCase() === 'confirmed')
      .reduce((sum, r) => sum + r.totalPrice, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your properties and reservations</p>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <Link
                to="/host/listings"
                className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  location.pathname === '/host/listings'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>My Listings</span>
              </Link>
              <Link
                to="/host/reservations"
                className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  location.pathname === '/host/reservations'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Reservations</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">${stats.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-2">
            {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Reservations List */}
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'You don\'t have any reservations yet.'
                : `No ${filter} reservations.`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr 
                      key={reservation.id} 
                      onClick={() => navigate(`/host/reservations/${reservation.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{reservation.guestName}</div>
                            <div className="text-sm text-gray-500">{reservation.guestEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Home className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{reservation.listingTitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(reservation.checkIn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(reservation.checkOut).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${reservation.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2" onClick={(e) => e.stopPropagation()}>
                        {reservation.status.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(reservation.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(reservation.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {reservation.status.toLowerCase() === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(reservation.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostReservationsPage;
