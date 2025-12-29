package com.hotel.rmi;

import com.hotel.rmi.dao.ListingDAO;
import com.hotel.rmi.dao.ReservationDAO;
import com.hotel.shared.exception.AuthorizationException;
import com.hotel.shared.exception.NotFoundException;
import com.hotel.shared.model.Listing;
import com.hotel.shared.model.Reservation;
import com.hotel.shared.service.ReservationService;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ReservationServiceImpl extends UnicastRemoteObject implements ReservationService {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = Logger.getLogger(ReservationServiceImpl.class.getName());
    private final ReservationDAO reservationDAO;
    private final ListingDAO listingDAO;
    
    public ReservationServiceImpl() throws RemoteException {
        super();
        this.reservationDAO = new ReservationDAO();
        this.listingDAO = new ListingDAO();
    }
    
    @Override
    public List<Reservation> getReservationsByHost(int hostId) throws RemoteException {
        try {
            logger.info("Fetching reservations for host: " + hostId);
            return reservationDAO.findByHostId(hostId);
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error fetching reservations by host", e);
            throw new RemoteException("Failed to fetch reservations: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Reservation> getAllReservations() throws RemoteException {
        try {
            logger.info("Fetching all reservations (admin)");
            return reservationDAO.findAll();
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error fetching all reservations", e);
            throw new RemoteException("Failed to fetch reservations: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Reservation> getReservationsByListing(int listingId, int currentUserId) 
            throws RemoteException, AuthorizationException {
        try {
            logger.info("Fetching reservations for listing: " + listingId + " by user: " + currentUserId);
            
            // Check if listing exists and user owns it
            Listing listing = listingDAO.findById(listingId);
            if (listing == null) {
                throw new AuthorizationException("Listing not found");
            }
            
            if (listing.getUserId() != currentUserId) {
                logger.warning("User " + currentUserId + " attempted to view reservations for listing owned by " + listing.getUserId());
                throw new AuthorizationException("You do not have permission to view reservations for this listing");
            }
            
            return reservationDAO.findByListingId(listingId);
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error fetching reservations by listing", e);
            throw new RemoteException("Failed to fetch reservations: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Reservation getReservationById(int reservationId) throws RemoteException, NotFoundException {
        try {
            logger.info("Fetching reservation: " + reservationId);
            Reservation reservation = reservationDAO.findById(reservationId);
            
            if (reservation == null) {
                throw new NotFoundException("Reservation not found with ID: " + reservationId);
            }
            
            return reservation;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error fetching reservation", e);
            throw new RemoteException("Failed to fetch reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Reservation createReservation(Reservation reservation) throws RemoteException {
        try {
            logger.info("Creating reservation for listing: " + reservation.getListingId());
            
            // Set default status if not set
            if (reservation.getStatus() == null || reservation.getStatus().isEmpty()) {
                reservation.setStatus("pending");
            }
            
            return reservationDAO.create(reservation);
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error creating reservation", e);
            throw new RemoteException("Failed to create reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean updateReservationStatus(int reservationId, String newStatus, int currentUserId) 
            throws RemoteException, AuthorizationException, NotFoundException {
        try {
            logger.info("Updating reservation " + reservationId + " status to: " + newStatus + " by user: " + currentUserId);
            
            // Validate status
            if (!newStatus.equals("confirmed") && !newStatus.equals("cancelled") && !newStatus.equals("pending")) {
                throw new RemoteException("Invalid status. Must be: pending, confirmed, or cancelled");
            }
            
            // Check if reservation exists
            Reservation reservation = reservationDAO.findById(reservationId);
            if (reservation == null) {
                throw new NotFoundException("Reservation not found with ID: " + reservationId);
            }
            
            // Check if user owns the listing associated with this reservation
            Integer listingOwnerId = reservationDAO.getListingOwnerId(reservationId);
            if (listingOwnerId == null || listingOwnerId != currentUserId) {
                logger.warning("User " + currentUserId + " attempted to update reservation for listing they don't own");
                throw new AuthorizationException("You do not have permission to update this reservation");
            }
            
            // Update status
            boolean updated = reservationDAO.updateStatus(reservationId, newStatus);
            if (!updated) {
                throw new RemoteException("Failed to update reservation status");
            }
            
            return updated;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error updating reservation status", e);
            throw new RemoteException("Failed to update reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean cancelReservation(int reservationId, int currentUserId) 
            throws RemoteException, AuthorizationException, NotFoundException {
        try {
            logger.info("Cancelling reservation " + reservationId + " by user: " + currentUserId);
            
            // Check if reservation exists
            Reservation reservation = reservationDAO.findById(reservationId);
            if (reservation == null) {
                throw new NotFoundException("Reservation not found with ID: " + reservationId);
            }
            
            // Check if user owns the listing associated with this reservation
            Integer listingOwnerId = reservationDAO.getListingOwnerId(reservationId);
            if (listingOwnerId == null || listingOwnerId != currentUserId) {
                logger.warning("User " + currentUserId + " attempted to cancel reservation for listing they don't own");
                throw new AuthorizationException("You do not have permission to cancel this reservation");
            }
            
            // Delete reservation
            boolean deleted = reservationDAO.delete(reservationId);
            if (!deleted) {
                throw new RemoteException("Failed to cancel reservation");
            }
            
            return deleted;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error cancelling reservation", e);
            throw new RemoteException("Failed to cancel reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean cancelGuestReservation(int reservationId, int guestUserId) 
            throws RemoteException, AuthorizationException, NotFoundException {
        try {
            logger.info("Guest " + guestUserId + " cancelling their reservation " + reservationId);
            
            // Check if reservation exists
            Reservation reservation = reservationDAO.findById(reservationId);
            if (reservation == null) {
                throw new NotFoundException("Reservation not found with ID: " + reservationId);
            }
            
            // Check if the guest owns this reservation
            if (reservation.getUserId() != guestUserId) {
                logger.warning("User " + guestUserId + " attempted to cancel reservation " + reservationId + " they don't own");
                throw new AuthorizationException("You can only cancel your own reservations");
            }
            
            // Update status to cancelled instead of deleting
            boolean updated = reservationDAO.updateStatus(reservationId, "cancelled");
            if (!updated) {
                throw new RemoteException("Failed to cancel reservation");
            }
            
            return updated;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error cancelling guest reservation", e);
            throw new RemoteException("Failed to cancel reservation: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean deleteReservation(int reservationId) throws RemoteException {
        try {
            logger.info("Deleting reservation: " + reservationId);
            
            boolean deleted = reservationDAO.delete(reservationId);
            if (!deleted) {
                throw new RemoteException("Failed to delete reservation");
            }
            
            return deleted;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error deleting reservation", e);
            throw new RemoteException("Failed to delete reservation: " + e.getMessage(), e);
        }
    }
}
