package com.example.registration.controller;

import com.example.registration.model.User;
import com.example.registration.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user); // Note: Changed to match service method name
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
public User getUserById(@PathVariable String id) {
    try {
        Long longId = Long.parseLong(id);
        return userService.getUserById(longId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException("Invalid ID format: " + id);
        }
    }   

    
    @PutMapping("/{id}") // Add this endpoint
    public User updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            Long longId = Long.parseLong(id);
            return userService.updateUser(longId, user);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid ID format: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        try {
            Long longId = Long.parseLong(id); // Convert String to Long
            userService.deleteUser(longId);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid ID format: " + id);
        }
    }
}