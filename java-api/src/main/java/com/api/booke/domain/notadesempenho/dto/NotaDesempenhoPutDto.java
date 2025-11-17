package com.api.booke.domain.notadesempenho.dto;

import lombok.*;

/*Alterar nota */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaDesempenhoPutDto {
    private Long id_nota_desempenho;
    private Long id_materia;
    private float nota_cadastro;
    private String tiponota;
}
