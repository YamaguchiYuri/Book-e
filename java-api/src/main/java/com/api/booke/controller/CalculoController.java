package com.api.booke.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.booke.domain.calcular.CalculoService;
import com.api.booke.domain.calcular.dto.CalculoResponseDto;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/calcular")
public class CalculoController {

    
    @Autowired
    private CalculoService calculoService;
    /**
     * Endpoint para calcular uma fórmula com base nas notas de desempenho.
     * Exemplo de chamada: GET /calcular/1/2
     */

    @GetMapping("/{idFormula}/{idMateria}")
    public ResponseEntity<CalculoResponseDto> calcular(
            @PathVariable Long idFormula,
            @PathVariable Long idMateria
    ) {
        double resultado = calculoService.calcular(idFormula, idMateria);
        CalculoResponseDto dto = new CalculoResponseDto(idFormula, idMateria, resultado);
        return ResponseEntity.ok(dto);
    }
}

