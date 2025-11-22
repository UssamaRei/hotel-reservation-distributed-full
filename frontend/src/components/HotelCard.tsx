import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Utensils } from 'lucide-react';
import { Hotel } from '../data/mockData';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('car')) return <Car className="h-4 w-4" />;
    if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('bar')) return <Utensils className="h-4 w-4" />;
    return null;
  };

  return (
    <Link to={`/hotels/${hotel.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm">{hotel.rating}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{hotel.name}</h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{hotel.location}</span>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.slice(0, 4).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
                >
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{hotel.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Price and Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-3xl font-bold text-blue-600">${hotel.price}</span>
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
