package com.api.booke.domain.universidade;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.booke.domain.universidade.dto.UniversidadePostDto;
import com.api.booke.domain.universidade.dto.UniversidadePutDto;
import com.api.booke.domain.universidade.dto.UniversidadeResponseDto;
import com.api.booke.entitites.Universidade;

@Service
public class UniversidadeService {
    @Autowired
    private UniversidadeRepository universidadeRepository;

    private UniversidadeResponseDto toResponseUniversidadeDto(Universidade universidade){
        if (universidade== null) return null;
        return new UniversidadeResponseDto(
            universidade.getId_uni(),
            universidade.getUni_nome()
        );
    }

        /*criar */
    public UniversidadeResponseDto createUniversidade(UniversidadePostDto dto) {
        Universidade universidade = new Universidade();
        universidade.setUni_nome(dto.getUni_nome());

        return toResponseUniversidadeDto(universidadeRepository.save(universidade));
    }

    /*alterar */
    public UniversidadeResponseDto alterarUniversidade(Long id, UniversidadePutDto dto) {
        Universidade universidade = universidadeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Universidade com ID " + id + " não encontrada."));

        universidade.setUni_nome(dto.getUni_nome());

        return toResponseUniversidadeDto(universidadeRepository.save(universidade));
    }

    /* Deletar universidade*/
    public String deletarUniversidade(Long id) {
        if (!universidadeRepository.existsById(id)) {
            throw new IllegalArgumentException("Universidade com ID " + id + " não encontrada.");
        }

        universidadeRepository.deleteById(id);
        return "Universidade deletada com sucesso.";
    }

    /*Listar todas as universidades*/
    public List<UniversidadeResponseDto> listarUniversidades() {
        return universidadeRepository.findAll()
            .stream()
            .map(this::toResponseUniversidadeDto)
            .collect(Collectors.toList());
    }
}