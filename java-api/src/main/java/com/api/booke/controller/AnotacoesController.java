
package com.api.booke.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.booke.domain.anotacoes.AnotacaoService;
import com.api.booke.domain.anotacoes.dto.AnotacaoPostDto;
import com.api.booke.domain.anotacoes.dto.AnotacaoPutDto;
import com.api.booke.domain.anotacoes.dto.AnotacaoResponseDto;

/**
 * Controlador REST para operações relacionadas a anotações.
 *
 * Retorna e recebe DTOs, mantendo a API desacoplada da entidade JPA.
 *
 * - GET    /listarAnotacoes      → lista todas as anotações do sistema
 * - GET    /buscar/{id}          → busca anotação específica por ID
 * - GET    /usuario/{idUser}     → busca todas as anotações de um usuário
 * - POST   /criar                → cria uma nova anotação
 * - PUT    /{id}                 → atualiza anotação existente
 * - DELETE /{id}                 → exclui anotação
 */

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/anotacoes")
public class AnotacoesController {

    @Autowired
    private AnotacaoService anotacaoService;

    /* GET /listarAnotacoes */
    @GetMapping("/listarAnotacoes")
    public ResponseEntity<List<AnotacaoResponseDto>> listarAnotacoes() {
        List<AnotacaoResponseDto> anotacoes = anotacaoService.getAll();
        return ResponseEntity.ok(anotacoes);
    }

    /* GET /buscar/{id} */
    @GetMapping("/buscar/{id}")
    public ResponseEntity<?> buscarAnotacaoPorId(@PathVariable Long id) {
        try {
            AnotacaoResponseDto anotacao = anotacaoService.getById(id);
            return ResponseEntity.ok(anotacao);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* GET /usuario/{idUser}*/
    @GetMapping("/usuario/{idUser}")
    public ResponseEntity<?> buscarAnotacoesPorUsuario(@PathVariable Long idUser) {
        List<AnotacaoResponseDto> anotacoes = anotacaoService.getByUserId(idUser);
        
        if (anotacoes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nenhuma anotação encontrada para o usuário com ID " + idUser);
        }
        return ResponseEntity.ok(anotacoes);
    }

    /* POST /criar */
    @PostMapping("/criar")
    public ResponseEntity<?> criarAnotacao(@RequestBody AnotacaoPostDto dto) {
        try {
            AnotacaoResponseDto novaAnotacao = anotacaoService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaAnotacao);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /* Exemplo de Body POST:
     * {
     * "titulo": "Resumo de Cálculo",
     * "texto": "A derivada de x^2 é 2x...",
     * "iduser": 1,
     * "idmateria": 2
     * }
     */

    /* PUT /{id} → atualiza anotação existente */
    @PutMapping("/{id}")
    public ResponseEntity<?> alterarAnotacao(@PathVariable Long id, @RequestBody AnotacaoPutDto dto) {
        try {
            // Garante que o ID da URL seja passado para o DTO antes de enviar ao service
            dto.setId(id); 
            AnotacaoResponseDto anotacaoAtualizada = anotacaoService.update(dto);
            return ResponseEntity.ok(anotacaoAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* Exemplo de Body PUT (Note que NÃO tem o iduser, pois o dono não muda):
     * {
     * "titulo": "Resumo de Cálculo Atualizado",
     * "texto": "Corrigindo: A derivada de constante é zero.",
     * "idmateria": 2
     * }
     */

    /* DELETE /{id} exclui anotação */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarAnotacao(@PathVariable Long id) {
        try {
            anotacaoService.delete(id);
            return ResponseEntity.ok("Anotação deletada com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}