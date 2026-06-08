package com.api.booke.domain.anotacoes.dto;

import lombok.*;

/**
 * DTO de saída para retornar as anotações na API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnotacaoResponseDto {
    private Long id;
    private String titulo;
    private String texto;
    private Long iduser;
    private Long idmateria;
}