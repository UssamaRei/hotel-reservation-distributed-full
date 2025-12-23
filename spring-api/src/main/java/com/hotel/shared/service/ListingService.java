package com.hotel.shared.service;

import com.hotel.shared.model.Listing;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface ListingService extends Remote {
    Listing createListing(Listing listing) throws RemoteException, Exception;
    Listing updateListing(Listing listing, int currentUserId) throws RemoteException, Exception;
    void deleteListing(int listingId, int currentUserId) throws RemoteException, Exception;
    List<Listing> getListingsByHost(int hostId) throws RemoteException;
    Listing getListingById(int listingId) throws RemoteException, Exception;
    List<Listing> getAllListings() throws RemoteException;
    void addListingImage(int listingId, String imageUrl, int currentUserId) throws RemoteException, Exception;
}
