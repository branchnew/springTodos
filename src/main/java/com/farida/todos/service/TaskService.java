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
  //create a task
  public Task create(String title){
    var task = new Task();
    task.setTitle(title);
    return taskRepository.save(task);
  }
  //get all tasks
  public Iterable<Task> getAll() {
    return taskRepository.findAll();
  }
  //delete by id a task
  public void deleteById(Long id) {
    taskRepository.deleteById(id);
  }
  //edit a task title and change task status
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
  //delete all tasks
  public void destroyAll() {
    taskRepository.deleteAll();
  }
  //change status to all tasks
  public void updateAll(boolean status) {
    var tasks = taskRepository.findAll();
    tasks.forEach(task -> task.setStatus(status));
    taskRepository.saveAll(tasks);
  }
}
