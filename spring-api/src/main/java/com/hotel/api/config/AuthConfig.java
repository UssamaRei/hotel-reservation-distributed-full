package com.hotel.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AuthConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // For demo purposes, using no encoding. In production, use BCryptPasswordEncoder
        return NoOpPasswordEncoder.getInstance();
    }
}