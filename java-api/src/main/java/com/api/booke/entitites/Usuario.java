package com.api.booke.entitites;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "credentials")
@Getter
@Setter
@NoArgsConstructor

/**
 * Entidade que representa as credenciais de um usuário no sistema.
 * Contém informações de login e dados de criação.
 */

public class Usuario {

    @Id
    @GeneratedValue
    @Column(name = "id_user", columnDefinition = "uniqueidentifier")
    private UUID id_user;

    @Column(name = "nickname_user", length = 20)
    private String nickname_user;

    @Column(name = "passwordkey_user", columnDefinition = "binary(32)")
    private byte[] passwordkey_user;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(name = "dt_nasciment_em")
    private LocalDateTime dt_nasciment_em;

    @Column(name = "dt_criado_em", updatable = false)
    private LocalDateTime data_criado_em = LocalDateTime.now();

    public Object getNickname_user;

    public Usuario(String nickname_user, byte[] passwordkey_user, String email, LocalDateTime data_nasciment_em) {
        this.nickname_user = nickname_user;
        this.passwordkey_user = passwordkey_user;
        this.email = email;
        this.dt_nasciment_em = data_nasciment_em;
    }
}
