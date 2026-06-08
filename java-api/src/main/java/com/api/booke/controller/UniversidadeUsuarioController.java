package com.api.booke.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import com.api.booke.domain.universidadeusuario.UniversidadeUsuarioService;
import com.api.booke.domain.universidadeusuario.dto.UniversidadeUsuarioFullResponseDto;
import com.api.booke.domain.universidadeusuario.dto.UniversidadeUsuarioResponseDto;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/universidadeUsuario")
@RequiredArgsConstructor

public class UniversidadeUsuarioController {

    private final UniversidadeUsuarioService service;
    
    @GetMapping("/full/{id}")
public UniversidadeUsuarioFullResponseDto getFull(@PathVariable Long id) {
    return service.getFullById(id);
}

@GetMapping("/usuario/{idUser}")
    public ResponseEntity<?> getByUserId(@PathVariable Long idUser) {
        List<UniversidadeUsuarioResponseDto> lista = service.getByUserId(idUser);
        
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nenhuma universidade encontrada para este usuário.");
        }
        
        return ResponseEntity.ok(lista);
    }

}
