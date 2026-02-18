package com.api.booke.domain.usuario.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO usado para transferência de dados da entidade Usuarii.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UsuarioPutDTO {
    private Long iduser;
    private String nicknameuser;
    private String email;
    private LocalDate dt_nasciment_em;
    private String  passwordkey_user;
}
