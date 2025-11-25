package com.api.booke.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.booke.domain.materia.MateriaService;
import com.api.booke.domain.materia.MateriaRepository;
import com.api.booke.domain.materia.dto.*;

/**
 * Controlador REST para operações relacionadas às matérias.
 *
 * Retorna e recebe DTOs, mantendo a API desacoplada da entidade JPA.
 *
 * - GET    /listarMaterias                         → lista todas as matérias
 * - GET    /listarPorUniversidadeUsuario/{id}      → lista matérias do usuário logado
 * - POST   /criar                                  → cria uma nova matéria
 * - PUT    /{id}                                   → atualiza matéria existente
 * - DELETE /{id}                                   → exclui matéria
 * - GET    /buscar?id={id}                         → busca matéria por ID
 */

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    @Autowired
    private MateriaService materiaService;

    @Autowired
    private MateriaRepository materiaRepository;

    /* GET /listarMaterias */
    @GetMapping("/listarMaterias")
    public ResponseEntity<List<MateriaResponseDto>> listarMaterias() {
        List<MateriaResponseDto> materias = materiaService.getAll();
        return ResponseEntity.ok(materias);
    }

    /* GET /listarPorUniversidadeUsuario/{id} */
    @GetMapping("/listarPorUniversidadeUsuario/{id}")
    public ResponseEntity<List<MateriaResponseDto>> listarPorUniversidadeUsuario(@PathVariable Long id) {
        List<MateriaResponseDto> materias = materiaService.getByUniversidadeUsuario(id);
        return ResponseEntity.ok(materias);
    }

    /* POST /criar */
    @PostMapping("/criar")
    public ResponseEntity<MateriaResponseDto> criarMateria(@RequestBody MateriaPostDto dto) {
        MateriaResponseDto novaMateria = materiaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMateria);
    }

    /* PUT /{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarMateria(@PathVariable Long id, @RequestBody MateriaPutDto dto) {
        try {
            dto.setIdmateria(id);
            MateriaResponseDto materiaAtualizada = materiaService.update(dto);
            return ResponseEntity.ok(materiaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* DELETE /{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarMateria(@PathVariable Long id) {
        try {
            materiaService.delete(id);
            return ResponseEntity.ok("Matéria deletada com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* GET /buscar?id= */
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarMateria(@RequestParam Long id) {
        if (!materiaRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Matéria com ID " + id + " não encontrada.");
        }

        MateriaResponseDto materia = materiaService.getById(id);
        return ResponseEntity.ok(materia);
    }

    /* GET /buscar/{id_user} */
@GetMapping("/buscar/{id_user}")
public ResponseEntity<?> buscarMateriasFullPorUsuario(@PathVariable Long id_user) {
    try {
        List<MateriaFullResponseDto> materias = materiaService.getFullByUserId(id_user);

        if (materias.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nenhuma matéria encontrada para o usuário com ID " + id_user);
        }

        return ResponseEntity.ok(materias);

    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
}