-- Add beds and bathrooms columns to listings table

USE hotel_db;

-- Add beds column (default 1)
ALTER TABLE listings ADD COLUMN beds INT DEFAULT 1 AFTER max_guests;

-- Add bathrooms column (default 1)
ALTER TABLE listings ADD COLUMN bathrooms INT DEFAULT 1 AFTER beds;

-- Verify columns were added
DESCRIBE listings;
