package com.hotel.rmi.dao;

import com.hotel.rmi.database.DBConnection;
import com.hotel.shared.model.Listing;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class ListingDAO {
    private static final Logger logger = Logger.getLogger(ListingDAO.class.getName());
    
    /**
     * Create a new listing
     */
    public Listing create(Listing listing) throws SQLException {
        String sql = "INSERT INTO listings (user_id, title, description, address, city, price_per_night, max_guests) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, listing.getUserId());
            stmt.setString(2, listing.getTitle());
            stmt.setString(3, listing.getDescription());
            stmt.setString(4, listing.getAddress());
            stmt.setString(5, listing.getCity());
            stmt.setBigDecimal(6, listing.getPricePerNight());
            stmt.setInt(7, listing.getMaxGuests());
            
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
                     "price_per_night = ?, max_guests = ? WHERE id = ? AND user_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, listing.getTitle());
            stmt.setString(2, listing.getDescription());
            stmt.setString(3, listing.getAddress());
            stmt.setString(4, listing.getCity());
            stmt.setBigDecimal(5, listing.getPricePerNight());
            stmt.setInt(6, listing.getMaxGuests());
            stmt.setInt(7, listing.getId());
            stmt.setInt(8, currentUserId);
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                logger.info("Updated listing: " + listing.getId());
                return true;
            }
            return false; // Either doesn't exist or user doesn't own it
        }
    }
    
    /**
     * Delete a listing (with ownership check)
     */
    public boolean delete(int listingId, int currentUserId) throws SQLException {
        String sql = "DELETE FROM listings WHERE id = ? AND user_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, listingId);
            stmt.setInt(2, currentUserId);
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                logger.info("Deleted listing: " + listingId);
                return true;
            }
            return false; // Either doesn't exist or user doesn't own it
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
        listing.setCreatedAt(rs.getTimestamp("created_at"));
        return listing;
    }
}
