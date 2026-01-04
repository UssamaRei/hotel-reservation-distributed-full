-- Add guest_phone and guest_notes columns to reservations table
-- Run this migration to add contact information fields for reservations

ALTER TABLE reservations
ADD COLUMN guest_phone VARCHAR(20) AFTER user_id;

ALTER TABLE reservations
ADD COLUMN guest_notes TEXT AFTER status;

-- Note: Existing reservations will have NULL values for these fields
-- New reservations should include these values when created
