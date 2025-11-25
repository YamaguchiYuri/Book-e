package com.api.booke.domain.materia.dto;

import lombok.*;

/**
 * DTO usado para criação de materias
 */


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaPostDto {
    private int semestremateria;
    private String nomemateria;
    private Long iduniversidadeusuario;
}
