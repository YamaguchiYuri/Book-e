package com.api.booke.domain.universidadeusuario;

import com.api.booke.domain.curso.CursoRepository;
import com.api.booke.domain.universidade.UniversidadeRepository;
import com.api.booke.domain.universidadeusuario.dto.*;
import com.api.booke.domain.usuario.UsuarioRepository;
import com.api.booke.entitites.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UniversidadeUsuarioService {

    private final UniversidadeUsuarioRepository universidadeUsuarioRepository;
    private final UniversidadeRepository universidadeRepository;
    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;

    public UniversidadeUsuarioService(
            UniversidadeUsuarioRepository universidadeUsuarioRepository,
            UniversidadeRepository universidadeRepository,
            CursoRepository cursoRepository,
            UsuarioRepository usuarioRepository) {
        this.universidadeUsuarioRepository = universidadeUsuarioRepository;
        this.universidadeRepository = universidadeRepository;
        this.cursoRepository = cursoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // ✅ Criar nova relação universidade-usuario
    @Transactional
    public UniversidadeUsuarioResponseDto create(UniversidadeUsuarioPostDto dto) {
        Universidade universidade = universidadeRepository.findById(dto.getId_uni())
                .orElseThrow(() -> new RuntimeException("Universidade não encontrada"));
        Curso curso = cursoRepository.findById(dto.getId_curso())
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        Usuario usuario = usuarioRepository.findById(dto.getId_user())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        UniversidadeUsuario entidade = new UniversidadeUsuario();
        entidade.setUniversidade(universidade);
        entidade.setCurso(curso);
        entidade.setUsuario(usuario);

        universidadeUsuarioRepository.save(entidade);

        return toResponse(entidade);
    }

    // ✅ Atualizar relação universidade-usuario existente
    @Transactional
    public UniversidadeUsuarioResponseDto update(UniversidadeUsuarioPutDto dto) {
        UniversidadeUsuario entidade = universidadeUsuarioRepository.findById(dto.getId_universidade_usuario())
                .orElseThrow(() -> new RuntimeException("UniversidadeUsuario não encontrado"));

        Universidade universidade = universidadeRepository.findById(dto.getId_uni())
                .orElseThrow(() -> new RuntimeException("Universidade não encontrada"));
        Curso curso = cursoRepository.findById(dto.getId_curso())
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        Usuario usuario = usuarioRepository.findById(dto.getId_user())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        entidade.setUniversidade(universidade);
        entidade.setCurso(curso);
        entidade.setUsuario(usuario);

        universidadeUsuarioRepository.save(entidade);

        return toResponse(entidade);
    }

    // ✅ Buscar por ID
    public UniversidadeUsuarioResponseDto getById(Long id) {
        UniversidadeUsuario entidade = universidadeUsuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UniversidadeUsuario não encontrado"));
        return toResponse(entidade);
    }

    // ✅ Listar todos
    public List<UniversidadeUsuarioResponseDto> getAll() {
        return universidadeUsuarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ Deletar por ID
    @Transactional
    public void delete(Long id) {
        if (!universidadeUsuarioRepository.existsById(id)) {
            throw new RuntimeException("UniversidadeUsuario não encontrado");
        }
        universidadeUsuarioRepository.deleteById(id);
    }

    // 🔁 Conversão para ResponseDto
    private UniversidadeUsuarioResponseDto toResponse(UniversidadeUsuario entidade) {
        return new UniversidadeUsuarioResponseDto(
                entidade.getId_universidade_usuario(),
                entidade.getCurso().getId_curso(),
                entidade.getUniversidade().getId_uni(),
                entidade.getUsuario().getId_user()
        );
    }

    public UniversidadeUsuarioFullResponseDto getFullById(Long id) {
    UniversidadeUsuario entidade = universidadeUsuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("UniversidadeUsuario não encontrado"));

    return new UniversidadeUsuarioFullResponseDto(
            entidade.getId_universidade_usuario(),

            entidade.getUniversidade().getId_uni(),
            entidade.getUniversidade().getUni_nome(),

            entidade.getCurso().getId_curso(),
            entidade.getCurso().getNome_curso(),

            entidade.getUsuario().getId_user(),
            entidade.getUsuario().getNicknameuser()
    );
}
}