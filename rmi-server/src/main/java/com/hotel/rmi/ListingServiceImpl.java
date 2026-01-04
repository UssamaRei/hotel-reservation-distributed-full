package com.hotel.rmi;

import com.hotel.rmi.dao.ListingDAO;
import com.hotel.shared.exception.AuthorizationException;
import com.hotel.shared.exception.NotFoundException;
import com.hotel.shared.model.Listing;
import com.hotel.shared.service.ListingService;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ListingServiceImpl extends UnicastRemoteObject implements ListingService {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = Logger.getLogger(ListingServiceImpl.class.getName());
    private final ListingDAO listingDAO;
    
    public ListingServiceImpl() throws RemoteException {
        super();
        this.listingDAO = new ListingDAO();
    }
    
    @Override
    public Listing createListing(Listing listing) throws RemoteException, AuthorizationException {
        try {
            logger.info("Creating listing for user: " + listing.getUserId());
            
            if (listing.getUserId() <= 0) {
                throw new AuthorizationException("User ID is required to create a listing");
            }
            
            return listingDAO.create(listing);
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error creating listing", e);
            throw new RemoteException("Failed to create listing: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Listing updateListing(Listing listing, int currentUserId) 
            throws RemoteException, AuthorizationException, NotFoundException {
        try {
            logger.info("Updating listing: " + listing.getId() + " by user: " + currentUserId);
            logger.info("Update values: beds=" + listing.getBeds() + ", bathrooms=" + listing.getBathrooms());
            
            // First check if listing exists
            Listing existing = listingDAO.findById(listing.getId());
            if (existing == null) {
                throw new NotFoundException("Listing not found with ID: " + listing.getId());
            }
            
            // Check ownership
            if (existing.getUserId() != currentUserId) {
                logger.warning("User " + currentUserId + " attempted to update listing owned by " + existing.getUserId());
                throw new AuthorizationException("You do not have permission to update this listing");
            }
            
            // Perform update
            boolean updated = listingDAO.update(listing, currentUserId);
            if (!updated) {
                throw new RemoteException("Failed to update listing");
            }
            
            return listingDAO.findById(listing.getId());
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error updating listing", e);
            throw new RemoteException("Failed to update listing: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void deleteListing(int listingId, int currentUserId) 
            throws RemoteException, AuthorizationException, NotFoundException {
        try {
            logger.info("Deleting listing: " + listingId + " by user: " + currentUserId);
            
            // First check if listing exists
            Listing existing = listingDAO.findById(listingId);
            if (existing == null) {
                throw new NotFoundException("Listing not found with ID: " + listingId);
            }
            
            // Check ownership
            if (existing.getUserId() != currentUserId) {
                logger.warning("User " + currentUserId + " attempted to delete listing owned by " + existing.getUserId());
                throw new AuthorizationException("You do not have permission to delete this listing");
            }
            
            // Perform delete
            boolean deleted = listingDAO.delete(listingId, currentUserId);
            if (!deleted) {
                throw new RemoteException("Failed to delete listing");
            }
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error deleting listing", e);
            throw new RemoteException("Failed to delete listing: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Listing> getListingsByHost(int hostId) throws RemoteException {
        try {
            logger.info("Fetching listings for host: " + hostId);
            return listingDAO.findByHostId(hostId);
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error fetching listings by host", e);
            throw new RemoteException("Failed to fetch listings: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Listing getListingById(int listingId) throws RemoteException, NotFoundException {
        try {
            logger.info("Fetching listing: " + listingId);
            Listing listing = listingDAO.findById(listingId);
            
            if (listing == null) {
                throw new NotFoundException("Listing not found with ID: " + listingId);
            }
            
            return listing;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error fetching listing", e);
            throw new RemoteException("Failed to fetch listing: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<Listing> getAllListings() throws RemoteException {
        try {
            logger.info("Fetching all listings");
            return listingDAO.findAll();
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error fetching all listings", e);
            throw new RemoteException("Failed to fetch listings: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void addListingImage(int listingId, String imageUrl, int currentUserId) 
            throws RemoteException, AuthorizationException, NotFoundException {
        try {
            logger.info("Adding image to listing: " + listingId + " by user: " + currentUserId);
            
            // Check if listing exists and user owns it
            Listing existing = listingDAO.findById(listingId);
            if (existing == null) {
                throw new NotFoundException("Listing not found with ID: " + listingId);
            }
            
            if (existing.getUserId() != currentUserId) {
                logger.warning("User " + currentUserId + " attempted to add image to listing owned by " + existing.getUserId());
                throw new AuthorizationException("You do not have permission to modify this listing");
            }
            
            listingDAO.addImage(listingId, imageUrl);
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error adding image", e);
            throw new RemoteException("Failed to add image: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean updateListingStatus(int listingId, String status) 
            throws RemoteException, NotFoundException {
        try {
            logger.info("Updating listing status: " + listingId + " to " + status);
            
            // Check if listing exists
            Listing existing = listingDAO.findById(listingId);
            if (existing == null) {
                throw new NotFoundException("Listing not found with ID: " + listingId);
            }
            
            // Update status
            boolean updated = listingDAO.updateStatus(listingId, status);
            
            if (!updated) {
                logger.warning("Failed to update status for listing: " + listingId);
            }
            
            return updated;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error updating listing status", e);
            throw new RemoteException("Failed to update listing status: " + e.getMessage(), e);
        }
    }
}
