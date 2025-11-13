package com.api.booke.domain.notadesempenho.dto;

import lombok.*;

/*Resposta ao usuario de Notas */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaDesempenhoResponseDto {
    private Long id_nota_desempenho;
    private float nota_cadastro;
    private long id_materia;
}
