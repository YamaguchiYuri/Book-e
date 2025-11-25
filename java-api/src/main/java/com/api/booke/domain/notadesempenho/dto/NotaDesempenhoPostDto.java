package com.api.booke.domain.notadesempenho.dto;
import lombok.*;

/*Criar nota */

@Data
@NoArgsConstructor
@AllArgsConstructor

public class NotaDesempenhoPostDto {
    private Long idmateria;
    private float notacadastro;
    private Long idvariavel;
}
