export interface Hotel {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  location: string;
  amenities: string[];
  description: string;
}

export const mockHotels: Hotel[] = [
  {
    id: 1,
    name: 'Grand Plaza Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    price: 150,
    rating: 4.8,
    location: 'New York, USA',
    amenities: ['Free WiFi', 'Pool', 'Restaurant', 'Gym', 'Parking'],
    description: 'Experience luxury in the heart of Manhattan. The Grand Plaza Hotel offers stunning city views, world-class amenities, and exceptional service. Perfect for both business and leisure travelers.'
  },
  {
    id: 2,
    name: 'Oceanview Resort',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    price: 200,
    rating: 4.9,
    location: 'Miami, USA',
    amenities: ['Beach Access', 'Spa', 'Free WiFi', 'Pool', 'Bar'],
    description: 'Tropical paradise awaits at Oceanview Resort. Wake up to breathtaking ocean views, relax at our world-class spa, and enjoy direct beach access. The ultimate Miami beach experience.'
  },
  {
    id: 3,
    name: 'Mountain Lodge',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    price: 120,
    rating: 4.7,
    location: 'Colorado, USA',
    amenities: ['Hiking Trails', 'Free WiFi', 'Restaurant', 'Fireplace', 'Mountain View'],
    description: 'Nestled in the Rocky Mountains, our lodge offers a perfect retreat for nature lovers. Enjoy scenic hiking trails, cozy fireplaces, and panoramic mountain views in every direction.'
  },
  {
    id: 4,
    name: 'City Center Suites',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
    price: 180,
    rating: 4.6,
    location: 'Los Angeles, USA',
    amenities: ['Free WiFi', 'Gym', 'Business Center', 'Room Service', 'Parking'],
    description: 'Modern suites in downtown LA with easy access to entertainment, shopping, and business districts. Features spacious rooms with contemporary design and all the amenities you need.'
  },
  {
    id: 5,
    name: 'Lakeside Retreat',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    price: 140,
    rating: 4.8,
    location: 'Lake Tahoe, USA',
    amenities: ['Lake View', 'Free WiFi', 'Restaurant', 'Spa', 'Boat Rental'],
    description: 'Serene lakeside escape offering stunning water views and outdoor activities. Perfect for families and couples seeking relaxation with access to water sports, hiking, and pristine nature.'
  },
  {
    id: 6,
    name: 'Downtown Business Hotel',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    price: 160,
    rating: 4.5,
    location: 'Chicago, USA',
    amenities: ['Free WiFi', 'Conference Room', 'Gym', 'Restaurant', 'Airport Shuttle'],
    description: 'Designed for the modern business traveler, featuring state-of-the-art conference facilities, high-speed internet, and convenient airport access. Comfort meets productivity in downtown Chicago.'
  }
];
