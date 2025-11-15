package com.api.booke.domain.usuario.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de saída para retornar usuarios na API.
 * Representa os dados expostos pela API sem expor diretamente a entidade JPA.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UsuarioResponseDto {
    private Long id_user;
    private String nicknameuser;
    private String email;
    private LocalDate dt_nasciment_em;
    private LocalDateTime dt_criado_em;
}
