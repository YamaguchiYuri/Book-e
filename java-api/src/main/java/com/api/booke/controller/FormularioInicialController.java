package com.api.booke.controller;

import com.api.booke.domain.formularioinicial.FormularioInicialService;
import com.api.booke.domain.formularioinicial.dto.FormularioInicialRequestDto;
import com.api.booke.domain.formularioinicial.dto.FormularioInicialResponseDto;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/formulario")
@RequiredArgsConstructor

public class FormularioInicialController {

    private final FormularioInicialService formularioInicialService;

    @PostMapping
    public ResponseEntity<FormularioInicialResponseDto> processarFormulario(
            @RequestBody FormularioInicialRequestDto dto) {

        FormularioInicialResponseDto response = formularioInicialService.processarFormulario(dto);

        return ResponseEntity.ok(response);
    }
}
