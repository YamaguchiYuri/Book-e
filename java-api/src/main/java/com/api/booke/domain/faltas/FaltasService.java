package com.api.booke.domain.faltas;

import com.api.booke.domain.faltas.dto.*;
import com.api.booke.domain.materia.MateriaRepository;
import com.api.booke.entitites.Faltas;
import com.api.booke.entitites.Materia;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FaltasService {

    private final FaltasRepository faltasRepository;
    private final MateriaRepository materiaRepository;

    @Transactional
    public FaltasResponseDto create(FaltasPostDto dto) {
        Materia materia = materiaRepository.findById(dto.getIdmateria())
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));

        Faltas faltas = new Faltas();
        faltas.setNumfaltas(dto.getNumfaltas());
        faltas.setLimitefaltas(dto.getLimitefaltas());
        faltas.setMateria(materia);

        faltasRepository.save(faltas);
        return toDto(faltas);
    }

    @Transactional
    public FaltasResponseDto update(Long id, FaltasPutDto dto) {
        Faltas faltas = faltasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de faltas não encontrado"));

        faltas.setNumfaltas(dto.getNumfaltas());
        faltas.setLimitefaltas(dto.getLimitefaltas());

        faltasRepository.save(faltas);
        return toDto(faltas);
    }

    public FaltasResponseDto search(Long id) {
        Faltas faltas = faltasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de faltas não encontrado"));
        return toDto(faltas);
    }

    public List<FaltasResponseDto> listAll() {
        return faltasRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<FaltasResponseDto> listByMateria(Long idmateria) {
        return faltasRepository.findByMateriaIdmateria(idmateria)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        if (!faltasRepository.existsById(id)) {
            throw new RuntimeException("Registro de faltas não encontrado");
        }
        faltasRepository.deleteById(id);
    }

    // Converter entidade → response
    private FaltasResponseDto toDto(Faltas faltas) {
        FaltasResponseDto dto = new FaltasResponseDto();
        dto.setIdfaltamateria(faltas.getIdfaltamateria());
        dto.setNumfaltas(faltas.getNumfaltas());
        dto.setLimitefaltas(faltas.getLimitefaltas());
        
        dto.setIdmateria(faltas.getMateria().getIdmateria()); 
        
        return dto;
    }
}