package com.hotel.rmi;

import com.hotel.rmi.dao.UserDAO;
import com.hotel.rmi.dao.ListingDAO;
import com.hotel.rmi.dao.ReservationDAO;
import com.hotel.shared.exception.AuthorizationException;
import com.hotel.shared.exception.NotFoundException;
import com.hotel.shared.model.User;
import com.hotel.shared.service.UserService;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserServiceImpl extends UnicastRemoteObject implements UserService {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = Logger.getLogger(UserServiceImpl.class.getName());
    private final UserDAO userDAO;
    private final ListingDAO listingDAO;
    private final ReservationDAO reservationDAO;
    
    public UserServiceImpl() throws RemoteException {
        super();
        this.userDAO = new UserDAO();
        this.listingDAO = new ListingDAO();
        this.reservationDAO = new ReservationDAO();
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
    
    @Override
    public List<User> getAllUsers() throws RemoteException {
        try {
            logger.info("Getting all users");
            List<User> users = userDAO.findAll();
            
            // Don't return passwords
            for (User user : users) {
                user.setPassword(null);
            }
            
            return users;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error getting all users", e);
            throw new RemoteException("Failed to get users: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean banUser(int userId) throws RemoteException {
        try {
            logger.info("Banning user: " + userId);
            
            // Delete all user's reservations
            reservationDAO.deleteByUserId(userId);
            
            // Delete all user's listings
            listingDAO.deleteByUserId(userId);
            
            // Ban the user
            boolean banned = userDAO.ban(userId);
            
            if (banned) {
                logger.info("User banned and all their data removed: " + userId);
            }
            
            return banned;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error banning user", e);
            throw new RemoteException("Failed to ban user: " + e.getMessage(), e);
        }
    }
    
    @Override
    public User updateUserProfile(int userId, String name, String email) throws RemoteException {
        try {
            logger.info("Updating user profile: " + userId);
            
            // Check if new email already exists for another user
            User existingEmail = userDAO.findByEmail(email);
            if (existingEmail != null && existingEmail.getId() != userId) {
                throw new RemoteException("Email already exists");
            }
            
            boolean updated = userDAO.updateProfile(userId, name, email);
            if (!updated) {
                throw new NotFoundException("User not found with ID: " + userId);
            }
            
            return getUserById(userId);
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error updating user profile", e);
            throw new RemoteException("Failed to update user profile: " + e.getMessage(), e);
        } catch (NotFoundException e) {
            throw new RemoteException(e.getMessage(), e);
        }
    }
    
    @Override
    public boolean changePassword(int userId, String currentPassword, String newPassword) throws RemoteException {
        try {
            logger.info("Changing password for user: " + userId);
            
            boolean changed = userDAO.changePassword(userId, currentPassword, newPassword);
            if (!changed) {
                throw new RemoteException("Current password is incorrect");
            }
            
            return true;
            
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Database error changing password", e);
            throw new RemoteException("Failed to change password: " + e.getMessage(), e);
        }
    }
}
