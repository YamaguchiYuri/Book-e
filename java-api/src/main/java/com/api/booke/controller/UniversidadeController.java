package com.api.booke.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.booke.domain.universidade.UniversidadeRepository;
import com.api.booke.domain.universidade.UniversidadeService;
import com.api.booke.domain.universidade.dto.UniversidadePostDto;
import com.api.booke.domain.universidade.dto.UniversidadePutDto;
import com.api.booke.domain.universidade.dto.UniversidadeResponseDto;

/**
 * Controlador REST para operações relacionadas a universidades.
 *
 * Retorna e recebe DTOs, mantendo a API desacoplada da entidade JPA.
 *
 * - GET    /listarUniversidades   → lista todas as universidades
 * - POST   /criar                 → cria uma nova universidade
 * - PUT    /{id}                  → atualiza universidade existente
 * - DELETE /{id}                  → exclui universidade
 * - GET    /buscar?id={id}        → busca universidade por ID
 */

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/universidades")
public class UniversidadeController {

    @Autowired
    private UniversidadeService universidadeService;

    @Autowired
    private UniversidadeRepository universidadeRepository;

    /* GET /listarUniversidades */
    @GetMapping("/listarUniversidades")
    public ResponseEntity<List<UniversidadeResponseDto>> listarUniversidades() {
        List<UniversidadeResponseDto> universidades = universidadeService.listarUniversidades();
        return ResponseEntity.ok(universidades);
    }

    /* POST /criar */
    @PostMapping("/criar")
    public ResponseEntity<UniversidadeResponseDto> criarUniversidade(@RequestBody UniversidadePostDto dto) {
        UniversidadeResponseDto novaUniversidade = universidadeService.createUniversidade(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaUniversidade);
    }

    /* PUT /{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> alterarUniversidade(@PathVariable Long id, @RequestBody UniversidadePutDto dto) {
        try {
            UniversidadeResponseDto universidadeAtualizada = universidadeService.alterarUniversidade(id, dto);
            return ResponseEntity.ok(universidadeAtualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* DELETE /{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUniversidade(@PathVariable Long id) {
        try {
            String mensagem = universidadeService.deletarUniversidade(id);
            return ResponseEntity.ok(mensagem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* GET /buscar?id= */
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarUniversidade(@RequestParam Long id) {
        List<UniversidadeResponseDto> universidades = universidadeService.listarUniversidades();

        return universidades.stream()
                .filter(u -> u.getIduni().equals(id))
                .findFirst()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Universidade com ID " + id + " não encontrada."));
    }
}

