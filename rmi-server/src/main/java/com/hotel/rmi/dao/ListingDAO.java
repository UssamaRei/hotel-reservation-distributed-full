package com.hotel.rmi.dao;

import com.hotel.rmi.database.DBConnection;
import com.hotel.shared.model.Listing;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ListingDAO {
    private static final Logger logger = Logger.getLogger(ListingDAO.class.getName());
    
    /**
     * Create a new listing
     */
    public Listing create(Listing listing) throws SQLException {
        String sql = "INSERT INTO listings (user_id, title, description, address, city, price_per_night, max_guests, beds, bathrooms, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, listing.getUserId());
            stmt.setString(2, listing.getTitle());
            stmt.setString(3, listing.getDescription());
            stmt.setString(4, listing.getAddress());
            stmt.setString(5, listing.getCity());
            stmt.setBigDecimal(6, listing.getPricePerNight());
            stmt.setInt(7, listing.getMaxGuests());
            stmt.setInt(8, listing.getBeds());
            stmt.setInt(9, listing.getBathrooms());
            stmt.setString(10, listing.getStatus() != null ? listing.getStatus() : "pending");
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating listing failed, no rows affected.");
            }
            
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    listing.setId(generatedKeys.getInt(1));
                } else {
                    throw new SQLException("Creating listing failed, no ID obtained.");
                }
            }
            
            logger.info("Created listing: " + listing);
            return listing;
        }
    }
    
    /**
     * Update a listing (with ownership check)
     */
    public boolean update(Listing listing, int currentUserId) throws SQLException {
        String sql = "UPDATE listings SET title = ?, description = ?, address = ?, city = ?, " +
                     "price_per_night = ?, max_guests = ?, beds = ?, bathrooms = ? WHERE id = ? AND user_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, listing.getTitle());
            stmt.setString(2, listing.getDescription());
            stmt.setString(3, listing.getAddress());
            stmt.setString(4, listing.getCity());
            stmt.setBigDecimal(5, listing.getPricePerNight());
            stmt.setInt(6, listing.getMaxGuests());
            stmt.setInt(7, listing.getBeds());
            stmt.setInt(8, listing.getBathrooms());
            stmt.setInt(9, listing.getId());
            stmt.setInt(10, currentUserId);
            
            logger.info("Updating listing with beds=" + listing.getBeds() + ", bathrooms=" + listing.getBathrooms());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                logger.info("Updated listing: " + listing.getId());
                return true;
            }
            return false; // Either doesn't exist or user doesn't own it
        }
    }
    
    /**
     * Update listing status (admin only - no ownership check)
     */
    public boolean updateStatus(int listingId, String status) throws SQLException {
        String sql = "UPDATE listings SET status = ? WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, status);
            stmt.setInt(2, listingId);
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                logger.info("Updated listing status: " + listingId + " to " + status);
                return true;
            }
            return false;
        }
    }
    
    /**
     * Delete a listing (with ownership check)
     */
    public boolean delete(int listingId, int currentUserId) throws SQLException {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction
            
            // First check if there are active reservations (pending or confirmed)
            String checkSql = "SELECT COUNT(*) FROM reservations WHERE listing_id = ? AND status IN ('pending', 'confirmed')";
            
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setInt(1, listingId);
                
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next() && rs.getInt(1) > 0) {
                        conn.rollback();
                        // Throw exception with specific message about active reservations
                        throw new SQLException("Cannot delete listing: There are active reservations (pending or confirmed) for this property. Please cancel or complete them first.");
                    }
                }
            }
            
            // Delete all cancelled reservations for this listing
            String deleteCancelledSql = "DELETE FROM reservations WHERE listing_id = ? AND status = 'cancelled'";
            try (PreparedStatement deleteReservationsStmt = conn.prepareStatement(deleteCancelledSql)) {
                deleteReservationsStmt.setInt(1, listingId);
                int deletedReservations = deleteReservationsStmt.executeUpdate();
                if (deletedReservations > 0) {
                    logger.info("Deleted " + deletedReservations + " cancelled reservations for listing: " + listingId);
                }
            }
            
            // Delete all images for this listing
            String deleteImagesSql = "DELETE FROM listing_images WHERE listing_id = ?";
            try (PreparedStatement deleteImagesStmt = conn.prepareStatement(deleteImagesSql)) {
                deleteImagesStmt.setInt(1, listingId);
                deleteImagesStmt.executeUpdate();
            }
            
            // Now delete the listing (with ownership check)
            String sql = "DELETE FROM listings WHERE id = ? AND user_id = ?";
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, listingId);
                stmt.setInt(2, currentUserId);
                
                int affectedRows = stmt.executeUpdate();
                
                if (affectedRows > 0) {
                    conn.commit();
                    logger.info("Deleted listing: " + listingId);
                    return true;
                } else {
                    conn.rollback();
                    return false; // Either doesn't exist or user doesn't own it
                }
            }
            
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    logger.log(Level.SEVERE, "Error rolling back transaction", rollbackEx);
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException closeEx) {
                    logger.log(Level.SEVERE, "Error closing connection", closeEx);
                }
            }
        }
    }
    
    /**
     * Find a listing by ID
     */
    public Listing findById(int listingId) throws SQLException {
        String sql = "SELECT * FROM listings WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, listingId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Listing listing = mapResultSetToListing(rs);
                    // Load images
                    listing.setImageUrls(findImagesByListingId(listingId));
                    return listing;
                }
            }
        }
        return null;
    }
    
    /**
     * Find all listings by a specific host
     */
    public List<Listing> findByHostId(int hostId) throws SQLException {
        String sql = "SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC";
        List<Listing> listings = new ArrayList<>();
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, hostId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Listing listing = mapResultSetToListing(rs);
                    listing.setImageUrls(findImagesByListingId(listing.getId()));
                    listings.add(listing);
                }
            }
        }
        
        logger.info("Found " + listings.size() + " listings for host: " + hostId);
        return listings;
    }
    
    /**
     * Find all listings
     */
    public List<Listing> findAll() throws SQLException {
        String sql = "SELECT * FROM listings ORDER BY created_at DESC";
        List<Listing> listings = new ArrayList<>();
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                Listing listing = mapResultSetToListing(rs);
                listing.setImageUrls(findImagesByListingId(listing.getId()));
                listings.add(listing);
            }
        }
        
        logger.info("Found " + listings.size() + " total listings");
        return listings;
    }
    
    /**
     * Add an image to a listing
     */
    public void addImage(int listingId, String imageUrl) throws SQLException {
        String sql = "INSERT INTO listing_images (listing_id, image_url) VALUES (?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, listingId);
            stmt.setString(2, imageUrl);
            stmt.executeUpdate();
            
            logger.info("Added image to listing: " + listingId);
        }
    }
    
    /**
     * Find images for a listing
     */
    public List<String> findImagesByListingId(int listingId) throws SQLException {
        String sql = "SELECT image_url FROM listing_images WHERE listing_id = ?";
        List<String> images = new ArrayList<>();
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, listingId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    images.add(rs.getString("image_url"));
                }
            }
        }
        
        return images;
    }
    
    /**
     * Delete all listings for a user (for banning)
     */
    public boolean deleteByUserId(int userId) throws SQLException {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction
            
            // First delete all reservations (cancelled ones) for user's listings
            String deleteReservationsSql = "DELETE FROM reservations WHERE listing_id IN (SELECT id FROM listings WHERE user_id = ?) AND status = 'cancelled'";
            try (PreparedStatement stmt = conn.prepareStatement(deleteReservationsSql)) {
                stmt.setInt(1, userId);
                int deletedReservations = stmt.executeUpdate();
                if (deletedReservations > 0) {
                    logger.info("Deleted " + deletedReservations + " cancelled reservations for user's listings: " + userId);
                }
            }
            
            // Delete all listing images
            String deleteImagesSql = "DELETE FROM listing_images WHERE listing_id IN (SELECT id FROM listings WHERE user_id = ?)";
            try (PreparedStatement stmt = conn.prepareStatement(deleteImagesSql)) {
                stmt.setInt(1, userId);
                stmt.executeUpdate();
            }
            
            // Then delete listings
            String deleteListingsSql = "DELETE FROM listings WHERE user_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(deleteListingsSql)) {
                stmt.setInt(1, userId);
                int affectedRows = stmt.executeUpdate();
                logger.info("Deleted " + affectedRows + " listings for user: " + userId);
            }
            
            conn.commit();
            return true;
            
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    logger.log(Level.SEVERE, "Error rolling back transaction", rollbackEx);
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException closeEx) {
                    logger.log(Level.SEVERE, "Error closing connection", closeEx);
                }
            }
        }
    }
    
    /**
     * Map ResultSet to Listing object
     */
    private Listing mapResultSetToListing(ResultSet rs) throws SQLException {
        Listing listing = new Listing();
        listing.setId(rs.getInt("id"));
        listing.setUserId(rs.getInt("user_id"));
        listing.setTitle(rs.getString("title"));
        listing.setDescription(rs.getString("description"));
        listing.setAddress(rs.getString("address"));
        listing.setCity(rs.getString("city"));
        listing.setPricePerNight(rs.getBigDecimal("price_per_night"));
        listing.setMaxGuests(rs.getInt("max_guests"));
        
        // Try to get beds and bathrooms (may not exist in older database versions)
        try {
            int bedsValue = rs.getInt("beds");
            listing.setBeds(bedsValue);
            logger.info("Read from DB - listing " + rs.getInt("id") + ": beds=" + bedsValue);
        } catch (SQLException e) {
            logger.warning("beds column not found, using default: " + e.getMessage());
            listing.setBeds(1); // Default value
        }
        
        try {
            int bathroomsValue = rs.getInt("bathrooms");
            listing.setBathrooms(bathroomsValue);
            logger.info("Read from DB - listing " + rs.getInt("id") + ": bathrooms=" + bathroomsValue);
        } catch (SQLException e) {
            logger.warning("bathrooms column not found, using default: " + e.getMessage());
            listing.setBathrooms(1); // Default value
        }
        
        listing.setStatus(rs.getString("status"));
        listing.setCreatedAt(rs.getTimestamp("created_at"));
        return listing;
    }
}
