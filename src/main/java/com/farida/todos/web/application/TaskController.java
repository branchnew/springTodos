package com.farida.todos.web.application;

import com.farida.todos.data.entity.Task;
import com.farida.todos.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping(value = "/api/task")
public class TaskController {
  @Autowired
  private TaskService service;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Task create(@RequestParam Map<String, String> body) {
    return service.create(body.get("title"));
  }

  @GetMapping
  public Iterable<Task> getAll() {
    return service.getAll();
  }

  @DeleteMapping(value = "/all")
  @ResponseStatus(HttpStatus.OK)
  public void deleteAll() {
    service.destroyAll();
  }

  @DeleteMapping(value = "/{id}")
  public ResponseEntity<?> delete(@PathVariable("id") Long id) {
    try {
      service.deleteById(id);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch(EmptyResultDataAccessException e) {
     return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }
  }

  @PutMapping(value = "/all")
  public void changeStatusAll(@RequestParam(name = "status") boolean status) {
    service.updateAll(status);
  }

  @PutMapping(value = "/{id}")
  public ResponseEntity<?> edit(@PathVariable("id") Long id, @RequestParam Map<String, String> body) {
    try {
      var task = service.edit(id, body);
      return new ResponseEntity<>(task, HttpStatus.OK);
    } catch (NoSuchElementException e) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }
  }
}
