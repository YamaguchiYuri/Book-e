package com.api.booke.domain.materia.dto;

import lombok.*;

/*
 * DTO de saída para retornar as matérias na API.
 * 
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaResponseDto {
    private Long id_materia;
    private int semestre_materia;
    private String nome_materia;
}
