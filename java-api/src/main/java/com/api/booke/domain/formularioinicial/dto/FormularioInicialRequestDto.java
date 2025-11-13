package com.api.booke.domain.formularioinicial.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class FormularioInicialRequestDto {

    private Long id_user;
    private LocalDate dt_nasciment_em;

    private String uni_nome;
    private String nome_curso;
    private int semestre;

    private List<MateriaRequestDto> materias;

    @Data
    public static class MateriaRequestDto {
        private String nome_materia;
        private int semestre_materia;
    }
}
