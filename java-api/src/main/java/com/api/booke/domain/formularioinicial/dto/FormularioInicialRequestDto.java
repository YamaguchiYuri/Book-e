package com.api.booke.domain.formularioinicial.dto;

import lombok.Data;

import java.time.LocalDate;


@Data
public class FormularioInicialRequestDto {

    private Long iduser;
    private LocalDate dt_nasciment_em;

    private String uninome;
    private String nomecurso;
    private int semestre; /*numero de semestres */
    private int semestreatual;

}
