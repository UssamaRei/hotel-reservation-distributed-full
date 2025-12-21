package com.hotel.shared.service;

import com.hotel.shared.model.Reservation;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface ReservationService extends Remote {
    Reservation createReservation(Reservation reservation) throws RemoteException;
    List<Reservation> getAllReservations() throws RemoteException;
    List<Reservation> getReservationsByUser(Long userId) throws RemoteException;
    Reservation getReservationById(Long id) throws RemoteException;
    Reservation updateReservationStatus(Long id, String status) throws RemoteException;
    boolean cancelReservation(Long id) throws RemoteException;
    Reservation updateReservation(Reservation reservation) throws RemoteException;
}