package com.api.booke.domain.usuario.dto;

import lombok.Data;

@Data
public class LoginDto {
    private String nickname_user;
    private String passwordkey_user;
}