package com.Todo_API.Application;

import com.Todo_API.Application.model.Todo;
import com.Todo_API.Application.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    public Optional<Todo> getTodoById(String id) {
        return todoRepository.findById(id);
    }

    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo updateTodo(String id, Todo updatedTodo) {
        return todoRepository.findById(id).map(todo -> {
            todo.setText(updatedTodo.getText());
            todo.setCompleted(updatedTodo.isCompleted());
            return todoRepository.save(todo);
        }).orElseThrow( () -> new RuntimeException("Todo not found with Id" + id));
    }

    public void deleteTodoById(String id) {
        todoRepository.deleteById(id);
    }
}
