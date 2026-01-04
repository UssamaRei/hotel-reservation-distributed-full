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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Public controller for viewing listings (guest access)
 */
@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "*")
public class ListingController {
    
    @Autowired
    private ListingService listingService;
    
    @Autowired
    private ReservationService reservationService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Get all listings (public access)
     * GET /api/listings
     */
    @GetMapping
    public ResponseEntity<?> getAllListings() {
        try {
            List<Listing> listings = listingService.getAllListings();
            return ResponseEntity.ok(listings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch listings: " + e.getMessage()));
        }
    }
    
    /**
     * Get a specific listing by ID (public access)
     * GET /api/listings/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getListingById(@PathVariable int id) {
        try {
            Listing listing = listingService.getListingById(id);
            
            // Create enriched response with host information
            Map<String, Object> response = new HashMap<>();
            response.put("id", listing.getId());
            response.put("userId", listing.getUserId());
            response.put("title", listing.getTitle());
            response.put("description", listing.getDescription());
            response.put("city", listing.getCity());
            response.put("address", listing.getAddress());
            response.put("pricePerNight", listing.getPricePerNight());
            response.put("maxGuests", listing.getMaxGuests());
            response.put("beds", listing.getBeds());
            response.put("bathrooms", listing.getBathrooms());
            response.put("status", listing.getStatus());
            response.put("imageUrls", listing.getImageUrls());
            response.put("createdAt", listing.getCreatedAt());
            
            // Fetch host information
            try {
                User host = userService.getUserById(listing.getUserId());
                if (host != null) {
                    Map<String, Object> hostInfo = new HashMap<>();
                    hostInfo.put("id", host.getId());
                    hostInfo.put("name", host.getName());
                    hostInfo.put("email", host.getEmail());
                    hostInfo.put("createdAt", host.getCreatedAt());
                    response.put("host", hostInfo);
                }
            } catch (Exception e) {
                response.put("host", null);
            }
            
            return ResponseEntity.ok(response);
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
     * Search listings by city (public access)
     * GET /api/listings/search?city={city}
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchListings(@RequestParam(required = false) String city) {
        try {
            List<Listing> allListings = listingService.getAllListings();
            
            // Filter by city if provided
            if (city != null && !city.isEmpty()) {
                List<Listing> filtered = allListings.stream()
                        .filter(l -> l.getCity() != null && 
                                l.getCity().toLowerCase().contains(city.toLowerCase()))
                        .toList();
                return ResponseEntity.ok(filtered);
            }
            
            return ResponseEntity.ok(allListings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to search listings: " + e.getMessage()));
        }
    }
    
    /**
     * Get booked dates for a listing (public access)
     * GET /api/listings/{id}/booked-dates
     */
    @GetMapping("/{id}/booked-dates")
    public ResponseEntity<?> getBookedDates(@PathVariable int id) {
        try {
            List<Reservation> allReservations = reservationService.getAllReservations();
            
            // Filter both pending and confirmed reservations for this listing to prevent double-booking
            List<Map<String, String>> bookedDates = new ArrayList<>();
            for (Reservation reservation : allReservations) {
                if (reservation.getListingId() == id && 
                    ("confirmed".equalsIgnoreCase(reservation.getStatus()) ||
                     "pending".equalsIgnoreCase(reservation.getStatus()))) {
                    Map<String, String> dateRange = new HashMap<>();
                    dateRange.put("checkIn", reservation.getCheckIn() != null ? reservation.getCheckIn().toString() : "");
                    dateRange.put("checkOut", reservation.getCheckOut() != null ? reservation.getCheckOut().toString() : "");
                    bookedDates.add(dateRange);
                }
            }
            
            return ResponseEntity.ok(bookedDates);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch booked dates: " + e.getMessage()));
        }
    }
    
    /**
     * Get host profile with their listings (public access)
     * GET /api/listings/host/{hostId}
     */
    @GetMapping("/host/{hostId}")
    public ResponseEntity<?> getHostProfile(@PathVariable int hostId) {
        try {
            // Get host information
            User host = userService.getUserById(hostId);
            if (host == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Host not found"));
            }
            
            // Get all listings by this host
            List<Listing> allListings = listingService.getAllListings();
            List<Listing> hostListings = new ArrayList<>();
            for (Listing listing : allListings) {
                if (listing.getUserId() == hostId && "approved".equalsIgnoreCase(listing.getStatus())) {
                    hostListings.add(listing);
                }
            }
            
            // Build response
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> hostInfo = new HashMap<>();
            hostInfo.put("id", host.getId());
            hostInfo.put("name", host.getName());
            hostInfo.put("email", host.getEmail());
            hostInfo.put("createdAt", host.getCreatedAt());
            
            response.put("host", hostInfo);
            response.put("listings", hostListings);
            response.put("listingCount", hostListings.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch host profile: " + e.getMessage()));
        }
    }
    
    private Map<String, String> createError(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
