package com.hotel.rmi;

import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class RMIServer {
    public static void main(String[] args) throws Exception {
        String host = "127.0.0.1";
        if (args.length > 0)
            host = args[0];
        System.setProperty("java.rmi.server.hostname", host);
        LocateRegistry.createRegistry(1099);
        RoomServiceImpl impl = new RoomServiceImpl();
        String url = String.format("rmi://%s:1099/RoomService", host);
        Naming.rebind(url, impl);

        // ADD THIS BLOCK
        ListingServiceImpl listingService = new ListingServiceImpl();
        Naming.rebind("ListingService", listingService);
        System.out.println("ListingService bound successfully");

        // After binding RoomService and ListingService
        ReservationServiceImpl reservationService = new ReservationServiceImpl();
        Naming.rebind("ReservationService", reservationService);
        System.out.println("ReservationService bound successfully");

        System.out.println("RMI server started and bound at " + url);
    }
}
