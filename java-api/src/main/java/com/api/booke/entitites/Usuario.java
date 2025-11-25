package com.api.booke.entitites;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.*;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Long iduser;

    @Column(length = 20, unique = true)
    private String nicknameuser;

    @Column(name = "passwordkey_user", length=100)
    private String passwordkey_user;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(name = "dt_nasciment_em")
    private LocalDate dt_nasciment_em;

    @Column(name = "dt_criado_em", updatable = false)
    private LocalDateTime data_criado_em = LocalDateTime.now();

    public Usuario(String nicknameuser, String passwordkey_user, String email, LocalDate data_nasciment_em) {
        this.nicknameuser = nicknameuser;
        this.passwordkey_user = passwordkey_user;
        this.email = email;
        this.dt_nasciment_em = data_nasciment_em;
    }
}
