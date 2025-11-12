package com.api.booke.domain.usuario.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO usado para transferência de dados da entidade Usuarii.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UsuarioDTO {
    private UUID id_user;
    private String nickname_user;
    private String email;
    private LocalDateTime dt_nasciment_em;
    private LocalDateTime dt_criado_em;
}
