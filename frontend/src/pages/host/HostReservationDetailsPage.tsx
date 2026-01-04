import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, Home, DollarSign, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ReservationDetails {
  id: number;
  listingId: number;
  userId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  guestPhone?: string;
  guestNotes?: string;
  listingTitle: string;
  guestName: string;
  guestEmail: string;
}

const HostReservationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchReservationDetails();
    }
  }, [id, user]);

  const fetchReservationDetails = async () => {
    try {
      setLoading(true);
      // Fetch all reservations and find the one with matching ID
      const response = await fetch('http://localhost:8080/api/host/reservations', {
        headers: {
          'X-User-Id': user?.id.toString() || '',
          'X-User-Role': 'host',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reservation details');
      }

      const data = await response.json();
      const foundReservation = data.find((r: ReservationDetails) => r.id === parseInt(id || '0'));
      
      if (!foundReservation) {
        throw new Error('Reservation not found');
      }

      setReservation(foundReservation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!reservation || !user) return;

    const confirmMessage = newStatus === 'confirmed' 
      ? 'Are you sure you want to approve this reservation?' 
      : 'Are you sure you want to cancel this reservation?';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:8080/api/host/reservations/${reservation.id}/status`, {
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

      setReservation({ ...reservation, status: newStatus });
      alert(`Reservation ${newStatus} successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update reservation');
    } finally {
      setActionLoading(false);
    }
  };

  const calculateNights = () => {
    if (!reservation) return 0;
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 w-fit";
    switch (status.toLowerCase()) {
      case 'confirmed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="w-4 h-4" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Clock className="w-4 h-4" />
            Pending Approval
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="w-4 h-4" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/host/reservations')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Reservations
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Reservation not found'}
          </div>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const pricePerNight = nights > 0 ? reservation.totalPrice / nights : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/host/reservations')}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Reservations
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Reservation #{reservation.id}</h1>
                <p className="text-indigo-100">
                  Created on {new Date(reservation.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              {getStatusBadge(reservation.status)}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Information</h2>
                
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guest Name</p>
                    <p className="text-gray-900 font-semibold">{reservation.guestName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <a 
                      href={`mailto:${reservation.guestEmail}`}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      {reservation.guestEmail}
                    </a>
                  </div>
                </div>

                {reservation.guestPhone && (
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 rounded-full p-2">
                      <Phone className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <a 
                        href={`tel:${reservation.guestPhone}`}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        {reservation.guestPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Home className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Property</p>
                    <p className="text-gray-900 font-semibold">{reservation.listingTitle}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-in Date</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(reservation.checkIn).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out Date</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(reservation.checkOut).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {reservation.guestNotes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  Special Requests / Notes
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{reservation.guestNotes}</p>
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                Payment Summary
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>${pricePerNight.toFixed(2)} × {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span>${reservation.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span>Service fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        ${reservation.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {reservation.status.toLowerCase() === 'pending' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => updateStatus('confirmed')}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Reservation
                  </button>
                  <button
                    onClick={() => updateStatus('cancelled')}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Decline Reservation
                  </button>
                </div>
              </div>
            )}

            {reservation.status.toLowerCase() === 'confirmed' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => updateStatus('cancelled')}
                  disabled={actionLoading}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Cancel Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostReservationDetailsPage;
