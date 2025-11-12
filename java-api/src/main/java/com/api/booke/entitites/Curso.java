package com.api.booke.entitites;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "curso")
@Getter
@Setter
@NoArgsConstructor
/**
 * Entidade que representa um curso no sistema.
 */
public class Curso{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso")
    private Long id_curso;

    @Column(name = "nome_curso", length = 30, nullable = false)
    private String nome_curso;

    @Column(name = "semestre", nullable = false)
    private Integer semestre;

    // RELACIONAMENTO COM UNIVERSIDADECURSO
    @OneToMany(mappedBy = "curso", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UniversidadeUsuario> universidades = new HashSet<>();

    public Curso(String nome_curso, Integer semestre) {
        this.nome_curso = nome_curso;
        this.semestre = semestre;
    }
}
