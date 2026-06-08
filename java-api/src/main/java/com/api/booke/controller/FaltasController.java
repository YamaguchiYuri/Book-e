package com.api.booke.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.booke.domain.faltas.FaltasService;
import com.api.booke.domain.faltas.FaltasRepository;
import com.api.booke.domain.faltas.dto.*;

/**
 * Controlador REST para operações relacionadas às faltas.
 *
 * Retorna e recebe DTOs, mantendo a API desacoplada da entidade JPA.
 *
 * - GET    /listarFaltas              → lista todas as faltas cadastradas
 * - GET    /listarPorMateria/{id}     → lista faltas vinculadas a uma matéria
 * - POST   /criar                     → cria um novo registro de faltas
 * - PUT    /{id}                      → atualiza um registro de faltas existente
 * - DELETE /{id}                      → exclui um registro de faltas
 * - GET    /buscar?id={id}            → busca registro de faltas por ID
 */

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/faltas")
public class FaltasController {

    @Autowired
    private FaltasService faltasService;

    @Autowired
    private FaltasRepository faltasRepository;

    /* GET /listarFaltas */
    @GetMapping("/listarFaltas")
    public ResponseEntity<List<FaltasResponseDto>> listarFaltas() {
        List<FaltasResponseDto> faltas = faltasService.listAll();
        return ResponseEntity.ok(faltas);
    }

    /* GET /listarPorMateria/{id} */
    @GetMapping("/listarPorMateria/{idmateria}")
    public ResponseEntity<List<FaltasResponseDto>> listarPorMateria(@PathVariable Long idmateria) {
        List<FaltasResponseDto> faltas = faltasService.listByMateria(idmateria);
        return ResponseEntity.ok(faltas);
    }

    /* POST /criar */
    @PostMapping("/criar")
    public ResponseEntity<FaltasResponseDto> criarFaltas(@RequestBody FaltasPostDto dto) {
        FaltasResponseDto novaFalta = faltasService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaFalta);
    }

    /* Faltas POST body
    {
      "idmateria": 1,
      "numfaltas": 2,
      "limitefaltas": 20
    }
    Obs: "limitefaltas" é opcional, pode ser omitido ou enviado como null.
    */

    /* PUT /{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarFaltas(@PathVariable Long id, @RequestBody FaltasPutDto dto) {
        try {
            dto.setIdfaltamateria(id);
            FaltasResponseDto faltasAtualizada = faltasService.update(id, dto);
            return ResponseEntity.ok(faltasAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* Faltas PUT body
    {
      "numfaltas": 5,
      "limitefaltas": 20
    }
    */

    /* DELETE /{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarFaltas(@PathVariable Long id) {
        try {
            faltasService.delete(id);
            return ResponseEntity.ok("Registro de faltas deletado com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* GET /buscar?id= */
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarFaltas(@RequestParam Long id) {
        if (!faltasRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Registro de faltas com ID " + id + " não encontrado.");
        }

        FaltasResponseDto faltas = faltasService.search(id);
        return ResponseEntity.ok(faltas);
    }
}