package api.

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO usado para transferência de dados da entidade Usuarii.
 */
@Data
public class UsuarioDTO {
    private UUID id_user;
    private String nickname_user;
    private String email;
    private LocalDateTime dt_nasciment_em;
    private LocalDateTime dt_criado_em;
}
