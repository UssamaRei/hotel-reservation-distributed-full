-- Hotel Reservation System Database Schema
-- Database: hotel_db

-- Drop existing tables if recreating
-- DROP TABLE IF EXISTS reservations;
-- DROP TABLE IF EXISTS listing_images;
-- DROP TABLE IF EXISTS listings;
-- DROP TABLE IF EXISTS users;

-- Users table: Stores user information with roles
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('guest','host','admin') DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Listings table: Property listings created by hosts
CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    city VARCHAR(100),
    price_per_night DECIMAL(10,2) NOT NULL,
    max_guests INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Listing Images table: Image URLs for listings
CREATE TABLE IF NOT EXISTS listing_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    INDEX idx_listing_id (listing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reservations table: Booking reservations
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    user_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_listing_id (listing_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data (Optional - uncomment to insert)
/*
-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES
('John Host', 'host@example.com', 'hashed_password_123', 'host'),
('Jane Guest', 'guest@example.com', 'hashed_password_456', 'guest'),
('Admin User', 'admin@example.com', 'hashed_password_789', 'admin');

-- Insert sample listings
INSERT INTO listings (user_id, title, description, address, city, price_per_night, max_guests) VALUES
(1, 'Cozy Downtown Apartment', 'Beautiful 2-bedroom apartment in the heart of the city with modern amenities', '123 Main St', 'New York', 150.00, 4),
(1, 'Beach House Paradise', 'Stunning beachfront property with ocean views and private beach access', '456 Ocean Dr', 'Miami', 250.00, 6),
(1, 'Mountain Cabin Retreat', 'Peaceful cabin in the mountains, perfect for a quiet getaway', '789 Pine Rd', 'Denver', 120.00, 4);

-- Insert sample images
INSERT INTO listing_images (listing_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'),
(1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'),
(2, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2'),
(2, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
(3, 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8');

-- Insert sample reservations
INSERT INTO reservations (listing_id, user_id, check_in, check_out, total_price, status) VALUES
(1, 2, '2025-12-15', '2025-12-20', 750.00, 'confirmed'),
(2, 2, '2025-12-25', '2025-12-30', 1250.00, 'pending'),
(3, 2, '2026-01-10', '2026-01-15', 600.00, 'confirmed');
*/
