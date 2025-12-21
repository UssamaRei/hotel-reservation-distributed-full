package com.hotel.rmi.dao;

import com.hotel.shared.model.Listing;
import com.hotel.rmi.database.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ListingDAO {

    public List<Listing> findAll() throws SQLException {
        List<Listing> listings = new ArrayList<>();
        String sql = "SELECT id, user_id, title, description, address, city, price_per_night, max_guests FROM listings";

        try (Connection con = DBConnection.getConnection();
             Statement stmt = con.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Listing listing = new Listing();
                listing.setId(rs.getLong("id"));
                listing.setUserId(rs.getLong("user_id"));
                listing.setTitle(rs.getString("title"));
                listing.setDescription(rs.getString("description"));
                listing.setAddress(rs.getString("address"));
                listing.setCity(rs.getString("city"));
                listing.setPricePerNight(rs.getBigDecimal("price_per_night"));
                listing.setMaxGuests(rs.getInt("max_guests"));
                // Fallback image if no image in listing_images table
                listing.setImageUrl("images/room" + ((rs.getLong("id") % 6) + 1) + ".jpg");
                listings.add(listing);
            }
        }
        return listings;
    }

    public Listing findById(Long id) throws SQLException {
        String sql = "SELECT * FROM listings WHERE id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Listing listing = new Listing();
                    listing.setId(rs.getLong("id"));
                    listing.setUserId(rs.getLong("user_id"));
                    listing.setTitle(rs.getString("title"));
                    listing.setDescription(rs.getString("description"));
                    listing.setAddress(rs.getString("address"));
                    listing.setCity(rs.getString("city"));
                    listing.setPricePerNight(rs.getBigDecimal("price_per_night"));
                    listing.setMaxGuests(rs.getInt("max_guests"));
                    listing.setImageUrl("images/room" + (id % 6 + 1) + ".jpg");
                    return listing;
                }
            }
        }
        return null;
    }
}