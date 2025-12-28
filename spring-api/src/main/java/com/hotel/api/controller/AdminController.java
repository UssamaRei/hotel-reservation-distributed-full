package com.hotel.api.controller;

import com.hotel.shared.model.Listing;
import com.hotel.shared.model.Reservation;
import com.hotel.shared.model.User;
import com.hotel.shared.service.ListingService;
import com.hotel.shared.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
     * Get all listings (admin view)
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
            return ResponseEntity.ok(listings);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch listings: " + e.getMessage()));
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
