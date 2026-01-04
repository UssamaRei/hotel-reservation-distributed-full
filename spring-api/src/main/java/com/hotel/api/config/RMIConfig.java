package com.hotel.api.config;

import com.hotel.shared.service.ListingService;
import com.hotel.shared.service.ReservationService;
import com.hotel.shared.service.RoomService;
import com.hotel.shared.service.UserService;
import com.hotel.shared.service.HostApplicationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.rmi.Naming;

@Configuration
public class RMIConfig {

    @Value("${rmi.host:127.0.0.1}")
    private String rmiHost;

    @Bean
    public RoomService roomService() throws Exception {
        String url = String.format("rmi://%s:1099/RoomService", rmiHost);
        System.out.println("Looking up RMI service at: " + url);
        return (RoomService) Naming.lookup(url);
    }
    
    @Bean
    public ListingService listingService() throws Exception {
        String url = String.format("rmi://%s:1099/ListingService", rmiHost);
        System.out.println("Looking up ListingService at: " + url);
        return (ListingService) Naming.lookup(url);
    }
    
    @Bean
    public ReservationService reservationService() throws Exception {
        String url = String.format("rmi://%s:1099/ReservationService", rmiHost);
        System.out.println("Looking up ReservationService at: " + url);
        return (ReservationService) Naming.lookup(url);
    }
    
    @Bean
    public UserService userService() throws Exception {
        String url = String.format("rmi://%s:1099/UserService", rmiHost);
        System.out.println("Looking up UserService at: " + url);
        return (UserService) Naming.lookup(url);
    }
    
    @Bean
    public HostApplicationService hostApplicationService() throws Exception {
        String url = String.format("rmi://%s:1099/HostApplicationService", rmiHost);
        System.out.println("Looking up HostApplicationService at: " + url);
        return (HostApplicationService) Naming.lookup(url);
    }
}
