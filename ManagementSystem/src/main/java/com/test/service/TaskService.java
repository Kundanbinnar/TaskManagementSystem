package com.test.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.entity.Task;
import com.test.entity.User;
import com.test.repository.TaskRepository;

@Service
public class TaskService {

	@Autowired
	private TaskRepository taskRepository;

	public Task addTask(Task task) {
		return taskRepository.save(task);
	}

	public List<Task> getAllTask() {
		return taskRepository.findAll();
	}

	public Optional<Task> getTaskByID(int id) {
		return taskRepository.findById(id);
	}

	public void deleteTask(int id) {
		taskRepository.deleteById(id);
	}

	public void updatedByID(int id, Task task) {
		Optional<Task> task1 = taskRepository.findById(id);
		if (task1.isPresent()) {
			Task taskExit = task1.get();
			taskExit.setName(task.getName());
			taskExit.setDescription(task.getDescription());
			taskExit.setStatus(task.getStatus());
			taskExit.setDueDate(task.getDueDate());
			taskRepository.save(taskExit);
		} else {
			throw new IllegalArgumentException("Task with id " + id + "not found");
		}

	}
	
	public List<Task> getTaskByUser(User user){
		return taskRepository.findByUser(user);
	}
}
