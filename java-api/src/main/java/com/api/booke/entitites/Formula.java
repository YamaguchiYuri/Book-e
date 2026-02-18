package com.api.booke.entitites;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

    
@Entity
@Table(name = "formula")
@Getter
@Setter
@NoArgsConstructor

/**
 * Entidade que representa a fórmula cadastrada associada a uma matéria
 */

 public class Formula{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_formula")
    private Long idformula;

    @Column(length = 80)
    private String expressao;

    @ManyToOne
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;

 }
