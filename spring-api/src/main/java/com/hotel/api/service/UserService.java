package com.hotel.api.service;

import com.hotel.api.model.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    // In-memory user store for demo purposes
    private final Map<String, User> users = new HashMap<>();

    public UserService() {
        // Initialize with default users
        users.put("admin", new User("admin", "admin123", "ADMIN"));
        users.put("user", new User("user", "user123", "USER"));
    }

    public User findByUsername(String username) {
        return users.get(username);
    }

    public boolean validatePassword(String username, String password) {
        User user = findByUsername(username);
        return user != null && user.getPassword().equals(password);
    }

    public User createUser(String username, String password, String role) {
        User user = new User(username, password, role);
        users.put(username, user);
        return user;
    }
}