package com.api.booke.entitites;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "universidade")
@Getter
@Setter
@NoArgsConstructor


public class Universidade{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_uni")
    private Long iduni;

    @Column(name = "uni_nome", length = 100, nullable = false)
    private String uninome;

    @OneToMany(mappedBy = "universidade", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UniversidadeUsuario> cursos = new HashSet<>();

    public Universidade(String uni_nome) {
        this.uninome = uni_nome;
    }
}
