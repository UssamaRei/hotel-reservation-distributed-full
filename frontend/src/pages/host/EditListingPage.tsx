import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FormData {
  title: string;
  description: string;
  address: string;
  city: string;
  pricePerNight: string;
  maxGuests: string;
  beds: string;
  bathrooms: string;
}

const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    address: '',
    city: '',
    pricePerNight: '',
    maxGuests: '1',
    beds: '1',
    bathrooms: '1',
  });

  const currentUserId = 1;

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/listings/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch listing');
      }

      const data = await response.json();
      setFormData({
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        pricePerNight: data.pricePerNight.toString(),
        maxGuests: data.maxGuests.toString(),
        beds: data.beds?.toString() || '1',
        bathrooms: data.bathrooms?.toString() || '1',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!user) return;
      
      const requestBody = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxGuests: parseInt(formData.maxGuests),
        beds: parseInt(formData.beds),
        bathrooms: parseInt(formData.bathrooms),
      };
      
      console.log('Updating listing with data:', requestBody);
      console.log('beds:', requestBody.beds, 'type:', typeof requestBody.beds);
      console.log('bathrooms:', requestBody.bathrooms, 'type:', typeof requestBody.bathrooms);
      
      const response = await fetch(`http://localhost:8080/api/host/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString(),
          'X-User-Role': 'host',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing');
      }

      alert('Listing updated successfully!');
      navigate(`/host/listings/${id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Listing</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/host/listings')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
              <p className="text-gray-600 mt-1">Update your property details</p>
            </div>
            <button
              onClick={() => navigate(`/host/listings/${id}`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Listing Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Address & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Price & Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night ($) *
                </label>
                <input
                  type="number"
                  id="pricePerNight"
                  name="pricePerNight"
                  required
                  min="0"
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Guests *
                </label>
                <select
                  id="maxGuests"
                  name="maxGuests"
                  required
                  value={formData.maxGuests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Beds *
                </label>
                <select
                  id="beds"
                  name="beds"
                  required
                  value={formData.beds}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'bed' : 'beds'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Bathrooms *
                </label>
                <select
                  id="bathrooms"
                  name="bathrooms"
                  required
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'bathroom' : 'bathrooms'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center space-x-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(`/host/listings/${id}`)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;
