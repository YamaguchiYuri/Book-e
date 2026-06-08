package com.api.booke.domain.notadesempenho;

import com.api.booke.domain.formulavariavel.VariavelFormulaRepository;
import com.api.booke.domain.materia.MateriaRepository;
import com.api.booke.domain.notadesempenho.dto.*;
import com.api.booke.entitites.Materia;
import com.api.booke.entitites.NotaDesempenho;
import com.api.booke.entitites.VariavelFormula;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotaDesempenhoService {

    private final NotaDesempenhoRepository notaDesempenhoRepository;
    private final MateriaRepository materiaRepository;
    private final VariavelFormulaRepository variavelFormulaRepository;

    public NotaDesempenhoService(NotaDesempenhoRepository notaDesempenhoRepository,
                                 MateriaRepository materiaRepository,
                                 VariavelFormulaRepository variavelFormulaRepository) {
        this.notaDesempenhoRepository = notaDesempenhoRepository;
        this.materiaRepository = materiaRepository;
        this.variavelFormulaRepository = variavelFormulaRepository;
    }

    // ===========================
    // CREATE
    // ===========================
    @Transactional
    public NotaDesempenhoResponseDto create(NotaDesempenhoPostDto dto) {

        Materia materia = materiaRepository.findById(dto.getIdmateria())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        VariavelFormula variavel = variavelFormulaRepository.findById(dto.getIdvariavel())
                .orElseThrow(() -> new RuntimeException("Variável não encontrada"));

        NotaDesempenho nota = new NotaDesempenho();
        nota.setNota_cadastro(dto.getNotacadastro());
        nota.setMateria(materia);
        nota.setVariavel(variavel);

        notaDesempenhoRepository.save(nota);
        return toResponse(nota);
    }

    // ===========================
    // UPDATE
    // ===========================
    @Transactional
    public NotaDesempenhoResponseDto update(NotaDesempenhoPutDto dto) {

        NotaDesempenho nota = notaDesempenhoRepository.findById(dto.getIdnotadesempenho())
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        Materia materia = materiaRepository.findById(dto.getIdmateria())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        VariavelFormula variavel = variavelFormulaRepository.findById(dto.getIdvariavel())
                .orElseThrow(() -> new RuntimeException("Variável não encontrada"));

        nota.setNota_cadastro(dto.getNotacadastro());
        nota.setMateria(materia);
        nota.setVariavel(variavel);

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
    // GET BY MATERIA
    // ===========================
    public List<NotaDesempenhoResponseDto> getByMateria(Long idMateria) {

        Materia materia = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        return notaDesempenhoRepository.findByMateria(materia)
                .stream()
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
                nota.getIdnotadesempenho(),
                nota.getNota_cadastro(),
                nota.getMateria().getIdmateria(),
                nota.getVariavel().getIdvariavel() // agora correto
        );
    }
}