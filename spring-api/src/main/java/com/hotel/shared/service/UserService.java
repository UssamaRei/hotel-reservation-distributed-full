package com.hotel.shared.service;

import com.hotel.shared.model.User;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface UserService extends Remote {
    User register(User user) throws RemoteException;
    User login(String email, String password) throws RemoteException;
    User getUserById(int userId) throws RemoteException;
    User updateUserRole(int userId, String role) throws RemoteException;
    List<User> getAllUsers() throws RemoteException;
    boolean banUser(int userId) throws RemoteException;
}
