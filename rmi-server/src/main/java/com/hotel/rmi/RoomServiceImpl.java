package com.hotel.rmi;

import com.hotel.shared.model.Room;
import com.hotel.shared.service.RoomService;
import com.hotel.rmi.dao.RoomDAO;

import java.rmi.server.UnicastRemoteObject;
import java.rmi.RemoteException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * RoomServiceImpl - RMI-exposed service implementation.
 * This class delegates JDBC work to RoomDAO so database access is contained and testable.
 */
public class RoomServiceImpl extends UnicastRemoteObject implements RoomService {

    private static final Logger LOGGER = Logger.getLogger(RoomServiceImpl.class.getName());
    private final RoomDAO roomDAO;

    public RoomServiceImpl() throws RemoteException {
        super();
        this.roomDAO = new RoomDAO();
    }

    @Override
    public Room createRoom(Room room) throws RemoteException {
        try {
            Room created = roomDAO.create(room);
            LOGGER.info("Created room: " + created);
            return created;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "DB error createRoom", e);
            throw new RemoteException("DB Error (createRoom): " + e.getMessage(), e);
        }
    }

    @Override
    public List<Room> getAllRooms() throws RemoteException {
        try {
            return roomDAO.findAll();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "DB error getAllRooms", e);
            throw new RemoteException("DB Error (getAllRooms): " + e.getMessage(), e);
        }
    }

    @Override
    public Room updateRoom(Room room) throws RemoteException {
        try {
            Room updated = roomDAO.update(room);
            if (updated != null) LOGGER.info("Updated room: " + updated);
            return updated;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "DB error updateRoom", e);
            throw new RemoteException("DB Error (updateRoom): " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteRoom(int id) throws RemoteException {
        try {
            boolean deleted = roomDAO.delete(id);
            if (deleted) LOGGER.info("Deleted room id=" + id);
            return deleted;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "DB error deleteRoom", e);
            throw new RemoteException("DB Error (deleteRoom): " + e.getMessage(), e);
        }
    }
}
