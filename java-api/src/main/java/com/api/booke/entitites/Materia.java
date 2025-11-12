package com.api.booke.entitites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "materias")
@Getter
@Setter
@NoArgsConstructor
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_materia;

    @ManyToOne
    @JoinColumn(name = "id_universidade_usuario", nullable = false)
    private UniversidadeUsuario universidadeUsuario;

    @Column(nullable = false)
    private Integer semestre_material;

    @Column(length = 30, nullable = false)
    private String nome_materia;
}