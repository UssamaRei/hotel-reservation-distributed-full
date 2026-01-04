package com.hotel.shared.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

public class Reservation implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int id;
    private int listingId;
    private int userId;
    private Date checkIn;
    private Date checkOut;
    private BigDecimal totalPrice;
    private String status; // pending, confirmed, cancelled
    private Timestamp createdAt;
    private String guestPhone;
    private String guestNotes;
    
    // Additional fields for joined queries
    private String listingTitle;
    private String guestName;
    private String guestEmail;
    
    public Reservation() {}
    
    public Reservation(int id, int listingId, int userId, Date checkIn, Date checkOut, 
                      BigDecimal totalPrice, String status, Timestamp createdAt) {
        this.id = id;
        this.listingId = listingId;
        this.userId = userId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getListingId() { return listingId; }
    public void setListingId(int listingId) { this.listingId = listingId; }
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public Date getCheckIn() { return checkIn; }
    public void setCheckIn(Date checkIn) { this.checkIn = checkIn; }
    
    public Date getCheckOut() { return checkOut; }
    public void setCheckOut(Date checkOut) { this.checkOut = checkOut; }
    
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    
    public String getListingTitle() { return listingTitle; }
    public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }
    
    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }
    
    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }
    
    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }
    
    public String getGuestNotes() { return guestNotes; }
    public void setGuestNotes(String guestNotes) { this.guestNotes = guestNotes; }
    
    @Override
    public String toString() {
        return "Reservation{id=" + id + ", listingId=" + listingId + ", userId=" + userId + 
               ", checkIn=" + checkIn + ", checkOut=" + checkOut + ", status='" + status + "'}";
    }
}
