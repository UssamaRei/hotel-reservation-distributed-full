package com.hotel.shared.service;

import com.hotel.shared.model.Reservation;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface ReservationService extends Remote {
    List<Reservation> getReservationsByHost(int hostId) throws RemoteException;
    List<Reservation> getReservationsByListing(int listingId, int currentUserId) throws RemoteException, Exception;
    List<Reservation> getAllReservations() throws RemoteException;
    Reservation getReservationById(int reservationId) throws RemoteException, Exception;
    Reservation createReservation(Reservation reservation) throws RemoteException;
    boolean updateReservationStatus(int reservationId, String newStatus, int currentUserId) throws RemoteException, Exception;
    boolean cancelReservation(int reservationId, int currentUserId) throws RemoteException, Exception;
    boolean cancelGuestReservation(int reservationId, int guestUserId) throws RemoteException, Exception;
    boolean deleteReservation(int reservationId) throws RemoteException;
}
