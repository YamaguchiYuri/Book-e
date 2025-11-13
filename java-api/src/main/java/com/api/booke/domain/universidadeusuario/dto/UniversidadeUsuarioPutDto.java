package com.api.booke.domain.universidadeusuario.dto;
import lombok.*;

/**
 * Alterar universidade-usuario
 */

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UniversidadeUsuarioPutDto {
    private Long id_universidade_usuario;
    private Long id_curso;
    private Long id_uni;
    private Long id_user;
}
