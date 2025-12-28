import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Utensils, Image as ImageIcon } from 'lucide-react';
import { Hotel } from '../data/mockData';

interface Listing {
  id: number;
  title?: string;
  description?: string;
  city?: string;
  address?: string;
  pricePerNight?: number;
  maxGuests?: number;
  imageUrls?: string[];
  amenities?: string[];
}

interface HotelCardProps {
  hotel: Hotel | Listing;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('car')) return <Car className="h-4 w-4" />;
    if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('bar')) return <Utensils className="h-4 w-4" />;
    return null;
  };

  // Helper to check if this is a Listing type (from API)
  const isListing = (h: Hotel | Listing): h is Listing => {
    return 'title' in h || 'pricePerNight' in h;
  };

  // Extract values that work for both types
  const title = isListing(hotel) ? (hotel.title || 'Untitled') : hotel.name;
  const price = isListing(hotel) ? (hotel.pricePerNight || 0) : hotel.price;
  const location = isListing(hotel) 
    ? `${hotel.city || ''}${hotel.address ? ', ' + hotel.address : ''}` 
    : hotel.location;
  const image = isListing(hotel) 
    ? (hotel.imageUrls && hotel.imageUrls.length > 0 ? hotel.imageUrls[0] : null) 
    : hotel.image;
  const amenities = (isListing(hotel) ? hotel.amenities : hotel.amenities) || [];
  const rating = isListing(hotel) ? null : hotel.rating;

  return (
    <Link to={`/hotels/${hotel.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gray-200">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {rating && (
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm">{rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{title}</h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location || 'Location not specified'}</span>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {amenities.slice(0, 4).map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    {getAmenityIcon(amenity)}
                    {amenity}
                  </span>
                ))}
                {amenities.length > 4 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{amenities.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price and Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-3xl font-bold text-blue-600">${price}</span>
              <span className="text-gray-600 text-sm ml-1">/night</span>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
