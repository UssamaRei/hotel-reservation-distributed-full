import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Home, MapPin } from 'lucide-react';
import HotelCard from '../components/HotelCard';

interface Host {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

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
  imageUrls: string[];
  status: string;
}

interface HostProfile {
  host: Host;
  listings: Listing[];
  listingCount: number;
}

const HostProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchHostProfile();
    }
  }, [id]);

  const fetchHostProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/listings/host/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch host profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading host profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Host not found'}
          </div>
        </div>
      </div>
    );
  }

  const { host, listings, listingCount } = profile;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Host Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="bg-blue-600 text-white rounded-full w-24 h-24 flex items-center justify-center font-bold text-4xl">
              {host.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{host.name}</h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Mail className="w-4 h-4" />
                <span>{host.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(host.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Home className="w-4 h-4" />
                <span className="font-semibold">{listingCount} {listingCount === 1 ? 'Property' : 'Properties'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {host.name.split(' ')[0]}'s Listings
          </h2>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">This host doesn't have any active listings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <HotelCard
                key={listing.id}
                hotel={listing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostProfilePage;
