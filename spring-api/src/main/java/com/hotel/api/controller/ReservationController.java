package com.hotel.api.controller;

import com.hotel.shared.model.Listing;
import com.hotel.shared.model.Reservation;
import com.hotel.shared.service.ListingService;
import com.hotel.shared.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for guest reservation operations
 */
@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {
    
    @Autowired
    private ReservationService reservationService;
    
    @Autowired
    private ListingService listingService;
    
    /**
     * Create a new reservation (guest creates)
     * POST /api/reservations
     */
    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody Reservation reservation,
            @RequestHeader(value = "X-User-Id", required = true) String userId) {
        try {
            // Set the user ID from header
            reservation.setUserId(Integer.parseInt(userId));
            
            // Set default status to pending
            if (reservation.getStatus() == null || reservation.getStatus().isEmpty()) {
                reservation.setStatus("pending");
            }
            
            // Check for date conflicts with confirmed reservations
            List<Reservation> allReservations = reservationService.getAllReservations();
            String newCheckIn = reservation.getCheckIn() != null ? reservation.getCheckIn().toString() : "";
            String newCheckOut = reservation.getCheckOut() != null ? reservation.getCheckOut().toString() : "";
            
            for (Reservation existingReservation : allReservations) {
                // Check both pending and confirmed reservations for the same listing to prevent double-booking
                if (existingReservation.getListingId() == reservation.getListingId() &&
                    ("confirmed".equalsIgnoreCase(existingReservation.getStatus()) ||
                     "pending".equalsIgnoreCase(existingReservation.getStatus()))) {
                    
                    String existingCheckIn = existingReservation.getCheckIn() != null ? existingReservation.getCheckIn().toString() : "";
                    String existingCheckOut = existingReservation.getCheckOut() != null ? existingReservation.getCheckOut().toString() : "";
                    
                    // Check if dates overlap
                    // New reservation starts before existing ends AND new reservation ends after existing starts
                    if (newCheckIn.compareTo(existingCheckOut) < 0 && 
                        newCheckOut.compareTo(existingCheckIn) > 0) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(createError("These dates are already booked. Please select different dates."));
                    }
                }
            }
            
            Reservation created = reservationService.createReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createError("Invalid user ID format"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to create reservation: " + e.getMessage()));
        }
    }
    
    /**
     * Get all reservations for the current user (guest's own reservations) with listing details
     * GET /api/reservations
     */
    @GetMapping
    public ResponseEntity<?> getMyReservations(
            @RequestHeader(value = "X-User-Id", required = true) String userId) {
        try {
            int userIdInt = Integer.parseInt(userId);
            List<Reservation> allReservations = reservationService.getAllReservations();
            
            // Filter to show only this user's reservations
            List<Reservation> myReservations = allReservations.stream()
                    .filter(r -> r.getUserId() == userIdInt)
                    .toList();
            
            // Enhance reservations with listing details
            List<Map<String, Object>> enrichedReservations = new ArrayList<>();
            for (Reservation reservation : myReservations) {
                Map<String, Object> enrichedReservation = new HashMap<>();
                enrichedReservation.put("id", reservation.getId());
                enrichedReservation.put("listingId", reservation.getListingId());
                enrichedReservation.put("userId", reservation.getUserId());
                enrichedReservation.put("checkIn", reservation.getCheckIn() != null ? reservation.getCheckIn().toString() : "");
                enrichedReservation.put("checkOut", reservation.getCheckOut() != null ? reservation.getCheckOut().toString() : "");
                enrichedReservation.put("totalPrice", reservation.getTotalPrice());
                enrichedReservation.put("status", reservation.getStatus());
                enrichedReservation.put("createdAt", reservation.getCreatedAt());
                
                // Fetch listing information
                try {
                    Listing listing = listingService.getListingById(reservation.getListingId());
                    if (listing != null) {
                        enrichedReservation.put("listingTitle", listing.getTitle());
                        enrichedReservation.put("listingCity", listing.getCity());
                        enrichedReservation.put("listingAddress", listing.getAddress());
                    }
                } catch (Exception e) {
                    // Continue without listing info if not found
                }
                
                enrichedReservations.add(enrichedReservation);
            }
            
            return ResponseEntity.ok(enrichedReservations);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createError("Invalid user ID format"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch reservations: " + e.getMessage()));
        }
    }
    
    /**
     * Cancel a reservation (guest cancels their own reservation)
     * DELETE /api/reservations/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelReservation(
            @PathVariable int id,
            @RequestHeader(value = "X-User-Id", required = true) String userId) {
        try {
            int userIdInt = Integer.parseInt(userId);
            
            // Use the new cancelGuestReservation method for guests to cancel their own reservations
            reservationService.cancelGuestReservation(id, userIdInt);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Reservation cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createError("Invalid user ID format"));
        } catch (Exception e) {
            String message = e.getMessage();
            if (message.contains("not found") || message.contains("NotFoundException")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Reservation not found"));
            }
            if (message.contains("permission") || message.contains("AuthorizationException") || message.contains("don't own")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("You can only cancel your own reservations"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to cancel reservation: " + message));
        }
    }
    
    private Map<String, String> createError(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
