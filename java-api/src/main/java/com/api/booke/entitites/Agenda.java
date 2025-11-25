package com.api.booke.entitites;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "agenda")
@Getter
@Setter
@NoArgsConstructor
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idagenda;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private Usuario usuario; 

    @Column(length = 50, nullable = false)
    private String tipo;

    @Column(nullable = false)
    private LocalDate data;

    public Long getId() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getId'");
    }
}
