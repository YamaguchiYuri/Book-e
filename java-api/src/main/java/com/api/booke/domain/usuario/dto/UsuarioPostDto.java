package com.api.booke.domain.usuario.dto;


import lombok.Data;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * DTO usado para transferência de dados da entidade Usuario.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UsuarioPostDto {
    private String nicknameuser;
    private String email;
    private String passwordkey_user;
}
