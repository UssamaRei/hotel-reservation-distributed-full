package com.hotel.rmi.dao;

import com.hotel.shared.model.Reservation;
import com.hotel.rmi.database.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ReservationDAO {

    public Reservation create(Reservation reservation) throws SQLException {
        String sql = "INSERT INTO reservations (listing_id, user_id, check_in, check_out, total_price, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setLong(1, reservation.getListingId());
            ps.setLong(2, reservation.getUserId());
            ps.setDate(3, Date.valueOf(reservation.getCheckIn()));
            ps.setDate(4, Date.valueOf(reservation.getCheckOut()));
            ps.setBigDecimal(5, reservation.getTotalPrice());
            ps.setString(6, reservation.getStatus());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    reservation.setId(rs.getLong(1));
                }
            }
        }
        return reservation;
    }

    public List<Reservation> findAll() throws SQLException {
        List<Reservation> reservations = new ArrayList<>();
        String sql = "SELECT * FROM reservations ORDER BY created_at DESC";

        try (Connection con = DBConnection.getConnection();
             Statement stmt = con.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Reservation r = new Reservation();
                r.setId(rs.getLong("id"));
                r.setListingId(rs.getLong("listing_id"));
                r.setUserId(rs.getLong("user_id"));
                r.setCheckIn(rs.getDate("check_in").toLocalDate());
                r.setCheckOut(rs.getDate("check_out").toLocalDate());
                r.setTotalPrice(rs.getBigDecimal("total_price"));
                r.setStatus(rs.getString("status"));
                r.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime().toLocalDate());
                reservations.add(r);
            }
        }
        return reservations;
    }

    public List<Reservation> findByUserId(Long userId) throws SQLException {
        List<Reservation> reservations = new ArrayList<>();
        String sql = "SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Reservation r = mapResultSetToReservation(rs);
                    reservations.add(r);
                }
            }
        }
        return reservations;
    }

    public Reservation findById(Long id) throws SQLException {
        String sql = "SELECT * FROM reservations WHERE id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToReservation(rs);
                }
            }
        }
        return null;
    }

    public Reservation updateStatus(Long id, String status) throws SQLException {
        String sql = "UPDATE reservations SET status = ? WHERE id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setLong(2, id);
            if (ps.executeUpdate() > 0) {
                return findById(id);
            }
        }
        return null;
    }

    public Reservation update(Reservation reservation) throws SQLException {
        String sql = "UPDATE reservations SET check_in = ?, check_out = ?, total_price = ? WHERE id = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setDate(1, Date.valueOf(reservation.getCheckIn()));
            ps.setDate(2, Date.valueOf(reservation.getCheckOut()));
            ps.setBigDecimal(3, reservation.getTotalPrice());
            ps.setLong(4, reservation.getId());

            int updated = ps.executeUpdate();
            if (updated > 0) {
                return findById(reservation.getId());
            }
        }
        return null;
    }

    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM reservations WHERE id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private Reservation mapResultSetToReservation(ResultSet rs) throws SQLException {
        Reservation r = new Reservation();
        r.setId(rs.getLong("id"));
        r.setListingId(rs.getLong("listing_id"));
        r.setUserId(rs.getLong("user_id"));
        r.setCheckIn(rs.getDate("check_in").toLocalDate());
        r.setCheckOut(rs.getDate("check_out").toLocalDate());
        r.setTotalPrice(rs.getBigDecimal("total_price"));
        r.setStatus(rs.getString("status"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) r.setCreatedAt(ts.toLocalDateTime().toLocalDate());
        return r;
    }
}