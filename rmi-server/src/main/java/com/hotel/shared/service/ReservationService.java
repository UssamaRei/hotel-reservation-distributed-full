package com.hotel.shared.service;

import com.hotel.shared.model.Reservation;
import com.hotel.shared.exception.AuthorizationException;
import com.hotel.shared.exception.NotFoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface ReservationService extends Remote {
    
    /**
     * Get all reservations for listings owned by a specific host
     * @param hostId The ID of the host
     * @return List of reservations for the host's listings
     * @throws RemoteException If RMI communication fails
     */
    List<Reservation> getReservationsByHost(int hostId) throws RemoteException;
    
    /**
     * Get all reservations in the system (admin only)
     * @return List of all reservations
     * @throws RemoteException If RMI communication fails
     */
    List<Reservation> getAllReservations() throws RemoteException;
    
    /**
     * Get reservations for a specific listing (only owner can view)
     * @param listingId The ID of the listing
     * @param currentUserId The ID of the user making the request
     * @return List of reservations for the listing
     * @throws RemoteException If RMI communication fails
     * @throws AuthorizationException If user doesn't own the listing
     */
    List<Reservation> getReservationsByListing(int listingId, int currentUserId) throws RemoteException, AuthorizationException;
    
    /**
     * Get a specific reservation by ID
     * @param reservationId The ID of the reservation
     * @return The reservation
     * @throws RemoteException If RMI communication fails
     * @throws NotFoundException If reservation doesn't exist
     */
    Reservation getReservationById(int reservationId) throws RemoteException, NotFoundException;
    
    /**
     * Create a new reservation (guest creates)
     * @param reservation The reservation to create
     * @return The created reservation with generated ID
     * @throws RemoteException If RMI communication fails
     */
    Reservation createReservation(Reservation reservation) throws RemoteException;
    
    /**
     * Update reservation status (host can update status)
     * @param reservationId The ID of the reservation
     * @param newStatus The new status (confirmed, cancelled)
     * @param currentUserId The ID of the user making the request
     * @return true if updated successfully
     * @throws RemoteException If RMI communication fails
     * @throws AuthorizationException If user doesn't own the listing
     * @throws NotFoundException If reservation doesn't exist
     */
    boolean updateReservationStatus(int reservationId, String newStatus, int currentUserId) throws RemoteException, AuthorizationException, NotFoundException;
    
    /**
     * Cancel (delete) a reservation (host can cancel)
     * @param reservationId The ID of the reservation to cancel
     * @param currentUserId The ID of the user making the request
     * @return true if cancelled successfully
     * @throws RemoteException If RMI communication fails
     * @throws AuthorizationException If user doesn't own the listing
     * @throws NotFoundException If reservation doesn't exist
     */
    boolean cancelReservation(int reservationId, int currentUserId) throws RemoteException, AuthorizationException, NotFoundException;
}
