package com.billsplitter.bill_splitter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getEmail());
        Map<String, Object> response = new HashMap<>();
        response.put("token", "Bearer " + token);
        response.put("name", saved.getName());
        response.put("email", saved.getEmail());
        response.put("userId", saved.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}/upi")
    public ResponseEntity<?> setUpi(@PathVariable Long id, @RequestBody UpiRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            return ResponseEntity.badRequest().body("User not found!");
        user.setUpiId(request.getUpiId());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        if (user == null)
            return ResponseEntity.badRequest().body("User not found!");
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Wrong password!");
        }
        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", "Bearer " + token);
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("userId", user.getId());
        return ResponseEntity.ok(response);
    }

    @Data
    static class UpiRequest {
        private String upiId;
    }
}