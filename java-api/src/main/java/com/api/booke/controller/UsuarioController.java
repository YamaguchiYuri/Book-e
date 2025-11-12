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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.booke.domain.usuario.UsuarioRepository;
import com.api.booke.domain.usuario.UsuarioService;
import com.api.booke.domain.usuario.dto.UsuarioPostDto;
import com.api.booke.domain.usuario.dto.UsuarioPutDTO;
import com.api.booke.domain.usuario.dto.UsuarioResponseDto;

/**
 * Controlador REST para operações relacionadas a usuarios.
 *
 * Retorna e recebe DTOs, mantendo a API desacoplada da entidade JPA.
 *
 * - GET    /listarUsuarios          → lista todos os usuarios
 * - GET /buscaPorId        → busca por ID ou nome via DTO
 * - POST   /criar                        → cria um novo usuario
 * - PUT    /{id}                    → atualiza usuario existente
 * - DELETE /{id}                    → exclui usuario
 */


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository; 

    /* GET /listarUsuarios */
    @GetMapping("/listarUsuarios")
    public ResponseEntity<List<UsuarioResponseDto>> listarUsuarios() {
        List<UsuarioResponseDto> usuarios = usuarioService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    /* POST criarUsuario*/
    @PostMapping("/criar")
    public ResponseEntity<UsuarioResponseDto> criarUsuario(@RequestBody UsuarioPostDto dto) {
        UsuarioResponseDto novoUsuario = usuarioService.createUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    /* /{id} → atualiza usuário existente */
    @PutMapping("/{id}")
    public ResponseEntity<?> alterarUsuario(@PathVariable Long id, @RequestBody UsuarioPutDTO dto) {
        try {
            UsuarioResponseDto usuarioAtualizado = usuarioService.alterarUsuario(id, dto);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* DELETE /{id} exclui usuário*/
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id) {
        try {
            String mensagem = usuarioService.deletarUsuario(id);
            return ResponseEntity.ok(mensagem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarUsuario(@RequestParam Long id) {
    List<UsuarioResponseDto> usuarios = usuarioService.listarUsuarios();

    return usuarios.stream()
            .filter(u -> u.getId_user().equals(id))
            .findFirst()
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuário com ID " + id + " não encontrado."));
}
    
}
