package com.api.booke.domain.universidadeusuario.dto;
import lombok.*;

/**
 * Criar universidade-usuario
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniversidadeUsuarioPostDto {
    private Long id_curso;
    private Long id_uni;
    private Long id_user;
}
