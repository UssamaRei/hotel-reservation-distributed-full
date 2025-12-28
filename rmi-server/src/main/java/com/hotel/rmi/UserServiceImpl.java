package com.hotel.rmi;

import com.hotel.rmi.dao.UserDAO;
import com.hotel.shared.exception.AuthorizationException;
import com.hotel.shared.exception.NotFoundException;
import com.hotel.shared.model.User;
import com.hotel.shared.service.UserService;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserServiceImpl extends UnicastRemoteObject implements UserService {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = Logger.getLogger(UserServiceImpl.class.getName());
    private final UserDAO userDAO;
    
    public UserServiceImpl() throws RemoteException {
        super();
        this.userDAO = new UserDAO();
    }
    
    @Override
    public User register(User user) throws RemoteException {
        try {
            logger.info("Registering user: " + user.getEmail());
            
            // Check if email already exists
            User existing = userDAO.findByEmail(user.getEmail());
            if (existing != null) {
                throw new RemoteException("Email already exists");
            }
            
            // Set default role if not provided
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("guest");
            }
            
            User created = userDAO.create(user);
            // Don't return password in response
            created.setPassword(null);
            return created;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error registering user", e);
            throw new RemoteException("Failed to register user: " + e.getMessage(), e);
        }
    }
    
    @Override
    public User login(String email, String password) throws RemoteException {
        try {
            logger.info("Login attempt for: " + email);
            
            User user = userDAO.findByEmailAndPassword(email, password);
            if (user == null) {
                throw new RemoteException("Invalid email or password");
            }
            
            // Don't return password in response
            user.setPassword(null);
            return user;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error during login", e);
            throw new RemoteException("Failed to login: " + e.getMessage(), e);
        }
    }
    
    @Override
    public User getUserById(int userId) throws RemoteException {
        try {
            logger.info("Getting user: " + userId);
            
            User user = userDAO.findById(userId);
            if (user == null) {
                throw new NotFoundException("User not found with ID: " + userId);
            }
            
            // Don't return password in response
            user.setPassword(null);
            return user;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error getting user", e);
            throw new RemoteException("Failed to get user: " + e.getMessage(), e);
        } catch (NotFoundException e) {
            throw new RemoteException(e.getMessage(), e);
        }
    }
    
    @Override
    public User updateUserRole(int userId, String role) throws RemoteException {
        try {
            logger.info("Updating user role: " + userId + " to " + role);
            
            // Validate role
            if (!role.equals("guest") && !role.equals("host") && !role.equals("admin")) {
                throw new RemoteException("Invalid role: " + role);
            }
            
            boolean updated = userDAO.updateRole(userId, role);
            if (!updated) {
                throw new NotFoundException("User not found with ID: " + userId);
            }
            
            return getUserById(userId);
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error updating user role", e);
            throw new RemoteException("Failed to update user role: " + e.getMessage(), e);
        } catch (NotFoundException e) {
            throw new RemoteException(e.getMessage(), e);
        }
    }
}
