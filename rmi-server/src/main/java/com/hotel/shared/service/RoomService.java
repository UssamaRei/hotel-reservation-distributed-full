package com.hotel.shared.service;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;
import com.hotel.shared.model.Room;

public interface RoomService extends Remote {
    Room createRoom(Room room) throws RemoteException;
    List<Room> getAllRooms() throws RemoteException;
    Room updateRoom(Room room) throws RemoteException;
    boolean deleteRoom(int id) throws RemoteException;
}
