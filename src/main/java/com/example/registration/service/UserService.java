package com.example.registration.service;

import com.example.registration.model.User;
import com.example.registration.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        logger.info("PasswordEncoder injected via constructor: {}", passwordEncoder != null);
        if (passwordEncoder != null) {
            logger.info("PasswordEncoder type: {}", passwordEncoder.getClass().getName());
        }
    }

    public User registerUser(User user) {
        logger.info("Registering user: {}", user.getEmail());
        if (passwordEncoder == null) {
            logger.error("PasswordEncoder is null - cannot hash password");
            throw new IllegalStateException("PasswordEncoder not injected");
        }
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        logger.info("Hashed password for user {}: {}", user.getEmail(), hashedPassword);
        user.setPassword(hashedPassword);
        User savedUser = userRepository.save(user);
        logger.info("Saved user: {}", savedUser.getEmail());
        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found with id: " + id);
        }
        User existingUser = existingUserOpt.get();
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            logger.info("Updating password for user: {}", existingUser.getEmail());
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        try {
            return userRepository.save(existingUser);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Email already exists: " + updatedUser.getEmail());
        }
    }
}