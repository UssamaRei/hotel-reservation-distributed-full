package com.hotel.api.config;

import com.hotel.shared.service.RoomService;
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
}
