package com.hotel.rmi.dao;

import com.hotel.rmi.database.DBConnection;
import com.hotel.shared.model.Reservation;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class ReservationDAO {
    private static final Logger logger = Logger.getLogger(ReservationDAO.class.getName());
    
    /**
     * Create a new reservation
     */
    public Reservation create(Reservation reservation) throws SQLException {
        String sql = "INSERT INTO reservations (listing_id, user_id, guest_phone, check_in, check_out, total_price, status, guest_notes) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, reservation.getListingId());
            stmt.setInt(2, reservation.getUserId());
            stmt.setString(3, reservation.getGuestPhone());
            stmt.setDate(4, reservation.getCheckIn());
            stmt.setDate(5, reservation.getCheckOut());
            stmt.setBigDecimal(6, reservation.getTotalPrice());
            stmt.setString(7, reservation.getStatus() != null ? reservation.getStatus() : "pending");
            stmt.setString(8, reservation.getGuestNotes());
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating reservation failed, no rows affected.");
            }
            
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    reservation.setId(generatedKeys.getInt(1));
                } else {
                    throw new SQLException("Creating reservation failed, no ID obtained.");
                }
            }
            
            logger.info("Created reservation: " + reservation);
            return reservation;
        }
    }
    
    /**
     * Find reservation by ID
     */
    public Reservation findById(int reservationId) throws SQLException {
        String sql = "SELECT r.id, r.listing_id, r.user_id, r.guest_phone, r.check_in, r.check_out, " +
                     "r.total_price, r.status, r.guest_notes, r.created_at, " +
                     "l.title as listing_title, u.name as guest_name, u.email as guest_email " +
                     "FROM reservations r " +
                     "JOIN listings l ON r.listing_id = l.id " +
                     "JOIN users u ON r.user_id = u.id " +
                     "WHERE r.id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, reservationId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToReservation(rs);
                }
            }
        }
        return null;
    }
    
    /**
     * Find all reservations for a specific listing
     */
    public List<Reservation> findByListingId(int listingId) throws SQLException {
        String sql = "SELECT r.id, r.listing_id, r.user_id, r.guest_phone, r.check_in, r.check_out, " +
                     "r.total_price, r.status, r.guest_notes, r.created_at, " +
                     "l.title as listing_title, u.name as guest_name, u.email as guest_email " +
                     "FROM reservations r " +
                     "JOIN listings l ON r.listing_id = l.id " +
                     "JOIN users u ON r.user_id = u.id " +
                     "WHERE r.listing_id = ? " +
                     "ORDER BY r.check_in DESC";
        
        List<Reservation> reservations = new ArrayList<>();
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, listingId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    reservations.add(mapResultSetToReservation(rs));
                }
            }
        }
        
        return reservations;
    }
    
    /**
     * Find all reservations for listings owned by a host
     */
    public List<Reservation> findByHostId(int hostId) throws SQLException {
        String sql = "SELECT r.id, r.listing_id, r.user_id, r.guest_phone, r.check_in, r.check_out, " +
                     "r.total_price, r.status, r.guest_notes, r.created_at, " +
                     "l.title as listing_title, u.name as guest_name, u.email as guest_email " +
                     "FROM reservations r " +
                     "JOIN listings l ON r.listing_id = l.id " +
                     "JOIN users u ON r.user_id = u.id " +
                     "WHERE l.user_id = ? " +
                     "ORDER BY r.check_in DESC";
        
        List<Reservation> reservations = new ArrayList<>();
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, hostId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    reservations.add(mapResultSetToReservation(rs));
                }
            }
        }
        
        logger.info("Found " + reservations.size() + " reservations for host: " + hostId);
        return reservations;
    }
    
    /**
     * Update reservation status (host can confirm/cancel)
     */
    public boolean updateStatus(int reservationId, String newStatus) throws SQLException {
        String sql = "UPDATE reservations SET status = ? WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, newStatus);
            stmt.setInt(2, reservationId);
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                logger.info("Updated reservation " + reservationId + " status to: " + newStatus);
                return true;
            }
            return false;
        }
    }
    
    /**
     * Find all reservations (admin)
     */
    public List<Reservation> findAll() throws SQLException {
        String sql = "SELECT r.id, r.listing_id, r.user_id, r.guest_phone, r.check_in, r.check_out, " +
                     "r.total_price, r.status, r.guest_notes, r.created_at, " +
                     "l.title as listing_title, u.name as guest_name, u.email as guest_email " +
                     "FROM reservations r " +
                     "JOIN listings l ON r.listing_id = l.id " +
                     "JOIN users u ON r.user_id = u.id " +
                     "ORDER BY r.created_at DESC";
        List<Reservation> reservations = new ArrayList<>();
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                reservations.add(mapResultSetToReservation(rs));
            }
        }
        
        logger.info("Found " + reservations.size() + " total reservations");
        return reservations;
    }
    
    /**
     * Delete a reservation
     */
    public boolean delete(int reservationId) throws SQLException {
        String sql = "DELETE FROM reservations WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, reservationId);
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                logger.info("Deleted reservation: " + reservationId);
                return true;
            }
            return false;
        }
    }
    
    /**
     * Get the owner (host) ID of a listing for a reservation
     */
    public Integer getListingOwnerId(int reservationId) throws SQLException {
        String sql = "SELECT l.user_id FROM reservations r " +
                     "JOIN listings l ON r.listing_id = l.id " +
                     "WHERE r.id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, reservationId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("user_id");
                }
            }
        }
        return null;
    }
    
    /**
     * Delete all reservations for a user (for banning)
     */
    public boolean deleteByUserId(int userId) throws SQLException {
        String sql = "DELETE FROM reservations WHERE user_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            int affectedRows = stmt.executeUpdate();
            
            logger.info("Deleted " + affectedRows + " reservations for user: " + userId);
            return true;
        }
    }
    
    /**
     * Map ResultSet to Reservation object
     */
    private Reservation mapResultSetToReservation(ResultSet rs) throws SQLException {
        Reservation reservation = new Reservation();
        reservation.setId(rs.getInt("id"));
        reservation.setListingId(rs.getInt("listing_id"));
        reservation.setUserId(rs.getInt("user_id"));
        reservation.setCheckIn(rs.getDate("check_in"));
        reservation.setCheckOut(rs.getDate("check_out"));
        reservation.setTotalPrice(rs.getBigDecimal("total_price"));
        reservation.setStatus(rs.getString("status"));
        reservation.setCreatedAt(rs.getTimestamp("created_at"));
        
        // Try to get phone and notes if they exist
        try {
            reservation.setGuestPhone(rs.getString("guest_phone"));
        } catch (SQLException e) {
            // Field might not be present in all queries
        }
        
        try {
            reservation.setGuestNotes(rs.getString("guest_notes"));
        } catch (SQLException e) {
            // Field might not be present in all queries
        }
        
        // Additional fields from joined tables
        try {
            reservation.setListingTitle(rs.getString("listing_title"));
            reservation.setGuestName(rs.getString("guest_name"));
            reservation.setGuestEmail(rs.getString("guest_email"));
        } catch (SQLException e) {
            // These fields might not be present in all queries
        }
        
        return reservation;
    }
}
