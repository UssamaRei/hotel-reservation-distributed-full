package com.hotel.api.controller;

import com.hotel.shared.model.Room;
import com.hotel.shared.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public Room create(@RequestBody Room room) throws Exception {
        return roomService.createRoom(room);
    }

    @GetMapping
    public List<Room> list() throws Exception {
        return roomService.getAllRooms();
    }

    @PutMapping("/{id}")
    public Room update(@PathVariable int id, @RequestBody Room room) throws Exception {
        room.setId(id);
        return roomService.updateRoom(room);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable int id) throws Exception {
        return roomService.deleteRoom(id);
    }
}
