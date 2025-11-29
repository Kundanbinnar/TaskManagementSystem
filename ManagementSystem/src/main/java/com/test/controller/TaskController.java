package com.test.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.Utility.JwUtil;
import com.test.entity.Task;
import com.test.entity.User;
import com.test.repository.UserRepository;
import com.test.service.TaskService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/tasks")
public class TaskController {

	@Autowired
	private TaskService taskSerivce;
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private JwUtil jwtUtil;

	@PostMapping
	public ResponseEntity<String> addTask(@RequestBody Task task, @RequestHeader("Authorization")  String authHeader) {
		
		String token = authHeader.substring(7);
		String username = jwtUtil.extractUsername(token);
		User user = userRepo.findByUsername(username);	
		
		task.setUser(user);
		taskSerivce.addTask(task);
		return ResponseEntity.ok("Successfully added the task !!!");
	}

	@GetMapping("/all")
	public ResponseEntity<List<Task>> getAllTask() {
		List<Task> tasks = taskSerivce.getAllTask();
		return ResponseEntity.ok().body(tasks);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Task> getTaskByID(@PathVariable int id) {
		Optional<Task> taskFromdb = taskSerivce.getTaskByID(id);
		if (taskFromdb.isPresent()) {
			Task task = taskFromdb.get();
			return ResponseEntity.ok(task);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteTaskByID(@PathVariable int id) {
		taskSerivce.deleteTask(id);
		return ResponseEntity.ok("Task deleted successfully !!!");
	}

	@PutMapping("/{id}")
	public ResponseEntity<String> updatedTaskByID(@PathVariable int id, @RequestBody Task task) {
		Optional<Task> task1 = taskSerivce.getTaskByID(id);
		if (task1.isPresent()) {
			taskSerivce.updatedByID(id, task);
			return ResponseEntity.ok("Successfully updated the task");
		} else {
			return ResponseEntity.status(404).body("Id is not present");
		}
	}
	
	@GetMapping("/my-tasks")
	public ResponseEntity<List<Task>> getTaskForUser(@RequestHeader("Authorization") String authHeader){
		
		String token = authHeader.substring(7);
		String username = jwtUtil.extractUsername(token);
		User user = userRepo.findByUsername(username);
		
		if(user == null) {
			return ResponseEntity.status(401).build();
		}
		
		List<Task> tasks = taskSerivce.getTaskByUser(user);
		return ResponseEntity.ok(tasks);
	}
	
	

}
