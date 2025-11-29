package com.test.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.entity.Task;
import com.test.entity.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer>{

	List<Task> findByUser(User user);
}
