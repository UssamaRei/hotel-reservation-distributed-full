package com.hotel.api.controller;

import com.hotel.shared.model.Listing;
import com.hotel.shared.service.ListingService;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "*")
public class ListingController {

    private final ListingService listingService;

    public ListingController() throws RemoteException, NotBoundException, MalformedURLException {
        try {
            this.listingService = (ListingService) Naming.lookup("rmi://localhost:1099/ListingService");
        } catch (NotBoundException e) {
            throw new RuntimeException("ListingService not bound in RMI registry", e);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid RMI URL", e);
        } catch (RemoteException e) {
            throw new RuntimeException("RMI connection failed", e);
        }
    }

    @GetMapping
    public List<Listing> getAllListings() throws RemoteException {
        return listingService.getAllListings();
    }

    @GetMapping("/{id}")
    public Listing getListingById(@PathVariable Long id) throws RemoteException {
        return listingService.getListingById(id);
    }
}