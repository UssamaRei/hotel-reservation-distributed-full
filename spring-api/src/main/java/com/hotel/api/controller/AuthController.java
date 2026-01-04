package com.hotel.api.controller;

import com.hotel.shared.model.User;
import com.hotel.shared.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for authentication operations
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Register a new user
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registered = userService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registered);
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null && message.contains("already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(createError("Email already exists"));
            }
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to register: " + message));
        }
    }
    
    /**
     * Login user
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createError("Email and password are required"));
            }
            
            User user = userService.login(email, password);
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null && message.contains("Invalid")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createError("Invalid email or password"));
            }
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to login: " + message));
        }
    }
    
    /**
     * Update user role (become host)
     * PUT /api/auth/users/{userId}/role
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable int userId,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Id", required = true) int requestUserId) {
        try {
            // User can only update their own role (or admin can update anyone's)
            if (userId != requestUserId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You can only update your own role"));
            }
            
            String role = payload.get("role");
            if (role == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createError("Role is required"));
            }
            
            User updated = userService.updateUserRole(userId, role);
            return ResponseEntity.ok(updated);
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null && message.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("User not found"));
            }
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to update role: " + message));
        }
    }
    
    /**
     * Update user profile (name and email)
     * PUT /api/users/{userId}
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable int userId,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "0") int requestUserId) {
        try {
            // User can only update their own profile
            if (userId != requestUserId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You can only update your own profile"));
            }
            
            String name = payload.get("name");
            String email = payload.get("email");
            
            if (name == null || email == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createError("Name and email are required"));
            }
            
            User updated = userService.updateUserProfile(userId, name, email);
            return ResponseEntity.ok(updated);
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null && message.contains("already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(createError("Email already exists"));
            }
            if (message != null && message.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("User not found"));
            }
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to update profile: " + message));
        }
    }
    
    /**
     * Change user password
     * PUT /api/users/{userId}/password
     */
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable int userId,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "0") int requestUserId) {
        try {
            // User can only change their own password
            if (userId != requestUserId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You can only change your own password"));
            }
            
            String currentPassword = payload.get("currentPassword");
            String newPassword = payload.get("newPassword");
            
            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createError("Current password and new password are required"));
            }
            
            boolean changed = userService.changePassword(userId, currentPassword, newPassword);
            
            if (!changed) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createError("Current password is incorrect"));
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null && message.contains("incorrect")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createError("Current password is incorrect"));
            }
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to change password: " + message));
        }
    }
    
    private Map<String, String> createError(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
