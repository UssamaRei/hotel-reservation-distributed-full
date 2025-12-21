package com.hotel.rmi;

import com.hotel.shared.model.Listing;
import com.hotel.shared.service.ListingService;
import com.hotel.rmi.dao.ListingDAO;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;

public class ListingServiceImpl extends UnicastRemoteObject implements ListingService {

    private final ListingDAO listingDAO = new ListingDAO();

    public ListingServiceImpl() throws RemoteException {
        super();
    }

    @Override
    public List<Listing> getAllListings() throws RemoteException {
        try {
            return listingDAO.findAll();
        } catch (Exception e) {
            // Wrap any database exception in a simple RuntimeException
            // This avoids sending MySQL-specific classes over RMI
            throw new RemoteException("Database error: " + e.getMessage());
        }
    }

    @Override
    public Listing getListingById(Long id) throws RemoteException {
        try {
            Listing listing = listingDAO.findById(id);
            if (listing == null) {
                throw new RemoteException("Listing not found with id: " + id);
            }
            return listing;
        } catch (Exception e) {
            throw new RemoteException("Database error: " + e.getMessage());
        }
    }
}