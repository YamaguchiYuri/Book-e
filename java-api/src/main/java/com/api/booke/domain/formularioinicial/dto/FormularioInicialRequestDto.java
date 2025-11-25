package com.api.booke.domain.formularioinicial.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class FormularioInicialRequestDto {

    private Long iduser;
    private LocalDate dt_nasciment_em;

    private String uninome;
    private String nomecurso;
    private int semestre;

    private List<MateriaRequestDto> materias;

    @Data
    public static class MateriaRequestDto {
        private String nomemateria;
        private int semestre_materia;
    }
}
