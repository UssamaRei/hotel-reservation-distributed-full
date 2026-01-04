package com.hotel.api.controller;

import com.hotel.shared.model.Listing;
import com.hotel.shared.model.Reservation;
import com.hotel.shared.model.User;
import com.hotel.shared.service.ListingService;
import com.hotel.shared.service.ReservationService;
import com.hotel.shared.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for ADMIN role operations
 * Full access to all system resources
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private ListingService listingService;
    
    @Autowired
    private ReservationService reservationService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Get dashboard statistics
     * GET /api/admin/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            List<Listing> allListings = listingService.getAllListings();
            List<Reservation> allReservations = reservationService.getAllReservations();
            
            // Calculate stats
            int totalListings = allListings.size();
            int totalReservations = allReservations.size();
            
            // Count confirmed reservations
            long confirmedReservations = allReservations.stream()
                    .filter(r -> "confirmed".equalsIgnoreCase(r.getStatus()))
                    .count();
            
            // Calculate total revenue from confirmed reservations
            BigDecimal totalRevenue = allReservations.stream()
                    .filter(r -> "confirmed".equalsIgnoreCase(r.getStatus()))
                    .map(Reservation::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Count pending reservations
            long pendingReservations = allReservations.stream()
                    .filter(r -> "pending".equalsIgnoreCase(r.getStatus()))
                    .count();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalListings", totalListings);
            stats.put("totalReservations", totalReservations);
            stats.put("confirmedReservations", confirmedReservations);
            stats.put("pendingReservations", pendingReservations);
            stats.put("totalRevenue", totalRevenue);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch stats: " + e.getMessage()));
        }
    }
    
    /**
     * Get all listings (admin view) with host information
     * GET /api/admin/listings
     */
    @GetMapping("/listings")
    public ResponseEntity<?> getAllListings(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            List<Listing> listings = listingService.getAllListings();
            
            // Enhance listings with host information
            List<Map<String, Object>> enrichedListings = new ArrayList<>();
            for (Listing listing : listings) {
                Map<String, Object> enrichedListing = new HashMap<>();
                enrichedListing.put("id", listing.getId());
                enrichedListing.put("userId", listing.getUserId());
                enrichedListing.put("title", listing.getTitle());
                enrichedListing.put("description", listing.getDescription());
                enrichedListing.put("city", listing.getCity());
                enrichedListing.put("address", listing.getAddress());
                enrichedListing.put("pricePerNight", listing.getPricePerNight());
                enrichedListing.put("maxGuests", listing.getMaxGuests());
                enrichedListing.put("beds", listing.getBeds());
                enrichedListing.put("bathrooms", listing.getBathrooms());
                enrichedListing.put("status", listing.getStatus());
                
                // Convert imageUrls to full URLs
                List<String> fullImageUrls = new ArrayList<>();
                if (listing.getImageUrls() != null && !listing.getImageUrls().isEmpty()) {
                    for (String imageUrl : listing.getImageUrls()) {
                        // If URL doesn't start with http, prepend server URL
                        if (imageUrl != null && !imageUrl.startsWith("http")) {
                            fullImageUrls.add("http://localhost:8080" + imageUrl);
                        } else {
                            fullImageUrls.add(imageUrl);
                        }
                    }
                }
                enrichedListing.put("imageUrls", fullImageUrls);
                
                // Add first image as imageUrl for compatibility
                if (!fullImageUrls.isEmpty()) {
                    enrichedListing.put("imageUrl", fullImageUrls.get(0));
                } else {
                    enrichedListing.put("imageUrl", null);
                }
                enrichedListing.put("createdAt", listing.getCreatedAt());
                
                // Fetch host information
                try {
                    User host = userService.getUserById(listing.getUserId());
                    System.out.println("Fetched host for listing " + listing.getId() + ": " + 
                        (host != null ? host.getName() + " (" + host.getEmail() + ")" : "null"));
                    if (host != null) {
                        Map<String, String> hostInfo = new HashMap<>();
                        hostInfo.put("name", host.getName());
                        hostInfo.put("email", host.getEmail());
                        hostInfo.put("role", host.getRole());
                        enrichedListing.put("host", hostInfo);
                        System.out.println("Added host info: " + hostInfo);
                    } else {
                        System.out.println("Host is null for userId: " + listing.getUserId());
                        enrichedListing.put("host", null);
                    }
                } catch (Exception e) {
                    // If host not found, continue without host info
                    System.err.println("Error fetching host for listing " + listing.getId() + ": " + e.getMessage());
                    e.printStackTrace();
                    enrichedListing.put("host", null);
                }
                
                enrichedListings.add(enrichedListing);
            }
            
            return ResponseEntity.ok(enrichedListings);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch listings: " + e.getMessage()));
        }
    }
    
    /**
     * Get single listing by ID
     * GET /api/admin/listings/{id}
     */
    @GetMapping("/listings/{id}")
    public ResponseEntity<?> getListingById(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            Listing listing = listingService.getListingById(id);
            if (listing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Listing not found"));
            }
            
            return ResponseEntity.ok(listing);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch listing: " + e.getMessage()));
        }
    }
    
    /**
     * Get all reservations (admin view)
     * GET /api/admin/reservations
     */
    @GetMapping("/reservations")
    public ResponseEntity<?> getAllReservations(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            List<Reservation> reservations = reservationService.getAllReservations();
            return ResponseEntity.ok(reservations);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch reservations: " + e.getMessage()));
        }
    }
    
    /**
     * Delete any listing (admin override)
     * DELETE /api/admin/listings/{id}
     */
    @DeleteMapping("/listings/{id}")
    public ResponseEntity<?> deleteListing(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            // Admin can delete any listing - get the listing first to know the owner
            Listing listing = listingService.getListingById(id);
            if (listing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Listing not found"));
            }
            
            // Delete using the listing's actual owner ID
            listingService.deleteListing(id, listing.getUserId());
            return ResponseEntity.ok(createSuccess("Listing deleted successfully"));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to delete listing: " + e.getMessage()));
        }
    }
    
    /**
     * Update reservation status (admin override)
     * PATCH /api/admin/reservations/{id}/status
     */
    @PatchMapping("/reservations/{id}/status")
    public ResponseEntity<?> updateReservationStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            String status = payload.get("status");
            if (status == null || status.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Status is required"));
            }
            
            // Get reservation to know the host
            Reservation reservation = reservationService.getReservationById(id);
            if (reservation == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Reservation not found"));
            }
            
            // Get the listing to know the host ID
            Listing listing = listingService.getListingById(reservation.getListingId());
            if (listing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Associated listing not found"));
            }
            
            // Update using host's ID
            boolean updated = reservationService.updateReservationStatus(id, status, listing.getUserId());
            
            if (updated) {
                return ResponseEntity.ok(createSuccess("Reservation status updated to: " + status));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Failed to update reservation"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to update status: " + e.getMessage()));
        }
    }
    
    /**
     * Delete reservation (admin override)
     * DELETE /api/admin/reservations/{id}
     */
    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<?> deleteReservation(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            // Get reservation to know the host
            Reservation reservation = reservationService.getReservationById(id);
            if (reservation == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Reservation not found"));
            }
            
            // Get the listing to know the host ID
            Listing listing = listingService.getListingById(reservation.getListingId());
            if (listing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Associated listing not found"));
            }
            
            // Delete using host's ID
            boolean deleted = reservationService.cancelReservation(id, listing.getUserId());
            
            if (deleted) {
                return ResponseEntity.ok(createSuccess("Reservation deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Failed to delete reservation"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to delete reservation: " + e.getMessage()));
        }
    }
    
    /**
     * Approve a listing
     * PATCH /api/admin/listings/{id}/approve
     */
    @PatchMapping("/listings/{id}/approve")
    public ResponseEntity<?> approveListing(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            boolean updated = listingService.updateListingStatus(id, "approved");
            
            if (updated) {
                return ResponseEntity.ok(createSuccess("Listing approved successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Listing not found"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to approve listing: " + e.getMessage()));
        }
    }
    
    /**
     * Reject a listing
     * PATCH /api/admin/listings/{id}/reject
     */
    @PatchMapping("/listings/{id}/reject")
    public ResponseEntity<?> rejectListing(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            boolean updated = listingService.updateListingStatus(id, "rejected");
            
            if (updated) {
                return ResponseEntity.ok(createSuccess("Listing rejected successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Listing not found"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to reject listing: " + e.getMessage()));
        }
    }
    
    /**
     * Get all users
     * GET /api/admin/users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch users: " + e.getMessage()));
        }
    }
    
    /**
     * Get user details with their reservations and listings
     * GET /api/admin/users/{id}
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserDetails(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("User not found"));
            }
            
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("user", user);
            
            // Get user's reservations
            List<Reservation> allReservations = reservationService.getAllReservations();
            List<Map<String, Object>> userReservations = new ArrayList<>();
            
            for (Reservation reservation : allReservations) {
                if (reservation.getUserId() == id) {
                    Map<String, Object> enrichedReservation = new HashMap<>();
                    enrichedReservation.put("id", reservation.getId());
                    enrichedReservation.put("listingId", reservation.getListingId());
                    enrichedReservation.put("checkIn", reservation.getCheckIn() != null ? reservation.getCheckIn().toString() : "");
                    enrichedReservation.put("checkOut", reservation.getCheckOut() != null ? reservation.getCheckOut().toString() : "");
                    enrichedReservation.put("totalPrice", reservation.getTotalPrice());
                    enrichedReservation.put("status", reservation.getStatus());
                    enrichedReservation.put("createdAt", reservation.getCreatedAt());
                    
                    // Get listing info
                    try {
                        Listing listing = listingService.getListingById(reservation.getListingId());
                        if (listing != null) {
                            enrichedReservation.put("listingTitle", listing.getTitle());
                            enrichedReservation.put("listingCity", listing.getCity());
                        }
                    } catch (Exception e) {
                        // Continue without listing info
                    }
                    
                    userReservations.add(enrichedReservation);
                }
            }
            userDetails.put("reservations", userReservations);
            
            // If user is a host, get their listings
            if ("host".equalsIgnoreCase(user.getRole())) {
                List<Listing> allListings = listingService.getAllListings();
                List<Listing> hostListings = new ArrayList<>();
                for (Listing listing : allListings) {
                    if (listing.getUserId() == id) {
                        hostListings.add(listing);
                    }
                }
                userDetails.put("listings", hostListings);
            }
            
            return ResponseEntity.ok(userDetails);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch user details: " + e.getMessage()));
        }
    }
    
    /**
     * Ban a user (deletes all their reservations and listings)
     * PUT /api/admin/users/{id}/ban
     */
    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            boolean banned = userService.banUser(id);
            
            if (banned) {
                return ResponseEntity.ok(createSuccess("User banned successfully. All their listings and reservations have been removed."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("User not found"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to ban user: " + e.getMessage()));
        }
    }
    
    /**
     * Create a new user (admin only)
     * POST /api/admin/users
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(
            @RequestBody Map<String, String> userData,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            String name = userData.get("name");
            String email = userData.get("email");
            String password = userData.get("password");
            String userRole = userData.get("role");
            
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Name is required"));
            }
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Email is required"));
            }
            
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Password is required"));
            }
            
            if (userRole == null || userRole.trim().isEmpty()) {
                userRole = "guest";
            }
            
            // Create user (register method checks for duplicate email)
            User newUser = new User();
            newUser.setName(name.trim());
            newUser.setEmail(email.trim());
            newUser.setPassword(password); // In production, hash this!
            newUser.setRole(userRole);
            
            User createdUser = userService.register(newUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("user", createdUser);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RemoteException e) {
            // Handle duplicate email or other errors
            if (e.getMessage().contains("already exists")) {
                return ResponseEntity.badRequest()
                        .body(createError("Email already exists"));
            }
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to create user: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to create user: " + e.getMessage()));
        }
    }
    
    /**
     * Update user role
     * PATCH /api/admin/users/{id}/role
     */
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable int id,
            @RequestBody Map<String, String> data,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            String newRole = data.get("role");
            
            if (newRole == null || newRole.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Role is required"));
            }
            
            // Validate role
            if (!newRole.equalsIgnoreCase("guest") && 
                !newRole.equalsIgnoreCase("host") && 
                !newRole.equalsIgnoreCase("admin") &&
                !newRole.equalsIgnoreCase("banned")) {
                return ResponseEntity.badRequest()
                        .body(createError("Invalid role. Must be: guest, host, admin, or banned"));
            }
            
            User updated = userService.updateUserRole(id, newRole);
            
            if (updated != null) {
                return ResponseEntity.ok(createSuccess("User role updated successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("User not found"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to update user role: " + e.getMessage()));
        }
    }
    
    private Map<String, Object> createError(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
    
    private Map<String, Object> createSuccess(String message) {
        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("message", message);
        return success;
    }
}
