package com.hotel.shared.model;

import java.io.Serializable;
import java.math.BigDecimal;

public class Listing implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long userId; // host
    private String title;
    private String description;
    private String address;
    private String city;
    private BigDecimal pricePerNight;
    private int maxGuests;
    private String imageUrl;

    // Empty constructor
    public Listing() {}

    // Full constructor (without id)
    public Listing(Long userId, String title, String description, String address,
                   String city, BigDecimal pricePerNight, int maxGuests, String imageUrl) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.address = address;
        this.city = city;
        this.pricePerNight = pricePerNight;
        this.maxGuests = maxGuests;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

    public int getMaxGuests() { return maxGuests; }
    public void setMaxGuests(int maxGuests) { this.maxGuests = maxGuests; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    @Override
    public String toString() {
        return "Listing{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", address='" + address + '\'' +
                ", city='" + city + '\'' +
                ", pricePerNight=" + pricePerNight +
                ", maxGuests=" + maxGuests +
                '}';
    }
}