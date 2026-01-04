package com.hotel.api.controller;

import com.hotel.api.dto.LoginRequest;
import com.hotel.api.dto.LoginResponse;
import com.hotel.api.model.User;
import com.hotel.api.security.JwtUtil;
import com.hotel.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            if (userService.validatePassword(loginRequest.getUsername(), loginRequest.getPassword())) {
                User user = userService.findByUsername(loginRequest.getUsername());
                String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
                
                return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole()));
            } else {
                return ResponseEntity.badRequest().body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest registerRequest) {
        try {
            if (userService.findByUsername(registerRequest.getUsername()) != null) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            User user = userService.createUser(registerRequest.getUsername(), registerRequest.getPassword(), "USER");
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            
            return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
}