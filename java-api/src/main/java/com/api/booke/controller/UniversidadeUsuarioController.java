package com.api.booke.controller;

import org.springframework.web.bind.annotation.*;

import com.api.booke.domain.universidadeusuario.UniversidadeUsuarioService;
import com.api.booke.domain.universidadeusuario.dto.UniversidadeUsuarioFullResponseDto;

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

}
