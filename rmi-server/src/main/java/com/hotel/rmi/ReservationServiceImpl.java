package com.hotel.rmi;

import com.hotel.shared.model.Reservation;
import com.hotel.shared.service.ReservationService;
import com.hotel.rmi.dao.ReservationDAO;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;

public class ReservationServiceImpl extends UnicastRemoteObject implements ReservationService {

    private final ReservationDAO reservationDAO = new ReservationDAO();

    public ReservationServiceImpl() throws RemoteException {
        super();
    }

    @Override
    public Reservation createReservation(Reservation reservation) throws RemoteException {
        try {
            reservation.setStatus("pending");
            return reservationDAO.create(reservation);
        } catch (Exception e) {
            throw new RemoteException("Failed to create reservation: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Reservation> getAllReservations() throws RemoteException {
        try {
            return reservationDAO.findAll();
        } catch (Exception e) {
            throw new RemoteException("Failed to fetch reservations", e);
        }
    }

    @Override
    public List<Reservation> getReservationsByUser(Long userId) throws RemoteException {
        try {
            return reservationDAO.findByUserId(userId);
        } catch (Exception e) {
            throw new RemoteException("Failed to fetch user reservations", e);
        }
    }

    @Override
    public Reservation getReservationById(Long id) throws RemoteException {
        try {
            return reservationDAO.findById(id);
        } catch (Exception e) {
            throw new RemoteException("Reservation not found", e);
        }
    }

    @Override
    public Reservation updateReservationStatus(Long id, String status) throws RemoteException {
        try {
            return reservationDAO.updateStatus(id, status);
        } catch (Exception e) {
            throw new RemoteException("Failed to update status", e);
        }
    }

    @Override
    public Reservation updateReservation(Reservation reservation) throws RemoteException {
        try {
            return reservationDAO.update(reservation);
        } catch (Exception e) {
            throw new RemoteException("Failed to update reservation: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean cancelReservation(Long id) throws RemoteException {
        try {
            return reservationDAO.delete(id);
        } catch (Exception e) {
            throw new RemoteException("Failed to cancel reservation", e);
        }
    }
}