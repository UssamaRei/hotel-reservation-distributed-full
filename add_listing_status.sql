-- Add status column to listings table for approval workflow
-- Run this migration to add listing approval functionality

ALTER TABLE listings
ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved' AFTER max_guests;

-- Add index for faster filtering by status
ALTER TABLE listings
ADD INDEX idx_status (status);

-- Update existing listings to be approved
UPDATE listings SET status = 'approved' WHERE status IS NULL;
