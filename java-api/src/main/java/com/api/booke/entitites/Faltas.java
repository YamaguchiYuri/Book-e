package com.api.booke.entitites;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

    
@Entity
@Table(name = "faltas_usuario")
@Getter
@Setter
@NoArgsConstructor

/**
 * Entidade que representa as faltas cadastradas mediante a uma materia
 */

public class Faltas{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_faltamateria")
    private Long idfaltamateria;

    @Column(name = "num_faltas", nullable = false)
    private int numfaltas;

    @Column(name = "limite_faltas") // Sem nullable=false, pois é opcional (pode ser null)
    private Integer limitefaltas;


    @ManyToOne
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;
}