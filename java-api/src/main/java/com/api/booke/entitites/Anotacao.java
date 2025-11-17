package com.api.booke.entitites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "anotacoes")
@Getter
@Setter
@NoArgsConstructor
public class Anotacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private Usuario usuario; // substitua pelo nome correto da entidade de usuário

    @Column(length = 100, nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String texto;
}
