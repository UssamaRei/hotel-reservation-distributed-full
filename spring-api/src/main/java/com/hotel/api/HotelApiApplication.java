package com.hotel.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.hotel"})
public class HotelApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(HotelApiApplication.class, args);
    }
}
