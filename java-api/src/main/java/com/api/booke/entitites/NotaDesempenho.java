package com.api.booke.entitites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "nota_desempenho")
@Getter
@Setter
@NoArgsConstructor
public class NotaDesempenho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_nota_desempenho;

    @Column(nullable = false)
    private Integer nota_cadastro;

    @ManyToOne
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;
}