package com.hotel.shared.service;

import com.hotel.shared.model.Listing;
import com.hotel.shared.exception.AuthorizationException;
import com.hotel.shared.exception.NotFoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface ListingService extends Remote {
    
    /**
     * Create a new listing for a host
     * @param listing The listing to create (userId must be set)
     * @return The created listing with generated ID
     * @throws RemoteException If RMI communication fails
     * @throws AuthorizationException If user is not a host
     */
    Listing createListing(Listing listing) throws RemoteException, AuthorizationException;
    
    /**
     * Update a listing (only owner can update)
     * @param listing The listing with updated data
     * @param currentUserId The ID of the user making the request
     * @return The updated listing
     * @throws RemoteException If RMI communication fails
     * @throws AuthorizationException If user doesn't own the listing
     * @throws NotFoundException If listing doesn't exist
     */
    Listing updateListing(Listing listing, int currentUserId) throws RemoteException, AuthorizationException, NotFoundException;
    
    /**
     * Delete a listing (only owner can delete)
     * @param listingId The ID of the listing to delete
     * @param currentUserId The ID of the user making the request
     * @throws RemoteException If RMI communication fails
     * @throws AuthorizationException If user doesn't own the listing
     * @throws NotFoundException If listing doesn't exist
     */
    void deleteListing(int listingId, int currentUserId) throws RemoteException, AuthorizationException, NotFoundException;
    
    /**
     * Get all listings owned by a specific host
     * @param hostId The ID of the host
     * @return List of listings owned by the host
     * @throws RemoteException If RMI communication fails
     */
    List<Listing> getListingsByHost(int hostId) throws RemoteException;
    
    /**
     * Get a specific listing by ID (with images)
     * @param listingId The ID of the listing
     * @return The listing with images
     * @throws RemoteException If RMI communication fails
     * @throws NotFoundException If listing doesn't exist
     */
    Listing getListingById(int listingId) throws RemoteException, NotFoundException;
    
    /**
     * Get all listings (public access)
     * @return List of all listings
     * @throws RemoteException If RMI communication fails
     */
    List<Listing> getAllListings() throws RemoteException;
    
    /**
     * Add an image to a listing (only owner can add)
     * @param listingId The ID of the listing
     * @param imageUrl The URL of the image to add
     * @param currentUserId The ID of the user making the request
     * @throws RemoteException If RMI communication fails
     * @throws AuthorizationException If user doesn't own the listing
     * @throws NotFoundException If listing doesn't exist
     */
    void addListingImage(int listingId, String imageUrl, int currentUserId) throws RemoteException, AuthorizationException, NotFoundException;
    
    /**
     * Update listing status (admin only)
     * @param listingId The ID of the listing
     * @param status The new status (pending, approved, rejected)
     * @throws RemoteException If RMI communication fails
     * @throws NotFoundException If listing doesn't exist
     */
    boolean updateListingStatus(int listingId, String status) throws RemoteException, NotFoundException;
}
