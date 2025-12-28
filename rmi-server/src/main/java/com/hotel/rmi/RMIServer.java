package com.hotel.rmi;

import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class RMIServer {
    public static void main(String[] args) throws Exception {
        String host = "127.0.0.1";
        if (args.length > 0) host = args[0];
        System.setProperty("java.rmi.server.hostname", host);
        LocateRegistry.createRegistry(1099);
        
        // Register Room Service
        RoomServiceImpl roomService = new RoomServiceImpl();
        String roomUrl = String.format("rmi://%s:1099/RoomService", host);
        Naming.rebind(roomUrl, roomService);
        System.out.println("RoomService bound at " + roomUrl);
        
        // Register Listing Service
        ListingServiceImpl listingService = new ListingServiceImpl();
        String listingUrl = String.format("rmi://%s:1099/ListingService", host);
        Naming.rebind(listingUrl, listingService);
        System.out.println("ListingService bound at " + listingUrl);
        
        // Register Reservation Service
        ReservationServiceImpl reservationService = new ReservationServiceImpl();
        String reservationUrl = String.format("rmi://%s:1099/ReservationService", host);
        Naming.rebind(reservationUrl, reservationService);
        System.out.println("ReservationService bound at " + reservationUrl);
        
        // Register User Service
        UserServiceImpl userService = new UserServiceImpl();
        String userUrl = String.format("rmi://%s:1099/UserService", host);
        Naming.rebind(userUrl, userService);
        System.out.println("UserService bound at " + userUrl);
        
        System.out.println("\nRMI Server started successfully!");
    }
}
