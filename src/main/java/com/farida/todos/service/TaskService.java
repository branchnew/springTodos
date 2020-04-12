package com.farida.todos.service;

import com.farida.todos.data.entity.Task;
import com.farida.todos.data.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class TaskService {

  private TaskRepository taskRepository;

  @Autowired
  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  public Task create(String title){
    var task = new Task();
    task.setTitle(title);
    return taskRepository.save(task);
  }

  public Iterable<Task> getAll() {
    return taskRepository.findAll();
  }

  public void deleteById(Long id) {
    taskRepository.deleteById(id);
  }

  public Task edit(Long id, Map<String, String> body) {
    var task = taskRepository.findById(id).get();
    if(body.containsKey("title")) {
      task.setTitle(body.get("title"));
    }
    if(body.containsKey("status")) {
      boolean status = body.get("status").toLowerCase().equals("true");
      task.setStatus(status);
    }
    return taskRepository.save(task);
  }
}
