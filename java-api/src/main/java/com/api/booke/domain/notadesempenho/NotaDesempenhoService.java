package com.api.booke.domain.notadesempenho;

import com.api.booke.domain.materia.MateriaRepository;
import com.api.booke.domain.notadesempenho.dto.*;
import com.api.booke.entitites.Materia;
import com.api.booke.entitites.NotaDesempenho;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotaDesempenhoService {

    private final NotaDesempenhoRepository notaDesempenhoRepository;
    private final MateriaRepository materiaRepository;

    public NotaDesempenhoService(NotaDesempenhoRepository notaDesempenhoRepository,
                                 MateriaRepository materiaRepository) {
        this.notaDesempenhoRepository = notaDesempenhoRepository;
        this.materiaRepository = materiaRepository;
    }

    // ===========================
    // CREATE
    // ===========================
    @Transactional
    public NotaDesempenhoResponseDto create(NotaDesempenhoPostDto dto) {
        Materia materia = materiaRepository.findById(dto.getId_materia())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        NotaDesempenho nota = new NotaDesempenho();
        nota.setNota_cadastro(dto.getNota_cadastro());
        nota.setMateria(materia);
        nota.setTiponota(dto.getTiponota());

        notaDesempenhoRepository.save(nota);
        return toResponse(nota);
    }

    // ===========================
    // UPDATE
    // ===========================
    @Transactional
    public NotaDesempenhoResponseDto update(NotaDesempenhoPutDto dto) {
        NotaDesempenho nota = notaDesempenhoRepository.findById(dto.getId_nota_desempenho())
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        Materia materia = materiaRepository.findById(dto.getId_materia())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        nota.setNota_cadastro(dto.getNota_cadastro());
        nota.setMateria(materia);
        nota.setTiponota(dto.getTiponota());

        notaDesempenhoRepository.save(nota);
        return toResponse(nota);
    }

    // ===========================
    // GET BY ID
    // ===========================
    public NotaDesempenhoResponseDto getById(Long id) {
        NotaDesempenho nota = notaDesempenhoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));
        return toResponse(nota);
    }

    // ===========================
    // GET ALL
    // ===========================
    public List<NotaDesempenhoResponseDto> getAll() {
        return notaDesempenhoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ===========================
    // GET BY MATERIA (listar todas as notas de uma matéria)
    // ===========================
    public List<NotaDesempenhoResponseDto> getByMateria(Long idMateria) {
        return notaDesempenhoRepository.findAll()
                .stream()
                .filter(n -> n.getMateria().getId_materia().equals(idMateria))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ===========================
    // DELETE
    // ===========================
    @Transactional
    public void delete(Long id) {
        if (!notaDesempenhoRepository.existsById(id)) {
            throw new RuntimeException("Nota não encontrada");
        }
        notaDesempenhoRepository.deleteById(id);
    }

    // ===========================
    // MAPPER
    // ===========================
    private NotaDesempenhoResponseDto toResponse(NotaDesempenho nota) {
        return new NotaDesempenhoResponseDto(
                nota.getId_nota_desempenho(),
                nota.getNota_cadastro(),
                nota.getMateria().getId_materia(),
                nota.getTiponota()

        );
    }
}