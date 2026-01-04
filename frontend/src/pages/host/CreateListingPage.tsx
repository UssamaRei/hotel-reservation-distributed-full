import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ImagePreview {
  file?: File;
  url: string;
  type: 'file' | 'url';
}

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
    beds: '1',
    bathrooms: '1',
  });
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          file,
          url: reader.result as string,
          type: 'file'
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    
    setImages(prev => [...prev, {
      url: imageUrl,
      type: 'url'
    }]);
    setImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
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
      
      console.log('Creating listing with data:', requestBody);
      console.log('beds:', requestBody.beds, 'type:', typeof requestBody.beds);
      console.log('bathrooms:', requestBody.bathrooms, 'type:', typeof requestBody.bathrooms);
      
      const response = await fetch('http://localhost:8080/api/host/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString(),
          'X-User-Role': 'host',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      const data = await response.json();
      
      // Add images if provided
      if (data.id && images.length > 0) {
        for (const image of images) {
          try {
            if (image.type === 'url') {
              // Upload via URL
              await fetch(`http://localhost:8080/api/host/listings/${data.id}/images`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-User-Id': user.id.toString(),
                  'X-User-Role': 'host',
                },
                body: JSON.stringify({ imageUrl: image.url }),
              });
            } else if (image.type === 'file' && image.file) {
              // Upload via file
              const formData = new FormData();
              formData.append('file', image.file);

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
                
                // Add the image URL to the listing
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
          } catch (imgErr) {
            console.error('Failed to add image:', imgErr);
          }
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
                <select
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a city</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Fes">Fes</option>
                  <option value="Tangier">Tangier</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Meknes">Meknes</option>
                  <option value="Oujda">Oujda</option>
                  <option value="Kenitra">Kenitra</option>
                  <option value="Tetouan">Tetouan</option>
                  <option value="Safi">Safi</option>
                  <option value="Temara">Temara</option>
                  <option value="Mohammedia">Mohammedia</option>
                  <option value="Khouribga">Khouribga</option>
                  <option value="El Jadida">El Jadida</option>
                  <option value="Beni Mellal">Beni Mellal</option>
                  <option value="Nador">Nador</option>
                  <option value="Taza">Taza</option>
                  <option value="Settat">Settat</option>
                  <option value="Khemisset">Khemisset</option>
                  <option value="Essaouira">Essaouira</option>
                  <option value="Ouarzazate">Ouarzazate</option>
                  <option value="Chefchaouen">Chefchaouen</option>
                </select>
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images
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
                  Upload Files
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (MAX. 5MB each)</p>
                    </div>
                    <input
                      id="createFileInput"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                        {image.type === 'file' ? 'File' : 'URL'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                {images.length === 0 
                  ? 'Add at least one image to make your listing more attractive'
                  : `${images.length} image${images.length !== 1 ? 's' : ''} added`
                }
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
