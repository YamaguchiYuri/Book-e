package com.api.booke.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.booke.domain.curso.CursoRepository;
import com.api.booke.domain.curso.CursoService;
import com.api.booke.domain.curso.dto.CursoPostDto;
import com.api.booke.domain.curso.dto.CursoPutDto;
import com.api.booke.domain.curso.dto.CursoResponseDto;

/**
 * Controlador REST para operações relacionadas a cursos.
 *
 * Retorna e recebe DTOs, mantendo a API desacoplada da entidade JPA.
 *
 * - GET    /listarCursos   → lista todos os cursos
 * - POST   /criar          → cria um novo curso
 * - PUT    /{id}           → atualiza curso existente
 * - DELETE /{id}           → exclui curso
 * - GET    /buscar?id={id} → busca curso por ID
 */

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @Autowired
    private CursoRepository cursoRepository;

    /* GET /listarCursos */
    @GetMapping("/listarCursos")
    public ResponseEntity<List<CursoResponseDto>> listarCursos() {
        List<CursoResponseDto> cursos = cursoService.listarCursos();
        return ResponseEntity.ok(cursos);
    }

    /* POST /criar */
    @PostMapping("/criar")
    public ResponseEntity<CursoResponseDto> criarCurso(@RequestBody CursoPostDto dto) {
        CursoResponseDto novoCurso = cursoService.createCurso(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCurso);
    }

    /* PUT /{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> alterarCurso(@PathVariable Long id, @RequestBody CursoPutDto dto) {
        try {
            CursoResponseDto cursoAtualizado = cursoService.alterarCurso(id, dto);
            return ResponseEntity.ok(cursoAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* DELETE /{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarCurso(@PathVariable Long id) {
        try {
            String mensagem = cursoService.deletarCurso(id);
            return ResponseEntity.ok(mensagem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* GET /buscar?id= */
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarCurso(@RequestParam Long id) {
        List<CursoResponseDto> cursos = cursoService.listarCursos();

        return cursos.stream()
                .filter(c -> c.getId_curso().equals(id))
                .findFirst()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Curso com ID " + id + " não encontrado."));
    }
}