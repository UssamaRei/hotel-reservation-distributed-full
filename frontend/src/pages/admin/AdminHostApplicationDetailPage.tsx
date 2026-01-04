import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard, FileText, Briefcase, CheckCircle, XCircle } from 'lucide-react';

interface HostApplication {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
  city: string;
  idCardNumber: string;
  motivation: string;
  experience: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminHostApplicationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<HostApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);

  const currentUserId = 1;

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/host-applications/${id}`, {
        headers: {
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch application');
      }

      const data = await response.json();
      setApplication(data);
      setAdminNotes(data.adminNotes || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!application) return;

    setPendingAction(action);
    setShowNotesInput(true);
  };

  const confirmAction = async () => {
    if (!application || !pendingAction) return;

    try {
      setActionLoading(true);
      const endpoint = pendingAction === 'approve' ? 'approve' : 'reject';
      
      const response = await fetch(`http://localhost:8080/api/admin/host-applications/${application.id}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUserId.toString(),
          'X-User-Role': 'admin',
        },
        body: JSON.stringify({ notes: adminNotes }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${pendingAction} application`);
      }

      // Refresh the application
      await fetchApplication();
      setShowNotesInput(false);
      setPendingAction(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelAction = () => {
    setShowNotesInput(false);
    setPendingAction(null);
    setAdminNotes(application?.adminNotes || '');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'Application not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/host-applications')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Host Application Details</h1>
          <span className={`px-4 py-2 text-sm font-semibold rounded-full capitalize ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>
      </div>

      {/* Applicant Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Applicant Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <User className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-base font-medium text-gray-900">{application.userName}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-900">{application.userEmail}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Phone className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-base font-medium text-gray-900">{application.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="text-base font-medium text-gray-900">{application.city}</p>
            </div>
          </div>
          <div className="flex items-start md:col-span-2">
            <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-base font-medium text-gray-900">{application.address}</p>
            </div>
          </div>
          <div className="flex items-start md:col-span-2">
            <CreditCard className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <div>
              <p className="text-sm text-gray-500">ID Card Number</p>
              <p className="text-base font-medium text-gray-900">{application.idCardNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation and Experience */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Application Details</h2>
        
        <div className="mb-6">
          <div className="flex items-start mb-2">
            <FileText className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <p className="text-sm font-medium text-gray-700">Motivation</p>
          </div>
          <p className="text-gray-900 whitespace-pre-wrap ml-8">
            {application.motivation || 'No motivation provided'}
          </p>
        </div>

        <div>
          <div className="flex items-start mb-2">
            <Briefcase className="w-5 h-5 text-gray-400 mr-3 mt-1" />
            <p className="text-sm font-medium text-gray-700">Experience</p>
          </div>
          <p className="text-gray-900 whitespace-pre-wrap ml-8">
            {application.experience || 'No experience provided'}
          </p>
        </div>
      </div>

      {/* Application Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Submitted</p>
            <p className="text-base font-medium text-gray-900">{formatDate(application.createdAt)}</p>
          </div>
          {application.updatedAt !== application.createdAt && (
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-base font-medium text-gray-900">{formatDate(application.updatedAt)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Notes Section */}
      {(application.adminNotes || showNotesInput) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Notes</h2>
          {showNotesInput ? (
            <div>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add notes (optional)..."
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={confirmAction}
                  disabled={actionLoading}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                    pendingAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {actionLoading ? 'Processing...' : `Confirm ${pendingAction === 'approve' ? 'Approval' : 'Rejection'}`}
                </button>
                <button
                  onClick={cancelAction}
                  disabled={actionLoading}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap">{application.adminNotes}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {application.status === 'pending' && !showNotesInput && (
        <div className="flex gap-4">
          <button
            onClick={() => handleAction('approve')}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Approve Application
          </button>
          <button
            onClick={() => handleAction('reject')}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Reject Application
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminHostApplicationDetailPage;
