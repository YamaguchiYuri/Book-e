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
    private final MateriaRepository materiaRepository;

    @Transactional
    public FormularioInicialResponseDto processarFormulario(FormularioInicialRequestDto dto) {

        // === 1. Buscar usuário ===
        Usuario usuario = usuarioRepository.findById(dto.getId_user())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualiza data nascimento
        if (dto.getDt_nasciment_em() != null) {
            usuario.setDt_nasciment_em(dto.getDt_nasciment_em());
        }

        // === 2. Buscar ou criar universidade ===
        Universidade universidade = universidadeRepository
                .findByNome(dto.getUni_nome())
                .orElseGet(() -> {

                    Universidade novaUni = new Universidade();
                    novaUni.setUni_nome(dto.getUni_nome());
                    return universidadeRepository.save(novaUni);
                });

        // === 3. Buscar ou criar curso ===
        Curso curso = cursoRepository
                .findByNomeCursoAndSemestre(dto.getNome_curso(), dto.getSemestre())
                .orElseGet(() -> {

                    Curso novoCurso = new Curso();
                    novoCurso.setNome_curso(dto.getNome_curso());
                    novoCurso.setSemestre(dto.getSemestre());
                    return cursoRepository.save(novoCurso);
                });

        // === 4. Criar relação universidade-usuario ===
        UniversidadeUsuario uu = new UniversidadeUsuario();
        uu.setUsuario(usuario);
        uu.setUniversidade(universidade);
        uu.setCurso(curso);
        universidadeUsuarioRepository.save(uu);

        // === 5. Criar matérias ===
        List<Long> materiasIds = new ArrayList<>();

        if (dto.getMaterias() != null) {
            dto.getMaterias().forEach(m -> {

                Materia materia = new Materia();
                materia.setNome_materia(m.getNome_materia());
                materia.setSemestre_materia(m.getSemestre_materia());
                materia.setUniversidadeUsuario(uu);

                materiaRepository.save(materia);
                materiasIds.add(materia.getId_materia());
            });
        }

        // === 6. Retorno ===
        return new FormularioInicialResponseDto(
                universidade.getId_uni(),
                curso.getId_curso(),
                uu.getId_universidade_usuario(),
                materiasIds
        );
    }
}

