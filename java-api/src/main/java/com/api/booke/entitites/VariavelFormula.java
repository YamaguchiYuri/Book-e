package com.api.booke.entitites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "variavel_formula")
@Getter
@Setter
@NoArgsConstructor
public class VariavelFormula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idvariavel;

    @Column(length = 50, nullable = false)
    private String nome; 
    
    @ManyToOne
    @JoinColumn(name = "id_formula", nullable = false)
    private Formula formula;
}

