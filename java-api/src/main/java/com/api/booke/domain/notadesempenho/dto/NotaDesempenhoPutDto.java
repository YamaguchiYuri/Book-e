package com.api.booke.domain.notadesempenho.dto;

import lombok.*;

/*Alterar nota */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaDesempenhoPutDto {
    private Long idnotadesempenho;
    private Long idmateria;
    private float notacadastro;
    private Long idvariavel;
}
