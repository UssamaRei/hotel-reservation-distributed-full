package com.hotel.shared.service;

import com.hotel.shared.model.Listing;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface ListingService extends Remote {
    List<Listing> getAllListings() throws RemoteException;
    Listing getListingById(Long id) throws RemoteException;
}