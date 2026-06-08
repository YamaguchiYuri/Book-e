package com.api.booke.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.booke.domain.agenda.AgendaService;
import com.api.booke.domain.formula.FormulaService;
import com.api.booke.domain.formula.dto.FormulaPostDto;
import com.api.booke.domain.formula.dto.FormulaPutDto;
import com.api.booke.domain.formula.dto.FormulaResponseDto;
import com.api.booke.entitites.Formula;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/formulas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FormulaController {

    @Autowired
    private FormulaService formulaService;

    // Criar fórmula (POST)
    @PostMapping
    public ResponseEntity<FormulaResponseDto> criar(@RequestBody FormulaPostDto dto) {
        return ResponseEntity.ok(formulaService.create(dto));
    }
    
    /*body:
     * {
        "expressao": "(nota1 + nota2) / 2",
        "idmateria": 5
    }
     */
    // Buscar fórmula por ID
    @GetMapping("/{id}")
    public ResponseEntity<FormulaResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(formulaService.search(id));
    }

    // Listar fórmulas por matéria
    @GetMapping("/materia/{idMateria}")
    public ResponseEntity<List<FormulaResponseDto>> listarPorMateria(@PathVariable Long idMateria) {
        return ResponseEntity.ok(formulaService.listByMateria(idMateria));
    }

    // Atualizar fórmula
    @PutMapping("/{id}")
    public ResponseEntity<FormulaResponseDto> atualizar(@PathVariable Long id,
                                                        @RequestBody FormulaPutDto dto) {
        return ResponseEntity.ok(formulaService.update(id, dto));
    }

    // Deletar fórmula
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        formulaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}