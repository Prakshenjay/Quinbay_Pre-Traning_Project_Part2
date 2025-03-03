package com.Todo_API.Application.repository;

import com.Todo_API.Application.model.Todo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TodoRepository extends MongoRepository<Todo, String> {
}