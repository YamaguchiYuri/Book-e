package com.api.booke.domain.usuario;

import java.time.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.booke.domain.usuario.dto.*;
import com.api.booke.entitites.Usuario;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private UsuarioResponseDto toResponseUsuarioDTO (Usuario usuario){
        if(usuario == null) return null;
        return new UsuarioResponseDto(
            usuario.getId_user(),
            usuario.getNickname_user(),
            usuario.getEmail(),
            usuario.getDt_nasciment_em(),
            usuario.getData_criado_em()
        );
    }

    public UsuarioResponseDto createUsuario(UsuarioPostDto dto){
        Usuario usuario = new Usuario();

        usuario.setNickname_user(dto.getNickname_user());
        usuario.setEmail(dto.getEmail());
        usuario.setDt_nasciment_em(dto.getDt_nasciment_em());

        return toResponseUsuarioDTO(usuarioRepository.save(usuario));
    }

    public UsuarioResponseDto alterarUsuario(Long id, UsuarioPutDTO dto){
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + id + " não encontrado."));

        usuario.setNickname_user(dto.getNickname_user());
        usuario.setEmail(dto.getEmail());
        usuario.setDt_nasciment_em(dto.getDt_nasciment_em());

        return toResponseUsuarioDTO(usuarioRepository.save(usuario));
    }

    public String deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
        throw new IllegalArgumentException("Usuário com ID " + id + " não encontrado.");
        }

        usuarioRepository.deleteById(id);
        return "Usuário deletado com sucesso.";
    }


    public List<UsuarioResponseDto> listarUsuarios(){
        return usuarioRepository.findAll()
            .stream()
            .map(this::toResponseUsuarioDTO)
            .collect(Collectors.toList());
    }
}
