package com.api.booke.entitites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "universidade_usuario")
@Getter
@Setter
@NoArgsConstructor
public class UniversidadeUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_universidade_usuario;

    @ManyToOne
    @JoinColumn(name = "id_uni", nullable = false)
    private Universidade universidade;

    @ManyToOne
    @JoinColumn(name = "id_curso", nullable = false)
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private Usuario usuario;
}