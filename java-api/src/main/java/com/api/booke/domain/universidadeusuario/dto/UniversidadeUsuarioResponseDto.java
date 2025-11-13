package com.api.booke.domain.universidadeusuario.dto;

import lombok.*;

/**
 * Saída para usuarios
 */

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UniversidadeUsuarioResponseDto {
    private Long id_universidade_usuario;
    private Long id_curso;
    private Long id_uni;
    private Long id_user;
}
