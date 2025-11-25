package com.api.booke.domain.curso;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.booke.domain.curso.dto.CursoPostDto;
import com.api.booke.domain.curso.dto.CursoPutDto;
import com.api.booke.domain.curso.dto.CursoResponseDto;
import com.api.booke.entitites.Curso;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    // Conversão de entidade para DTO de resposta
    private CursoResponseDto toResponseCursoDto(Curso curso) {
        if (curso == null) return null;
        return new CursoResponseDto(
            curso.getIdcurso(),
            curso.getNomecurso(),
            curso.getSemestre()
        );
    }

    /* Criar curso */
    public CursoResponseDto createCurso(CursoPostDto dto) {
        Curso curso = new Curso();
        curso.setNomecurso(dto.getNomecurso());
        curso.setSemestre(dto.getSemestre());

        return toResponseCursoDto(cursoRepository.save(curso));
    }

    /* Alterar curso */
    public CursoResponseDto alterarCurso(Long id, CursoPutDto dto) {
        Curso curso = cursoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Curso com ID " + id + " não encontrado."));

        curso.setNomecurso(dto.getNomecurso());
        curso.setSemestre(dto.getSemestre());

        return toResponseCursoDto(cursoRepository.save(curso));
    }

    /* Deletar curso */
    public String deletarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new IllegalArgumentException("Curso com ID " + id + " não encontrado.");
        }

        cursoRepository.deleteById(id);
        return "Curso deletado com sucesso.";
    }

    /* Listar todos os cursos */
    public List<CursoResponseDto> listarCursos() {
        return cursoRepository.findAll()
            .stream()
            .map(this::toResponseCursoDto)
            .collect(Collectors.toList());
    }
}