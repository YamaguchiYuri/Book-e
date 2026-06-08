package com.api.booke.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.booke.domain.formulavariavel.VariavelFormulaService;
import com.api.booke.domain.formulavariavel.dto.VariavelFormulaRequestDto;
import com.api.booke.domain.formulavariavel.dto.VariavelFormulaResponseDto;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/variaveis")
public class VariavelFormulaController {

    @Autowired
    private VariavelFormulaService variavelFormulaService;

    /* body:
     * {
     * "nome": "P1",
     * "idformula": 5
     * }
     */
    // Criar variável avulsa 
    @PostMapping("/criar")
    public ResponseEntity<VariavelFormulaResponseDto> criar(@RequestBody VariavelFormulaRequestDto dto) {
        try {
            VariavelFormulaResponseDto novaVariavel = variavelFormulaService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaVariavel);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Buscar variável por ID
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorId(@RequestParam Long id) {
        try {
            VariavelFormulaResponseDto variavel = variavelFormulaService.searchForId(id);
            return ResponseEntity.ok(variavel);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Buscar TODAS as variáveis de uma FÓRMULA específica 
    @GetMapping("/formula/{formulaId}")
    public ResponseEntity<?> listarPorFormula(@PathVariable Long formulaId) {
        try {
            List<VariavelFormulaResponseDto> variaveis = variavelFormulaService.searchFormula(formulaId);
            if (variaveis.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma variável encontrada para esta fórmula.");
            }
            return ResponseEntity.ok(variaveis);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Deletar variável
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            variavelFormulaService.deletar(id);
            return ResponseEntity.ok("Variável deletada com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
