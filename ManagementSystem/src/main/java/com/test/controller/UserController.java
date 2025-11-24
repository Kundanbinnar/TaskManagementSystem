package com.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.Utility.JwUtil;
import com.test.entity.User;
import com.test.repository.UserRepository;

@RestController
@RequestMapping("/auth")
public class UserController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private JwUtil jwUtil;
	
	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody User user){
		userRepository.save(user);
		return ResponseEntity.ok("User registered Successfully!!!");
	}
	
	@PostMapping("/login")
	public ResponseEntity<String> loginUser(@RequestBody User user){
		User existingUser =  userRepository.findByUsername(user.getUsername());
				
		if(existingUser !=null) {
			if(existingUser.getPassword().equals(user.getPassword())) {
				String token = jwUtil.generateToken(existingUser.getUsername());
				return ResponseEntity.ok(token);
			}else {
				return ResponseEntity.status(401).body("Invalid credentials");
			}	
		}else
		{
		 return ResponseEntity.status(404).body("USer not found !!!");	
		}
		
	}
	
}
