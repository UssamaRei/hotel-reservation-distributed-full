import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    pricePerNight: '',
    maxGuests: '1',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/host/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString(),
          'X-User-Role': 'host',
        },
        body: JSON.stringify({
          ...formData,
          pricePerNight: parseFloat(formData.pricePerNight),
          maxGuests: parseInt(formData.maxGuests),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      const data = await response.json();
      
      // Add image if provided
      if (data.id) {
        try {
          if (uploadMethod === 'url' && imageUrl.trim()) {
            // Upload via URL
            await fetch(`http://localhost:8080/api/host/listings/${data.id}/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-User-Id': user.id.toString(),
                'X-User-Role': 'host',
              },
              body: JSON.stringify({ imageUrl }),
            });
          } else if (uploadMethod === 'file') {
            // Upload via file
            const fileInput = document.getElementById('createFileInput') as HTMLInputElement;
            const file = fileInput?.files?.[0];
            
            if (file) {
              // First, upload the file
              const formData = new FormData();
              formData.append('file', file);

              const uploadResponse = await fetch('http://localhost:8080/api/upload/image', {
                method: 'POST',
                headers: {
                  'X-User-Id': user.id.toString(),
                  'X-User-Role': 'host',
                },
                body: formData,
              });

              if (uploadResponse.ok) {
                const uploadData = await uploadResponse.json();
                
                // Then, add the image URL to the listing
                await fetch(`http://localhost:8080/api/host/listings/${data.id}/images`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': user.id.toString(),
                    'X-User-Role': 'host',
                  },
                  body: JSON.stringify({ imageUrl: `http://localhost:8080${uploadData.imageUrl}` }),
                });
              }
            }
          }
        } catch (imgErr) {
          console.error('Failed to add image:', imgErr);
        }
      }
      
      alert('Listing created successfully!');
      navigate('/host/listings');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
              <p className="text-gray-600 mt-1">Add a new property to your portfolio</p>
            </div>
            <button
              onClick={() => navigate('/host/listings')}
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
                placeholder="e.g., Cozy Downtown Apartment"
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
                placeholder="Describe your property, amenities, and what makes it special..."
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
                  placeholder="123 Main Street"
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
                  placeholder="New York"
                />
              </div>
            </div>

            {/* Price & Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="pricePerNight"
                    name="pricePerNight"
                    required
                    min="0"
                    step="0.01"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="100.00"
                  />
                </div>
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Image (Optional)
              </label>
              
              {/* Upload Method Tabs */}
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMethod === 'file'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMethod === 'url'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Image URL
                </button>
              </div>

              {uploadMethod === 'file' ? (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="createFileInput"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      id="createFileInput"
                      type="file"
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the URL of an image from any website
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                You can add more images later from the listing details page
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Creating...' : 'Create Listing'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/host/listings')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

export default CreateListingPage;
