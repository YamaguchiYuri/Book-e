package com.api.booke.exceptions;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.expression.spel.SpelParseException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleIntegrity(DataIntegrityViolationException e) {
        return ResponseEntity.badRequest().body("Esse nickname já está em uso.");
    }

    @ExceptionHandler(SpelParseException.class)
    public ResponseEntity<String> handleSpelParse(SpelParseException e) {
        return ResponseEntity.badRequest().body("Erro de sintaxe na expressão matemática.");
    }
}

