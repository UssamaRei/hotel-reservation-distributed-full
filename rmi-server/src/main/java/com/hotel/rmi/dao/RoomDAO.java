package com.hotel.rmi.dao;

import com.hotel.shared.model.Room;
import com.hotel.rmi.database.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RoomDAO {

    public Room create(Room room) throws SQLException {
        String sql = "INSERT INTO rooms(type, price) VALUES(?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, room.getType());
            ps.setDouble(2, room.getPrice());
            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    room.setId(rs.getInt(1));
                }
            }
        }
        return room;
    }

    public List<Room> findAll() throws SQLException {
        List<Room> rooms = new ArrayList<>();
        String sql = "SELECT * FROM rooms";

        try (Connection con = DBConnection.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                rooms.add(new Room(
                        rs.getInt("id"),
                        rs.getString("type"),
                        rs.getDouble("price")
                ));
            }
        }

        return rooms;
    }

    public Room update(Room room) throws SQLException {
        String sql = "UPDATE rooms SET type=?, price=? WHERE id=?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, room.getType());
            ps.setDouble(2, room.getPrice());
            ps.setInt(3, room.getId());

            int updated = ps.executeUpdate();
            if (updated > 0) return room;
        }
        return null;
    }

    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM rooms WHERE id=?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            int deleted = ps.executeUpdate();
            return deleted > 0;
        }
    }
}
