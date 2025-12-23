package com.hotel.api.controller;

import com.hotel.shared.model.Listing;
import com.hotel.shared.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    
    private Map<String, String> createError(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
