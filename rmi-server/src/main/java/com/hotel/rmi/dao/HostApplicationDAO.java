package com.hotel.rmi.dao;

import com.hotel.rmi.database.DBConnection;
import com.hotel.shared.model.HostApplication;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class HostApplicationDAO {
    private static final Logger logger = Logger.getLogger(HostApplicationDAO.class.getName());
    
    /**
     * Create a new host application
     */
    public int create(HostApplication application) throws SQLException {
        String sql = "INSERT INTO host_applications (user_id, phone_number, address, city, id_card_number, motivation, experience) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, application.getUserId());
            stmt.setString(2, application.getPhoneNumber());
            stmt.setString(3, application.getAddress());
            stmt.setString(4, application.getCity());
            stmt.setString(5, application.getIdCardNumber());
            stmt.setString(6, application.getMotivation());
            stmt.setString(7, application.getExperience());
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        int id = generatedKeys.getInt(1);
                        logger.info("Created host application: " + id);
                        return id;
                    }
                }
            }
            throw new SQLException("Creating host application failed, no ID obtained.");
        }
    }
    
    /**
     * Find application by user ID
     */
    public HostApplication findByUserId(int userId) throws SQLException {
        String sql = "SELECT ha.*, u.name as user_name, u.email as user_email " +
                     "FROM host_applications ha " +
                     "JOIN users u ON ha.user_id = u.id " +
                     "WHERE ha.user_id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToApplication(rs);
                }
            }
        }
        return null;
    }
    
    /**
     * Find application by ID
     */
    public HostApplication findById(int id) throws SQLException {
        String sql = "SELECT ha.*, u.name as user_name, u.email as user_email " +
                     "FROM host_applications ha " +
                     "JOIN users u ON ha.user_id = u.id " +
                     "WHERE ha.id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToApplication(rs);
                }
            }
        }
        return null;
    }
    
    /**
     * Get all applications (admin only)
     */
    public List<HostApplication> findAll() throws SQLException {
        String sql = "SELECT ha.*, u.name as user_name, u.email as user_email " +
                     "FROM host_applications ha " +
                     "JOIN users u ON ha.user_id = u.id " +
                     "ORDER BY ha.created_at DESC";
        
        List<HostApplication> applications = new ArrayList<>();
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                applications.add(mapResultSetToApplication(rs));
            }
        }
        
        logger.info("Found " + applications.size() + " host applications");
        return applications;
    }
    
    /**
     * Get applications by status
     */
    public List<HostApplication> findByStatus(String status) throws SQLException {
        String sql = "SELECT ha.*, u.name as user_name, u.email as user_email " +
                     "FROM host_applications ha " +
                     "JOIN users u ON ha.user_id = u.id " +
                     "WHERE ha.status = ? " +
                     "ORDER BY ha.created_at DESC";
        
        List<HostApplication> applications = new ArrayList<>();
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, status);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    applications.add(mapResultSetToApplication(rs));
                }
            }
        }
        
        return applications;
    }
    
    /**
     * Update application status and admin notes
     */
    public boolean updateStatus(int id, String status, String adminNotes) throws SQLException {
        String sql = "UPDATE host_applications SET status = ?, admin_notes = ? WHERE id = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, status);
            stmt.setString(2, adminNotes);
            stmt.setInt(3, id);
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows > 0) {
                logger.info("Updated application " + id + " status to: " + status);
                return true;
            }
            return false;
        }
    }
    
    private HostApplication mapResultSetToApplication(ResultSet rs) throws SQLException {
        HostApplication app = new HostApplication();
        app.setId(rs.getInt("id"));
        app.setUserId(rs.getInt("user_id"));
        app.setPhoneNumber(rs.getString("phone_number"));
        app.setAddress(rs.getString("address"));
        app.setCity(rs.getString("city"));
        app.setIdCardNumber(rs.getString("id_card_number"));
        app.setMotivation(rs.getString("motivation"));
        app.setExperience(rs.getString("experience"));
        app.setStatus(rs.getString("status"));
        app.setAdminNotes(rs.getString("admin_notes"));
        app.setCreatedAt(rs.getTimestamp("created_at"));
        app.setUpdatedAt(rs.getTimestamp("updated_at"));
        app.setUserName(rs.getString("user_name"));
        app.setUserEmail(rs.getString("user_email"));
        return app;
    }
}
