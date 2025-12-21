package com.hotel.api.controller;

import com.hotel.shared.model.Reservation;
import com.hotel.shared.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.rmi.Naming;
import java.rmi.RemoteException;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController() throws Exception {
        this.reservationService = (ReservationService) Naming.lookup("rmi://localhost:1099/ReservationService");
    }

    @PostMapping
    public Reservation create(@RequestBody Reservation reservation) throws Exception {
        return reservationService.createReservation(reservation);
    }

    @GetMapping
    public List<Reservation> getAll() throws Exception {
        return reservationService.getAllReservations();
    }

    @GetMapping("/user/{userId}")
    public List<Reservation> getByUser(@PathVariable Long userId) throws Exception {
        return reservationService.getReservationsByUser(userId);
    }

    @GetMapping("/{id}")
    public Reservation getById(@PathVariable Long id) throws Exception {
        return reservationService.getReservationById(id);
    }

    @PutMapping("/{id}/status")
    public Reservation updateStatus(@PathVariable Long id, @RequestParam String status) throws Exception {
        return reservationService.updateReservationStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public boolean cancel(@PathVariable Long id) throws Exception {
        return reservationService.cancelReservation(id);
    }

    @PutMapping("/{id}")
    public Reservation updateReservation(@PathVariable Long id, @RequestBody Reservation updatedReservation) throws Exception {
        updatedReservation.setId(id);
        return reservationService.updateReservation(updatedReservation);
    }
}