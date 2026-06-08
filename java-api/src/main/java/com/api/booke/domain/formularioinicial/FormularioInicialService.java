package com.api.booke.domain.formularioinicial;

import com.api.booke.domain.formularioinicial.dto.*;

import com.api.booke.domain.usuario.UsuarioRepository;
import com.api.booke.domain.universidade.UniversidadeRepository;
import com.api.booke.domain.universidadeusuario.UniversidadeUsuarioRepository;
import com.api.booke.domain.curso.CursoRepository;
import com.api.booke.domain.materia.MateriaRepository;
import com.api.booke.entitites.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormularioInicialService {

    private final UsuarioRepository usuarioRepository;
    private final UniversidadeRepository universidadeRepository;
    private final CursoRepository cursoRepository;
    private final UniversidadeUsuarioRepository universidadeUsuarioRepository;

    @Transactional
    public FormularioInicialResponseDto processarFormulario(FormularioInicialRequestDto dto) {

        // === 1. Buscar usuário ===
        Usuario usuario = usuarioRepository.findById(dto.getIduser())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualiza data nascimento
        if (dto.getDt_nasciment_em() != null) {
            usuario.setDt_nasciment_em(dto.getDt_nasciment_em());
        }
        // Atualizar semestre atual
        if (dto.getSemestreatual() != null) {
            usuario.setSemestreatual(dto.getSemestreatual());
        }

        // === 2. Buscar ou criar universidade ===
        Universidade universidade = universidadeRepository
                .findByNome(dto.getUninome())
                .orElseGet(() -> {

                    Universidade novaUni = new Universidade();
                    novaUni.setUninome(dto.getUninome());
                    return universidadeRepository.save(novaUni);
                });

        // === 3. Buscar ou criar curso ===
        Curso curso = cursoRepository
                .findByNomeCursoAndSemestre(dto.getNomecurso(), dto.getSemestre())
                .orElseGet(() -> {

                    Curso novoCurso = new Curso();
                    novoCurso.setNomecurso(dto.getNomecurso());
                    novoCurso.setSemestre(dto.getSemestre());
                    return cursoRepository.save(novoCurso);
                });

        // === 4. Criar relação universidade-usuario ===
        UniversidadeUsuario uu = new UniversidadeUsuario();
        uu.setUsuario(usuario);
        uu.setUniversidade(universidade);
        uu.setCurso(curso);
        universidadeUsuarioRepository.save(uu);

        // === 5. Retorno ===
        return new FormularioInicialResponseDto(
                universidade.getIduni(),
                curso.getIdcurso(),
                uu.getIduniversidadeusuario()
        );
    }
}

