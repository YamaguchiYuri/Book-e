package com.api.booke.domain.notadesempenho.dto;
import lombok.*;

/*Criar nota */

@Data
@NoArgsConstructor
@AllArgsConstructor

public class NotaDesempenhoPostDto {
    private Long id_materia;
    private float nota_cadastro;
}
