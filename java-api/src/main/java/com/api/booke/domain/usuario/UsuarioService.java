package com.api.booke.domain.usuario;

import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.booke.domain.usuario.dto.*;
import com.api.booke.entitites.Usuario;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private UsuarioResponseDto toResponseUsuarioDTO (Usuario usuario){
        if(usuario == null) return null;
        return new UsuarioResponseDto(
            usuario.getIduser(),
            usuario.getNicknameuser(),
            usuario.getEmail(),
            usuario.getDt_nasciment_em(),
            usuario.getData_criado_em()
        );
    }

    public UsuarioResponseDto createUsuario(UsuarioPostDto dto){
        Usuario usuario = new Usuario();

            // Verifica se nickname já existe
        if (usuarioRepository.findByNicknameuser(dto.getNicknameuser()).isPresent()) {
        throw new IllegalArgumentException("Nickname já está em uso.");
        }
        
        usuario.setNicknameuser(dto.getNicknameuser());
        usuario.setEmail(dto.getEmail());

        String hashedPassword = passwordEncoder.encode(dto.getPasswordkey_user());
        usuario.setPasswordkey_user(hashedPassword);

        return toResponseUsuarioDTO(usuarioRepository.save(usuario));
    }
    public UsuarioResponseDto autenticar(String nickname, String senhaPura) throws AuthenticationException {
        Usuario usuario = usuarioRepository.findByNicknameuser(nickname)
            .orElseThrow(() -> 
                new AuthenticationException("Usuário ou senha inválidos."));

        if (passwordEncoder.matches(senhaPura, usuario.getPasswordkey_user())) {
            

            return toResponseUsuarioDTO(usuario);
        } else {
            // Senha não bate
            throw new AuthenticationException("Usuário ou senha inválidos.");
        }
    }

    public UsuarioResponseDto alterarUsuario(Long id, UsuarioPutDTO dto){
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + id + " não encontrado."));

        usuario.setNicknameuser(dto.getNicknameuser());
        usuario.setEmail(dto.getEmail());
        usuario.setDt_nasciment_em(dto.getDt_nasciment_em());

        String hashedPassword = passwordEncoder.encode(dto.getPasswordkey_user());
        usuario.setPasswordkey_user(hashedPassword);

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

