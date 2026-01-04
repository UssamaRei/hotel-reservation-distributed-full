package com.hotel.api.controller;

import com.hotel.shared.model.Listing;
import com.hotel.shared.model.Reservation;
import com.hotel.shared.service.ListingService;
import com.hotel.shared.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for HOST role operations
 * Manages listings and reservations for hosts
 */
@RestController
@RequestMapping("/api/host")
@CrossOrigin(origins = "*")
public class HostController {
    
    @Autowired
    private ListingService listingService;
    
    @Autowired
    private ReservationService reservationService;
    
    /**
     * Create a new listing
     * POST /api/host/listings
     * Required: role = HOST
     */
    @PostMapping("/listings")
    public ResponseEntity<?> createListing(
            @RequestBody Listing listing,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can create listings"));
            }
            
            // Set the user ID from header
            listing.setUserId(userId);
            
            Listing created = listingService.createListing(listing);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
            
        } catch (Exception e) {
            e.printStackTrace(); // Print stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to create listing: " + e.getMessage()));
        }
    }
    
    /**
     * Update a listing (only owner can update)
     * PUT /api/host/listings/{id}
     * Required: role = HOST, ownership verified
     */
    @PutMapping("/listings/{id}")
    public ResponseEntity<?> updateListing(
            @PathVariable int id,
            @RequestBody Listing listing,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can update listings"));
            }
            
            System.out.println("[HostController] Received update request for listing: " + id);
            System.out.println("[HostController] beds=" + listing.getBeds() + ", bathrooms=" + listing.getBathrooms());
            System.out.println("[HostController] maxGuests=" + listing.getMaxGuests());
            
            listing.setId(id);
            Listing updated = listingService.updateListing(listing, userId);
            
            System.out.println("[HostController] After update from RMI - beds=" + updated.getBeds() + ", bathrooms=" + updated.getBathrooms());
            
            return ResponseEntity.ok(updated);
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("permission") || message.contains("Authorization")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You do not have permission to update this listing"));
            } else if (message.contains("not found") || message.contains("NotFoundException")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Listing not found"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to update listing: " + message));
        }
    }
    
    /**
     * Delete a listing (only owner can delete)
     * DELETE /api/host/listings/{id}
     * Required: role = HOST, ownership verified
     */
    @DeleteMapping("/listings/{id}")
    public ResponseEntity<?> deleteListing(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can delete listings"));
            }
            
            listingService.deleteListing(id, userId);
            return ResponseEntity.ok(createSuccess("Listing deleted successfully"));
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("permission") || message.contains("Authorization")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You do not have permission to delete this listing"));
            } else if (message.contains("not found") || message.contains("NotFoundException")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Listing not found"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to delete listing: " + message));
        }
    }
    
    /**
     * Get all listings owned by the current host
     * GET /api/host/listings
     * Required: role = HOST
     */
    @GetMapping("/listings")
    public ResponseEntity<?> getMyListings(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can view their listings"));
            }
            
            List<Listing> listings = listingService.getListingsByHost(userId);
            return ResponseEntity.ok(listings);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch listings: " + e.getMessage()));
        }
    }
    
    /**
     * Get a specific listing by ID (must be owned by host)
     * GET /api/host/listings/{id}
     * Required: role = HOST, ownership verified
     */
    @GetMapping("/listings/{id}")
    public ResponseEntity<?> getListingById(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can view listing details"));
            }
            
            Listing listing = listingService.getListingById(id);
            
            // Verify ownership
            if (listing.getUserId() != userId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You do not have permission to view this listing"));
            }
            
            return ResponseEntity.ok(listing);
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("not found") || message.contains("NotFoundException")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Listing not found"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch listing: " + message));
        }
    }
    
    /**
     * Add an image to a listing (only owner can add)
     * POST /api/host/listings/{id}/images
     * Required: role = HOST, ownership verified
     */
    @PostMapping("/listings/{id}/images")
    public ResponseEntity<?> addListingImage(
            @PathVariable int id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can add images"));
            }
            
            String imageUrl = payload.get("imageUrl");
            if (imageUrl == null || imageUrl.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Image URL is required"));
            }
            
            listingService.addListingImage(id, imageUrl, userId);
            return ResponseEntity.ok(createSuccess("Image added successfully"));
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("permission") || message.contains("Authorization")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You do not have permission to modify this listing"));
            } else if (message.contains("not found") || message.contains("NotFoundException")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Listing not found"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to add image: " + message));
        }
    }
    
    /**
     * Get all reservations for the host's listings
     * GET /api/host/reservations
     * Required: role = HOST
     */
    @GetMapping("/reservations")
    public ResponseEntity<?> getMyReservations(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can view reservations"));
            }
            
            List<Reservation> reservations = reservationService.getReservationsByHost(userId);
            return ResponseEntity.ok(reservations);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch reservations: " + e.getMessage()));
        }
    }
    
    /**
     * Get reservations for a specific listing (only if host owns it)
     * GET /api/host/listings/{id}/reservations
     * Required: role = HOST, ownership verified
     */
    @GetMapping("/listings/{id}/reservations")
    public ResponseEntity<?> getListingReservations(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can view reservations"));
            }
            
            List<Reservation> reservations = reservationService.getReservationsByListing(id, userId);
            return ResponseEntity.ok(reservations);
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("permission") || message.contains("Authorization")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You do not have permission to view reservations for this listing"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch reservations: " + message));
        }
    }
    
    /**
     * Update reservation status (confirm or cancel)
     * PUT /api/host/reservations/{id}/status
     * Required: role = HOST, ownership of listing verified
     */
    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<?> updateReservationStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role) {
        try {
            // Check if user is a host
            if (!"host".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Only hosts can update reservation status"));
            }
            
            String newStatus = payload.get("status");
            if (newStatus == null || newStatus.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createError("Status is required"));
            }
            
            boolean updated = reservationService.updateReservationStatus(id, newStatus, userId);
            if (updated) {
                return ResponseEntity.ok(createSuccess("Reservation status updated successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Reservation not found"));
            }
            
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("permission") || message.contains("Authorization")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You do not have permission to update this reservation"));
            } else if (message.contains("not found") || message.contains("NotFoundException")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Reservation not found"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to update reservation: " + message));
        }
    }
    
    // Helper methods
    private Map<String, String> createError(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
    
    private Map<String, String> createSuccess(String message) {
        Map<String, String> success = new HashMap<>();
        success.put("message", message);
        return success;
    }
}
