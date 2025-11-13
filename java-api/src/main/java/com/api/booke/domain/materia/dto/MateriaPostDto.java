package com.api.booke.domain.materia.dto;

import lombok.*;

/**
 * DTO usado para criação de materias
 */


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaPostDto {
    private int semestre_materia;
    private String nome_materia;
    private Long id_universidade_usuario;
}
