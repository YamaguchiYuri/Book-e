package com.api.booke.controller;

import com.api.booke.domain.notadesempenho.NotaDesempenhoService;
import com.api.booke.domain.notadesempenho.dto.NotaDesempenhoPostDto;
import com.api.booke.domain.notadesempenho.dto.NotaDesempenhoPutDto;
import com.api.booke.domain.notadesempenho.dto.NotaDesempenhoResponseDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/notas")
public class NotaDesempenhoController {

    @Autowired
    private NotaDesempenhoService notaService;

    // Lista todas as notas
    @GetMapping
    public ResponseEntity<List<NotaDesempenhoResponseDto>> listarNotas() {
        return ResponseEntity.ok(notaService.getAll());
    }


    // Busca nota pelo ID

    @GetMapping("/buscar/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(notaService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nota com ID " + id + " não encontrada.");
        }
    }

    // Lista notas vinculadas à matéria
    @GetMapping("/materia/{idMateria}")
    public ResponseEntity<List<NotaDesempenhoResponseDto>> buscarPorMateria(@PathVariable Long idMateria) {
        return ResponseEntity.ok(notaService.getByMateria(idMateria));
    }

    // Cria uma nova nota

    @PostMapping
    public ResponseEntity<?> criarNota(@RequestBody NotaDesempenhoPostDto dto) {
        try {
            NotaDesempenhoResponseDto created = notaService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro ao criar nota: " + e.getMessage());
        }
    }

    /*
     * body:
     * {
  "idmateria": 5,
  "notacadastro": 8.5,
  "idvariavel": 2
}
     */


    // Atualiza nota existente

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarNota(@PathVariable Long id,
                                           @RequestBody NotaDesempenhoPutDto dto) {
        try {
            dto.setIdnotadesempenho(id);
            NotaDesempenhoResponseDto updated = notaService.update(dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erro ao atualizar nota: " + e.getMessage());
        }
    }

    // DELETE /api/notas/{id}
    // Exclui uma nota

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarNota(@PathVariable Long id) {
        try {
            notaService.delete(id);
            return ResponseEntity.ok("Nota com ID " + id + " deletada com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erro ao deletar nota: " + e.getMessage());
        }
    }
}