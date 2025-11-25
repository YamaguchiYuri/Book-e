package com.api.booke.controller;

import com.api.booke.domain.formularioinicial.FormularioInicialService;
import com.api.booke.domain.formularioinicial.dto.FormularioInicialRequestDto;
import com.api.booke.domain.formularioinicial.dto.FormularioInicialResponseDto;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/formulario")
@RequiredArgsConstructor

public class FormularioInicialController {

    private final FormularioInicialService formularioInicialService;

    @PostMapping("/enviar")
    public ResponseEntity<FormularioInicialResponseDto> processarFormulario(
            @RequestBody FormularioInicialRequestDto dto) {

        FormularioInicialResponseDto response = formularioInicialService.processarFormulario(dto);

        return ResponseEntity.ok(response);
    }
}

/*body:
 *  {
  "iduser": 1,
  "dt_nasciment_em": "2004-10-17",

  "uninome": "Universidade de São Paulo",
  "nomecurso": "Ciência da Computação",
  "semestre": 3,

  "materias": [
    {
      "nomemateria": "Cálculo I",
      "semestre_materia": 1
    },
    {
      "nomemateria": "Estruturas de Dados",
      "semestre_materia": 3
    }
  ]
}
 */