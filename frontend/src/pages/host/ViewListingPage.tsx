import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, DollarSign, Users, Image as ImageIcon, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Listing {
  id: number;
  title: string;
  description: string;
  city: string;
  address: string;
  pricePerNight: number;
  maxGuests: number;
  imageUrls: string[];
}

const ViewListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');

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
      setListing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setUploadingImage(true);

      if (uploadMethod === 'url') {
        // Upload via URL
        if (!imageUrl.trim()) return;
        if (!user) return;

        const response = await fetch(`http://localhost:8080/api/host/listings/${id}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user.id.toString(),
            'X-User-Role': 'host',
          },
          body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to add image');
        }

        setImageUrl('');
      } else {
        // Upload via file
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        
        if (!file) {
          alert('Please select a file');
          return;
        }

        // First, upload the file to get the URL
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

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        const uploadData = await uploadResponse.json();
        
        // Then, add the image URL to the listing
        const addImageResponse = await fetch(`http://localhost:8080/api/host/listings/${id}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': user.id.toString(),
            'X-User-Role': 'host',
          },
          body: JSON.stringify({ imageUrl: `http://localhost:8080${uploadData.imageUrl}` }),
        });

        if (!addImageResponse.ok) {
          throw new Error('Failed to add image to listing');
        }

        // Reset file input
        if (fileInput) fileInput.value = '';
      }

      fetchListing(); // Refresh listing to show new image
      alert('Image added successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add image');
    } finally {
      setUploadingImage(false);
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

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/host/listings')}
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Listings</span>
          </button>
          <Link
            to={`/host/listings/${id}/edit`}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Listing</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {listing.imageUrls && listing.imageUrls.length > 0 ? (
                <div className="space-y-4 p-4">
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {listing.imageUrls.length > 1 && (
                    <div className="grid grid-cols-3 gap-4">
                      {listing.imageUrls.slice(1).map((url, index) => (
                        <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                          <img
                            src={url}
                            alt={`${listing.title} - ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                    <p>No images uploaded yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Add Image Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Image</h3>
              
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

              <form onSubmit={handleAddImage}>
                {uploadMethod === 'file' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="fileInput"
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
                          id="fileInput"
                          type="file"
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-5 h-5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-5 h-5" />
                      <span>{uploadingImage ? 'Adding...' : 'Add'}</span>
                    </button>
                  </div>
                )}
              </form>
              
              {uploadMethod === 'url' && (
                <p className="text-sm text-gray-500 mt-2">
                  Enter the URL of an image from any website
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-gray-900">{listing.address}</p>
                    <p className="text-gray-600">{listing.city}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Price per Night</p>
                    <p className="text-2xl font-bold text-indigo-600">${listing.pricePerNight}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Maximum Guests</p>
                    <p className="text-gray-900">{listing.maxGuests} guests</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Listing ID</span>
                  <span className="font-semibold text-gray-900">{listing.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Images</span>
                  <span className="font-semibold text-gray-900">
                    {listing.imageUrls?.length || 0}
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

export default ViewListingPage;
