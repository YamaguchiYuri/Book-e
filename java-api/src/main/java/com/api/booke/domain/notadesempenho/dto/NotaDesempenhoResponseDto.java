package com.api.booke.domain.notadesempenho.dto;

import lombok.*;

/*Resposta ao usuario de Notas */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaDesempenhoResponseDto {
    private Long idnotadesempenho;
    private float notacadastro;
    private long idmateria;
    private Long idvariavel;
}
