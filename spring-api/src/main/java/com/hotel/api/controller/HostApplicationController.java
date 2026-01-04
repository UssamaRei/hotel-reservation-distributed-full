package com.hotel.api.controller;

import com.hotel.shared.model.HostApplication;
import com.hotel.shared.service.HostApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HostApplicationController {
    
    @Autowired
    private HostApplicationService hostApplicationService;
    
    /**
     * Submit a host application
     * POST /api/host-applications
     */
    @PostMapping("/host-applications")
    public ResponseEntity<?> submitApplication(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestBody HostApplication application) {
        try {
            application.setUserId(userId);
            HostApplication created = hostApplicationService.submitApplication(application);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createError(e.getMessage()));
        }
    }
    
    /**
     * Get current user's application
     * GET /api/host-applications/my-application
     */
    @GetMapping("/host-applications/my-application")
    public ResponseEntity<?> getMyApplication(
            @RequestHeader(value = "X-User-Id", required = true) int userId) {
        try {
            HostApplication application = hostApplicationService.getApplicationByUserId(userId);
            if (application == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("No application found"));
            }
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch application: " + e.getMessage()));
        }
    }
    
    /**
     * Get all host applications (admin only)
     * GET /api/admin/host-applications
     */
    @GetMapping("/admin/host-applications")
    public ResponseEntity<?> getAllApplications(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role,
            @RequestParam(value = "status", required = false) String status) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            List<HostApplication> applications;
            if (status != null && !status.isEmpty()) {
                applications = hostApplicationService.getApplicationsByStatus(status);
            } else {
                applications = hostApplicationService.getAllApplications();
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch applications: " + e.getMessage()));
        }
    }
    
    /**
     * Get specific application by ID (admin only)
     * GET /api/admin/host-applications/{id}
     */
    @GetMapping("/admin/host-applications/{id}")
    public ResponseEntity<?> getApplicationById(
            @RequestHeader(value = "X-User-Id", required = true) int userId,
            @RequestHeader(value = "X-User-Role", required = true) String role,
            @PathVariable int id) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            HostApplication application = hostApplicationService.getApplicationById(id);
            if (application == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createError("Application not found"));
            }
            
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to fetch application: " + e.getMessage()));
        }
    }
    
    /**
     * Approve a host application (admin only)
     * PATCH /api/admin/host-applications/{id}/approve
     */
    @PatchMapping("/admin/host-applications/{id}/approve")
    public ResponseEntity<?> approveApplication(
            @RequestHeader(value = "X-User-Id", required = true) int adminId,
            @RequestHeader(value = "X-User-Role", required = true) String role,
            @PathVariable int id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            String notes = body != null ? body.get("notes") : null;
            boolean success = hostApplicationService.approveApplication(id, adminId, notes);
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Application approved successfully");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createError("Failed to approve application"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to approve application: " + e.getMessage()));
        }
    }
    
    /**
     * Reject a host application (admin only)
     * PATCH /api/admin/host-applications/{id}/reject
     */
    @PatchMapping("/admin/host-applications/{id}/reject")
    public ResponseEntity<?> rejectApplication(
            @RequestHeader(value = "X-User-Id", required = true) int adminId,
            @RequestHeader(value = "X-User-Role", required = true) String role,
            @PathVariable int id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createError("Admin access required"));
            }
            
            String notes = body != null ? body.get("notes") : null;
            boolean success = hostApplicationService.rejectApplication(id, adminId, notes);
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Application rejected");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createError("Failed to reject application"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createError("Failed to reject application: " + e.getMessage()));
        }
    }
    
    private Map<String, String> createError(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
