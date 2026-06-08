package com.api.booke.entitites;
import java.util.*;
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
    private Long idmateria;

    @ManyToOne
    @JoinColumn(name = "id_universidade_usuario", nullable = false)
    private UniversidadeUsuario universidadeUsuario;

    @Column(nullable = false)
    private int semestre_materia;

    @Column(length = 40, nullable = false)
    private String nomemateria;

    @Column(name = "aprovacao") // Nome explícito ajuda muito
    private Double aprovacao;


    @OneToMany(mappedBy = "materia")
    private List<Formula> formula;

    @OneToMany(mappedBy = "materia")
    private List<NotaDesempenho> notasDesempenho;;

    /*para apagar as anotações junto com materia */
    @OneToMany(mappedBy = "materia")
    private List<Anotacao> anotacoes;


}
